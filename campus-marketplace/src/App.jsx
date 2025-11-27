import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // ✅ ADD THIS
import LandingPage from "./LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import CategoryPage from "./Component/CategoryPage";
import ProductDetail from "./Component/ProductDetail";
import SellPage from './Component/SellPage';
import Admin from './Admin';
import Profile from './Pages/Profile';

import Cart from './Pages/Cart';

// import AdminLogin from './Pages/AdminLogin'; // ✅ ADD THIS IMPORT
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage/>
    },
    {
      path: "Login",
      element: <Login/>
    },
    {
      path: "signup",
      element: <Signup/>
    },
  //   {
  // path: "/admin-login",
  // element: <AdminLogin />
  //   },
    {
      path: "/sell",
      element: <SellPage/>

    },
    {
      path: "category/:categoryId",
      element: <CategoryPage/>
    },
    {
      path: "/product/:productId",
      element: <ProductDetail />
    },
    {
      path: "/Admin",
      element: <Admin/>
    },
    {
      path: "/cart",
  element: <Cart/>
    },
    {
      path: "/profile",
      element: <Profile/>
    }
  ]);

  return (
    <CartProvider> {/* ✅ WRAP WITH CARTPROVIDER */}
      <RouterProvider router={router}/>
    </CartProvider>
  );
}

export default App;