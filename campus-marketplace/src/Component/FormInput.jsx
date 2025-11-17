import { useState, useEffect } from "react";

function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
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
      setError(name, "");   // clear error in parent
    } catch (err) {
      if (err.errors && err.errors.length > 0) {
        setLocalError(err.errors[0].message);
        setError(name, err.errors[0].message); // update parent error
      }
    }
  }, [value, zodSchema, name, setError]);

  return (
    <div className="mb-3">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-control ${localError ? "is-invalid" : ""}`}
        />
        {type === "password" && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {localError && <div className="invalid-feedback d-block">{localError}</div>}
    </div>
  );
}

export default FormInput;
