import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout.tsx/Layout'
import { useAuth } from '../context/auth'
import Cart from './Cart'
import capitalize from '../utils/capitalize'
function Buy() {
    const [auth,] = useAuth()
    const [paymentMethod, setPaymentMethod] = useState('')
    const [products, setProducts] = useState([]);

    const handlePaymentChange = (event:any) => {
        setPaymentMethod(event.target.value)
    }

    const handleSubmit = (event:any) => {
        event.preventDefault()
        // Handle form submission logic here
        console.log("Payment Method:", paymentMethod)
    }

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

    return (
        <Layout>
            <div className=' my-10 w-full flex flex-col items-center'>
                <h1 className='text-center font-semibold w-full'>
                    Location : {auth.user?.location}
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
                      className='ml-4 px-1 hover:bg-red-700 bg-red-500 text-white rounded'
                    >
                      Delete
                    </button>
                    </div>
                                
                  </div>
                   ))}
                 </div>
                <form onSubmit={handleSubmit} className='w-full flex flex-col items-center'>
                    <div className='mt-4'>
                        <label className='mr-2 font-light'>
                            <input
                                type='radio'
                                value='Cash On Delivery'
                                checked= {true}
                                onChange={handlePaymentChange}
                            />
                            Cash On Delivery
                        </label>
                    </div>
                    <button type='submit' className='mt-4 px-4 py-2 bg-[#141414] text-white rounded'>
                        Submit
                    </button>
                </form>
                
            </div>
        </Layout>
    )
}

export default Buy
