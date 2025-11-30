import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; // ✅ ADD THIS
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
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

const stripePromise = loadStripe('pk_test_51SYsgX0xHe8lXm4K2Aw4KhBLqxmwx6qw3MX87175DCw67MOfzerXK7o6v7sqlXVa6B6Vd3W8XEcT4cPIK7xog7430064bT82LT');

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
    <CartProvider>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router}/>
      </Elements>
    </CartProvider>
  );
}

export default App;