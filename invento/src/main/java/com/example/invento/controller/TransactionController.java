package com.example.invento.controller;

import com.example.invento.entity.*;
import com.example.invento.repository.CustomerRepository;
import com.example.invento.repository.ProductRepository;
import com.example.invento.repository.TransactionRepository;
import com.example.invento.repository.UserRepository;
import com.example.invento.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TransactionController {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    PdfService pdfService;

    @Autowired
    ProductRepository productRepository;

    @PostMapping("addTransaction/{id}/{customerId}")
    TransactionMaster addTransaction(@PathVariable Long id, @PathVariable Long customerId, @RequestBody TransactionMaster transaction){
        UserMaster user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        transaction.setUser(user);

        CustomerMaster customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer Not Found"));
        transaction.setCustomer(customer);

        if (transaction.getItems() != null) {
            for (TransactionItem item : transaction.getItems()) {
                item.setTransaction(transaction);
                ProductMaster product = productRepository.findById(
                        item.getProduct().getId()
                ).orElseThrow(() -> new RuntimeException("Product not found"));
                if (product.getProduct_quantity() < item.getQuantity()) {
                    throw new RuntimeException(
                            "Insufficient stock for product: " + product.getProduct_name()
                    );
                }
                product.setProduct_quantity(
                        product.getProduct_quantity() - item.getQuantity()
                );
                productRepository.save(product);

                item.setProduct(product);
            }
        }

        return transactionRepository.save(transaction);
    }

    @GetMapping("/transaction/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id){
        TransactionMaster transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        byte[] pdf = pdfService.generatePdf(transaction);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_"+ id+ ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
