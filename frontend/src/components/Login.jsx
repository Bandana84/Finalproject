import React, { useState ,useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { setShowUserLogin, setUser } = useAppContext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Effect to handle auto-closing after successful login
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        setShowUserLogin(false);
      }, 800); // Close after 0.8 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, setShowUserLogin]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (state === "register") {
      try {
        const response= await axios.post("http://127.0.0.1:8000/api/users/register/", {
          username: name,
          email,
          password1: password,
          password2: confirmPassword,
        });

        setSuccessMessage("Registration successful! Check your email for the OTP code.");
        setPassword("");
        setConfirmPassword("");

        // Redirect to verify-email page
        setTimeout(() => {
          navigate(`/verify-email/${name}`);
        }, 300);
        
      } catch (err) {
        setError(err.response?.data?.detail || "Registration failed.");
      }
    } else {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/users/login/', {
          email: email,
          password: password,
        });

        const data = response.data;
        console.log('Login response:', data);
        
        // Store user data and tokens
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('tokens', JSON.stringify(data.tokens));
        
        setUser({
          ...data.user,
          tokens: data.tokens
        });
        navigate('/');
        setShowUserLogin(false);
        setIsLoggedIn(true);
        
      } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        
        // Handle different types of errors
        if (err.response?.data?.non_field_errors) {
          setError('Please verify your email address first.');
        } else if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else if (err.response?.data?.email) {
          setError(err.response.data.email);
        } else if (err.response?.data?.password) {
          setError(err.response.data.password);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      }
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowUserLogin(false);
      }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4"
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-full max-w-md rounded-xl shadow-lg border border-green-200 bg-white/90 backdrop-blur-sm"
      >
        <div className="w-full text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-2">Farms2Basket</h2>
          <p className="text-green-600 mb-6">
            {state === "login" ? "Welcome back!" : "Join our farming community"}
          </p>
        </div>

        {state === "register" && (
          <div className="w-full">
            <label className="block text-sm font-medium text-green-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
            />
          </div>
        )}

        <div className="w-full">
          <label className="block text-sm font-medium text-green-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-green-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            required
            className="input"
          />
        </div>

        {state === "register" && (
          <div className="w-full">
            <label className="block text-sm font-medium text-green-700 mb-1">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className={`input ${passwordError ? "border-red-500" : ""}`}
            />
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>
        )}

        {state === "login" && (
          <div className="w-full text-right -mt-2">
            <a href="/forgot-password" className="text-xs text-green-600 hover:underline">
              Forgot password?
            </a>
          </div>
        )}

        {error && <p className="text-red-500 text-sm w-full text-center">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm w-full text-center">{successMessage}</p>}

        <button
          type="submit"
          disabled={state === "register" && (passwordError || !password || !confirmPassword)}
          className={`w-full bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 ${
            state === "register" && (passwordError || !password || !confirmPassword)
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-green-800"
          }`}
        >
          {state === "register" ? "Create Account" : "Login to Your Account"}
        </button>

        <div className="w-full text-center text-sm text-green-600">
          {state === "register" ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setState("login");
                  setPasswordError("");
                }}
                className="font-semibold text-green-700 hover:text-green-800 underline"
              >
                Sign in instead
              </button>
            </p>
          ) : (
            <p>
              New to Farms2Basket?{" "}
              <button
                type="button"
                onClick={() => setState("register")}
                className="font-semibold text-green-700 hover:text-green-800 underline"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
