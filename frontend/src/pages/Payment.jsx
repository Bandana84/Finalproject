import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currency } = useAppContext();
  const { address, paymentMethod, totalAmount } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState(null);

  // Load Khalti Checkout script
  useEffect(() => {
    if (!window.KhaltiCheckout) {
      const script = document.createElement('script');
      script.src = "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js";
      script.onload = () => {
        initializeKhaltiCheckout();
      };
      document.body.appendChild(script);
    } else {
      initializeKhaltiCheckout();
    }

    return () => {
      if (checkout) {
        checkout.hide();
      }
    };
  }, []);

  // Initialize Khalti Checkout
  const initializeKhaltiCheckout = () => {
    const config = {
      // Sandbox credentials (replace with your test keys)
      publicKey: "test_public_key_d1790b84c696446db29feb56628ec289",
      productIdentity: `order_${Date.now()}`,
      productName: "Your Store Purchase",
      productUrl: window.location.href,
      paymentPreference: ["KHALTI"],
      eventHandler: {
        onSuccess: (payload) => {
          handlePaymentSuccess(payload);
        },
        onError: (error) => {
          toast.error(`Payment failed: ${error.message}`);
          console.error("Khalti Error:", error);
        },
        onClose: () => {
          toast("Payment window closed");
        }
      }
    };

    setCheckout(new window.KhaltiCheckout(config));
  };

  // Handle successful payment
  const handlePaymentSuccess = async (payload) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/payments/khalti/verify/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: payload.token,
          amount: payload.amount,
          mobile: payload.mobile,
          product_details: {
            name: "Your Product",
            quantity: 1
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      toast.success("Payment successful! Order placed.");
      navigate('/order-success', { state: data });
    } catch (error) {
      toast.error(`Order processing failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initiate payment
  // Payment.jsx
const handleManualRetry = () => {
  if (!window.KhaltiCheckout) {
    toast.error("Payment system not ready. Please refresh.");
    return;
  }

  const config = {
    // SANDBOX TEST KEY (replace with live in production)
    publicKey: "test_public_key_d1790b84c696446db29feb56628ec289",
    productIdentity: `order_${Date.now()}`,
    productName: "Your Product",
    productUrl: window.location.href,
    paymentPreference: ["KHALTI"],
    eventHandler: {
      onSuccess: async (payload) => {
        try {
          const response = await fetch('/api/payments/khalti/verify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
              token: payload.token,
              amount: payload.amount,
              mobile: payload.mobile
            })
          });
          
          if (!response.ok) throw new Error(await response.text());
          navigate('/order-success');
        } catch (error) {
          toast.error(`Verification failed: ${error.message}`);
        }
      },
      onError: (error) => {
        toast.error(error.message || "Payment failed");
        console.error("Khalti Error:", error);
      }
    }
  };

  const checkout = new window.KhaltiCheckout(config);
  checkout.show({
    amount: Math.round(totalAmount * 100) // Convert to paisa
  });
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Processing Payment</h2>
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
            <h2 className="text-2xl font-bold text-white">Complete Your Payment</h2>
            <p className="mt-1 text-indigo-100">Secure payment page</p>
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
                    {currency}{totalAmount}
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
                  <p><span className="font-medium">Address:</span> {address?.street}, {address?.city}, {address?.province}, {address?.country}</p>
                  <p><span className="font-medium">Phone:</span> {address?.phone || 'Not provided'}</p>
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
                  <h3 className="text-sm font-medium text-blue-800">Payment Instructions</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>This is a placeholder for payment instructions.</p>
                    <p className="mt-1">You can integrate your payment gateway here.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/checkout')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Checkout
              </button>
              <button
                onClick={handleManualRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
