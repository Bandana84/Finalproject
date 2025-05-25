import React from 'react';
import CartComponent from '../components/Cart';
import '../components/Cart.css';

const Cart = () => {
    return (
        <div className="cart-page">
            <h1 className="page-title">Shopping Cart</h1>
            <CartComponent />
        </div>
    );
};

export default Cart;
