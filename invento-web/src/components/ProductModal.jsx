import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
export default function ProductModal({
  onClose,
  onSuccess,
  pageName,
  product,
}) {
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productCostPrice, setProductCostPrice] = useState("");
  const [productSellingPrice, setProductSellingPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (product) {
      setProductName(product.product_name);
      setSelectedCategory(product.product_category);
      setProductQuantity(product.product_quantity);
      setProductCostPrice(product.product_cost_price);
      setProductSellingPrice(product.product_selling_price);
    }
  }, [product]);

  const handleProduct = async () => {
    if (
      productName.trim() === "" ||
      selectedCategory.trim() === "" ||
      productQuantity <= 0 ||
      productCostPrice <= 0 ||
      productSellingPrice <= 0
    ) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    try {
      const payload = {
        product_name: productName,
        product_category: selectedCategory,
        product_quantity: productQuantity,
        product_cost_price: productCostPrice,
        product_selling_price: productSellingPrice,
        userid: userId,
      };

      if (product) {
        await axios.put(
          `http://localhost:8080/api/updateProducts/${userId}/${product.id}`,
          payload
        );
        Swal.fire("Success", "Product Updated Successfully", "success");
      } else {
        await axios.post(`http://localhost:8080/api/product/${userId}`, payload);
        Swal.fire("Success", "Product Added Successfully", "success");
      }
      onSuccess();
    } catch (err) {
      Swal.fire("Error", "Something Went Wrong! Please Try Later", "error");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] sm:w-[85%]  md:w-full md:max-w-3xl rounded-2xl shadow-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h1 className="text-xl font-semibold">{pageName}</h1>
          </div>
          <button
            className="cursor-pointer hover:bg-red-600 hover:text-white"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <form action="" className="p-6 space-y-4">
          <input
            type="text"
            name=""
            placeholder="Product Name"
            id=""
            className="w-full border rounded-lg p-2"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <select
            className="border h-full p-2 rounded w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Category</option>
            <option value="Stationery & Office Supplies">
              Stationery & Office Supplies
            </option>
            <option value="Electronics">Electronics</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Household & Kitchen">Household & Kitchen</option>
            <option value="Health & Personal Care">
              Health & Personal Care
            </option>
            <option value="Apparel & Accessories">Apparel & Accessories</option>
            <option value="Furniture & Home Decor">
              Furniture & Home Decor
            </option>
            <option value="Sports & Fitness">Sports & Fitness</option>
            <option value="Books & Educational Materials">
              Educational Materials
            </option>
            <option value="Toys & Games">Toys & Games</option>
          </select>
          <input
            type="number"
            name=""
            placeholder="Product Quantity"
            id=""
            className="w-full border rounded-lg p-2"
            value={productQuantity}
            onChange={(e) => setProductQuantity(Number(e.target.value))}
          />
          <input
            type="number"
            name=""
            placeholder="Cost Price"
            id=""
            className="w-full border rounded-lg p-2"
            value={productCostPrice}
            onChange={(e) => setProductCostPrice(Number(e.target.value))}
          />
          <input
            type="number"
            name=""
            placeholder="Selling Price"
            id=""
            className="w-full border rounded-lg p-2"
            value={productSellingPrice}
            onChange={(e) => setProductSellingPrice(Number(e.target.value))}
          />
        </form>
        <div className="flex justify-end gap-3 p-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleProduct}
            className="bg-blue-600 text-white p-3 rounded-lg cursor-pointer hover:bg-blue-700 px-4 py-2"
          >
            {pageName}
          </button>
        </div>
      </div>
    </div>
  );
}
