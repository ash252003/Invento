package com.example.invento.controller;

import com.example.invento.entity.ProductMaster;
import com.example.invento.entity.UserMaster;
import com.example.invento.repository.ProductRepository;
import com.example.invento.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/product/{userid}")
    public ProductMaster addProduct(@PathVariable Long userid, @RequestBody ProductMaster product){
        UserMaster user = userRepository.findById(userid)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
        product.setUser(user);
        return productRepository.save(product);
    }

    @GetMapping("/getProducts/{userid}")
    public List<ProductMaster> getProducts(@PathVariable Long userid) {
        return productRepository.findByUserId(userid);
    }

    @PutMapping("/updateProducts/{userid}/{id}")
    public ProductMaster updateProduct(@PathVariable Long userid, @PathVariable Long id, @RequestBody ProductMaster updatedProduct) {
        ProductMaster product = productRepository.findByIdAndUserId(userid, id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setProduct_name(updatedProduct.getProduct_name());
        product.setProduct_category(updatedProduct.getProduct_category());
        product.setProduct_quantity(updatedProduct.getProduct_quantity());
        product.setProduct_selling_price(updatedProduct.getProduct_selling_price());
        product.setProduct_cost_price(updatedProduct.getProduct_cost_price());
        return productRepository.save(product);
    }

    @DeleteMapping("/deleteProduct/{userid}/{id}")
    @Transactional
    public void deleteProduct(@PathVariable Long userid, @PathVariable Long id) {
        productRepository.deleteByIdAndUserId(id, userid);
    }

}
