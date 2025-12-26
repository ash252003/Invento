package com.example.invento.service;

import com.example.invento.entity.TransactionItem;
import com.example.invento.entity.TransactionMaster;
import com.lowagie.text.Document;
import com.lowagie.text.Image;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Objects;

@Service
public class PdfService {
    public byte[] generatePdf(TransactionMaster transaction){
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            Image logo = Image.getInstance(
                    Objects.requireNonNull(getClass().getResource("/static/logo.png"))
            );
            document.add(new Paragraph("\n"));
            logo.scaleToFit(120, 120);   // size of logo
            logo.setAlignment(Image.ALIGN_CENTER); // or ALIGN_LEFT

            document.add(logo);
            document.add(new Paragraph("Invoice"));
            document.add(new Paragraph("Date: "+ transaction.getTransactionDate()));
            document.add(new Paragraph("Customer: "+ transaction.getCustomer().getCustomerName()));
            document.add(new Paragraph("Phone: "+ transaction.getCustomer().getCustomerPhone()));
            document.add(new Paragraph(" "));
            PdfPTable table = getPdfPTable(transaction);
            document.add(table);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Total Amount: ₹ "+ transaction.getAmount()));
            document.close();
        } catch (Exception e){
            throw new RuntimeException(e);
        }
        return out.toByteArray();
    }

    private static PdfPTable getPdfPTable(TransactionMaster transaction) {
        PdfPTable table = new PdfPTable(4);
        table.addCell("Product");
        table.addCell("Qty");
        table.addCell("Price");
        table.addCell("Total");

        for (TransactionItem item: transaction.getItems()){
            table.addCell(item.getProduct().getProduct_name());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell(String.valueOf(item.getSellingPrice()));
            table.addCell(
                    String.valueOf(item.getQuantity() * item.getSellingPrice())
            );
        }
        return table;
    }
}
