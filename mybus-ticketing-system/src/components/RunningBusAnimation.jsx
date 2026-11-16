import React, { useState } from 'react';
import { Box, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SpeedIcon from '@mui/icons-material/Speed';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';

const RunningBusAnimation = () => {
  const [speed, setSpeed] = useState('express'); // 'cruise' (slow), 'express' (medium), 'turbo' (fast)
  const [isNight, setIsNight] = useState(true);
  const [honking, setHonking] = useState(false);

  // Speed multiplier for CSS animations
  const speedDurations = {
    cruise: { road: '1.2s', wheels: '0.6s', scenery: '16s', bounce: '0.8s' },
    express: { road: '0.6s', wheels: '0.3s', scenery: '8s', bounce: '0.5s' },
    turbo: { road: '0.3s', wheels: '0.15s', scenery: '4s', bounce: '0.3s' },
  };

  const dur = speedDurations[speed];

  const handleHonk = () => {
    setHonking(true);
    setTimeout(() => setHonking(false), 1400);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 920,
        mx: 'auto',
        mt: 3,
        mb: 2,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: isNight
          ? '0 16px 40px rgba(2, 6, 23, 0.45)'
          : '0 16px 36px rgba(14, 165, 233, 0.2)',
        border: isNight ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(226, 232, 240, 0.8)',
        background: isNight
          ? 'linear-gradient(180deg, #090d16 0%, #0f172a 45%, #1e293b 85%, #0f172a 100%)'
          : 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 45%, #bae6fd 80%, #94a3b8 100%)',
        transition: 'all 0.5s ease',
      }}
    >
      {/* Sky & Distant Scenery (Parallax) */}
      <Box
        sx={{
          height: { xs: 130, sm: 160 },
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sun or Moon */}
        {isNight ? (
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              right: { xs: 24, sm: 48 },
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fef08a 0%, #facc15 60%, rgba(250, 204, 21, 0) 100%)',
              boxShadow: '0 0 25px rgba(253, 224, 71, 0.65)',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              right: { xs: 24, sm: 48 },
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fff 0%, #fde047 50%, #f59e0b 100%)',
              boxShadow: '0 0 35px #fde047',
            }}
          />
        )}

        {/* Stars (Night only) */}
        {isNight && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.8,
              backgroundImage:
                'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 80px 15px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 40px, #38bdf8, rgba(0,0,0,0)), radial-gradient(1px 1px at 240px 20px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 320px 35px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 450px 25px, #fef08a, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 580px 45px, #ffffff, rgba(0,0,0,0)), radial-gradient(1px 1px at 720px 18px, #38bdf8, rgba(0,0,0,0)), radial-gradient(1px 1px at 840px 32px, #ffffff, rgba(0,0,0,0))',
              backgroundRepeat: 'repeat-x',
              backgroundSize: '500px 120px',
            }}
          />
        )}

        {/* Distant Mountain Silhouettes (Scrolling slowly) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: 0,
            width: '200%',
            height: 70,
            backgroundImage: isNight
              ? 'radial-gradient(ellipse at 50% 100%, #1e293b 40%, transparent 75%)'
              : 'radial-gradient(ellipse at 50% 100%, #15803d 40%, transparent 75%)',
            backgroundSize: '400px 70px',
            backgroundRepeat: 'repeat-x',
            animation: `sceneryMove ${dur.scenery} linear infinite`,
            opacity: 0.65,
            '@keyframes sceneryMove': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
          }}
        />

        {/* Highway Streetlights (Night mode) */}
        {isNight && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 32,
              left: 0,
              width: '200%',
              height: 48,
              backgroundImage:
                'radial-gradient(circle at 120px 8px, rgba(254, 240, 138, 0.45) 0%, transparent 40px), radial-gradient(circle at 360px 8px, rgba(254, 240, 138, 0.45) 0%, transparent 40px), radial-gradient(circle at 600px 8px, rgba(254, 240, 138, 0.45) 0%, transparent 40px)',
              backgroundSize: '480px 48px',
              backgroundRepeat: 'repeat-x',
              animation: `sceneryMove ${dur.road} linear infinite`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Honk Soundwave Bubble */}
        {honking && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: { xs: '38%', sm: '42%' },
              bgcolor: 'rgba(250, 204, 21, 0.95)',
              color: '#0f172a',
              px: 1.5,
              py: 0.4,
              borderRadius: 3,
              fontWeight: 800,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              boxShadow: '0 4px 16px rgba(250, 204, 21, 0.6)',
              animation: 'honkPop 1.4s ease-out forwards',
              zIndex: 10,
              '@keyframes honkPop': {
                '0%': { opacity: 0, transform: 'scale(0.5) translateY(10px)' },
                '20%': { opacity: 1, transform: 'scale(1.15) translateY(-5px)' },
                '40%': { transform: 'scale(1) translateY(0)' },
                '80%': { opacity: 1 },
                '100%': { opacity: 0, transform: 'scale(0.8) translateY(-15px)' },
              },
            }}
          >
            🔊 BEEP BEEP! 🚌💨
          </Box>
        )}

        {/* Speed Wind Streaks */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 42,
            right: { xs: '30%', sm: '38%' },
            width: { xs: 80, sm: 140 },
            height: 24,
            backgroundImage:
              'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.6), transparent)',
            backgroundSize: '100% 2px',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: speed === 'turbo' ? 0.9 : speed === 'express' ? 0.5 : 0.2,
            animation: `windStreak 0.4s ease-in-out infinite alternate`,
            pointerEvents: 'none',
            '@keyframes windStreak': {
              '0%': { transform: 'translateX(0) scaleX(0.8)', opacity: 0.2 },
              '100%': { transform: 'translateX(25px) scaleX(1.2)', opacity: 0.8 },
            },
          }}
        />

        {/* Animated Running Bus */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 18,
            left: { xs: '15%', sm: '28%' },
            width: { xs: 230, sm: 290 },
            animation: `busSuspension ${dur.bounce} ease-in-out infinite alternate`,
            zIndex: 5,
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              filter: 'drop-shadow(0 6px 12px rgba(14, 165, 233, 0.4))',
            },
            '@keyframes busSuspension': {
              '0%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-1.8px) rotate(-0.3deg)' },
              '100%': { transform: 'translateY(1.2px) rotate(0.2deg)' },
            },
          }}
          onClick={handleHonk}
          title="Click to Honk!"
        >
          {/* Headlight Beam Cone (Translucent) */}
          <Box
            sx={{
              position: 'absolute',
              right: -130,
              bottom: 8,
              width: 140,
              height: 48,
              background:
                'linear-gradient(90deg, rgba(254, 240, 138, 0.45) 0%, rgba(254, 240, 138, 0.15) 60%, transparent 100%)',
              clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 0% 70%)',
              pointerEvents: 'none',
              filter: 'blur(3px)',
              display: isNight ? 'block' : 'none',
            }}
          />

          {/* Bus SVG */}
          <svg viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Soft Shadow Underneath */}
            <ellipse cx="160" cy="115" rx="140" ry="5" fill="#000000" opacity="0.65" filter="blur(2px)" />

            {/* Main Coach Body Aerodynamic Shape */}
            <path
              d="M15 88 L15 38 C15 32 20 27 26 27 L250 27 C275 27 296 42 305 65 L310 82 C312 87 308 92 302 92 L15 92 Z"
              fill="url(#busBodyGrad)"
            />

            {/* Top Roof Cap */}
            <path
              d="M26 27 C20 27 15 32 15 38 L15 32 C15 26 20 22 26 22 L245 22 C265 22 285 30 295 44 L288 35 C278 27 262 22 245 22 Z"
              fill="#0284c7"
            />

            {/* Aerodynamic Livery Accent Stripes */}
            <path
              d="M15 72 L308 72 L306 79 L15 79 Z"
              fill="#38bdf8"
            />
            <path
              d="M15 79 L304 79 L302 83 L15 83 Z"
              fill="#f59e0b"
            />

            {/* Destination LED Board (Matrix display) */}
            <rect x="238" y="32" width="60" height="12" rx="2" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
            <text x="242" y="41" fill="#facc15" fontSize="7" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">
              COLOMBO
            </text>

            {/* Passenger Windows Row */}
            {/* Rear Window */}
            <rect x="26" y="34" width="30" height="24" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <rect x="28" y="36" width="26" height="20" rx="2" fill={isNight ? '#1e293b' : '#60a5fa'} opacity={isNight ? '0.8' : '0.6'} />

            {/* Passenger 2 */}
            <rect x="62" y="34" width="32" height="24" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <rect x="64" y="36" width="28" height="20" rx="2" fill={isNight ? '#334155' : '#60a5fa'} opacity={isNight ? '0.9' : '0.6'} />
            {/* Passenger silhouette inside */}
            <circle cx="78" cy="44" r="4" fill="#64748b" />
            <path d="M72 56 C72 50 84 50 84 56 Z" fill="#64748b" />

            {/* Passenger 3 */}
            <rect x="100" y="34" width="32" height="24" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <rect x="102" y="36" width="28" height="20" rx="2" fill={isNight ? '#334155' : '#60a5fa'} opacity={isNight ? '0.9' : '0.6'} />

            {/* Passenger 4 */}
            <rect x="138" y="34" width="32" height="24" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <rect x="140" y="36" width="28" height="20" rx="2" fill={isNight ? '#334155' : '#60a5fa'} opacity={isNight ? '0.9' : '0.6'} />
            <circle cx="154" cy="44" r="4" fill="#64748b" />
            <path d="M148 56 C148 50 160 50 160 56 Z" fill="#64748b" />

            {/* Passenger 5 */}
            <rect x="176" y="34" width="32" height="24" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <rect x="178" y="36" width="28" height="20" rx="2" fill={isNight ? '#334155' : '#60a5fa'} opacity={isNight ? '0.9' : '0.6'} />

            {/* Passenger 6 */}
            <rect x="214" y="34" width="20" height="24" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <rect x="216" y="36" width="16" height="20" rx="2" fill={isNight ? '#334155' : '#60a5fa'} opacity={isNight ? '0.9' : '0.6'} />

            {/* Front Panoramic Windshield */}
            <path
              d="M240 48 L275 48 C285 48 296 56 300 68 L304 80 L240 80 Z"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            <path
              d="M242 50 L273 50 C282 50 292 57 296 68 L299 78 L242 78 Z"
              fill={isNight ? '#1e293b' : '#7dd3fc'}
              opacity="0.85"
            />
            {/* Driver Silhouette */}
            <circle cx="265" cy="62" r="5" fill="#475569" />
            <path d="M256 78 C256 70 274 70 274 78 Z" fill="#475569" />

            {/* MyBus Branding Emblem on Coach Flank */}
            <text x="80" y="70" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.2">
              MyBus
            </text>
            <text x="122" y="70" fill="#38bdf8" fontSize="8" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.8">
              EXPRESS
            </text>

            {/* Front Headlight Assembly */}
            <polygon points="304,82 312,85 308,91 301,90" fill="#fef08a" filter="drop-shadow(0 0 6px #fde047)" />
            <circle cx="308" cy="86" r="3" fill="#ffffff" />

            {/* Rear Tail-Light */}
            <rect x="14" y="74" width="4" height="15" rx="1.5" fill="#ef4444" filter="drop-shadow(-3px 0 6px #dc2626)" />

            {/* Amber Side-Marker Lights */}
            <circle cx="45" cy="85" r="1.5" fill="#f59e0b" />
            <circle cx="160" cy="85" r="1.5" fill="#f59e0b" />
            <circle cx="270" cy="85" r="1.5" fill="#f59e0b" />

            {/* Front Wheel Well Cutout */}
            <path d="M228 92 C228 78 260 78 260 92 Z" fill="#090d16" />

            {/* Rear Dual-Wheel Well Cutout */}
            <path d="M48 92 C48 78 86 78 86 92 Z" fill="#090d16" />

            {/* Gradients */}
            <defs>
              <linearGradient id="busBodyGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="45%" stopColor="#0284c7" />
                <stop offset="85%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0c4a6e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Front Animated Spinning Wheel */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -4,
              left: { xs: 174, sm: 220 },
              width: { xs: 26, sm: 33 },
              height: { xs: 26, sm: 33 },
              borderRadius: '50%',
              bgcolor: '#0f172a',
              border: '4px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 6px #000',
              animation: `spinWheel ${dur.wheels} linear infinite`,
              '@keyframes spinWheel': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          >
            {/* Rim Spokes */}
            <Box
              sx={{
                width: '70%',
                height: '70%',
                borderRadius: '50%',
                border: '2px dashed #94a3b8',
                bgcolor: '#475569',
              }}
            />
          </Box>

          {/* Rear Animated Spinning Wheel */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -4,
              left: { xs: 44, sm: 55 },
              width: { xs: 26, sm: 33 },
              height: { xs: 26, sm: 33 },
              borderRadius: '50%',
              bgcolor: '#0f172a',
              border: '4px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 6px #000',
              animation: `spinWheel ${dur.wheels} linear infinite`,
            }}
          >
            <Box
              sx={{
                width: '70%',
                height: '70%',
                borderRadius: '50%',
                border: '2px dashed #94a3b8',
                bgcolor: '#475569',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Asphalt Highway Road Strip */}
      <Box
        sx={{
          height: 36,
          bgcolor: '#1e293b',
          borderTop: '3px solid #475569',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Moving Yellow/White Center Dashed Lane Divider */}
        <Box
          sx={{
            width: '200%',
            height: 4,
            backgroundImage:
              'linear-gradient(90deg, #facc15 0%, #facc15 50%, transparent 50%, transparent 100%)',
            backgroundSize: '48px 4px',
            animation: `roadLines ${dur.road} linear infinite`,
            '@keyframes roadLines': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-48px)' },
            },
          }}
        />

        {/* Road Surface Texture / Reflective Cat-eyes */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            width: '200%',
            height: 2,
            backgroundImage:
              'radial-gradient(circle at 100px 1px, #ffffff, transparent 3px), radial-gradient(circle at 250px 1px, #ffffff, transparent 3px), radial-gradient(circle at 400px 1px, #ffffff, transparent 3px)',
            backgroundSize: '300px 2px',
            animation: `roadLines ${dur.road} linear infinite`,
            opacity: 0.7,
          }}
        />
      </Box>

      {/* Interactive Control Toolbar */}
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: isNight ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          borderTop: isNight ? '1px solid rgba(51, 65, 85, 0.6)' : '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        {/* Speed Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpeedIcon sx={{ fontSize: 18, color: '#38bdf8' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: isNight ? '#94a3b8' : '#64748b' }}>
            SPEED:
          </Typography>
          <Chip
            label="Cruising (60 km/h)"
            size="small"
            clickable
            color={speed === 'cruise' ? 'primary' : 'default'}
            variant={speed === 'cruise' ? 'filled' : 'outlined'}
            onClick={() => setSpeed('cruise')}
            sx={{ fontWeight: 600, fontSize: '0.72rem', height: 24 }}
          />
          <Chip
            label="Express (100 km/h)"
            size="small"
            clickable
            color={speed === 'express' ? 'primary' : 'default'}
            variant={speed === 'express' ? 'filled' : 'outlined'}
            onClick={() => setSpeed('express')}
            sx={{ fontWeight: 600, fontSize: '0.72rem', height: 24 }}
          />
          <Chip
            label="Turbo (140 km/h)"
            size="small"
            clickable
            color={speed === 'turbo' ? 'secondary' : 'default'}
            variant={speed === 'turbo' ? 'filled' : 'outlined'}
            onClick={() => setSpeed('turbo')}
            sx={{ fontWeight: 600, fontSize: '0.72rem', height: 24 }}
          />
        </Box>

        {/* Quick Honk & Day/Night Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Honk the Bus Horn!">
            <Chip
              icon={<VolumeUpIcon sx={{ fontSize: 16 }} />}
              label="Honk Horn"
              size="small"
              clickable
              color="warning"
              onClick={handleHonk}
              sx={{ fontWeight: 700, fontSize: '0.72rem', height: 24 }}
            />
          </Tooltip>

          <Tooltip title={isNight ? 'Switch to Daytime' : 'Switch to Night mode'}>
            <IconButton
              size="small"
              onClick={() => setIsNight(!isNight)}
              sx={{
                width: 26,
                height: 26,
                color: isNight ? '#fde047' : '#0284c7',
                bgcolor: isNight ? 'rgba(254, 240, 138, 0.15)' : 'rgba(2, 132, 199, 0.12)',
              }}
            >
              {isNight ? <WbSunnyIcon sx={{ fontSize: 16 }} /> : <NightlightRoundIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default RunningBusAnimation;
