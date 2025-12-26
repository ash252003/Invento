import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Aside from "../components/AsideBar";
import { CirclePlus, X } from "lucide-react";
import { data } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
export default function Billing() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [customers, setCustomer] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const totalAmount = invoiceItems.reduce(
    (sum, item) => sum + item.product_selling_price * item.quantity,
    0
  );

  const downloadInvoice = async (transactionId) => {
    const res = await axios.get(
      `http://localhost:8080/api/transaction/${transactionId}/invoice`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${transactionId}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  const saveOrUpdateCustomer = async () => {
    const customerRes = await axios.post(
      `http://localhost:8080/api/addOrUpdateCustomer/${userId}`,
      {
        customerName,
        customerPhone,
        customerAddress,
      }
    );

    const customer = customerRes.data;

    // Update local state
    setCustomer((prev) => {
      const exists = prev.find((c) => c.id === customer.id);
      if (exists) {
        return prev.map((c) => (c.id === customer.id ? customer : c));
      } else {
        return [...prev, customer];
      }
    });

    return customer;
  };

  const handleTransaction = async () => {
    if (invoiceItems.length === 0) {
      Swal.fire(
        "Error",
        "Add at least one product to generate invoice",
        "error"
      );
      return;
    }

    // Add or update customer first
    const customer = await saveOrUpdateCustomer();
    const transactionPayload = {
      transactionDate: transactionDate,
      amount: totalAmount,
      items: invoiceItems.map((item) => ({
        product: { id: item.id },
        quantity: item.quantity,
        sellingPrice: item.product_selling_price,
      })),
    };
    try {
      const res = await axios.post(
        `http://localhost:8080/api/addTransaction/${userId}/${customer.id}`,
        transactionPayload
      );
      console.log(res.data);
      const transactionId = res.data.id;
      await downloadInvoice(transactionId);
      Swal.fire("Success", "Invoice Generated Successfully", "success");

      // Reset form
      setInvoiceItems([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setTransactionDate("");
    } catch (err) {
      Swal.fire("Error", {err}, "error");
    }
  };

  const fetchProducts = () => {
    fetch(`http://localhost:8080/api/getProducts/${userId}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const fetchCustomer = () => {
    fetch(`http://localhost:8080/api/getCustomer/${userId}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data));
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomer();
  }, []);

  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === Number(selectedProductId));
    const alreadyAdded = invoiceItems.some((item) => item.id === product.id);
    if (alreadyAdded) return;
    setInvoiceItems([...invoiceItems, { ...product, quantity: 1 }]);
    setSelectedProductId("");
  };

  return (
    <div>
      <div>
        <Header openSidebar={() => setSidebarOpen(true)} />
        <Aside
          isOpen={isSidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          active="billing"
        />
      </div>
      <div className="w-full px-3">
        <h1 className="text-xl font-semibold ms-2 mt-2 md:mt-4 md:ms-3 md:text-2xl w-full text-center">
          Create Invoice
        </h1>
        <form action="">
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-6 rounded-lg shadow mx-auto mt-4">
            <h1 className="text-xl font-bold mb-2">Customer Details</h1>
            <p className="mb-6">Enter customer information for billing.</p>
            <input
              type="text"
              list="customerList"
              placeholder="Customer Name"
              className="w-full p-3 mb-4 border rounded-lg"
              value={customerName}
              onChange={(e) => {
                const name = e.target.value;
                setCustomerName(name);

                const selectedCustomer = customers.find(
                  (c) => c.customerName === name
                );
                if (selectedCustomer) {
                  setSelectedCustomerId(selectedCustomer.id);
                  setCustomerPhone(selectedCustomer.customerPhone);
                  setCustomerAddress(selectedCustomer.customerAddress);
                } else {
                  setSelectedCustomerId(null);
                }
              }}
            />
            <datalist id="customerList">
              {customers.map((c) => (
                <option key={c.id} value={c.customerName} />
              ))}
            </datalist>
            <input
              type="text"
              placeholder="Phone"
              className="w-full p-3 mb-4 border rounded-lg"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <input
              type="text"
              placeholder="Customer Address"
              className="w-full p-3 mb-4 border rounded-lg"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
            <input
              type="date"
              className="w-full p-3 mb-4 border rounded-lg"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-6 rounded-lg shadow mx-auto mt-5">
            <h1 className="text-xl font-bold mb-2">Add Products</h1>
            <p className="mb-6">Select products to add to the invoice.</p>
            <div className="w-full flex justify-between gap-3">
              <select
                className="border h-10 p-2 rounded w-full"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option>Choose Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="border-2 flex items-center rounded-lg px-3 bg-gray-50 text-gray-500"
                onClick={handleAddProduct}
              >
                <CirclePlus className="mr-1" /> Add
              </button>
            </div>
            {invoiceItems.map((item) => (
              <div
                key={item.id}
                className="w-full flex justify-between gap-3 mt-2"
              >
                <div className="bg-gray-100 w-full p-2 flex justify-between gap-3 items-center">
                  <h4 className="w-1/3">{item.product_name}</h4>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      className="w-10 md:w-20 border rounded p-1 text-center"
                      value={item.quantity}
                      onChange={(e) =>
                        setInvoiceItems(
                          invoiceItems.map((p) =>
                            p.id === item.id
                              ? { ...p, quantity: Number(e.target.value) }
                              : p
                          )
                        )
                      }
                    />
                    <h4 className="ps-2">
                      ₹ {item.product_selling_price * item.quantity}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setInvoiceItems(
                      invoiceItems.filter((p) => p.id !== item.id)
                    )
                  }
                  className="border-2 w-28 flex items-center justify-center rounded-lg px-3 text-red-500"
                >
                  <X className="mr-1" />
                </button>
              </div>
            ))}
          </div>
          {invoiceItems.length > 0 && (
            <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-4 rounded-lg shadow mx-auto mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount</span>
                <span>₹ {totalAmount}</span>
              </div>
            </div>
          )}
          <div className="mt-6 w-full md:w-2/3 lg:w-1/2 mx-auto mb-6">
            <button
              type="button"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              onClick={handleTransaction}
            >
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
