import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.tsx/Layout';
import Card from '../components/oneCard';
import { VelocityScroll } from '../components/scroll-based-velocity';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

interface Product {
  id:string
  name: string;
  count: string;
  category: string;
  isFeatured: string;
  modelPic: string[];
  description: string;
  rating: string;
  price: string;
}

function Home() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [auth, setAuth] = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [tops, setTops] = useState<Product[]>([]);
  const [skirts, setSkirts] = useState<Product[]>([])
  const Navigate = useNavigate()
 
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/products/getfeat');
        const data = await response.json();
        if(data.success){
        setFeaturedProducts(data.data);}
        else{
          console.error('Error fetching featured products');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    const fetchTops = async ()=>{
      try {
        const response = await fetch('http://localhost:5000/api/v1/products/getcat/tops');
        const data = await response.json();
        if(data.success){
        setTops(data.data);}
        else{
          console.error('Error fetching featured products');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    }

    const fetchskirts = async ()=>{
      try {
        const response = await fetch('http://localhost:5000/api/v1/products/getcat/skirts');
        const data = await response.json();
        if(data.success){
        setSkirts(data.data);}
        else{
          console.error('Error fetching featured products');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    }

    fetchTops() 
    fetchskirts()

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsZoomed(scrollPosition > 0);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderProducts = (products: Product[]) => {
    if (!Array.isArray(products) || products.length === 0) {
      return <p>No products available</p>;
    }

    const displayedProducts = windowWidth < 640 ? products.slice(0, 2) : products.slice(0,8);
    return displayedProducts.map((product, index) => (
      <Card
        id={product.id}
        key={index}
        name={product.name}
        count={product.count}
        category={product.category}
        isFeatured={product.isFeatured}
        file1={product.modelPic[0]}
        file2={product.modelPic[1]}
        description={product.description}
        rating={product.rating}
        price={product.price}
        isCart={false}
      />
    ));
  };

  return (
    <Layout>
      <div className='flex flex-col w-full bg-no-repeat gap-14'>
        <div className='overflow-hidden relative'>
          <img
            src="https://images.unsplash.com/photo-1485518882345-15568b007407?q=80&w=2542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="heroImg"
            className={`image-container w-full lg:h-[92vh] md:h-[60vh] sm:h-[50vh] object-cover zoom-image ${isZoomed ? 'zoom' : ''}`}
          />
        </div>

        <div className='flex flex-col p-5 items-center justify-center gap-5 w-full'>
          <h1 className='sm:text-4xl text-xl font-bold text-left w-fit'>Featured Products</h1>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center'>
            {renderProducts(featuredProducts)}
          </div>
          <button onClick={(e)=>{
            Navigate('/shop?isFeatured=true')
          }} className="mt-8 rounded-full bg-slate-900 px-8 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
            View All
          </button>
        </div>

        <div>
          <VelocityScroll className='text-zinc-200 font-bold sm:text-9xl text-5xl bg-[#141414]' text='SHOW OFF THE LIT' />
        </div>

        <div className='flex flex-col p-5 items-center justify-center gap-5 w-full'>
          <h1 className='sm:text-4xl text-xl font-bold text-left w-fit'>Tops</h1>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center'>
            {renderProducts(tops)}
          </div>
          <button onClick={(e)=>{
            Navigate('/shop?category=tops')
          }}  className="mt-8 rounded-full bg-slate-900 px-8 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
            View All
          </button>
        </div>

        <div className='flex flex-col p-5 items-center justify-center gap-5 w-full'>
          <h1 className='sm:text-4xl text-xl font-bold text-left w-fit'>Skirts</h1>
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center'>
            {renderProducts(skirts)}
          </div>
          <button onClick={(e)=>{
            Navigate('/shop?category=skirts')
          }}  className="mt-8 rounded-full bg-slate-900 px-8 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
            View All
          </button>
        </div>

        <div className='bg-[#141414] text-white justify-around items-center rounded-lg h-fit flex lg:flex-row flex-col lg:m-10 lg:p-10 gap-2 p-2'>
          <h1 className='font-bold text-5xl lg:w-1/3 text-center lg:text-left w-full order-1 lg:order-1'>
            Look Sharp And Stay Comfy With This Varsity Jacket
          </h1>
          <img src='https://wtflex.in/cdn/shop/files/DII2_600x600.png?v=1685026287'
           alt='' className='w-1/2 lg:w-1/4 rounded-md m-4 order-2 lg:order-3' />
          <div className='flex flex-col lg:w-1/3 md:w-1/2 text-center lg:text-left w-full order-3 lg:order-2'>
            <h2 className='font-bold text-3xl'>
              Did I imagine it ?
            </h2>
            <h3 className='text-xl text-center lg:text-left'>
              The double-layered fabric featuring cotton blend with inner lining keeps you warm and snug all day long. 
              High-density 3D puff print adds a stylish flair to the classic black color, making it perfect for both men and women.
            </h3>
          </div>
          
          </div>

          <div className=' p-2 text-black justify-around  rounded-lg h-fit flex lg:flex-row flex-col lg:m-10 lg:p-10 gap-2'>
          <div className=' h-96 overflow-hidden lg:w-1/4 rounded-md w-full object-contain '>
            <img src='https://wtflex.in/cdn/shop/files/352178397_639174921565413_5550562391282319855_n.jpg?v=1701341086&width=1070'
             alt='' className='' />
          </div>
          
          <div className='flex justify-center items-center flex-col lg:w-1/2 w-full  lg:text-left '>
            <h2 className='font-bold text-center text-3xl'>
              Did I imagine it ?
            </h2>
            <h3 className='text-xl  lg:text-left font-light '>
              The double-layered fabric featuring cotton blend with inner lining keeps you warm and snug all day long. 
              High-density 3D puff print adds a stylish flair to the classic black color, making it perfect for both men and women.
            </h3>
          </div>
          </div>
        </div>

    </Layout>
  );
}

export default Home;
