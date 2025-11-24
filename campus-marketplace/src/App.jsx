import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';

import LandingPage from "./LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CategoryPage from "./Component/CategoryPage";
import ProductDetail from "./Component/ProductDetail"; // Add this import
import SellPage from './Component/SellPage';
import Admin from './Admin';
import Profile from './Pages/Profile'; // ✅ ADD THIS IMPORT
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
    },
    { // ✅ ADD THIS NEW ROUTE ONLY
      path:"/profile",
      element:<Profile/>
    }
  ])
  return (
     <RouterProvider router={router}/>
 
  );
}

export default App;