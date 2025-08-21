import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  MessageOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';

const APIFlow = () => {
  const flowSteps = [
    {
      icon: <UsergroupAddOutlined />,
      title: 'Your Phone',
      description: 'Link existing account',
      color: '#4CAF50',
      delay: 0
    },
    {
      icon: <ApiOutlined />,
      title: 'ShortMesh API',
      description: 'Get instant access',
      color: '#2196F3',
      delay: 0.5
    },
    {
      icon: <MessageOutlined />,
      title: 'Send Messages',
      description: 'Any platform, any contact',
      color: '#FF9800',
      delay: 1
    }
  ];

  const benefits = [
    { text: 'No approval process', icon: <ClockCircleOutlined />, delay: 1.5 },
    { text: 'No per-message fees', icon: <CheckCircleOutlined />, delay: 1.8 },
    { text: 'Instant API access', icon: <ThunderboltOutlined />, delay: 2.1 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const arrowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.8
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 360, md: 460 },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      {/* Main Flow */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        {/* Flow Steps */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          {flowSteps.map((step, index) => (
            <React.Fragment key={step.title}>
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: 3,
                    p: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: `2px solid ${step.color}30`,
                    minWidth: 280,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: step.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      boxShadow: `0 4px 15px ${step.color}40`
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>

              {/* Arrow between steps */}
              {index < flowSteps.length - 1 && (
                <motion.div variants={arrowVariants}>
                  <Box
                    sx={{
                      width: 2,
                      height: 20,
                      backgroundColor: '#ddd',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -5,
                        left: -3,
                        width: 0,
                        height: 0,
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '8px solid #ddd'
                      }
                    }}
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </Box>

        {/* Benefits */}
        {/* <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.text}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: benefit.delay, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderRadius: 2,
                  p: 1,
                  px: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}
              >
                <Box sx={{ color: '#4CAF50', fontSize: '1rem' }}>{benefit.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {benefit.text}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box> */}
      </motion.div>

      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #E3F2FD, #BBDEFB)',
          opacity: 0.6,
          zIndex: -1
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #F3E5F5, #E1BEE7)',
          opacity: 0.5,
          zIndex: -1
        }}
      />
    </Box>
  );
};

export default APIFlow;
