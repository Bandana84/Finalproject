import React, { useState } from 'react'

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition text-gray-700 placeholder-gray-400"
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
)

const AddAddress = () => {
  const [address, setAddress] = useState({ 
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }))
    console.log(address);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Submit logic here
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Add Shipping <span className="text-primary">Address</span></h1>
          <p className="mt-2 text-gray-600">Enter your delivery information</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Form Section */}
            <div className="w-full md:w-1/2 p-8">
              <form onSubmit={onSubmitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <InputField handleChange={handleChange} address={address} name='firstName' type="text" placeholder="First Name"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <InputField handleChange={handleChange} address={address} name='lastName' type="text" placeholder="Last Name"/>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <InputField handleChange={handleChange} address={address} name='email' type="email" placeholder="Email Address"/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <InputField handleChange={handleChange} address={address} name='street' type="text" placeholder="Street Address"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <InputField handleChange={handleChange} address={address} name='city' type="text" placeholder="City"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <InputField handleChange={handleChange} address={address} name='country' type="text" placeholder="Country"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <InputField handleChange={handleChange} address={address} name='zipcode' type="number" placeholder="ZIP Code"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <InputField handleChange={handleChange} address={address} name='state' type="text" placeholder="State"/>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <InputField handleChange={handleChange} address={address} name='phone' type="tel" placeholder="Phone Number"/>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>

            {/* Image Section */}
            <div className="hidden md:block w-1/2 bg-gray-100 relative">
              <img 
                className="absolute inset-0 w-full h-full object-cover" 
                src="/address.jpg" 
                alt="Delivery address illustration"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-8">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-bold mb-3">Fast & Secure Delivery</h3>
                  <p className="text-lg">We ensure your farm-fresh products arrive safely at your doorstep</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAddress