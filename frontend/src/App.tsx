
import Home from "./pages/Home"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import ProductMain from "./pages/productMain"
import Shop from "./pages/Shop"
import { Navigate, Outlet } from 'react-router-dom'
import Cart from "./pages/Cart"
import { useAuth } from "./context/auth"
import Three from './pages/Three'
function App() {
  return (
    <BrowserRouter >
    <div className=" h-fit ">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/product/:id" element={<ProductMain/>}/>
        <Route path="/shop" element={<Shop/>}/>
          <Route element={<PrivateRoutes/>}>
          <Route path="/cart" element={<Cart/>}/>
        </Route>
        <Route path="/three" element={<Three/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  )
}


const PrivateRoutes = () => {
  const [auth, , loading] = useAuth();
  //console.log("Auth state in PrivateRoutes:", auth); // Debugging line

  if (loading) {
    return <div className="items-center justify-center top-1/2 left-1/2 ">Loading...</div>;
  }

  return (
    auth.token !== '' ? <Outlet /> : <Navigate to='/' />
  )
}


export default App