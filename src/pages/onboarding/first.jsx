import React, { useState, useEffect, useRef } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Avatar,
  Grid,
  Alert
} from '@mui/material';
import { CopyOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';
import CircularProgress from '@mui/material/CircularProgress';

const platformStyles = {
  WhatsApp: {
    hoverBg: '#25D366',
    color: '#fff'
  },
  Signal: {
    hoverBg: '#3A76F0',
    color: '#fff'
  }
};

const platforms = [
  {
    name: 'WhatsApp',
    img: <WhatsAppOutlined />
  },
  {
    name: 'Signal',
    img: <FontAwesomeIcon icon={faSignalMessenger} />
  }
];

const OnboardingStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [platform, setPlatform] = useState('');
  const [copied, setCopied] = useState(false); // This state isn't used in the provided code
  const [deviceMsg, setDeviceMsg] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [wsQrData, setWsQrData] = useState(''); // This state isn't directly used for display after changes
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrImage, setQrImage] = useState(null); // Stores the data URL for the QR code image
  const wsRef = useRef(null);

  const apiKey = 'sk_live_12345-abcdef-ghijk'; // This variable isn't used in the provided code
  const navigate = useNavigate();

  const steps = ['Add Platform', 'Scan QR Code'];

  const handlePlatformSelect = async (name) => {
    setPlatform(name);
    setDeviceMsg('');
    setDeviceError('');
    setWsQrData(''); // Clear any old QR data
    setLoadingQr(true); // Start loading when platform is selected
    setQrImage(null); // Clear previous QR image

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const access_token = localStorage.getItem('token');
      const username = localStorage.getItem('username') || 'User';
      let platformKey = name.toLowerCase();
      if (platformKey === 'whatsapp') platformKey = 'wa';
      const endpoint = `https://sherlockwisdom.com:8080/${platformKey}/devices`;
      const payload = {
        username,
        access_token
      };
      console.log('Add device payload:', payload, 'Endpoint:', endpoint);

      const res = await axios.post(endpoint, payload, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Add device server response:', res.data);
      setDeviceMsg('Device added successfully! Waiting for QR code...');

      if (res.data?.websocket_url) {
        let wsUrl = res.data.websocket_url;
        if (wsUrl.startsWith('/')) {
          wsUrl = `wss://sherlockwisdom.com:8090${wsUrl}`;
        }

        try {
          wsRef.current = new window.WebSocket(wsUrl);
          wsRef.current.binaryType = 'blob';

          wsRef.current.onopen = () => {
            console.log('WebSocket connected:', wsUrl);
          };

          wsRef.current.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            setLoadingQr(false);

            if (event.data instanceof Blob) {
              const reader = new FileReader();
              reader.onload = function (e) {
                setQrImage(e.target.result);
                setActiveStep(1);
              };
              reader.onerror = function () {
                setDeviceError('Error reading binary image data.');
                setLoadingQr(false);
              };
              reader.readAsDataURL(event.data);
            } else if (typeof event.data === 'string') {
              if (event.data.startsWith('data:image/')) {
                setQrImage(event.data);
              } else {
                setQrImage(`data:image/png;base64,${event.data}`);
              }
              setActiveStep(1);
            } else {
              setDeviceError('Received unsupported data type for QR code.');
              setLoadingQr(false);
            }
          };

          wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setDeviceError('WebSocket connection failed. Please ensure the backend WebSocket endpoint is running and accessible.');
            setLoadingQr(false);
          };

          wsRef.current.onclose = (event) => {
            console.log('WebSocket closed', event, `code: ${event.code}`, `reason: ${event.reason}`, `wasClean: ${event.wasClean}`);
            if (!event.wasClean && event.code !== 1000) {
              setDeviceError(`WebSocket closed unexpectedly (code: ${event.code}, reason: ${event.reason})`);
            }
            setLoadingQr(false);
          };
        } catch (wsErr) {
          console.error('WebSocket connection error:', wsErr);
          setDeviceError('WebSocket connection error. Please check your backend and network.');
          setLoadingQr(false);
        }
      } else {
        setDeviceError('WebSocket URL not provided by the server.');
        setLoadingQr(false);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setDeviceError(err.response.data.message);
        console.error('Add device error:', err.response.data.message, err.response);
      } else {
        setDeviceError(err.message || 'Failed to add device');
        console.error('Add device error:', err, err?.response);
      }
      setLoadingQr(false);
    }
  };

  const handleFinish = () => {
    if (platform) {
      let savedPlatforms = [];
      try {
        savedPlatforms = JSON.parse(localStorage.getItem('platforms') || '[]');
        if (!savedPlatforms.includes(platform)) {
          savedPlatforms.push(platform);
          localStorage.setItem('platforms', JSON.stringify(savedPlatforms));
        }
      } catch (e) {
        localStorage.setItem('platforms', JSON.stringify([platform]));
      }
    }
    localStorage.setItem('hasOnboarded', 'true');
    navigate('/dashboard');
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" textAlign="center" fontWeight="bold" sx={{ mb: 2 }}>
              Select a platform to add
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {platforms.map((p) => (
                <Grid item key={p.name}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: platform === p.name ? '2px solid #1976d2' : '2px solid transparent',
                      p: 2,
                      width: 100,
                      height: 100,
                      justifyContent: 'center',
                      transition: 'border 0.2s, background 0.2s',
                      '&:hover': {
                        background: platformStyles[p.name]?.hoverBg || '#eee',
                        color: platformStyles[p.name]?.color || 'inherit'
                      },
                      '&:hover .MuiAvatar-root': {
                        background: 'transparent'
                      }
                    }}
                    onClick={() => handlePlatformSelect(p.name)}
                  >
                    <Avatar
                      sx={{
                        bgcolor: platform === p.name ? platformStyles[p.name]?.hoverBg : 'default',
                        color: platform === p.name ? platformStyles[p.name]?.color : 'inherit',
                        mb: 1,
                        width: 48,
                        height: 48,
                        transition: 'background 0.2s, color 0.2s'
                      }}
                    >
                      {p.img}
                    </Avatar>
                    <Typography variant="body1">{p.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {deviceMsg && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {deviceMsg}
              </Alert>
            )}
            {deviceError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {deviceError}
              </Alert>
            )}
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            {loadingQr && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="body2">Waiting for QR code from device...</Typography>
              </Box>
            )}
            {!loadingQr && qrImage ? (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Scan this QR Code with your device
                </Typography>
                <Box
                  sx={{
                    display: 'inline-block',
                    background: '#fff',
                    border: '4px solid #1976d2',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 2
                  }}
                >
                  <img
                    src={qrImage}
                    alt="QR Code"
                    style={{
                      width: 320,
                      height: 320,
                      maxWidth: '90vw',
                      maxHeight: '90vw',
                      imageRendering: 'pixelated',
                      background: '#fff',
                      display: 'block'
                    }}
                  />
                </Box>
              </Box>
            ) : null}
            {!loadingQr && !qrImage && !deviceError && (
              <Typography variant="body2" textAlign="center" color="text.secondary">
                Select a platform to generate a QR code.
              </Typography>
            )}
            <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleFinish}>
              Finish
            </Button>
            {deviceError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {deviceError}
              </Alert>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OnboardingStepper;
