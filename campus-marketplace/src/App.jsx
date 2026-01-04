import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import LandingPage from "./LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifyEmail from "./Pages/VerifyEmail";
import CategoryPage from "./Component/CategoryPage";
import ProductDetail from "./Component/ProductDetail";
import SellPage from './Component/SellPage';
import Admin from './Admin';
import Profile from './Pages/Profile';
import Cart from './Pages/Cart';
import About from './Component/About'; // ✅ ADD THIS
import Contact from './Component/Contact'; // ✅ ADD THIS
import SearchResults from './Pages/SearchResults'; // ✅ ADD THIS
import 'bootstrap/dist/css/bootstrap.min.css';

const stripePromise = loadStripe('pk_test_51SYsgX0xHe8lXm4K2Aw4KhBLqxmwx6qw3MX87175DCw67MOfzerXK7o6v7sqlXVa6B6Vd3W8XEcT4cPIK7xog7430064bT82LT');

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage/>
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/signup",
      element: <Signup/>
    },
    {
      path: "/verify-email",
      element: <VerifyEmail/>
    },
    {
      path: "/sell",
      element: <SellPage/>
    },
    {
      path: "/category/:categoryId",
      element: <CategoryPage/>
    },
    {
      path: "/product/:productId",
      element: <ProductDetail />
    },
    {
      path: "/search", // ✅ ADD THIS
      element: <SearchResults/>
    },
    {
      path: "/admin",
      element: <Admin/>
    },
    {
      path: "/cart",
      element: <Cart/>
    },
    {
      path: "/profile",
      element: <Profile/>
    },
    {
      path: "/about", // ✅ ADD THIS
      element: <About/>
    },
    {
      path: "/contact", // ✅ ADD THIS
      element: <Contact/>
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