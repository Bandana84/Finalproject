import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage
        const storedUser = localStorage.getItem('user');
        const storedTokens = localStorage.getItem('tokens');
        if (storedUser && storedTokens) {
            return {
                ...JSON.parse(storedUser),
                tokens: JSON.parse(storedTokens)
            };
        }
        return null;
    });
    const [isSeller, setSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    // Update localStorage when user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify({
                username: user.username,
                email: user.email,
                is_active: user.is_active
            }));
            localStorage.setItem('tokens', JSON.stringify(user.tokens));
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('tokens');
        }
    }, [user]);

    // Filter products when search query changes
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/products/');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const fetchCart = async () => {
        const accessToken = user?.tokens?.access;
        if (!accessToken) return;

        try {
            const response = await fetch('http://localhost:8000/api/carts/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token is invalid, clear user data and show login
                    localStorage.removeItem('user');
                    localStorage.removeItem('tokens');
                    setUser(null);
                    setShowUserLogin(true);
                    return;
                }
                throw new Error('Failed to fetch cart');
            }

            const data = await response.json();
            if (data && data.items) {
                // Map: productId -> { quantity, cart_item_id }
                const items = {};
                data.items.forEach(item => {
                    items[item.product.id] = {
                        quantity: item.quantity,
                        cart_item_id: item.id // backend's cart item id
                    };
                });
                setCartItems(items);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    const addToCart = async (productId) => {
        const accessToken = user?.tokens?.access;
        
        if (!accessToken) {
            toast.error("Please log in to add to cart");
            setShowUserLogin(true);
            return false;
        }

        // Ensure productId is a number
        const numericProductId = Number(productId);
        if (isNaN(numericProductId)) {
            toast.error("Invalid product ID");
            return false;
        }
    
        try {
            console.log('Adding to cart:', { product_id: numericProductId });
            const response = await fetch('http://localhost:8000/api/carts/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ 
                    product_id: numericProductId, 
                    quantity: 1 
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
             
                fetchCart();
                return true;
            } else {
                const errorData = await response.json();
                console.error('Cart Error:', errorData);
                
                if (response.status === 401) {
                    // Token is invalid, clear user data and show login
                    localStorage.removeItem('user');
                    localStorage.removeItem('tokens');
                    setUser(null);
                    setShowUserLogin(true);
                    toast.error("Session expired. Please log in again.");
                } else if (response.status === 404) {
                    toast.error("Product not found. Please try again.");
                } else {
                    toast.error(errorData.error || errorData.message || "Failed to add to cart");
                }
                return false;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error("Network error. Please try again.");
            return false;
        }
    };

    const updateCartItem = async (productId, quantity) => {
        const accessToken = user?.tokens?.access;
        if (!accessToken) return false;

        try {
            const response = await fetch(`http://localhost:8000/api/carts/update-by-product/${productId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ quantity }),
            });

            if (response.ok) {
           
                fetchCart();
                return true;
            } else {
                toast.error("Failed to update cart");
                return false;
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
            return false;
        }
    };

    const removeFromCart = async (productId) => {
        const accessToken = user?.tokens?.access;
        if (!accessToken) return false;

        try {
            const response = await fetch(`http://localhost:8000/api/carts/remove-by-product/${productId}/`, {
                method: 'DELETE',
                headers: {
                  
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
              
                fetchCart();
                return true;
            } else {
                toast.error("Failed to remove item");
                return false;
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return false;
        }
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((sum, item) => sum + (item.quantity || 0), 0);
    };

    const getCartAmount = () => {
        let total = 0;
        for (const id in cartItems) {
            const product = products.find(p => String(p.id) === String(id));
            if (product) {
                total += product.offer_price * cartItems[id].quantity;
            }
        }
        return Math.round(total * 100) / 100;
    };

    // Update getCart to ensure each item has a top-level id (product id)
    const getCart = () => {
        const cartArray = [];
        for (const key in cartItems) {
            const product = products.find(item => String(item.id) === String(key));
            if (product) {
                cartArray.push({ 
                    ...product, 
                    id: product.id, // ensure id is present and is the product id
                    quantity: cartItems[key].quantity, 
                    cart_item_id: cartItems[key].cart_item_id
                });
            }
        }
        return cartArray;
    };

    // Add cart object
    const cart = {
        items: getCart(),
        subtotal: getCartAmount(),
        tax: Math.round(getCartAmount() * 0.02 * 100) / 100,
        grand_total: Math.round(getCartAmount() * 1.02 * 100) / 100,
        itemCount: getCartCount()
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchCart();
    }, [user]);

    const value = {
        navigate,
        user,
        setUser,
        setSeller,
        isSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        setProducts,
        filteredProducts,
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        setCartItems,
        searchQuery,
        setSearchQuery,
        getCartAmount,
        getCartCount,
        cart,
        fetchCart
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
