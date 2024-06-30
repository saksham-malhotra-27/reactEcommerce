import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.tsx/Layout';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../components/BaseUrl';

interface Props {
  id: string;
  name: string;
  count: string;
  category: string;
  isFeatured: string;
  modelPic: string[];
  description: string;
  rating: string;
  price: string;
}

const ProductMain = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Props>();
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [auth, , isLoading] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/products/get/${id}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.data[0]);
       //   console.log(data.data[0].modelPic[1]);
          setLoading(false);
        } else {
          window.alert("Error 404");
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const capitalizeFirstLetterOfEachWord = (str: string) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleAddToCart = async () => {
    if (auth.token === '' || !auth.user) {
      window.alert("Sign In first");
      setShowModal(false)
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/v1/cart/add`, {
        method: 'POST', // Specify the HTTP method
        headers: {
          'Content-Type': 'application/json', // Indicate that the body contains JSON data
          authorization: auth.token // Include the authorization token
        },
        body: JSON.stringify({ // Convert the body object to a JSON string
          userId: auth?.user?.id,
          productId: product?.id,
          count: parseFloat(count) // Add count as a number
        })
      });
      if (res.ok) {
        window.alert("Added to cart successfully!");
        navigate('/cart')
        setShowModal(false); // Close the modal on success
      } else {
        window.alert("Not enough stock")
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading || isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center mt-5">Product not found</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div
            className="w-full md:w-fit relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              className={`object-cover rounded-md h-2/3 shadow-md transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
              src={product.modelPic[0]}
              alt={product.name}
            />
            <img
              className={`absolute top-0 left-0 object-cover rounded-md h-2/3 shadow-md transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              src={product.modelPic[1]}
              alt={product.name}
            />
          </div>
          <div className="w-full md:w-1/2 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold text-slate-900">{capitalizeFirstLetterOfEachWord(product.name)}</h1>
            <p className="mt-2 text-gray-600">{product.description}</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-slate-900">₹{parseFloat(product.price).toFixed(2)}</span>
            </div>
            <div className="mt-4 flex items-center">
              <span className="flex items-center">
                {renderStars(parseFloat(product.rating))}
                <span className="ml-2 text-sm text-gray-600">{parseFloat(product.rating).toFixed(1)}</span>
              </span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 flex items-center justify-center rounded-md bg-[#141414] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to cart
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Enter Quantity</h2>
            <input
              type="text"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4"
              placeholder="Enter quantity"
            />
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#141414] text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

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

export default ProductMain;
