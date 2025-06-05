import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import api from '../utils/axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, currency, products } = useAppContext();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    province: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);

      // Validate required fields
      const requiredFields = ['street', 'city', 'province', 'country', 'phone'];
      const missingFields = requiredFields.filter((field) => !address[field]);
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Validate cart and products
      console.log('Cart:', cart);
      console.log('Products:', products);
      if (!cart || !Object.keys(cart.items).length) {
        toast.error('Your cart is empty. Please add items to proceed.');
        navigate('/cart');
        return;
      }

      // Check if we have products data
      if (!products || !products.length) {
        toast.error('Failed to load product data. Please try refreshing the page.');
        return;
      }

      // First filter out out-of-stock items
      const inStockItems = Object.entries(cart.items).filter(([productId, item]) => {
        const product = item.product || products.find(p => String(p.id) === productId);
        return product && product.inStock;
      });

      // If no in-stock items, show error
      if (inStockItems.length === 0) {
        toast.error('All items in your cart are out of stock. Please remove them and try again.');
        navigate('/cart');
        return;
      }

      // Validate cart items and ensure valid product data
      const cartItemsWithProducts = inStockItems.map(([productId, item]) => {
        console.log('Processing cart item:', { productId, item });
        // Check if product data is already included
        if (item.product && item.product.id) {
          console.log('Using included product data:', item.product);
          return {
            product: item.product,
            quantity: item.quantity,
            price: item.product.price
          };
        }

        // Fallback to finding product in products array if not included
        // Use string comparison since we're storing product IDs as strings
        const product = products.find(p => String(p.id) === productId);
        if (!product) {
          console.log('Product not found in array for ID:', productId);
          throw new Error(`Product not found for ID: ${productId}`);
        }
        
        return {
          product,
          quantity: item.quantity,
          price: product.price
        };
      });

      if (paymentMethod === 'cod') {
        const orderPayload = {
          street: address.street,
          city: address.city,
          province: address.province,
          country: address.country,
          phone: address.phone || "",
          payment_method: "cod",
          payment_details: {},
          items: cartItemsWithProducts.map(item => ({
            product: item.product.id,
            quantity: item.quantity,
            price: item.price
          })),
          total_amount: cart.grand_total
        };

        try {
          const response = await api.post("/carts/order/", orderPayload);
          if (response.data.id) {
            toast.success("Order placed successfully!");
            navigate("/my-orders");
          } else {
            throw new Error("Failed to create order");
          }
        } catch (error) {
          console.error("Order error:", error);
          toast.error(error.response?.data?.error || "Failed to place order");
        }
      } else {
        // For Khalti, just navigate to payment page
        navigate('/payment', {
          state: {
            address,
            paymentMethod,
            totalAmount: cart.grand_total,
            cartItems: cartItemsWithProducts,
          },
        });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Failed to proceed to payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart || !cart.items || !Object.keys(cart.items).length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Add some items to your cart before checking out.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h2>

          {/* Address Form */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                    Province
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    value={address.province}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                  Cash on Delivery
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="online"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="online" className="ml-3 block text-sm font-medium text-gray-700">
                  Online Payment (Khalti)
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {currency}
                  {cart.subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (13%)</span>
                <span className="text-gray-900">
                  {currency}
                  {cart.tax}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {currency}
                  {cart.grand_total}
                </span>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="mt-8">
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;