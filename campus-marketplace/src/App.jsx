import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';

import LandingPage from "./LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CategoryPage from "./Component/CategoryPage";
import ProductDetail from "./Component/ProductDetail"; // Add this import
import SellPage from './Component/SellPage';
import Admin from './Admin';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const router=createBrowserRouter([
    {
      path:"/",
      element:<LandingPage/>
     },
     {
      path:"Login",
      element:<Login/>
     },
     {
      path:"/signup",
      element:<Signup/>
     },
     {
      path:"/sell",
      element:<SellPage/>
     },
     {
      path:"category/:categoryId",
      element:<CategoryPage/>
     },
     {
      path: "/product/:productId",
      element: <ProductDetail />
    },
    {
      path:"/Admin",
      element:<Admin/>
    }
  ])
  return (
     <RouterProvider router={router}/>
  //  <Router>
  //     <Routes>
  //       <Route path="/" element={<LandingPage />} />
  //       <Route path="/Login" element={<Login />} />
  //       <Route path="/signup" element={< Signup />} />
  //       <Route path="/category/:categoryId" element={<CategoryPage />} />
  //       <Route path="/product/:productId" element={<ProductDetail />} /> 
  //       <Route path="/sell" element={<SellPage />} />
  //     </Routes>
  //   </Router>
  );
}

export default App;