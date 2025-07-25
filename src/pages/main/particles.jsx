import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const floatingElements = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 80 + 5}%`,
  left: `${Math.random() * 80 + 5}%`,
  rotation: Math.random() * 30 - 15,
  delay: Math.random() * 2
}));

const Particles = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { md: '50vh', xs: '20vh' },
        // bgcolor: '#1F1B24',
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
            background: 'hsla(276, 82.90%, 27.50%, 0.63)',
            border: '1px solid hsla(256, 72.00%, 18.20%, 0.57)',
            borderRadius: 12,
            transform: `rotate(${item.rotation}deg)`
          }}
        />
      ))}

      {/* Main box */}
    </Box>
  );
};

export default Particles;
