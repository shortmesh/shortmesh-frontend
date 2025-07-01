import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const floatingElements = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 89 + 5}%`,
  left: `${Math.random() * 80 + 5}%`,
  rotation: Math.random() * 30 - 15,
  delay: Math.random() * 2
}));

export default function OrangeBoxesFloating() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { md: '50vh', xs: '20vh' },
        width: '100',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 2
      }}
    >
      {/* Floating shapes */}
      {floatingElements.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0.2, scale: 1 }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.2, 0.5, 0.2],
            rotate: [item.rotation, item.rotation + 5, item.rotation]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: item.delay
          }}
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            width: 80,
            height: 80,
            background: 'hsla(207, 79.30%, 52.70%, 0.66)',
            border: '1px solid hsla(216, 91.90%, 19.40%, 0.64)',
            borderRadius: 12,
            transform: `rotate(${item.rotation}deg)`
          }}
        />
      ))}

      {/* Main box */}
    </Box>
  );
}
