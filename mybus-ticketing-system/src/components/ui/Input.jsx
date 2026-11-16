import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { tokens } from '../../theme/designTokens';

/**
 * Stitch Reusable Input with Motion UI Focus Rings
 */
const Input = React.forwardRef(
  (
    {
      label,
      error = false,
      errorMessage,
      helperText,
      prefixIcon,
      suffixIcon,
      type = 'text',
      id,
      name,
      value,
      onChange,
      placeholder,
      disabled = false,
      required = false,
      fullWidth = true,
      className = '',
      style = {},
      inputStyle = {},
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || (name ? `input-${name}` : undefined);

    const borderColor = error
      ? tokens.colors.state.error.main
      : isFocused
      ? tokens.colors.secondary.main
      : tokens.colors.border.default;

    const boxShadow = error
      ? '0 0 0 3px rgba(239, 68, 68, 0.2)'
      : isFocused
      ? '0 0 0 3px rgba(6, 182, 212, 0.25)'
      : 'none';

    return (
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          width: fullWidth ? '100%' : 'auto',
          fontFamily: tokens.typography.fontFamily,
          ...style,
        }}
      >
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semiBold,
              color: error ? tokens.colors.state.error.main : tokens.colors.text.primary,
            }}
          >
            {label}
            {required && <span style={{ color: tokens.colors.state.error.main, marginLeft: '4px' }}>*</span>}
          </label>
        )}

        <motion.div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: disabled ? tokens.colors.background.subtle : tokens.colors.background.paper,
            border: `1.5px solid ${borderColor}`,
            borderRadius: tokens.radii.md,
            boxShadow,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
            overflow: 'hidden',
          }}
          animate={{
            borderColor,
            boxShadow,
          }}
          transition={{ duration: 0.2 }}
        >
          {prefixIcon && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '12px',
                color: isFocused ? tokens.colors.secondary.main : tokens.colors.text.secondary,
                transition: 'color 0.2s ease',
              }}
            >
              {prefixIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: '100%',
              padding: prefixIcon ? '10px 12px 10px 8px' : '10px 14px',
              fontFamily: tokens.typography.fontFamily,
              fontSize: tokens.typography.sizes.base,
              color: tokens.colors.text.primary,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              ...inputStyle,
            }}
            {...props}
          />

          {suffixIcon && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingRight: '12px',
                color: tokens.colors.text.secondary,
              }}
            >
              {suffixIcon}
            </span>
          )}
        </motion.div>

        {(errorMessage || helperText) && (
          <span
            style={{
              fontSize: tokens.typography.sizes.xs,
              color: error ? tokens.colors.state.error.main : tokens.colors.text.secondary,
              marginTop: '2px',
              paddingLeft: '2px',
            }}
          >
            {errorMessage || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Stitch Reusable Select with Motion UI
 */
const Select = React.forwardRef(
  (
    {
      label,
      children,
      error = false,
      errorMessage,
      helperText,
      prefixIcon,
      id,
      name,
      value,
      onChange,
      disabled = false,
      required = false,
      fullWidth = true,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const selectId = id || (name ? `select-${name}` : undefined);

    const borderColor = error
      ? tokens.colors.state.error.main
      : isFocused
      ? tokens.colors.secondary.main
      : tokens.colors.border.default;

    const boxShadow = error
      ? '0 0 0 3px rgba(239, 68, 68, 0.2)'
      : isFocused
      ? '0 0 0 3px rgba(6, 182, 212, 0.25)'
      : 'none';

    return (
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          width: fullWidth ? '100%' : 'auto',
          fontFamily: tokens.typography.fontFamily,
          ...style,
        }}
      >
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.semiBold,
              color: error ? tokens.colors.state.error.main : tokens.colors.text.primary,
            }}
          >
            {label}
            {required && <span style={{ color: tokens.colors.state.error.main, marginLeft: '4px' }}>*</span>}
          </label>
        )}

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: disabled ? tokens.colors.background.subtle : tokens.colors.background.paper,
            border: `1.5px solid ${borderColor}`,
            borderRadius: tokens.radii.md,
            boxShadow,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            overflow: 'hidden',
          }}
        >
          {prefixIcon && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '12px',
                color: isFocused ? tokens.colors.secondary.main : tokens.colors.text.secondary,
              }}
            >
              {prefixIcon}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: '100%',
              padding: prefixIcon ? '11px 36px 11px 8px' : '11px 36px 11px 14px',
              fontFamily: tokens.typography.fontFamily,
              fontSize: tokens.typography.sizes.base,
              color: tokens.colors.text.primary,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: disabled ? 'not-allowed' : 'pointer',
              appearance: 'none',
            }}
            {...props}
          >
            {children}
          </select>

          <span
            style={{
              position: 'absolute',
              right: '12px',
              pointerEvents: 'none',
              color: tokens.colors.text.secondary,
              fontSize: '10px',
            }}
          >
            ▼
          </span>
        </div>

        {(errorMessage || helperText) && (
          <span
            style={{
              fontSize: tokens.typography.sizes.xs,
              color: error ? tokens.colors.state.error.main : tokens.colors.text.secondary,
              marginTop: '2px',
            }}
          >
            {errorMessage || helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Input, Select };
export default Input;
