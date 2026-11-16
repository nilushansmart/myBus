import { motion } from 'framer-motion';
import { tokens } from '../../theme/designTokens';

/**
 * Stitch Reusable Badge / Chip with Motion Indicator
 */
const Badge = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
  size = 'md',         // 'sm' | 'md'
  outline = false,
  pulse = false,       // Animated live status indicator dot
  icon,
  className = '',
  style = {},
  ...props
}) => {
  const variantColors = {
    primary: {
      bg: tokens.colors.primary[50],
      text: tokens.colors.primary.main,
      border: tokens.colors.primary[200],
      dot: tokens.colors.primary.main,
    },
    secondary: {
      bg: tokens.colors.secondary[50],
      text: tokens.colors.secondary.dark,
      border: tokens.colors.secondary[200],
      dot: tokens.colors.secondary.main,
    },
    success: {
      bg: tokens.colors.state.success.light,
      text: tokens.colors.state.success.dark,
      border: '#a7f3d0',
      dot: tokens.colors.state.success.main,
    },
    warning: {
      bg: tokens.colors.state.warning.light,
      text: tokens.colors.state.warning.dark,
      border: '#fde68a',
      dot: tokens.colors.state.warning.main,
    },
    error: {
      bg: tokens.colors.state.error.light,
      text: tokens.colors.state.error.dark,
      border: '#fecaca',
      dot: tokens.colors.state.error.main,
    },
    neutral: {
      bg: tokens.colors.background.subtle,
      text: tokens.colors.text.secondary,
      border: tokens.colors.border.default,
      dot: tokens.colors.text.secondary,
    },
  }[variant] || variantColors.primary;

  const sizeStyles = {
    sm: {
      padding: '3px 8px',
      fontSize: '0.7rem',
      height: '22px',
      dotSize: 6,
    },
    md: {
      padding: '5px 12px',
      fontSize: tokens.typography.sizes.xs,
      height: '28px',
      dotSize: 8,
    },
  }[size] || sizeStyles.md;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: tokens.typography.fontFamily,
        fontWeight: tokens.typography.weights.bold,
        letterSpacing: '0.02em',
        borderRadius: tokens.radii.full,
        background: outline ? 'transparent' : variantColors.bg,
        color: variantColors.text,
        border: `1px solid ${variantColors.border}`,
        userSelect: 'none',
        lineHeight: 1,
        boxSizing: 'border-box',
        ...sizeStyles,
        ...style,
      }}
      {...props}
    >
      {pulse && (
        <span style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span
            style={{
              position: 'absolute',
              width: sizeStyles.dotSize * 2,
              height: sizeStyles.dotSize * 2,
              borderRadius: '50%',
              backgroundColor: variantColors.dot,
              opacity: 0.4,
            }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            style={{
              width: sizeStyles.dotSize,
              height: sizeStyles.dotSize,
              borderRadius: '50%',
              backgroundColor: variantColors.dot,
            }}
          />
        </span>
      )}
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
export { Badge };
