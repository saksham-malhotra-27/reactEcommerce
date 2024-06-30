import React, { useState } from 'react';
import { useAuth } from '../context/auth';
import Layout from '../components/Layout.tsx/Layout';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../components/BaseUrl';
interface SignUpModalProps {
  onClose: () => void;
  switchToSignIn: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose, switchToSignIn }) => {
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role] = useState(0); // Default role to 0
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('role', String(role));

      const response = await fetch(`${BASE_URL}/api/v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      const data = await response.text();
      const obj = JSON.parse(data);
      const newAuth = { user: obj.user, token: obj.token };
      setAuth(newAuth);
      localStorage.setItem('auth', JSON.stringify(newAuth));
      onClose();
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-4">Sign Up</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#141414] text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#141414] leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#141414] text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#141414] leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#141414] text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#141414] leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#141414] text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#141414] leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <input
            type="hidden"
            id="role"
            value={role}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-[#141414] leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-[#141414] hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign Up
            </button>
            <button onClick={onClose} type="button" className="text-[#141414] hover:text-gray-500">
              Cancel
            </button>
          </div>
          <div className="mt-4 text-center">
            <button type="button" className="text-[#141414] hover:text-gray-500" onClick={switchToSignIn}>
              Already have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SignInModalProps {
  onClose: () => void;
  switchToSignUp: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ onClose, switchToSignUp }) => {
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('email', email);
      formData.append('password', password);

      const response = await fetch(`${BASE_URL}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.text();
      const obj = JSON.parse(data);
      const newAuth = { user: obj.user, token: obj.token };
      setAuth(newAuth);
      localStorage.setItem('auth', JSON.stringify(newAuth));
      onClose();
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-4">Sign In</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#141414] text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#141414] leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#141414] text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[#141414] leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-[#141414] hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign In
            </button>
            <button onClick={onClose} type="button" className="text-[#141414] hover:text-gray-500">
              Cancel
            </button>
          </div>
          <div className="mt-4 text-center">
            <button type="button" className="text-[#141414] hover:text-gray-500" onClick={switchToSignUp}>
              Don't have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SignUpPage: React.FC = () => {
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(true);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);
  const navigate = useNavigate()
  const [auth, ] = useAuth()

    

  const openSignUpModal = () => {
    setSignInModalOpen(false);
    setSignUpModalOpen(true);
  };

  const openSignInModal = () => {
    setSignUpModalOpen(false);
    setSignInModalOpen(true);
  };

  const closeModals = () => {
    setSignUpModalOpen(false);
    setSignInModalOpen(false);
    navigate('/')
  };

  return (
    <Layout>
      <div className='min-h-screen flex items-center justify-center'>
        {isSignUpModalOpen && <SignUpModal onClose={closeModals} switchToSignIn={openSignInModal} />}
        {isSignInModalOpen && <SignInModal onClose={closeModals} switchToSignUp={openSignUpModal} />}
      </div>
    </Layout>
  );
};

export default SignUpPage;
