import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usersApi } from '../services/api';
import { CheckCircle2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };

      const res = await usersApi.updateProfile(payload);
      if (res.data.success) {
        setUser(res.data.data);
        setMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-poppins space-y-10">
      
      {/* Breadcrumb & Welcome Greeting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <span className="text-black font-medium">My Account</span>
        </nav>

        <p className="text-sm font-medium text-black">
          Welcome! <span className="text-exclusive-red font-semibold">{user?.name}</span>
        </p>
      </div>

      {/* Main Grid: Sidebar (Left) & Edit Profile Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-base text-black">Manage My Account</h3>
            <ul className="pl-6 space-y-2 text-sm">
              <li>
                <Link to="/profile" className="text-exclusive-red font-medium">My Profile</Link>
              </li>
              <li>
                <span className="text-gray-500 hover:text-black cursor-pointer">Address Book</span>
              </li>
              <li>
                <span className="text-gray-500 hover:text-black cursor-pointer">My Payment Options</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base text-black">My Orders</h3>
            <ul className="pl-6 space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/orders" className="hover:text-black transition-colors">My Orders / History</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-black transition-colors">My Returns</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-black transition-colors">My Cancellations</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-base text-black">My WishList</h3>
            <ul className="pl-6 space-y-2 text-sm text-gray-500">
              <li>
                <Link to="/shop" className="hover:text-black transition-colors">Wishlist Items</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Form: Edit Profile */}
        <div className="lg:col-span-8 bg-white shadow-exclusive-sm border border-gray-100 rounded p-8 sm:p-10 space-y-6">
          <h2 className="text-xl font-bold text-exclusive-red">Edit Your Profile</h2>

          {message && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">First Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full bg-gray-100 text-gray-500 rounded px-4 py-3 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-700 font-medium">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Password Changes */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-sm text-black">Password Changes</h3>

              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-exclusive-bg rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-6 pt-4">
              <button
                type="button"
                className="text-sm text-black hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3.5 bg-exclusive-red hover:bg-exclusive-red-hover text-white font-medium text-sm rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
};
