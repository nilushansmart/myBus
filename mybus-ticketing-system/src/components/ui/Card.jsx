import React from 'react';
import { motion } from 'framer-motion';
import { tokens } from '../../theme/designTokens';

/**
 * Stitch Reusable Card with Motion UI
 */
const Card = React.forwardRef(
  (
    {
      children,
      interactive = false, // lifts on hover
      glass = false,       // frosted glass effect
      bordered = true,
      elevation = 'sm',    // 'none' | 'sm' | 'md' | 'lg'
      padding = '24px',
      className = '',
      style = {},
      onClick,
      ...props
    },
    ref
  ) => {
    const shadowValue = tokens.shadows[elevation] || tokens.shadows.sm;

    const baseStyle = {
      background: glass ? 'rgba(255, 255, 255, 0.85)' : tokens.colors.background.paper,
      backdropFilter: glass ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: glass ? 'blur(12px)' : 'none',
      borderRadius: tokens.radii.lg,
      border: bordered ? `1px solid ${tokens.colors.border.default}` : 'none',
      boxShadow: shadowValue,
      padding,
      boxSizing: 'border-box',
      overflow: 'hidden',
      cursor: interactive || onClick ? 'pointer' : 'default',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      ...style,
    };

    const hoverAnimation = interactive || onClick
      ? {
          y: -4,
          boxShadow: tokens.shadows.lg,
          borderColor: tokens.colors.secondary.main,
        }
      : {};

    const tapAnimation = interactive || onClick
      ? {
          scale: 0.99,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={className}
        style={baseStyle}
        onClick={onClick}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        transition={tokens.motion.springGentle}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = ({ children, style = {}, className = '', ...props }) => (
  <div
    className={className}
    style={{
      marginBottom: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ children, style = {}, className = '', ...props }) => (
  <h3
    className={className}
    style={{
      margin: 0,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.sizes.xl,
      fontWeight: tokens.typography.weights.bold,
      color: tokens.colors.text.primary,
      letterSpacing: '-0.015em',
      ...style,
    }}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, style = {}, className = '', ...props }) => (
  <p
    className={className}
    style={{
      margin: 0,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.sizes.sm,
      color: tokens.colors.text.secondary,
      lineHeight: tokens.typography.lineHeights.normal,
      ...style,
    }}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ children, style = {}, className = '', ...props }) => (
  <div className={className} style={{ ...style }} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, style = {}, className = '', ...props }) => (
  <div
    className={className}
    style={{
      marginTop: '20px',
      paddingTop: '16px',
      borderTop: `1px solid ${tokens.colors.border.subtle}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
