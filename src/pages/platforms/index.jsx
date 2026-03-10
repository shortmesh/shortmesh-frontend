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
import MainCard from 'components/MainCard';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// icons
import { AppstoreOutlined, DeleteOutlined, PlusOutlined, WhatsAppOutlined } from '@ant-design/icons';
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
  const [addingPlatform, setAddingPlatform] = useState(false);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [pendingPlatform, setPendingPlatform] = useState('');
  const [deviceMsg, setDeviceMsg] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [qrImage, setQrImage] = useState(null); // <-- add this line
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrTimeout, setQrTimeout] = useState(null);
  const [devices, setDevices] = useState([]);

  const wsRef = useRef(null);

  let platforms = [];

  const platformsCount = Array.isArray(platforms) ? platforms.length : 0;

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
          const response = await axios.get(`${API_URL}/devices`, { headers });
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

  const handleAddPlatformClick = () => {
    setAddingPlatform(true);
    setAddDeviceDialogOpen(true);
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
    console.log('handlePlatformSelect called with:', name);
    setSelectedPlatform(name);
    setPendingPlatform(name);
    setDeviceMsg('');
    setDeviceError('');
    setQrImage(null);
    setLoadingQr(true);
    if (qrTimeout) clearTimeout(qrTimeout);
    try {
      const access_token = localStorage.getItem('token');
      let platformKey = name.toLowerCase();
      if (platformKey === 'whatsapp') platformKey = 'wa';
      const endpoint = `${API_URL}/devices`;
      const payload = { platform: platformKey };
      console.log('Creating device with payload:', payload);
      const res = await axios.post(endpoint, payload, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      });
      console.log('POST /devices response:', res.data);
      setDeviceMsg('Waiting for QR code...');
      const rawWsUrl = res.data?.websocket_url || res.data?.qr_code_url || res.data?.ws_url || res.data?.socket_url;
      if (!rawWsUrl) {
        setDeviceError(`No WebSocket URL in server response. Response was: ${JSON.stringify(res.data)}`);
        setLoadingQr(false);
        return;
      }
      let wsUrl;
      if (rawWsUrl.startsWith('ws')) {
        wsUrl = rawWsUrl;
      } else {
        const apiOrigin = new URL(API_URL).origin;
        const wsOrigin = apiOrigin.replace(/^https/, 'wss').replace(/^http/, 'ws');
        wsUrl = `${wsOrigin}${rawWsUrl}`;
      }
      const token = localStorage.getItem('token');
      wsUrl = `${wsUrl}?token=${encodeURIComponent(token)}`;
      console.log('Connecting to WebSocket:', wsUrl);
      try {
        wsRef.current = new window.WebSocket(wsUrl, ['Bearer', token]);
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
    setAddDeviceDialogOpen(false);
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
      <Grid size={12}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          Platforms
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
        <AnalyticEcommerce title="Platforms" count={platformSet.size} icon={<AppstoreOutlined />} />
      </Grid>

      {/* Add Device Dialog */}
      <Dialog
        open={addDeviceDialogOpen}
        onClose={() => {
          if (!loadingQr) handleFinishAddPlatform();
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedPlatform ? `Connect ${selectedPlatform}` : 'Add Device'}</DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          {!selectedPlatform ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the platform you want to connect.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                {Object.keys(platformIcons).map((p) => (
                  <Box
                    key={p}
                    component="button"
                    onClick={() => {
                      console.log('Platform card clicked:', p);
                      handlePlatformSelect(p);
                    }}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      p: 2.5,
                      width: 110,
                      background: 'transparent',
                      transition: 'border-color 0.2s, background 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.lighter'
                      }
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'transparent', width: 48, height: 48, mb: 1 }}>{platformIcons[p]}</Avatar>
                    <Typography variant="body2" fontWeight={500}>
                      {p}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {deviceError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {deviceError}
                </Alert>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              {loadingQr && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 3 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary">
                    Waiting for QR code...
                  </Typography>
                </Box>
              )}
              {!loadingQr && qrImage && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Scan this QR code with your {selectedPlatform} app.
                  </Typography>
                  <Box
                    sx={{
                      display: 'inline-block',
                      bgcolor: '#fff',
                      border: '4px solid',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      p: 2
                    }}
                  >
                    <img src={qrImage} alt="QR Code" style={{ width: 280, height: 280, display: 'block', imageRendering: 'pixelated' }} />
                  </Box>
                </>
              )}
              {!loadingQr && !qrImage && deviceMsg && (
                <Alert severity="info" sx={{ mt: 1 }}>
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleFinishAddPlatform} color="inherit" size="small">
            Close
          </Button>
          {selectedPlatform && !loadingQr && (
            <Button
              onClick={() => {
                setSelectedPlatform('');
                setQrImage(null);
                setDeviceError('');
              }}
              size="small"
            >
              Back
            </Button>
          )}
          {selectedPlatform && qrImage && (
            <Button variant="contained" color="success" size="small" onClick={handleFinishAddPlatform}>
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Grid size={12}>
        <Box sx={{ mt: 2 }}>
          {/* Devices List */}
          <Grid size={12}>
            <MainCard
              borderRadius={5}
              title="Connected Devices"
              secondary={
                <Button variant="text" color="primary" startIcon={<PlusOutlined />} onClick={handleAddPlatformClick} sx={{ ml: 2 }}>
                  Add Device
                </Button>
              }
            >
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
        </Box>
      </Grid>
    </Grid>
  );
}
