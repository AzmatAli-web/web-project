import { useState } from 'react';

function FormInput({ 
  label, 
  type = 'text', 
  name,
  value, 
  onChange, 
  error, 
  placeholder,
  required = false 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="mb-3">
      <label className="form-label">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
        {type === 'password' && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

export default FormInput;