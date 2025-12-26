import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/Header";
import Aside from "../components/AsideBar";
import { Plus, IndianRupee, Loader, Package, TrendingUp, Edit, Trash2 } from "lucide-react";
import Logo from "../assets/Final Logo.png";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import ProductModal from "../components/ProductModal";
import axios from "axios";

export default function ManageProducts() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? p.product_category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const { totalProducts, totalStockValue, totalSellingValue } = useMemo(() => {
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.product_quantity * p.product_cost_price), 0);
    const totalSellingValue = products.reduce((sum, p) => sum + (p.product_quantity * p.product_selling_price), 0);
    return { totalProducts, totalStockValue, totalSellingValue };
  }, [products]);

  const handleDelete = async (p) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/deleteProduct/${userId}/${p.id}`
        );
        Swal.fire("Deleted!", "Product has been deleted.", "success");
        fetchProducts();
      } catch (err) {
        Swal.fire("Error", "Could not delete the product", "error");
        console.error(err);
      }
    }
  };

  const fetchProducts = async () => {
    if (!userId) {
      setError("User not logged in. Please log in to view products.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8080/api/getProducts/${userId}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div>
        <Header openSidebar={() => setSidebarOpen(true)} />
        <Aside
          isOpen={isSidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          active="manage"
        />
      </div>
      <main className="flex-1 px-4 py-8 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                  Product Inventory
                </h1>
                <p className="text-gray-600">Manage your products efficiently</p>
              </div>
              <button
                type="button"
                className="mt-4 cursor-pointer lg:mt-0 flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setOpenModal(true);
                  setModalMode("add");
                  setEditProduct(null);
                }}
              >
                <Plus size={20} />
                Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <IndianRupee className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Stock Value</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalStockValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Selling Value</p>
                    <p className="text-2xl font-bold text-gray-900">₹{totalSellingValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                <div className="flex-1 w-64">
                  <input
                    type="search"
                    placeholder="Search products by name..."
                    className="w-full px-4 py-4  border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="lg:w-80">
                  <select
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-gray-700"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Stationery & Office Supplies">Stationery & Office Supplies</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Household & Kitchen">Household & Kitchen</option>
                    <option value="Health & Personal Care">Health & Personal Care</option>
                    <option value="Apparel & Accessories">Apparel & Accessories</option>
                    <option value="Furniture & Home Decor">Furniture & Home Decor</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Books & Educational Materials">Books & Educational Materials</option>
                    <option value="Toys & Games">Toys & Games</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader className="animate-spin text-indigo-600" size={48} />
                  <span className="ml-4 text-gray-600">Loading products...</span>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cost Price</th>
                        <th className="px-6 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Selling Price</th>
                        <th className="px-6 py-5 pr-25 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((p, index) => (
                        <tr key={p.id} className={`hover:bg-indigo-50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <img src={Logo} alt="Product" className="w-16 h-16 object-cover rounded-xl shadow-md border border-gray-200" />
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">{p.product_name}</td>
                          <td className="px-6 py-5 mt-5 whitespace-nowrap text-sm text-gray-600 bg-gray-100 rounded-full inline-block">{p.product_category}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">{p.product_quantity}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">₹{p.product_cost_price}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">₹{p.product_selling_price}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <button
                                className="flex cursor-pointer items-center gap-2 bg-linear-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-lg hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                                onClick={() => {
                                  setOpenModal(true);
                                  setModalMode("update");
                                  setEditProduct(p);
                                }}
                              >
                                <Edit size={16} />
                                Update
                              </button>
                              <button
                                className="flex cursor-pointer items-center gap-2 bg-linear-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-md"
                                onClick={() => handleDelete(p)}
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      {openModal && (
        <ProductModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
            fetchProducts();
          }}
          pageName={modalMode == "add" ? "Add Product" : "Update Product"}
          product={editProduct}
        />
      )}
    </div>
  );
}
