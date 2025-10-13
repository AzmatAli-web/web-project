function AuthLayout({ children, title }) 
{
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg w-100" style={{ maxWidth: '300px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <img
              src="/src/assets/images/logo.png"
              alt="Campus Marketplace Logo"
              width="48"
              height="48"
              className="mb-2"
              style={{ borderRadius: '20%' }}
            />
            <h1 className="h3 fw-bold text-primary mb-1">Campus Marketplace</h1>
            <h2 className="h5 text-muted">{title}</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;