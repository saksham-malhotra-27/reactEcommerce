import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import capitalize from '../utils/capitalize';

interface CardProps {
  id: string,
  name: string;
  count: string;
  category: string;
  isFeatured: string;
  file1: string;
  file2: string;
  description: string;
  rating: string;
  price: string;
  isCart: boolean
}

const Card: React.FC<CardProps> = ({ name, count, category, isFeatured, file1, file2, description, rating, price, id, isCart }) => {
  const parsedRating = parseFloat(rating);
  const parsedPrice = parseFloat(price);
  const discount = "10%"; 
  const navigate = useNavigate();
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          aria-hidden="true"
          className={`h-5 w-5 ${i < rating ? 'text-yellow-300' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };

  return (


    <div onClick={(e)=>{
      e.preventDefault();
      navigate(`/product/${id}`)
    }} 
    className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-md bg-white shadow-md">
      <a className="group hover:translate-y-1 hover:translate-x-1 hover:rotate-1 hover:shadow-xl relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" href="#">
        <img className="object-cover transition-opacity duration-300 group-hover:opacity-0" src={file1} alt="product image" />
        <img className="absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-100 opacity-0" src={file2} alt="product image hover" />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-[#141414] px-2 text-center text-sm font-medium text-white">{discount}</span>
      </a>
      <div className="mt-4 px-5 pb-5">
        <a href="#">
          <h5 className="text-xl tracking-tight text-slate-900">{capitalize(name)}</h5>
        </a>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">₹{parsedPrice}</span>
          </p>
          <div className="flex items-center">
            {renderStars(parsedRating)}
            <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">{parsedRating.toFixed(1)}</span>
          </div>
        </div>
        <button 
        className="flex items-center justify-center rounded-md bg-[#141414] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Details
        </button>
        
      </div>
    </div>
    
  );
};

export default Card;
