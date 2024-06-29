import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.tsx/Layout';
import { useAuth } from '../context/auth';
import capitalize from '../utils/capitalize';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [auth] = useAuth();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetching() {
      const id = auth.user?.id;
      const ans = await fetch(`http://localhost:5000/api/v1/cart/${String(id)}`, {
        headers: {
          authorization: String(auth.token)
        }
      });
      const data = await ans.json();
      console.log(data.data[0].product)

      setProducts(data.data);
    }
    fetching();
  }, []);

  const handleCountChange = async (productId: string, count: string) => {
    const res = await fetch('http://localhost:5000/api/v1/cart/change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: auth.token
      },
      body: JSON.stringify({
        userId: auth?.user?.id,
        productId: productId,
        count: parseFloat(count)
      })
    });

    if (res.ok) {
      // Refresh the cart data after the update
      const id = auth.user?.id;
      const ans = await fetch(`http://localhost:5000/api/v1/cart/${String(id)}`, {
        headers: {
          authorization: String(auth.token)
        }
      });
      const data = await ans.json();
      setProducts(data.data);
    }
  };

  const handleDelete = async (productId: string, count: number) => {
    const res = await fetch('http://localhost:5000/api/v1/cart/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: auth.token
      },
      body: JSON.stringify({
        userId: auth?.user?.id,
        productId: productId,
        count: count
      })
    });

    if (res.ok) {
      // Refresh the cart data after the deletion
      const id = auth.user?.id;
      const ans = await fetch(`http://localhost:5000/api/v1/cart/${String(id)}`, {
        headers: {
          authorization: String(auth.token)
        }
      });
      const data = await ans.json();
      setProducts(data.data);
    }
  };

  return (
    <Layout>
      <div className='flex flex-col w-full min-h-screen items-center'>
        <h1 className='text-[#141414] font-bold text-3xl sm:text-7xl text-center w-full'>
          CART
        </h1>
        <div className='flex flex-col p-4 w-full max-w-6xl'>
          {products.map((prod: any) => (
            <div key={prod.product.id} className='flex flex-row items-center justify-between border-b border-gray-200 py-4 w-full'>
              <div className='flex flex-col flex-grow'>
                <a href={`/product/${prod.product.id}`} className='text-lg sm:text-2xl font-semibold mb-2'>{capitalize(prod.product.name)}
                </a>
                <p className='text-gray-800 mb-2'>Category: {prod.product.category}</p>
                <p className='text-gray-800 mb-2'>Price: ₹{prod.product.price}</p>
                <p className='text-gray-800 mb-2'>Rating: {prod.product.rating}</p>
                <div className='flex flex-col items-start mt-2'>
                  <p className='text-gray-500 mb-2'>Count:</p>
                  <select
                    value={prod.count}
                    onChange={(e) => handleCountChange(prod.product.id, e.target.value)}
                    className='p-2 border rounded'
                  >
                    {[...Array(100).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='flex flex-col gap-2 ml-4 ' >
                <img
                  src={prod.product.modelPic[0]}
                  alt={prod.product.name}
                  className='w-32 h-32 object-cover'
                />
                <button
                onClick={() => handleDelete(prod.product.id, prod.count)}
                className='ml-4 px-1 hover:bg-red-700 bg-red-500 text-white rounded'
              >
                Delete
              </button>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
