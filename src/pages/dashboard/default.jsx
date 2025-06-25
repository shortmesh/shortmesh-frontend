// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { CopyOutlined, WhatsAppOutlined, PlusOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

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

const platformIcons = {
  WhatsApp: <WhatsAppOutlined style={{ color: '#25D366' }} />,
  Signal: <FontAwesomeIcon icon={faSignalMessenger} style={{ color: '#3A76F0' }} />
};

const API_URL = import.meta.env.VITE_APP_API_URL;
const WS_URL = import.meta.env.VITE_APP_WEBSOCKET_URL;

export default function DashboardDefault() {
  const username = localStorage.getItem('username');

  const apiKey = localStorage.getItem('token') || '';
  const apiKeysCount = apiKey ? 1 : 0;

  const [copiedKey, setCopiedKey] = useState('');
  const [addingPlatform, setAddingPlatform] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [pendingPlatform, setPendingPlatform] = useState('');
  const [deviceMsg, setDeviceMsg] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrTimeout, setQrTimeout] = useState(null);
  const [devices, setDevices] = useState([]);
  const wsRef = useRef(null);
  const navigate = useNavigate();

  let platforms = [];

  const fetchPlatforms = async () => {
    const access_token = localStorage.getItem('token');
    const username = localStorage.getItem('username') || 'User';
    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`
    };

    const platformMap = {
      wa: 'WhatsApp',
      signal: 'Signal'
    };

    const allDevices = [];
    await Promise.all(
      Object.keys(platformMap).map(async (key) => {
        try {
          const response = await axios.post(`${API_URL}/${key}/list/devices`, { username }, { headers });
          console.log(`${key.toUpperCase()} devices:`, response.data);
          (response.data?.devices || []).forEach((id) => {
            allDevices.push({ platform: platformMap[key], id });
          });
        } catch (err) {
          console.error(`Error fetching ${key} devices`, err);
        }
      })
    );
    setDevices(allDevices);
  };

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  const handleAddPlatformClick = () => {
    setAddingPlatform(true);
    setSelectedPlatform('');
    setDeviceMsg('');
    setDeviceError('');
    setQrImage(null);
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
    setQrImage(null);
    setLoadingQr(true);
    if (qrTimeout) clearTimeout(qrTimeout);
    try {
      const access_token = localStorage.getItem('token');
      const username = localStorage.getItem('username') || 'User';
      let platformKey = name.toLowerCase();
      if (platformKey === 'whatsapp') platformKey = 'wa';
      const endpoint = `${API_URL}/${platformKey}/devices`;
      const payload = { username };
      const res = await axios.post(endpoint, payload, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      setDeviceMsg('Waiting for QR code...');
      if (res.data?.websocket_url) {
        let wsUrl = res.data.websocket_url;
        if (wsUrl.startsWith('/')) {
          wsUrl = `${WS_URL}${wsUrl}`;
        }
        try {
          wsRef.current = new window.WebSocket(wsUrl);
          wsRef.current.binaryType = 'blob';
          wsRef.current.onopen = () => {
            console.log('WebSocket connected successfully to:', wsUrl);
          };
          wsRef.current.onmessage = (event) => {
            setLoadingQr(false);

            if (!event.data || event.data.length === 0) {
              console.log('Received nil or empty data, closing WebSocket connection.');
              if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
              }
              setDeviceError('End of session or error: No data received. Please try again.');
              return;
            }

            console.log('WebSocket received data:', event.data);

            if (event.data instanceof Blob) {
              const reader = new FileReader();
              reader.onload = function (e) {
                setQrImage(e.target.result);
                setDeviceMsg('QR code received successfully!');
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
            console.log('WebSocket closed:', event);
            if (!event.wasClean && event.code !== 1000) {
              setDeviceError(`WebSocket closed unexpectedly (code: ${event.code}, reason: ${event.reason})`);
            }
            setLoadingQr(false);
          };
        } catch (wsErr) {
          console.error('WebSocket connection attempt error:', wsErr);
          setDeviceError('WebSocket connection error. Please check your backend and network.');
          setLoadingQr(false);
        }
      } else {
        setDeviceError('WebSocket URL not provided by the server.');
        setLoadingQr(false);
      }
    } catch (err) {
      console.error('API call failed:', err);
      if (err.response?.data?.message) {
        setDeviceError(err.response.data.message);
      } else {
        setDeviceError(err.message || 'Failed to add device');
      }
      setLoadingQr(false);
    }
  };

  const handleFinishAddPlatform = () => {
    setAddingPlatform(false);
    setSelectedPlatform('');
    setPendingPlatform('');
    setDeviceMsg('');
    setDeviceError('');
    setQrImage(null);
    setLoadingQr(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    fetchPlatforms();
  };

  const platformSet = new Set(devices.map((d) => d.platform));

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid sx={{ mb: 1 }} size={12}>
        <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
          Hi {username ? `, ${username}` : ''}!👋🏼
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce title="Platforms" count={platformSet.size} extra="Number of Platforms" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce title="Devices" count={devices.length} extra="Number of Devices" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce title="API Keys" count={apiKeysCount} extra="Number of API Keys" />
      </Grid>

      {/* API Key Display */}
      <Grid size={12}>
        <MainCard title="API Key">
          {!apiKey ? (
            <Typography variant="body2" color="text.secondary">
              No API key found.
            </Typography>
          ) : (
            <List>
              <ListItem
                key={apiKey}
                secondaryAction={
                  <IconButton edge="end" aria-label="copy" onClick={() => handleCopy(apiKey)}>
                    <CopyOutlined />
                  </IconButton>
                }
                sx={{ pl: 0 }}
              >
                <ListItemText primary={apiKey} secondary={copiedKey === apiKey ? 'Copied!' : null} sx={{ wordBreak: 'break-all' }} />
              </ListItem>
            </List>
          )}
        </MainCard>
      </Grid>

      {/* Add Platform Button */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1, gap: 2 }}>
          <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={handleAddPlatformClick}>
            Add Device
          </Button>
        </Box>
      </Grid>

      {/* Add Platform Flow (inline, like platforms/index.jsx) */}
      {addingPlatform && (
        <Grid size={12}>
          <Box sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: 'background.paper' }}>
            {!selectedPlatform ? (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Select a platform to add
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                  {Object.keys(platformIcons).map((p) => (
                    <Grid item key={p}>
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
                        onClick={() => handlePlatformSelect(p)}
                      >
                        <Avatar
                          sx={{
                            bgcolor: selectedPlatform === p ? platformIcons[p]?.props?.style?.color : 'default',
                            color: selectedPlatform === p ? '#fff' : 'inherit',
                            mb: 1,
                            width: 48,
                            height: 48,
                            transition: 'background 0.2s, color 0.2s'
                          }}
                        >
                          {platformIcons[p]}
                        </Avatar>
                        <Typography variant="body1">{p}</Typography>
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
        </Grid>
      )}
      {/* Devices List */}
      <Grid size={12}>
        <MainCard title="Connected Devices">
          {devices.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No devices connected.
            </Typography>
          ) : (
            <List>
              {devices.map(({ platform, id }) => (
                <ListItem key={id} sx={{ pl: 0 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'transparent' }}>{platformIcons[platform]}</Avatar>
                  <ListItemText primary={id} secondary={platform} />
                </ListItem>
              ))}
            </List>
          )}
        </MainCard>
      </Grid>

      {/* Filters Section */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <MainCard sx={{ mt: 1 }} content={false}>
          <Box sx={{ p: 3 }}></Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}
