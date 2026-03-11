// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
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
import { AppstoreOutlined, DeleteOutlined, PlusOutlined, WhatsAppOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const platformStyles = {
  WhatsApp: { hoverBg: '#25D366', color: '#fff' }
};

const platformIcons = {
  WhatsApp: <WhatsAppOutlined style={{ color: '#25D366' }} />
};

export default function Platforms() {
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [deviceMsg, setDeviceMsg] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [devices, setDevices] = useState([]);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [deletingDevice, setDeletingDevice] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const wsRef = useRef(null);
  const wsGotDataRef = useRef(false);

  const getHeaders = () => ({
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('api_token')}`
  });

  const fetchPlatforms = async () => {
    const platformMap = { wa: 'WhatsApp' };
    try {
      const response = await axios.get(`${API_URL}/devices`, { headers: getHeaders() });
      console.log('GET /devices response:', response.data);
      const rawList = Array.isArray(response.data) ? response.data : response.data?.devices || response.data?.data || [];
      const allDevices = rawList.map((item) => {
        if (typeof item === 'string') return { platform: 'Unknown', id: item, rawPlatform: '' };
        const id = item.id || item.device_id || item.name || JSON.stringify(item);
        const rawPlatform = item.platform || item.type || '';
        const platform = platformMap[rawPlatform] || rawPlatform || 'Unknown';
        return { platform, id, rawPlatform };
      });
      setDevices(allDevices);
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('api_token')) fetchPlatforms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPlatformClick = () => {
    setAddDeviceDialogOpen(true);
    setSelectedPlatform('');
    setDeviceMsg('');
    setDeviceError('');
    setQrImage(null);
    setLoadingQr(false);
    setDeviceConnected(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const handlePlatformSelect = async (name) => {
    setSelectedPlatform(name);
    setDeviceMsg('');
    setDeviceError('');
    setQrImage(null);
    setLoadingQr(true);
    try {
      let platformKey = name.toLowerCase();
      if (platformKey === 'whatsapp') platformKey = 'wa';
      const res = await axios.post(`${API_URL}/devices`, { platform: platformKey }, { headers: getHeaders() });
      console.log('POST /devices response:', res.data);
      setDeviceMsg('Waiting for QR code...');
      const rawWsUrl = res.data?.websocket_url || res.data?.qr_code_url || res.data?.ws_url || res.data?.socket_url;
      if (!rawWsUrl) {
        setDeviceError(`No WebSocket URL in server response. Response was: ${JSON.stringify(res.data)}`);
        setLoadingQr(false);
        return;
      }
      let wsUrl = rawWsUrl.startsWith('ws')
        ? rawWsUrl
        : (() => {
            const wsOrigin = new URL(API_URL).origin.replace(/^https/, 'wss').replace(/^http/, 'ws');
            return `${wsOrigin}${rawWsUrl}`;
          })();
      const wsApiToken = sessionStorage.getItem('api_token');
      if (!wsUrl.includes('token=')) {
        wsUrl = `${wsUrl}${wsUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(wsApiToken)}`;
      }
      console.log('Connecting to WebSocket:', wsUrl);
      try {
        wsGotDataRef.current = false;
        wsRef.current = new window.WebSocket(wsUrl);
        wsRef.current.binaryType = 'blob';
        wsRef.current.onopen = () => console.log('WebSocket connected:', wsUrl);
        wsRef.current.onmessage = (event) => {
          setLoadingQr(false);
          if (!event.data || event.data.length === 0) {
            setDeviceError('End of session or error: No data received. Please try again.');
            return;
          }
          console.log('WebSocket received data:', event.data);
          if (event.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              wsGotDataRef.current = true;
              setQrImage(e.target.result);
              setDeviceMsg('QR code received successfully!');
            };
            reader.onerror = () => {
              setDeviceError('Error reading binary image data.');
              setLoadingQr(false);
            };
            reader.readAsDataURL(event.data);
          } else if (typeof event.data === 'string') {
            wsGotDataRef.current = true;
            setQrImage(event.data);
            setDeviceMsg('QR code received successfully!');
          } else {
            setDeviceError('Received unsupported data type for QR code.');
            setLoadingQr(false);
          }
        };
        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (!wsGotDataRef.current) setDeviceError('WebSocket connection failed. Please ensure the backend is accessible.');
          setLoadingQr(false);
        };
        wsRef.current.onclose = (event) => {
          console.log('WebSocket closed:', event);
          if (wsGotDataRef.current) {
            setDeviceConnected(true);
            setTimeout(() => handleFinishAddPlatform(), 2500);
          } else if (!event.wasClean && event.code !== 1000) {
            setDeviceError(`WebSocket closed unexpectedly (code: ${event.code}, reason: ${event.reason})`);
          }
          setLoadingQr(false);
        };
      } catch (wsErr) {
        console.error('WebSocket connection error:', wsErr);
        setDeviceError('WebSocket connection error. Please check your backend and network.');
        setLoadingQr(false);
      }
    } catch (err) {
      console.error('API call failed:', err);
      setDeviceError(err.response?.data?.message || err.message || 'Failed to add device');
      setLoadingQr(false);
    }
  };

  const handleFinishAddPlatform = () => {
    setAddDeviceDialogOpen(false);
    setSelectedPlatform('');
    setDeviceMsg('');
    setDeviceError('');
    setQrImage(null);
    setLoadingQr(false);
    setDeviceConnected(false);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    fetchPlatforms();
  };

  const handleDeleteDevice = async () => {
    if (!deviceToDelete) return;
    setDeletingDevice(true);
    setDeleteError('');
    try {
      await axios.delete(`${API_URL}/devices`, {
        headers: getHeaders(),
        data: {
          device_id: deviceToDelete.id,
          platform: deviceToDelete.rawPlatform || deviceToDelete.platform.toLowerCase()
        }
      });
      setDeleteConfirmOpen(false);
      setDeviceToDelete(null);
      fetchPlatforms();
    } catch (err) {
      setDeleteError(err.response?.data?.message || err.message || 'Failed to delete device');
    } finally {
      setDeletingDevice(false);
    }
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
              {deviceConnected ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
                  <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    Connected successfully!
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your {selectedPlatform} device is now linked. Closing…
                  </Typography>
                </Box>
              ) : (
                <>
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
                        {qrImage.startsWith('data:') ? (
                          <img src={qrImage} alt="QR Code" style={{ width: 280, height: 280, display: 'block' }} />
                        ) : (
                          <QRCodeSVG value={qrImage} size={280} />
                        )}
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
                </>
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
                  {devices.map((device) => (
                    <ListItem
                      key={device.id}
                      sx={{ pl: 0 }}
                      secondaryAction={
                        <Tooltip title="Remove device">
                          <IconButton
                            edge="end"
                            size="small"
                            color="error"
                            onClick={() => {
                              setDeviceToDelete(device);
                              setDeleteError('');
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            <DeleteOutlined />
                          </IconButton>
                        </Tooltip>
                      }
                    >
                      <Avatar sx={{ mr: 2, bgcolor: 'transparent' }}>{platformIcons[device.platform]}</Avatar>
                      <ListItemText primary={device.id} secondary={device.platform} />
                    </ListItem>
                  ))}
                </List>
              )}
            </MainCard>
          </Grid>
        </Box>
      </Grid>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => !deletingDevice && setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Remove Device</DialogTitle>
        <DialogContent>
          <Typography>
            Remove <strong>{deviceToDelete?.id}</strong> ({deviceToDelete?.platform})?
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit" disabled={deletingDevice}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteDevice} disabled={deletingDevice}>
            {deletingDevice ? <CircularProgress size={18} color="inherit" /> : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
