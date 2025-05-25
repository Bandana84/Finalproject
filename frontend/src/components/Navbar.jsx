import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from "react-hot-toast";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    const { 
        user, 
        setUser, 
        setShowUserLogin, 
        setSearchQuery, 
        searchQuery, 
        getCartCount,
        filteredProducts 
    } = useAppContext();

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logout = async () => {
        try {
            // Check if user and tokens exist
            if (!user?.tokens?.access) {
                // If no tokens, just clear the user state
                setUser(null);
                setShowUserLogin(false);
                navigate('/');
                setOpen(false);
                setIsDropdownOpen(false);
                return;
            }

            const response = await fetch('http://localhost:8000/api/users/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.tokens.access}`
                },
                body: JSON.stringify({
                    refresh: user.tokens.refresh
                }),
            });

            // Even if the server request fails, we should still log the user out locally
            setUser(null);
            setShowUserLogin(false);
            navigate('/');
            setOpen(false);
            setIsDropdownOpen(false);

            if (!response.ok) {
                console.warn('Server logout failed, but user was logged out locally');
                return;
            }

        } catch (error) {
            console.error('Logout error:', error);
            // Still log out locally even if there's an error
            setUser(null);
            setShowUserLogin(false);
            navigate('/');
            setOpen(false);
            setIsDropdownOpen(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 shadow-sm border-b border-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <NavLink
                        to='/'
                        onClick={() => {
                            setOpen(false);
                            setIsDropdownOpen(false);
                        }}
                        className="flex items-center space-x-2 group"
                    >
                        <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-indigo-600 group-hover:rotate-12 transition-transform duration-300">
                            <img className="h-7 w-7" src="/logo.svg" alt="logo" />
                        </div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                            Farms2Basket
                        </h3>
                    </NavLink>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink
                            to='/'
                            className={({ isActive }) =>
                                `relative px-1 py-2 text-sm font-medium transition-colors duration-300
                                ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`
                            }
                        >
                            Home
                            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </NavLink>

                        <NavLink
                            to='/products'
                            className={({ isActive }) =>
                                `relative px-1 py-2 text-sm font-medium transition-colors duration-300
                                ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`
                            }
                        >
                            Shop
                        </NavLink>

                        <NavLink
                            to='/contact'
                            className={({ isActive }) =>
                                `relative px-1 py-2 text-sm font-medium transition-colors duration-300
                                ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`
                            }
                        >
                            Contact
                        </NavLink>

                        {/* Search Bar */}
                        <div className="hidden lg:flex items-center text-sm space-x-2 border border-gray-200 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300 relative" ref={searchRef}>
                            <input
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSearchResults(true);
                                }}
                                onFocus={() => setShowSearchResults(true)}
                                value={searchQuery}
                                className="py-1 w-36 bg-transparent outline-none placeholder-gray-500 text-gray-700 focus:w-44 transition-all duration-300"
                                type="text"
                                placeholder="Search products"
                            />
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                                <path d="M10.836 10.615 15 14.695" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchQuery.trim() !== '' && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-y-auto z-50">
                                    {filteredProducts.length > 0 ? (
                                        <div className="py-2">
                                            {filteredProducts.map((product) => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => {
                                                        navigate(`/products/${product.category.toLowerCase()}/${product.id}`);
                                                        setShowSearchResults(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-3"
                                                >
                                                    <img
                                                        src={product.images[0]?.image || '/placeholder.png'}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                    <div>
                                                        <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                                                        <p className="text-xs text-gray-500">${product.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500">
                                            No products found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <div
                            onClick={() => {
                                navigate('/cart');
                                setIsDropdownOpen(false);
                            }}
                            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                            <img src="/nav_cart_icon.svg" alt='cart' className='w-6 opacity-80' />
                            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                                {getCartCount()}
                            </button>
                        </div>

                        {/* Auth */}
                        {!user ? (
                            <button
                                onClick={() => {
                                    // setShowUserLogin(true);
                                    navigate("/login")
                                    setIsDropdownOpen(false);
                                }}
                                className="relative px-6 py-1.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Login
                                <span className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                            </button>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="relative">
                                        <img
                                            src="profile_icon.png"
                                            alt="Profile"
                                            className="w-9 h-9 rounded-full object-cover border-2 border-primary/30 hover:border-primary/60 transition-all duration-300"
                                        />
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                                    </div>
                                    <span className="hidden lg:inline-block font-medium text-gray-700 hover:text-primary transition-colors duration-300">
                                        {user.name || user.email}
                                    </span>
                                </div>

                                <div
                                    className={`absolute top-12 right-0 bg-white shadow-lg border border-gray-100 py-2 w-48 rounded-xl z-50 overflow-hidden transition-all duration-200 ${
                                        isDropdownOpen ? 'block' : 'hidden'
                                    }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-90"></div>
                                    <div className="relative z-10">
                                      
                                            <div
                                                onClick={() => {
                                                    navigate('/my-orders');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="px-4 py-2.5 hover:bg-primary/5 cursor-pointer flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                <span>My Orders</span>
                                            </div>
                              

                                        <div
                                            onClick={() => {
                                                navigate('/forgot-password');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="px-4 py-2.5 hover:bg-primary/5 cursor-pointer flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                            <span>Reset password</span>
                                        </div>

                                        <div className="border-t border-gray-100 my-1"></div>

                                        <div
                                            onClick={logout}
                                            className="px-4 py-2.5 hover:bg-primary/5 cursor-pointer flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span>Logout</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <div
                            onClick={() => {
                                navigate('/cart');
                                setOpen(false);
                            }}
                            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                        >
                            <img src="/nav_cart_icon.svg" alt='cart' className='w-6 opacity-80' />
                            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
                                {getCartCount()}
                            </button>
                        </div>
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                        >
                            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <NavLink
                            to="/"
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                                ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/products"
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                                ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            Shop
                        </NavLink>

                        {/* Mobile Cart Item */}
                        <div
                            onClick={() => {
                                setOpen(false);
                                navigate('/cart');
                            }}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div className="flex items-center w-full">
                                <img src="/nav_cart_icon.svg" alt="cart" className="w-5 h-5 mr-3 opacity-80" />
                                <span>Cart</span>
                                <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-xs font-medium bg-primary text-white rounded-full">
                                    {getCartCount()}
                                </span>
                            </div>
                        </div>

                        {user && (
                            <NavLink
                                to="/my-orders"
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                                    ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`
                                }
                            >
                                My Orders
                            </NavLink>
                        )}
                        <NavLink
                            to="/contact"
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                                ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            Contact
                        </NavLink>

                        <div className="pt-2">
                            {!user ? (
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        setShowUserLogin(true);
                                    }}
                                    className="w-full px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-md text-base font-medium shadow hover:shadow-md transition-all duration-300"
                                >
                                    Login
                                </button>
                            ) : (
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-2 text-white bg-gradient-to-r from-red-500 to-red-600 rounded-md text-base font-medium shadow hover:shadow-md transition-all duration-300"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
