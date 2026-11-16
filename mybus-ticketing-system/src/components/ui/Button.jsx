import React from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { tokens } from '../../theme/designTokens';

/**
 * Reusable Motion Button conforming to the Stitch Design System
 */
const Button = React.forwardRef(
  (
    {
      children,
      variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
      size = 'md',        // 'sm' | 'md' | 'lg'
      fullWidth = false,
      disabled = false,
      loading = false,
      startIcon,
      endIcon,
      onClick,
      type = 'button',
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    // Size settings
    const sizeStyles = {
      sm: {
        padding: '6px 14px',
        fontSize: tokens.typography.sizes.sm,
        height: '36px',
        iconSize: 16,
      },
      md: {
        padding: '10px 20px',
        fontSize: tokens.typography.sizes.base,
        height: '44px',
        iconSize: 18,
      },
      lg: {
        padding: '14px 28px',
        fontSize: tokens.typography.sizes.lg,
        height: '52px',
        iconSize: 20,
      },
    }[size] || sizeStyles.md;

    // Variant styles
    const variantStyles = {
      primary: {
        background: tokens.colors.primary.gradient,
        color: tokens.colors.primary.contrastText,
        border: 'none',
        boxShadow: tokens.shadows.sm,
        hoverShadow: tokens.shadows.glowPrimary,
      },
      secondary: {
        background: tokens.colors.secondary.gradient,
        color: tokens.colors.secondary.contrastText,
        border: 'none',
        boxShadow: tokens.shadows.sm,
        hoverShadow: tokens.shadows.glowSecondary,
      },
      outline: {
        background: 'transparent',
        color: tokens.colors.primary.main,
        border: `1.5px solid ${tokens.colors.border.strong}`,
        boxShadow: 'none',
        hoverBackground: tokens.colors.background.subtle,
      },
      ghost: {
        background: 'transparent',
        color: tokens.colors.text.primary,
        border: 'none',
        boxShadow: 'none',
        hoverBackground: tokens.colors.background.subtle,
      },
      danger: {
        background: tokens.colors.state.error.main,
        color: '#ffffff',
        border: 'none',
        boxShadow: tokens.shadows.sm,
        hoverShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
      },
    }[variant] || variantStyles.primary;

    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: tokens.typography.fontFamily,
      fontWeight: tokens.typography.weights.semiBold,
      borderRadius: tokens.radii.md,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      outline: 'none',
      userSelect: 'none',
      transition: 'box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease',
      boxSizing: 'border-box',
      ...sizeStyles,
      ...variantStyles,
      ...style,
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        className={className}
        style={baseStyle}
        whileHover={
          !disabled && !loading
            ? {
                scale: tokens.motion.interactions.hoverScale,
                boxShadow: variantStyles.hoverShadow || tokens.shadows.md,
                backgroundColor: variantStyles.hoverBackground,
              }
            : {}
        }
        whileTap={
          !disabled && !loading
            ? {
                scale: tokens.motion.interactions.tapScale,
              }
            : {}
        }
        transition={tokens.motion.spring}
        {...props}
      >
        {loading ? (
          <CircularProgress size={sizeStyles.iconSize} color="inherit" thickness={4} />
        ) : (
          <>
            {startIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{startIcon}</span>}
            <span>{children}</span>
            {endIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{endIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { Button };
