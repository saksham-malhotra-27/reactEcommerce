import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout.tsx/Layout';
import Card from '../components/oneCard';
import { BASE_URL } from '../components/BaseUrl';

// Define types for the filter state and the product
interface Filters {
  rating: number;
  price: number;
  category: string;
  isFeatured: boolean;
}

interface Product {
  id: string;
  name: string;
  count: number;
  category: string;
  isFeatured: boolean;
  modelPic: string[];
  description: string;
  rating: number;
  price: number;
}

// Star component to handle individual stars
const Star: React.FC<{ filled: boolean; onClick: () => void }> = ({ filled, onClick }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "yellow" : "gray"}
    width="24px"
    height="24px"
    className="cursor-pointer"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
  </svg>
);

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState<Filters>({
    rating: 4,
    price: 999,
    category: '',
    isFeatured: false,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]); // State for categories
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter visibility
  const [isLoading, setIsLoading] = useState(false); // State for loading

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rating = params.get('rating');
    const price = params.get('price');
    const category = params.get('category');
    const isFeatured = params.get('isFeatured');

    const newFilters: Filters = {
      rating: rating ? Number(rating) : 3,
      price: price ? Number(price) : 2999,
      category: category || '',
      isFeatured: isFeatured === 'true',
    };

    setFilters(newFilters);

    fetchCategories(); // Fetch categories on initial render
    handleFilter(newFilters); // Fetch products based on query params
  }, [location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFilters({
        ...filters,
        [name]: checked,
      });
    } else {
      setFilters({
        ...filters,
        [name]: name === 'price' ? Number(value) : value,
      });
    }
  };
  

  const handleStarClick = (rating: number) => {
    setFilters({
      ...filters,
      rating,
    });
  };

  const handlePriceRangeChange = (price: number) => {
    setFilters({
      ...filters,
      price,
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/products/getallcat`);
      const data = await response.json();
      setCategories(data.data || []); // Set categories state with fetched data or empty array
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilter = async (filterParams: Filters = filters) => {
    try {
      setIsLoading(true); // Set loading state to true before fetching
      // Remove empty parameters from filters object
      const filteredParams = Object.fromEntries(
        Object.entries(filterParams).filter(([key, value]) => value !== '' && value !== false)
      );

      const queryParams = new URLSearchParams(filteredParams as any).toString();
      const url = `${BASE_URL}/api/v1/products/filters${queryParams ? `?${queryParams}` : ''}`;
      console.log(url)
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.data || []); // Ensure products is set to an array, even if data.data is null/undefined
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams(filters as any).toString();
    navigate(`/shop?${queryParams}`);
  };

  return (
    <Layout>
      <div className="p-4 flex flex-col md:flex-row">
        <div className="md:hidden mb-4">
          <button
            className="bg-white text-[#141414] font-semibold p-2 rounded"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? 'Close Filters' : 'Open Filters'}
          </button>
        </div>
        <div className={`w-full md:w-1/4 p-4 bg-[#141414] border border-gray-200 rounded-lg ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Filters</h2>
          </div>
          <div className="flex flex-col">
            <div className="mb-4 flex flex-col">
              <label className="text-white">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    filled={star <= filters.rating}
                    onClick={() => handleStarClick(star)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4 flex flex-col ">
              <label className="text-white">Price</label>
              <div className="flex gap-4 flex-col">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="999"
                    checked={filters.price === 999}
                    onChange={() => handlePriceRangeChange(999)}
                  />
                  <span className="ml-2 text-white">Under 1000</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="1999"
                    checked={filters.price === 1999}
                    onChange={() => handlePriceRangeChange(1999)}
                  />
                  <span className="ml-2 text-white">Under 2000</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="2999"
                    checked={filters.price === 2999}
                    onChange={() => handlePriceRangeChange(2999)}
                  />
                  <span className="ml-2 text-white">Under 3000</span>
                </label>
              </div>
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label className="text-white" htmlFor="category">Category</label>
              <select
                className="mb-2 p-2 rounded-full w-1/2"
                id="category"
                name="category"
                value={filters.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.substring(0, 1).toUpperCase()}{category.substring(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 flex items-center">
              <label className="text-white mr-2" htmlFor="isFeatured">Featured</label>
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={filters.isFeatured}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="bg-white w-fit text-[#141414] p-2 rounded-full hover:bg-slate-200"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
        <div className="w-full md:w-3/4 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
            {isLoading ? (
              <div className="text-white">Loading...</div>
            ) : (
              products.map((product: Product) => (
                <Card
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  count={String(product.count)}
                  category={product.category}
                  isFeatured={String(product.isFeatured)}
                  file1={product.modelPic[0]}
                  file2={product.modelPic[1]}
                  description={product.description}
                  rating={String(product.rating)}
                  price={String(product.price)}
                  isCart={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
