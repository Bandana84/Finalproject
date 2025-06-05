import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';

import { Toaster } from "react-hot-toast";
import { AuthProvider } from './context/AuthContext'; 
import Footer from './components/footer';
import Login from './components/Login';
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import ResendOtp from "./components/resend_otp";
import VerifyEmail from "./components/Verify_Email";

import { useAppContext } from './context/AppContext';

import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import AllProducts from './pages/AllProducts';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
 import KhaltiVerify from "./components/KhaltiVerify"; // New component
import Contact from './components/contact';


const App = () => {
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin } = useAppContext();

  return (
    <AuthProvider>
      <div className='text-default min-h-screen text-gray-700 bg-white'>
        {!isSellerPath && <Navbar />}
        {showUserLogin && <Login />}
        <Toaster />
        <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<AllProducts />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/products/:category' element={<ProductCategory />} />
            <Route path='/products/:category/:id' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/add-address' element={<AddAddress />} />
            <Route path='/my-orders' element={<MyOrders />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/payment' element={<Payment />} />
           
            <Route path='/login' element={<Login />} />
            <Route path='/verify-email/:username' element={<VerifyEmail />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password/:uid/:token' element={<ResetPassword />} />
            <Route path='/resend-otp' element={<ResendOtp />} />
    
              <Route path="/khalti-verify" element={<KhaltiVerify />} />
       



          </Routes>
        </div>
        {!isSellerPath && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;
