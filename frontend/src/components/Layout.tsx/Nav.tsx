import React, { useState } from 'react';
import { useAuth } from '../../context/auth';

function Nav() {
  const [auth, setAuth] = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setAuth({ user: null, token: '' });
    localStorage.removeItem('auth');
  };

  return (
    <nav className="bg-[#131313] shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-200">
          <h1 className="text-6xl font-extrabold mb-4">
            <span className="rotate-t">T</span>rigify
          </h1>
        </div>
        <div className="hidden md:flex space-x-4">
          <a href="/" className="text-gray-200 hover:text-white">Home</a>
          <a href="/shop" className="text-gray-200 hover:text-white">Shop</a>
          <a href="/#contacts" className="text-gray-200 hover:text-white">Contact</a>
          {auth.user && (
            <>
              <a href="/cart" className="text-gray-200 hover:text-white">
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H1m6 8v6a2 2 0 11-4 0v-6m16 6a2 2 0 11-4 0v-6m-6 6h.01"></path>
                </svg>
              </a>
              <button onClick={handleLogout} className="text-gray-200 hover:text-white">Sign Out</button>
            </>
          )}
          {!auth.user && (
            <button onClick={() => setIsModalOpen(true)} className="text-gray-200 hover:text-white">Sign In</button>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <a href="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Home</a>
          <a href="/shop" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Shop</a>
          <a href="#contacts" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Contact</a>

          {auth.user && (
            <>
              <a href="/cart" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Cart</a>
              <button onClick={handleLogout} className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Sign Out</button>
            </>
          )}
          {!auth.user && (
            <button onClick={() => setIsModalOpen(true)} className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Sign In</button>
          )}
        </div>
      )}
      {isModalOpen && (
        <SignInModal onClose={() => setIsModalOpen(false)} />
      )}
    </nav>
  );
}

export default Nav;

interface SignUpModalProps {
  onClose: () => void;
}
const SignUpModal: React.FC<SignUpModalProps> = ({ onClose }) => {
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

      const response = await fetch('http://localhost:5000/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      if (!response.ok) {
        throw new Error( 'Registration failed');
      }
      const data = await response.text();
      const obj = JSON.parse(data)
     // console.log(obj)
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
        </form>
      </div>
    </div>
  );
};


interface SignInModalProps {
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ onClose }) => {
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

      const response = await fetch('http://localhost:5000/api/v1/login', {
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
      const obj = JSON.parse(data)
      // console.log(obj)
      const newAuth = { user: obj.user, token: obj.token };
      setAuth(newAuth);
      localStorage.setItem('auth', JSON.stringify(newAuth));
      // console.log(newAuth)
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
            <button type="submit" className=" bg-[#141414] hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Sign In
            </button>
            <button onClick={onClose} type="button" className="text-[#141414] hover:text-gray-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

