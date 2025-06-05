import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../utils/axios";
import { useAppContext } from "../context/AppContext";

const KhaltiVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart, fetchCart } = useAppContext();

  useEffect(() => {
    const verifyPayment = async () => {
      const queryParams = new URLSearchParams(location.search);
      const orderId = queryParams.get("order_id");
      const pidx = queryParams.get("pidx");
      const transactionId = queryParams.get("transaction_id");
      const status = queryParams.get("status");
      const amount = queryParams.get("amount");

      console.log("Khalti verification params:", { orderId, pidx, transactionId, status });

      if (status !== "Completed") {
        Swal.fire({
          title: "Payment Failed",
          text: "Payment was not completed successfully.",
          icon: "error",
        }).then(() => {
          localStorage.removeItem("khalti_order_ref");
          navigate("/cart");
        });
        return;
      }

      try {
        // Get order details from localStorage (set before redirect to Khalti)
        const khaltiOrderRef = JSON.parse(localStorage.getItem("khalti_order_ref") || "{}");
        let serverOrderId = khaltiOrderRef.order_id;
        let orderPayload = khaltiOrderRef.orderPayload;

        // If order is not yet created, create it now
        if (!serverOrderId && orderPayload) {
          // Add payment method as 'khalti' and empty payment_details
          orderPayload.payment_method = "khalti";
          orderPayload.payment_details = {};
          const orderRes = await api.post("/carts/order/", orderPayload);
          if (!orderRes.data.id) {
            throw new Error(orderRes.data.error || "Failed to create order after payment");
          }
          serverOrderId = orderRes.data.id;
          // Save order_id for verification
          khaltiOrderRef.order_id = serverOrderId;
          localStorage.setItem("khalti_order_ref", JSON.stringify(khaltiOrderRef));
        }

        if (!serverOrderId || !pidx) {
          throw new Error("Missing order or payment details");
        }

        // Now verify payment
        const response = await api.post("/carts/khalti/verify/", {
          pidx,
          order_id: serverOrderId,
          transaction_id: transactionId,
          amount,
        });

        console.log("Verification response:", response.data);

        if (response.data.status === "success") {
          localStorage.removeItem("khalti_order_ref");
          clearCart();
          await fetchCart(); // Refresh cart
          Swal.fire("Success", "Payment verified and order placed successfully!", "success").then(() => {
            navigate("/my-orders");
          });
        } else {
          throw new Error(response.data.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error, "Response:", error.response?.data);
        let errorMessage = error.response?.data?.error || error.message || "An error occurred during verification";
        if (error.response?.status === 405) {
          errorMessage = "Server configuration error: Method not allowed. Please contact support.";
        }
        localStorage.removeItem("khalti_order_ref");
        Swal.fire({
          title: "Payment Verification Failed",
          text: errorMessage,
          icon: "error",
        }).then(() => {
          navigate("/cart");
        });
      }
    };

    verifyPayment();
  }, [location, navigate, clearCart, fetchCart]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800">Verifying Payment</h2>
        <p className="text-gray-600 mt-2">Please wait...</p>
      </div>
    </div>
  );
};

export default KhaltiVerify;