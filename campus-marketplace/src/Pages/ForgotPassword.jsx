// import { useState } from 'react';
// // import AuthLayout from "./Component/AuthLayout";
// import Home from "./Home";
// import FormInput from './FormInput';
// import Button from './Button';

// function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [emailSent, setEmailSent] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!email) {
//       setError('Email is required');
//       return;
//     }
    
//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError('Email is invalid');
//       return;
//     }

//     setLoading(true);
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       setEmailSent(true);
//     }, 2000);
//   };

//   if (emailSent) {
//     return (
//       <AuthLayout title="Check Your Email">
//         <div className="text-center">
//           <div className="text-success mb-3">
//             <i className="bi bi-check-circle-fill" style={{ fontSize: '3rem' }}></i>
//           </div>
//           <h3 className="h4 mb-3">Password Reset Link Sent!</h3>
//           <p className="text-muted mb-3">
//             We've sent a password reset link to <strong>{email}</strong>
//           </p>
//           <p className="text-muted mb-4">
//             Please check your email and follow the instructions.
//           </p>
//           <Button 
//             onClick={() => setEmailSent(false)} 
//             variant="outline-primary"
//             className="w-100"
//           >
//             Back to Login
//           </Button>
//         </div>
//       </AuthLayout>
//     );
//   }

//   return (
//     <Home title="Reset Your Password">
//       <form onSubmit={handleSubmit}>
//         <p className="text-muted mb-4 text-center">
//           Enter your email address and we'll send you a link to reset your password.
//         </p>

//         <FormInput
//           label="Email Address"
//           type="email"
//           value={email}
//           onChange={(e) => {
//             setEmail(e.target.value);
//             setError('');
//           }}
//           error={error}
//           placeholder="student@campus.edu"
//           required
//         />

//         <Button 
//           type="submit" 
//           loading={loading}
//           disabled={loading}
//           className="w-100 mb-3"
//           size="lg"
//         >
//           Send Reset Link
//         </Button>

//         <div className="text-center">
//           <p className="text-muted">
//             <a href="/login" className="text-decoration-none">Back to Login</a>
//           </p>
//         </div>
//       </form>
//     </Home>
//   );
// }

// export default ForgotPassword;