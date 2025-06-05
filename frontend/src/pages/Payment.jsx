import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Swal from "sweetalert2";
import api from "../utils/axios";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, cart } = useAppContext();
  const { address, paymentMethod, totalAmount, cartItems } = location.state || {};
  const [loading, setLoading] = useState(false);

  const handlePaymentSubmission = async () => {
    setLoading(true);
    console.log("location.state:", location.state);
    console.log("cartItems:", cartItems);
    console.log("AppContext cart:", cart);

    try {
      const tokens = JSON.parse(localStorage.getItem("tokens") || "{}");
      const token = tokens?.access;

      console.log("Auth token:", token);

      if (!token) {
        throw new Error("Please log in to continue");
      }

      if (!totalAmount || !address) {
        throw new Error("Missing order details (total amount or address)");
      }

      if (!cartItems || !Array.isArray(cartItems) || !cartItems.length) {
        throw new Error("Cart is empty or invalid. Please add items to your cart.");
      }

      // Validate cart items structure
      if (!cartItems.every(item => item?.product && item?.quantity)) {
        throw new Error("Invalid cart item structure");
      }

      if (!address?.street || !address?.city || !address?.province || !address?.country) {
        throw new Error("Please complete all address fields");
      }

      const clientOrderId = `ORDER_${Date.now()}`;

      // Build the order payload (same as before)
      const orderPayload = {
        street: address.street,
        city: address.city,
        province: address.province,
        country: address.country,
        phone: address.phone || "",
        payment_method: "khalti",
        payment_details: {},
        items: cartItems.map(item => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        total_amount: totalAmount
      };

      // Only initiate Khalti payment, do not create order here
      const khaltiPayload = {
        return_url: `${window.location.origin}/khalti-verify?order_id=${clientOrderId}`,
        amount: Math.round(totalAmount * 100),
        purchase_order_id: clientOrderId,
        customer_info: {
          name: address.name || address.street,
          email: address.email || "user@example.com",
          phone: address.phone || "9813479433"
        },
        // No order_id yet, will be created after payment verification
      };

      console.log("Khalti payload:", khaltiPayload);

      const response = await api.post("/carts/khalti/initiate/", khaltiPayload);

      console.log("Khalti response:", response.data);
      if (response.data.payment_url) {
        localStorage.setItem(
          "khalti_order_ref",
          JSON.stringify({
            pidx: response.data.pidx,
            orderPayload // <-- Save orderPayload for KhaltiVerify
          })
        );
        window.location.href = response.data.payment_url;
      } else {
        throw new Error("Failed to get payment URL");
      }
    } catch (error) {
      console.error("Payment error:", error, "Response:", error.response?.data);
      let errorMessage = error.response?.data?.error || error.message || "An error occurred";
      if (error.response?.status === 400 && error.response?.data?.error?.includes("Cart")) {
        errorMessage = "Your cart is empty on the server. Please add items again.";
      }
      Swal.fire({
        title: "Payment Failed",
        text: errorMessage,
        icon: "error"
      }).then(() => {
        if (error.message.includes("log in") || error.response?.status === 401) {
          navigate("/login");
        } else if (error.message.includes("cart") || error.response?.data?.error?.includes("Cart")) {
          navigate("/cart");
        }
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Processing Order</h2>
          <p className="text-gray-600 mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Complete Your Order</h2>
            <p className="mt-1 text-indigo-100">Review your details</p>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {currency}
                    {totalAmount}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Shipping Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Address:</span> {address?.street}, {address?.city}, {address?.province}, {address?.country}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {address?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Payment Method</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Selected: {paymentMethod === "online" ? "Khalti" : "Cash on Delivery"}</p>
                    {paymentMethod === "online" && <p className="mt-1">You'll be redirected to Khalti for payment.</p>}
                    {paymentMethod === "cod" && <p className="mt-1">You'll pay when your order arrives.</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate("/checkout")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Checkout
              </button>
              <button
                onClick={handlePaymentSubmission}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;