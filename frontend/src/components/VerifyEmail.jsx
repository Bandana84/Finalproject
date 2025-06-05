import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = ({ username }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/users/verify-email/${username}/`, {
        otp_code: otp
      });

      if (response.status === 200) {
        setSuccess('Email verified successfully! You can now login.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-full max-w-md rounded-xl shadow-lg border border-green-200 bg-white/90 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-green-800 mb-6">Verify Your Email</h2>
        
        {error && <p className="text-red-500 text-sm w-full text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm w-full text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-green-700 mb-1">OTP Code</label>
            <input
              type="text"
              placeholder="Enter OTP code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="input"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 hover:bg-green-800"
          >
            Verify Email
          </button>
        </form>

        <p className="text-sm text-green-600 text-center mt-4">
          Check your email for the OTP code. It will expire in 5 minutes.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
