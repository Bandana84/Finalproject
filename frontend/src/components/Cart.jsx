import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, updateCartItem, removeFromCart, currency, user } = useAppContext();
    const navigate = useNavigate();

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        const success = await updateCartItem(productId, newQuantity);
        if (success) {
            toast.success('Cart updated successfully');
        }
    };

    const handleRemoveItem = async (productId) => {
        const success = await removeFromCart(productId);
        if (success) {
            toast.success('Item removed from cart');
        }
    };

    const handleCheckout = () => {
        if (!user) {
            toast.error('Please log in to proceed to checkout');
            return;
        }
        navigate('/checkout');
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <button 
                    className="continue-shopping-btn"
                    onClick={() => navigate('/products')}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h2>Your Cart ({cart.itemCount} items)</h2>
                <button 
                    className="continue-shopping-btn"
                    onClick={() => navigate('/products')}
                >
                    Continue Shopping
                </button>
            </div>
            
            <div className="cart-items">
                {cart.items.map((item) => (
                    <div key={item.id} className="cart-item">
                        <img 
                            src={item.images?.[0]?.image || '/placeholder.png'} 
                            alt={item.name} 
                            className="product-image"
                            onClick={() => navigate(`/products/${item.category}/${item.id}`)}
                        />
                        <div className="item-details">
                            <h3 onClick={() => navigate(`/products/${item.category}/${item.id}`)}>
                                {item.name}
                            </h3>
                            <p>Price: {currency}{item.offer_price}</p>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button 
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <p>Subtotal: {currency}{(item.offer_price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button 
                            className="remove-btn"
                            onClick={() => handleRemoveItem(item.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-item">
                    <span>Subtotal</span>
                    <span>{currency}{cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                    <span>Tax (2%)</span>
                    <span>{currency}{cart.tax.toFixed(2)}</span>
                </div>
                <div className="summary-item total">
                    <span>Total</span>
                    <span>{currency}{cart.grand_total.toFixed(2)}</span>
                </div>
                <button 
                    className="checkout-btn"
                    onClick={handleCheckout}
                    disabled={!user}
                >
                    {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
            </div>
        </div>
    );
};

export default Cart;
