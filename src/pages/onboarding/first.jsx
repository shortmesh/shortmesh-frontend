import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, Card, CardContent, IconButton, TextField, Avatar, Grid } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { CopyOutlined, SlackOutlined, WhatsAppOutlined, XOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import axios from 'axios';

// Example platform data with images (replace with your own images or icons)
const platforms = [
  {
    name: 'WhatsApp',
    img: <WhatsAppOutlined />
  },
  {
    name: 'X',
    img: <XOutlined />
  },
  {
    name: 'Slack',
    img: <SlackOutlined />
  }
];

const OnboardingStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [platform, setPlatform] = useState('');
  const [copied, setCopied] = useState(false);
  const [deviceMsg, setDeviceMsg] = useState('');
  const [deviceError, setDeviceError] = useState('');

  const apiKey = 'sk_live_12345-abcdef-ghijk';

  const handleNext = () => {
    if (activeStep === 3) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) return;
    setActiveStep((prev) => prev - 1);
  };
  const navigate = useNavigate();

  const handleFinish = () => {
    localStorage.setItem('hasOnboarded', 'true');
    navigate('/dashboard');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatformSelect = (name) => {
    setPlatform(name);
    setTimeout(() => {
      setActiveStep(1);
    }, 200);
  };

  const handleAddDevice = async () => {
    setDeviceMsg('');
    setDeviceError('');
    try {
      const access_token = localStorage.getItem('token');
      const username = 'vanessaigwe33'; // or get from context/form
      const endpoint = `https://sherlockwisdom.com:8080/${platform.toLowerCase()}/devices`;
      const payload = { access_token, username };
      console.log('Add device payload:', payload, 'Endpoint:', endpoint);
      const res = await axios.post(endpoint, payload, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Add device server response:', res.data);
      setDeviceMsg('Device added successfully!');
    } catch (err) {
      if (err.response?.data?.message) {
        setDeviceError(err.response.data.message);
        console.error('Add device error:', err.response.data.message, err.response);
      } else {
        setDeviceError(err.message || 'Failed to add device');
        console.error('Add device error:', err, err?.response);
      }
    }
  };

  const steps = ['Add Platform', 'Authorize Connection', 'Get API Key', 'Test Send'];

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
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select a Platform
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
                      // borderRadius: '50%',
                      p: 2,
                      transition: 'border 0.2s'
                    }}
                    onClick={() => handlePlatformSelect(p.name)}
                  >
                    <Avatar>{p.img}</Avatar>

                    <Typography variant="body1">{p.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">Scan QR Code to Connect {platform || '...'}</Typography>
            <Box sx={{ mt: 2, display: 'inline-block' }}>
              <QRCodeCanvas value={`https://web.whatsapp.com//${platform.toLowerCase()}`} size={200} />
            </Box>
            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleAddDevice} disabled={!platform}>
              Add Device
            </Button>
            {deviceMsg && (
              <Typography color="success.main" sx={{ mt: 2 }}>
                {deviceMsg}
              </Typography>
            )}
            {deviceError && (
              <Typography color="error.main" sx={{ mt: 2 }}>
                {deviceError}
              </Typography>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1">Your API Key</Typography>
              <Box
                sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  padding: 2,
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  wordBreak: 'break-all'
                }}
              >
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {apiKey}
                </Typography>
                <IconButton onClick={handleCopy}>
                  <CopyOutlined />
                </IconButton>
              </Box>
              {copied && <Typography color="success.main">Copied!</Typography>}
            </CardContent>
          </Card>
        )}

        {activeStep === 3 && (
          <Box>
            <Typography variant="h6">Test Sending a Message</Typography>
            <TextField fullWidth multiline rows={3} label="Message" sx={{ mt: 2 }} />
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Send Test Message
            </Button>
            <Button variant="outlined" color="success" sx={{ mt: 2, ml: 2 }} onClick={handleFinish}>
              Finish
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep < 3 && activeStep !== 0 && (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default OnboardingStepper;
