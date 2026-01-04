import { useState, useEffect } from "react";

function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = "", // ✅ ADD ERROR PROP
  zodSchema,        // <-- Zod schema for this field
  setError          // <-- function to update error in parent
}) {
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  // Validate on every value change
  useEffect(() => {
    if (!zodSchema) return;

    try {
      zodSchema.parse(value);
      setLocalError("");
      if (setError) setError(name, "");   // clear error in parent
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setLocalError(err.errors[0].message);
        if (setError) setError(name, err.errors[0].message); // update parent error
      }
    }
  }, [value, zodSchema, name, setError]);

  // Use prop error if provided, otherwise use local error
  const displayError = error || localError;

  return (
    <div className="mb-3 form-input-group">
      <label className="form-label fw-600" style={{ display: 'block', marginBottom: '0.5rem' }}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group input-group-lg" style={{ minHeight: '44px' }}>
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-control ${displayError ? "is-invalid" : ""}`}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px 0 0 8px',
            fontSize: '1rem',
            border: displayError ? '2px solid #dc3545' : '2px solid #e0e0e0'
          }}
        />
        {type === "password" && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              borderRadius: '0 8px 8px 0',
              borderColor: displayError ? '#dc3545' : '#e0e0e0',
              fontWeight: 500
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {displayError && (
        <div className="invalid-feedback d-block" style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#dc3545',
          fontWeight: 500
        }}>
          {displayError}
        </div>
      )}
    </div>
  );
}

export default FormInput;
