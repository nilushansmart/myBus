import { motion } from 'framer-motion';
import { tokens } from '../../theme/designTokens';

/**
 * Animated NavTabs with Sliding Pill Indicator (Motion UI)
 */
export const NavTabs = ({
  tabs = [],       // Array of { id: string | number, label: string, icon?: ReactNode }
  activeTab,
  onChange,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px',
        backgroundColor: tokens.colors.background.subtle,
        borderRadius: tokens.radii.lg,
        border: `1px solid ${tokens.colors.border.default}`,
        gap: '4px',
        position: 'relative',
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 18px',
              fontFamily: tokens.typography.fontFamily,
              fontSize: tokens.typography.sizes.sm,
              fontWeight: tokens.typography.weights.bold,
              color: isActive ? tokens.colors.primary.main : tokens.colors.text.secondary,
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: tokens.radii.md,
              cursor: 'pointer',
              outline: 'none',
              zIndex: 1,
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: tokens.radii.md,
                  boxShadow: tokens.shadows.sm,
                  zIndex: -1,
                }}
                transition={tokens.motion.spring}
              />
            )}
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/**
 * Stitch Top App Navigation Bar Shell
 */
export const NavigationBar = ({
  brand,
  links,
  actions,
  className = '',
  style = {},
}) => {
  return (
    <header
      className={`no-print ${className}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${tokens.colors.border.default}`,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        {brand && <div style={{ display: 'flex', alignItems: 'center' }}>{brand}</div>}
        {links && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>{links}</div>}
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>{actions}</div>}
      </div>
    </header>
  );
};

export default { NavTabs, NavigationBar };
