import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'




import { Toaster } from "react-hot-toast";
import { AuthProvider } from './context/AuthContext'; 
import Footer from './components/footer';
import Login from './components/Login';
// import Register from "./components/Register";
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
import SellerLogin from './components/Farmer/SellerLogin';
import SellerLayout from './pages/Farmers/SellerLayout';
import AddProduct from './pages/Farmers/AddProduct';
import Orders from './pages/Farmers/Orders';
import ProductList from './pages/Farmers/ProductList';
import AllProducts from './pages/AllProducts';

import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Contact from './components/contact';
import KhaltiCallback from './components/KhaltiCallBack';


const App =()=>{
  const isSellerPath =useLocation().pathname.includes("seller")
  const { showUserLogin,isSeller } = useAppContext()
  return(
    <AuthProvider>
      <div className='text-default min-h-screen text-gray-700 bg-white'>
        {isSellerPath ? null : <Navbar/>}
        {showUserLogin ? <Login/> :null}
        <Toaster/>
        <div className={`${isSellerPath ? "":"px-6md:px-16 lg:px-24 xl:px-32"}`}>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/products' element={<AllProducts/>}/>
            <Route path='/contact' element={<Contact/>}/>
            <Route path='/products/:category' element={<ProductCategory/>}/>
            <Route path='/products/:category/:id' element={<ProductDetails/>}/>
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/add-address' element={<AddAddress/>}/>
            <Route path='/my-orders' element={<MyOrders/>}/>
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/payment' element={<Payment />} />
            <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
              <Route index element={isSeller?<AddProduct />:null} /> {/* /seller */}
              <Route path="product-list" element={<ProductList />} /> {/* /seller/product-list */}
              <Route path="orders" element={<Orders />} /> {/* /seller/orders */}
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email/:username" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            <Route path="/resend-otp" element={<ResendOtp />} /> 
             <Route path="/payment-callback" element={<KhaltiCallback/>} /> 
           

          </Routes>
        </div>
        {!isSellerPath &&<Footer/>}
      </div>
    </AuthProvider>
  )
}
export default App
