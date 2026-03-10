import React from 'react';
import { Box, Typography, Badge, Avatar } from '@mui/material';
import { WhatsAppOutlined, MessageOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const MessageAlerts = () => {
  const messages = [
    {
      platform: 'WhatsApp',
      icon: <WhatsAppOutlined style={{ color: '#25D366', fontSize: 16 }} />,
      sender: 'John Doe',
      preview: 'Hey, are you available?',
      time: '2m ago',
      delay: 0,
      bgColor: '#E8F5E9'
    },
    {
      platform: 'Signal',
      icon: <MessageOutlined style={{ color: '#3A76F0', fontSize: 16 }} />,
      sender: 'Sarah Smith',
      preview: 'Meeting at 3pm today',
      time: '5m ago',
      delay: 0.3,
      bgColor: '#E3F2FD'
    },
    {
      platform: 'WhatsApp',
      icon: <WhatsAppOutlined style={{ color: '#25D366', fontSize: 16 }} />,
      sender: 'Alex Johnson',
      preview: 'Thanks for the update!',
      time: '8m ago',
      delay: 0.6,
      bgColor: '#E8F5E9'
    }
  ];

  const popAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    })
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', minHeight: 200, pt: 2 }}>
      {/* Badge with number of messages */}
      <Box sx={{ position: 'absolute', top: -1, right: -0, zIndex: 10 }}>
        <motion.div animate={pulseAnimation} style={{ display: 'inline-block' }}>
          <Badge
            badgeContent={3}
            color="success"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '1rem',
                height: 28,
                minWidth: 28,
                borderRadius: '50%',
                borderColor: '#000',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: 'error.main',
                borderRadius: '50%',
                opacity: 0
              }}
            />
          </Badge>
        </motion.div>
      </Box>

      {/* Message alerts - stacked/overlapping */}
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={popAnimation}
            style={{
              position: 'absolute',
              top: `${index * 35}px`,
              left: `${index * 8}px`,
              width: 'calc(100% - ' + index * 8 + 'px)',
              zIndex: 3 - index
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 1.5,
                bgcolor: message.bgColor,
                borderRadius: 2,
                border: '1px solid',
                borderColor: '#F5F5F5',
                // boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  zIndex: 10
                }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: message.platform === 'WhatsApp' ? '#25D366' : '#3A76F0',
                  fontSize: '0.875rem'
                }}
              >
                {message.sender
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {message.sender}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {message.icon}
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                      {message.time}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.8rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {message.preview}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default MessageAlerts;
