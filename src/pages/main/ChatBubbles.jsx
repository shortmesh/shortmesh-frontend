import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { MessageOutlined, CheckCircleOutlined } from '@ant-design/icons';

const ChatBubbles = () => {
  const chatMessages = [
    {
      type: 'whatsapp',
      message: 'Your order #1234 has been shipped! 🚚',
      sender: 'ShopBot',
      time: '2:14 PM',
      isOwn: false,
      color: '#25D366'
    },
    {
      type: 'signal',
      message: 'Meeting reminder: Team standup in 30 mins',
      sender: 'WorkFlow',
      time: '2:15 PM',
      isOwn: false,
      color: '#3A76F0'
    },
    {
      type: 'whatsapp',
      message: 'Thanks for the update! 👍',
      sender: 'You',
      time: '2:16 PM',
      isOwn: true,
      color: '#25D366'
    },
    {
      type: 'signal',
      message: 'Payment of $150 received from client',
      sender: 'PaymentBot',
      time: '2:17 PM',
      isOwn: false,
      color: '#3A76F0'
    }
  ];

  const bubbleVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 300, md: 400 },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        overflow: 'hidden'
      }}
    >
      {/* Phone-like container */}
      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          borderRadius: 4,
          p: 3,
          height: '100%',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '8px solid #333',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            pb: 1,
            borderBottom: '1px solid #ddd'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#666' }}>
            Multi-Platform Messages
          </Typography>
        </Box>

        {/* Messages */}
        <Box sx={{ height: 'calc(100% - 60px)', overflow: 'hidden' }}>
          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              variants={bubbleVariants}
              initial="hidden"
              whileInView="visible"
              custom={index}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                  alignItems: 'flex-end'
                }}
              >
                {!msg.isOwn && (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      mr: 1,
                      backgroundColor: msg.color,
                      fontSize: '0.7rem'
                    }}
                  >
                    {msg.type === 'whatsapp' ? '💬' : '🔒'}
                  </Avatar>
                )}

                <Box
                  sx={{
                    maxWidth: '70%',
                    backgroundColor: msg.isOwn ? '#DCF8C6' : '#fff',
                    borderRadius: msg.isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    p: 1.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: `2px solid ${msg.color}20`
                  }}
                >
                  {!msg.isOwn && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: msg.color,
                        fontWeight: 'bold',
                        display: 'block',
                        mb: 0.5,
                        fontSize: '0.7rem'
                      }}
                    >
                      {msg.sender} • {msg.type.toUpperCase()}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.75rem', md: '0.8rem' },
                      lineHeight: 1.4,
                      color: '#333'
                    }}
                  >
                    {msg.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#666',
                      fontSize: '0.65rem',
                      display: 'block',
                      mt: 0.5,
                      textAlign: 'right'
                    }}
                  >
                    {msg.time} {msg.isOwn && <CheckCircleOutlined style={{ fontSize: '0.7rem', color: '#4FC3F7' }} />}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Floating indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          padding: '8px 16px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '2px solid #e0e0e0'
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>
          🚀 Automated messaging across platforms
        </Typography>
      </motion.div>
    </Box>
  );
};

export default ChatBubbles;
