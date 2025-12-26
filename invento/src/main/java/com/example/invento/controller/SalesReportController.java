package com.example.invento.controller;

import com.example.invento.entity.TransactionItem;
import com.example.invento.entity.TransactionMaster;
import com.example.invento.repository.TransactionRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SalesReportController {

    @Autowired
    private TransactionRepository transactionRepository;

    @GetMapping("/sales-report")
    public void downloadSalesReport(@RequestParam String fromDate,
                                    @RequestParam String toDate,
                                    @RequestParam String name,
                                    HttpServletResponse response) throws Exception{
        LocalDate start = LocalDate.parse(fromDate);
        LocalDate end = LocalDate.parse(toDate);
        List<TransactionMaster> transactions = transactionRepository.findByTransactionDateBetween(start, end);
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(name);

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Invoice ID");
        header.createCell(1).setCellValue("Date");
        header.createCell(2).setCellValue("Customer");
        header.createCell(3).setCellValue("Product");
        header.createCell(4).setCellValue("Quantity");
        header.createCell(5).setCellValue("Cost Price");
        header.createCell(6).setCellValue("Selling Price");
        header.createCell(7).setCellValue("Total Amount");
        header.createCell(8).setCellValue("Profit / Loss");
        header.createCell(9).setCellValue("Status");

        int rowIndex = 1;
        long totalSales = 0;
        long totalProfit = 0;

        for(TransactionMaster tx : transactions){
            for(TransactionItem item : tx.getItems()){
                long costPrice = item.getProduct().getProduct_cost_price();
                long sellingPrice = item.getSellingPrice();
                int qty = item.getQuantity();

                long amount = sellingPrice * qty;
                long profitLoss = (sellingPrice - costPrice) * qty;

                totalSales += amount;
                totalProfit += profitLoss;

                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(tx.getId());
                row.createCell(1).setCellValue(tx.getTransactionDate().toString());
                row.createCell(2).setCellValue(tx.getCustomer().getCustomerName());
                row.createCell(3).setCellValue(item.getProduct().getProduct_name());
                row.createCell(4).setCellValue(qty);
                row.createCell(5).setCellValue(costPrice);
                row.createCell(6).setCellValue(sellingPrice);
                row.createCell(7).setCellValue(amount);
                row.createCell(8).setCellValue(profitLoss);
                row.createCell(9).setCellValue(
                        profitLoss > 0 ? "PROFIT" :
                                profitLoss < 0 ? "LOSS" : "N0 PROFIT"
                );
            }
        }
        Row summary = sheet.createRow(rowIndex + 1);
        summary.createCell(0).setCellValue("Total");
        summary.createCell(7).setCellValue(totalSales);
        summary.createCell(8).setCellValue(totalProfit);
        summary.createCell(9).setCellValue(
                totalProfit > 0 ? "NET PROFIT" : "NET LOSS"
        );

        for (int i = 0; i <= 9; i++){
            sheet.autoSizeColumn(i);
        }

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition",
                "attachment; filename="+name+".xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}
