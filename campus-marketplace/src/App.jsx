import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  Link,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import NavigationBar from "./Component/NavigationBar";
import Footer from "./Component/Footer";
import LandingPage from "./LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifyEmail from "./Pages/VerifyEmail";
import Browse from "./Pages/Browse";
import ProductDetail from "./Component/ProductDetail";
import SellPage from "./Component/SellPage";
import Admin from "./Admin";
import Profile from "./Pages/Profile";
import Cart from "./Pages/Cart";
import About from "./Component/About";
import Contact from "./Component/Contact";
function Shell() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#page-content">
        Skip to content
      </a>
      <NavigationBar />
      <div
        id="page-content"
        className="route-content"
        key={location.pathname}
        tabIndex={-1}
      >
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/browse", element: <Browse /> },
      { path: "/category/:categoryId", element: <Browse /> },
      { path: "/search", element: <Browse /> },
      { path: "/products", element: <Browse /> },
      { path: "/product/:productId", element: <ProductDetail /> },
      { path: "/sell", element: <SellPage /> },
      { path: "/admin", element: <Admin /> },
      { path: "/profile", element: <Profile /> },
      { path: "/cart", element: <Cart /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
      {
        path: "*",
        element: (
          <main className="site-width collection-message">
            <h1>This page took a different path.</h1>
            <Link to="/browse" className="button button-dark">
              Explore the marketplace
            </Link>
          </main>
        ),
      },
    ],
  },
]);
export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
