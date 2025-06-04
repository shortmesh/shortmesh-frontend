import { Box } from '@mui/material';
import ShortMeshLogo from '/logo.svg';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import React from 'react';

/**
 * @param {number} count - The number of circles to generate.
 * @param {string} pathId - The ID of the SVG path for the circles to follow.
 * @param {number} duration - The duration of one full animation cycle in seconds.
 * @param {string} fillColorId - The ID of the gradient or color to fill the circles.
 * @param {number[]} [offsets=[]] - Optional array of start time offsets for each circle.
 * @returns {JSX.Element[]} An array of motion.circle components.
 */
function generateMovingCircles(count, pathId, duration, fillColorId, offsets = []) {
  return Array.from({ length: count }).map((_, i) => {
    const offset = offsets[i] !== undefined ? offsets[i] : i * (duration / count);
    return (
      <motion.circle key={i} r={6} fill={`url(#${fillColorId})`}>
        <motion.animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${offset}s`}>
          <mpath href={`#${pathId}`} />
        </motion.animateMotion>
      </motion.circle>
    );
  });
}

function BannerImage() {
  const platformYs = [100, 150, 200, 250];

  const svgWidth = 1000;
  const svgHeight = 400;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const outputX = svgWidth - 100;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '300px', sm: '400px', md: '400px' },
        height: { xs: '20vh', sm: '400px', md: '400px' }
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          maxHeight: '400px'
        }}
      >
        <defs>
          <radialGradient id="logoCircleGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8F8F8" />{' '}
          </radialGradient>

          <linearGradient id="smallCircleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f8f8f8" /> <stop offset="100%" stopColor="#D8D8D8" />{' '}
          </linearGradient>
        </defs>
        {platformYs.map((y, index) => {
          const offsets = Array.from({ length: 2 }).map(() => Math.random() * 4);
          return (
            <React.Fragment key={`platform-${index}`}>
              <path
                id={`path-${index}`}
                d={`M 0,${y} Q ${centerX - 100},${y} ${centerX},${centerY}`}
                fill="none"
                stroke="#ccc"
                strokeWidth="0.5"
              />
              {generateMovingCircles(2, `path-${index}`, 6, 'smallCircleGradient', offsets)}
            </React.Fragment>
          );
        })}
        <path
          id="output-path"
          d={`M ${centerX},${centerY} Q ${centerX + 100},${centerY} ${outputX},${centerY}`}
          fill="none"
          stroke="#ccc"
          strokeWidth="0.5"
        />
        {generateMovingCircles(6, 'output-path', 6, 'smallCircleGradient')}{' '}
        <rect x={centerX - 40} y={centerY - 40} width={80} height={80} fill="f8f8f8" stroke="#D8D8D8" strokeWidth="3" rx={2} ry={2} />
      </svg>

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 60, sm: 60, md: 70 },
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 2
        }}
      >
        <img
          src={ShortMeshLogo}
          alt="ShortMesh"
          style={{
            width: '65%',
            height: 'auto',
            display: 'block'
          }}
        />
      </Box>
    </Box>
  );
}

export default BannerImage;
