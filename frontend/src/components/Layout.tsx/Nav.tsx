import React, { useState } from 'react';
import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';

function Nav() {
  const [auth, setAuth] = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
 const navigate = useNavigate()
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
          {auth.user && (
            <>
              <a href="/gen" className=" text-gray-200 hover:text-white">Customize</a>
              <a href="/cart" className="text-gray-200 hover:text-white">
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H1m6 8v6a2 2 0 11-4 0v-6m16 6a2 2 0 11-4 0v-6m-6 6h.01"></path>
                </svg>
              </a>

              <button onClick={handleLogout} className="text-gray-200 hover:text-white">Sign Out</button>
            </>
          )}
          {!auth.user && (
            <button onClick={() => navigate('/signup')} className="text-gray-200 hover:text-white">Sign Up</button>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <a href="/" className="block px-4 py-2 text-gray-200 hover:bg-white">Home</a>
          <a href="/shop" className="block px-4 py-2 text-gray-200 hover:bg-white">Shop</a>
          <a href="#contacts" className="block px-4 py-2 text-gray-200 hover:bg-white">Contact</a>

          {auth.user && (
            <>
              <a href="/cart" className="block px-4 py-2 text-gray-200 hover:white">Cart</a>
              <a href="/cart" className="block px-4 py-2 text-gray-200 hover:white">Customize</a>
              <button onClick={handleLogout} className="block px-4 py-2 text-gray-200 hover:bg-white">Sign Out</button>
            </>
            
          )}
          {!auth.user && (
            <button onClick={()=>navigate('/signup')} className="block px-4 py-2 text-gray-200 hover:bg-white">Sign Up</button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Nav;
