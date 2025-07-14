
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup } from '../redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: '', username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    const result = await dispatch(signup(formData));
    if (signup.fulfilled.match(result)) {
      toast.success(result.payload.message || 'Signup successful!');
      setFormData({ name: '', username: '', password: '' }); // Clear input fields
      navigate('/'); // Navigate to home page
    } else {
      toast.error(result.payload || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-green-900 to-red-900">
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1 text-sm sm:text-base">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1 text-sm sm:text-base">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500 text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1 text-sm sm:text-base">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500 text-sm sm:text-base"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-green-400 text-sm sm:text-base cursor-pointer"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-white mt-4 text-center text-sm sm:text-base">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

