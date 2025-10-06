function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  size = '' 
}) {
  const btnClass = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={btnClass}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;