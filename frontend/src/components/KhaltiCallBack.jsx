import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const KhaltiCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pidx = searchParams.get('pidx');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!pidx) {
          throw new Error('Payment reference missing');
        }

        const response = await api.post('/api/khalti/verify/', { pidx });
        
        if (response.data.status === 'success') {
          toast.success('Payment verified successfully!');
          // Redirect to success page or orders page
          navigate('/order-success');
        } else {
          toast.error('Payment verification pending');
          navigate('/orders');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error(error.response?.data?.error || 'Payment verification failed');
        navigate('/checkout');
      }
    };

    verifyPayment();
  }, [pidx, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-800">Verifying Payment</h2>
        <p className="text-gray-600 mt-2">Please wait while we verify your payment...</p>
      </div>
    </div>
  );
};

export default KhaltiCallback;