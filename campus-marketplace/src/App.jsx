import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./LandingPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import 'bootstrap/dist/css/bootstrap.min.css';
import Class from "./Class";

function App() {
  return (
    <>
    <Class />
    </>
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<LandingPage />} />
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/signup" element={<Signup />} />
    //   </Routes>
    // </Router>
  );
}

export default App;