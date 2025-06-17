// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

// icons
import { DeleteOutlined, PlusOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';
import { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;
const WS_URL = import.meta.env.VITE_APP_WEBSOCKET_URL;

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

const availablePlatforms = [
  {
    name: 'WhatsApp',
    img: <WhatsAppOutlined />
  },
  {
    name: 'Signal',
    img: <FontAwesomeIcon icon={faSignalMessenger} />
  }
];

const platformIcons = {
  WhatsApp: <WhatsAppOutlined style={{ color: '#25D366' }} />,
  Signal: <FontAwesomeIcon icon={faSignalMessenger} style={{ color: '#3A76F0' }} />
};

export default function Platforms() {
  let initialPlatforms = [];
  try {
    initialPlatforms = JSON.parse(localStorage.getItem('platforms') || '[]');
  } catch {
    initialPlatforms = [];
  }
  const [platforms, setPlatforms] = useState(initialPlatforms);

  const [addingPlatform, setAddingPlatform] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [pendingPlatform, setPendingPlatform] = useState('');
  const [deviceMsg, setDeviceMsg] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [wsQrData, setWsQrData] = useState('');
  const [qrImage, setQrImage] = useState(null); // <-- add this line
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrTimeout, setQrTimeout] = useState(null);
  const wsRef = useRef(null);

  const handleAddPlatformClick = () => {
    setAddingPlatform(true);
    setSelectedPlatform('');
    setDeviceMsg('');
    setDeviceError('');
    setWsQrData('');
    setQrImage(null); // <-- reset QR image
    setLoadingQr(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handlePlatformSelect = async (name) => {
    setSelectedPlatform(name);
    setPendingPlatform(name);
    setDeviceMsg('');
    setDeviceError('');
    setWsQrData('');
    setQrImage(null); // <-- reset QR image
    setLoadingQr(true); // <-- set loader on start
    if (qrTimeout) clearTimeout(qrTimeout);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    try {
      const access_token = localStorage.getItem('token');
      const username = localStorage.getItem('username') || 'User';
      let platformKey = name.toLowerCase();
      if (platformKey === 'whatsapp') platformKey = 'wa';
      const endpoint = `${API_URL}/${platformKey}/devices`;
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
          wsUrl = `${WS_URL}${wsUrl}`;
        }

        try {
          wsRef.current = new window.WebSocket(wsUrl);
          wsRef.current.binaryType = 'blob';
          const timeout = setTimeout(() => {
            setLoadingQr(false);
            setDeviceError('QR code did not arrive in time. Please try again.');
          }, 180000); //  minute
          setQrTimeout(timeout);

          wsRef.current.onopen = () => {
            console.log('WebSocket connected:', wsUrl);
          };

          wsRef.current.onmessage = (event) => {
            clearTimeout(timeout);
            setLoadingQr(false);
            if (event.data instanceof Blob) {
              const reader = new FileReader();
              reader.onload = function (e) {
                setQrImage(e.target.result); // <-- set QR image
                setDeviceMsg('QR code received successfully!');
              };
              reader.onerror = function () {
                setDeviceError('Error reading binary image data.');
                setLoadingQr(false);
              };
              reader.readAsDataURL(event.data);
            } else if (typeof event.data === 'string') {
              if (event.data.startsWith('data:image/')) {
                setQrImage(event.data); // <-- set QR image
              } else {
                setQrImage(`data:image/png;base64,${event.data}`); // <-- set QR image
              }
              setDeviceMsg('QR code received successfully!');
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

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const handleFinishAddPlatform = () => {
    if (pendingPlatform) {
      let savedPlatforms = [];
      try {
        savedPlatforms = JSON.parse(localStorage.getItem('platforms') || '[]');
        if (!savedPlatforms.includes(pendingPlatform)) {
          savedPlatforms.push(pendingPlatform);
          localStorage.setItem('platforms', JSON.stringify(savedPlatforms));
          setPlatforms(savedPlatforms);
        }
      } catch (e) {
        localStorage.setItem('platforms', JSON.stringify([pendingPlatform]));
        setPlatforms([pendingPlatform]);
      }
    }
    setAddingPlatform(false);
    setSelectedPlatform('');
    setPendingPlatform('');
    setDeviceMsg('');
    setDeviceError('');
    setWsQrData('');
    setQrImage(null); // <-- reset QR image
    setLoadingQr(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handleDelete = (name) => {
    const updated = platforms.filter((p) => p !== name);
    setPlatforms(updated);
    localStorage.setItem('platforms', JSON.stringify(updated));
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Platforms
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
        <AnalyticEcommerce title="Platforms" count={platforms.length} extra="Number of Platforms" />
      </Grid>

      <Grid size={12}>
        <Box sx={{ mt: 2 }}>
          <Button startIcon={<PlusOutlined />} variant="contained" color="primary" onClick={handleAddPlatformClick} sx={{ mb: 3 }}>
            Add Device
          </Button>
          {/* Add Platform Flow */}
          {addingPlatform && (
            <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: 'background.paper' }}>
              {!selectedPlatform ? (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Select a platform to add
                  </Typography>
                  <Grid container spacing={3} justifyContent="center">
                    {availablePlatforms.map((p) => (
                      <Grid item key={p.name}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            border: selectedPlatform === p.name ? '2px solid #1976d2' : '2px solid transparent',
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
                              bgcolor: selectedPlatform === p.name ? platformStyles[p.name]?.hoverBg : 'default',
                              color: selectedPlatform === p.name ? platformStyles[p.name]?.color : 'inherit',
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
                </>
              ) : (
                <>
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
                  <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleFinishAddPlatform}>
                    Done
                  </Button>
                  {deviceError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {deviceError}
                    </Alert>
                  )}
                </>
              )}
            </Box>
          )}

          {platforms.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No platforms have been added yet.
            </Typography>
          ) : (
            <List>
              {platforms.map((name) => (
                <ListItem
                  key={name}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(name)}>
                      <DeleteOutlined />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'transparent' }}>{platformIcons[name] || name[0]}</Avatar>
                  </ListItemIcon>
                  <ListItemText sx={{ ml: 2 }} primary={name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
