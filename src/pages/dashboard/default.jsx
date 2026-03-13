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
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// project imports
import MainCard from 'components/MainCard';
// import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Divider from '@mui/material/Divider';
import {
  CopyOutlined,
  CheckOutlined,
  WhatsAppOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  AppstoreOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router';
import { getUserSubscriptions } from 'api/services';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { TextField } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const platformStyles = {
  WhatsApp: {
    hoverBg: '#25D366',
    color: '#fff'
  }
};

const platformIcons = {
  WhatsApp: <WhatsAppOutlined style={{ color: '#25D366' }} />
};

const API_URL = import.meta.env.VITE_APP_API_URL;
const WS_URL = import.meta.env.VITE_APP_WEBSOCKET_URL;

export default function DashboardDefault() {
  const [copiedKey, setCopiedKey] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTokenExpiry, setNewTokenExpiry] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [successAlert, setSuccessAlert] = useState(null);
  const [tokenPromptOpen, setTokenPromptOpen] = useState(!sessionStorage.getItem('api_token'));
  const [apiTokenInput, setApiTokenInput] = useState('');
  const [addingPlatform, setAddingPlatform] = useState(false);
  const [addDeviceDialogOpen, setAddDeviceDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [pendingPlatform, setPendingPlatform] = useState('');
  const [deviceMsg, setDeviceMsg] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrTimeout, setQrTimeout] = useState(null);
  const [devices, setDevices] = useState([]);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [deletingDevice, setDeletingDevice] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  // const [webhookUrl, setWebhookUrl] = useState('');
  // const [webhookSaved, setWebhookSaved] = useState(false);
  // const [webhookError, setWebhookError] = useState('');
  // const [webhooks, setWebhooks] = useState([]);
  // const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const wsRef = useRef(null);
  const wsGotDataRef = useRef(false);
  const navigate = useNavigate();

  let platforms = [];

  const fetchPlatforms = async () => {
    const apiToken = sessionStorage.getItem('api_token');
    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiToken}`
    };

    const platformMap = {
      wa: 'WhatsApp'
    };

    try {
      const response = await axios.get(`${API_URL}/devices`, { headers });
      // console.log('GET /devices response:', response.data);

      const rawList = Array.isArray(response.data) ? response.data : response.data?.devices || response.data?.data || [];

      const allDevices = rawList.map((item) => {
        if (typeof item === 'string') {
          return { platform: 'Unknown', id: item };
        }
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

  // Map service name → dashboard route
  const SERVICE_ROUTES = { authy: '/authy' };
  const SERVICE_ICONS = { authy: <SafetyOutlined style={{ fontSize: 20 }} /> };

  useEffect(() => {
    if (sessionStorage.getItem('api_token')) fetchPlatforms();
    // Subscriptions use the login token
    if (localStorage.getItem('token')) {
      getUserSubscriptions()
        .then(setSubscriptions)
        .catch(() => setSubscriptions([]))
        .finally(() => setSubsLoading(false));
    } else {
      setSubsLoading(false);
    }
  }, []);

  const handleDeleteDevice = async () => {
    if (!deviceToDelete) return;
    setDeletingDevice(true);
    setDeleteError('');
    try {
      const apiToken = sessionStorage.getItem('api_token');
      await axios.delete(`${API_URL}/devices`, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`
        },
        data: { device_id: deviceToDelete.id, platform: deviceToDelete.rawPlatform || deviceToDelete.platform.toLowerCase() }
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

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  const handleSaveApiToken = () => {
    if (!apiTokenInput.trim()) return;
    sessionStorage.setItem('api_token', apiTokenInput.trim());
    setTokenPromptOpen(false);
    setApiTokenInput('');
    fetchPlatforms();
  };

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
    // console.log('handlePlatformSelect called with:', name);
    setSelectedPlatform(name);
    setPendingPlatform(name);
    setDeviceMsg('');
    setDeviceError('');
    setQrImage(null);
    setLoadingQr(true);
    if (qrTimeout) clearTimeout(qrTimeout);
    try {
      let platformKey = name.toLowerCase();
      if (platformKey === 'whatsapp') platformKey = 'wa';
      const endpoint = `${API_URL}/devices`;
      const payload = { platform: platformKey };
      // console.log('Creating device with payload:', payload);
      const apiToken = sessionStorage.getItem('api_token');
      const res = await axios.post(endpoint, payload, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`
        }
      });
      // console.log('POST /devices response:', res.data);
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
      const wsApiToken = sessionStorage.getItem('api_token');
      if (!wsUrl.includes('token=')) {
        wsUrl = `${wsUrl}${wsUrl.includes('?') ? '&' : '?'}token=${encodeURIComponent(wsApiToken)}`;
      }
      // console.log('Connecting to WebSocket in 3s:', wsUrl);
      setDeviceMsg('Preparing connection...');
      await new Promise((resolve) => setTimeout(resolve, 6000));
      try {
        wsGotDataRef.current = false;
        wsRef.current = new window.WebSocket(wsUrl);
        wsRef.current.binaryType = 'blob';
        wsRef.current.onopen = () => {
          // console.log('WebSocket connected successfully to:', wsUrl);
        };
        wsRef.current.onmessage = (event) => {
          setLoadingQr(false);

          if (!event.data || event.data.length === 0) {
            // console.log('Received nil or empty data, closing WebSocket connection.');
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.close();
            }
            setDeviceError('End of session or error: No data received. Please try again.');
            return;
          }

          // console.log('WebSocket received data:', event.data);

          if (event.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = function (e) {
              wsGotDataRef.current = true;
              setQrImage(e.target.result);
              setDeviceMsg('QR code received successfully!');
            };
            reader.onerror = function () {
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
          if (!wsGotDataRef.current) {
            setDeviceError('WebSocket connection failed. Please ensure the backend WebSocket endpoint is running and accessible.');
          }
          setLoadingQr(false);
        };
        wsRef.current.onclose = (event) => {
          // console.log('WebSocket closed:', event);
          if (wsGotDataRef.current) {
            setDeviceConnected(true);
            setTimeout(() => handleFinishAddPlatform(), 2500);
          } else if (!event.wasClean && event.code !== 1000) {
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
    setAddDeviceDialogOpen(false);
    setAddingPlatform(false);
    setSelectedPlatform('');
    setPendingPlatform('');
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

  // const platformSet = new Set(devices.map((d) => d.platform));

  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}/webhook`, {
  //       headers: {
  //         accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${access_token}`
  //       }
  //     })
  //     .then((res) => {
  //       if (Array.isArray(res.data)) {
  //         setWebhooks(res.data);
  //       } else if (res.data?.webhooks) {
  //         setWebhooks(res.data.webhooks);
  //       } else if (res.data?.url) {
  //         setWebhooks([res.data.url]);
  //       } else {
  //         setWebhooks([]);
  //       }
  //       setWebhookUrl('');
  //     });
  // }, []);

  // const handleSaveWebhook = async () => {
  //   try {
  //     await axios.post(
  //       `${API_URL}/webhook`,
  //       { url: webhookUrl, username },
  //       {
  //         headers: {
  //           accept: 'application/json',
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${access_token}`
  //         }
  //       }
  //     );
  //     setWebhookSaved(true);
  //     setWebhookError('');
  //     setShowAddWebhook(false);
  //     const res = await axios.get(`${API_URL}/webhook`, {
  //       headers: {
  //         accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${access_token}`
  //       }
  //     });
  //     if (Array.isArray(res.data)) {
  //       setWebhooks(res.data);
  //     } else if (res.data?.webhooks) {
  //       setWebhooks(res.data.webhooks);
  //     } else if (res.data?.url) {
  //       setWebhooks([res.data.url]);
  //     } else {
  //       setWebhooks([]);
  //     }
  //     setWebhookUrl('');
  //     setTimeout(() => setWebhookSaved(false), 3000);
  //   } catch (err) {
  //     setWebhookError('Failed to save webhook.');
  //   }
  // };
  const handleCreateToken = async () => {
    setCreating(true);
    setCreateError('');
    try {
      const authToken = localStorage.getItem('token');
      const body = newTokenExpiry ? { expires_at: new Date(newTokenExpiry).toISOString() } : {};
      const res = await axios.post(`${API_URL}/tokens`, body, {
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' }
      });
      const newToken = res.data?.token || res.data;
      sessionStorage.setItem('api_token', newToken);
      setTokenPromptOpen(false);
      setSuccessAlert({ token: newToken });
      setDialogOpen(false);
      setNewTokenExpiry('');
      fetchPlatforms();
    } catch (err) {
      setCreateError(err?.response?.data?.detail || 'Failed to create token.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* <Grid sx={{ mb: 1 }} size={12}>
        <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
          Hi {email ? `, ${email}` : ''}!👋🏼
        </Typography>
      </Grid> */}
        {/* Analytics cards — commented out
        <Grid size={12}>
          <Grid container columnSpacing={1.5}>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
              <AnalyticEcommerce title="Platforms" count={platformSet.size} icon={<AppstoreOutlined />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
              <AnalyticEcommerce title="Devices" count={devices.length} icon={<MobileOutlined />} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
              <AnalyticEcommerce
                title="API Token"
                count={sessionStorage.getItem('api_token') ? 'Active' : 'Not set'}
                icon={<KeyOutlined style={{ color: sessionStorage.getItem('api_token') ? '#52c41a' : '#faad14' }} />}
              />
            </Grid>
          </Grid>
        </Grid>
        */}
        <Dialog
          open={dialogOpen}
          onClose={() => !creating && setDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4 } }}
        >
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              Create Token
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Set an optional expiry. Defaults to 6 months if left blank.
            </Typography>
          </Box>
          <Divider />
          <DialogContent sx={{ pt: 2.5 }}>
            <TextField
              label="Expires at (optional)"
              type="datetime-local"
              fullWidth
              size="small"
              value={newTokenExpiry}
              onChange={(e) => setNewTokenExpiry(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              helperText="Leave blank to use the default 6-month expiry."
            />
            {createError && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {createError}
              </Alert>
            )}
          </DialogContent>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)} disabled={creating} size="small">
              Cancel
            </Button>
            <Button onClick={handleCreateToken} variant="contained" size="small" disabled={creating}>
              {creating ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
              Create
            </Button>
          </DialogActions>
        </Dialog>
        {/* Tokens section */}
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          {successAlert && (
            <Alert severity="success" onClose={() => setSuccessAlert(null)} sx={{ mb: 2, alignItems: 'flex-start' }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                Token created — copy it now, it will not be shown again.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.75,
                  mt: 1,
                  width: 'fit-content'
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {successAlert.token}
                </Typography>
                <Tooltip title={copiedKey === successAlert.token ? 'Copied!' : 'Copy'} placement="top">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(successAlert.token)}
                    sx={{ color: copiedKey === successAlert.token ? 'success.main' : 'text.secondary', flexShrink: 0 }}
                  >
                    {copiedKey === successAlert.token ? (
                      <CheckOutlined style={{ fontSize: 13 }} />
                    ) : (
                      <CopyOutlined style={{ fontSize: 13 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Alert>
          )}
          <MainCard
            title="Tokens"
            borderRadius={4}
            secondary={
              <Button
                variant="text"
                color="primary"
                startIcon={<PlusOutlined />}
                onClick={() => {
                  setDialogOpen(true);
                  setCreateError('');
                  setNewTokenExpiry('');
                }}
              >
                New Token
              </Button>
            }
          >
            <Typography variant="body2" color="text.secondary">
              Tokens are <strong>view-once</strong> — they cannot be retrieved after creation. After creating a token it is automatically
              saved to your session so device calls work right away.
            </Typography>
          </MainCard>
        </Grid>

        {/* Token prompt dialog — shown when no api_token in sessionStorage */}
        <Dialog open={tokenPromptOpen} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <Box sx={{ px: 3, pt: 3, pb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              Enter your API Token
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Device calls require an API token (e.g. <code>mt_...</code>). It is stored in session storage and cleared when you close the
              tab.
            </Typography>
          </Box>
          <Divider />
          <DialogContent sx={{ pt: 2.5 }}>
            <TextField
              label="API Token"
              placeholder="mt_..."
              value={apiTokenInput}
              onChange={(e) => setApiTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveApiToken()}
              fullWidth
              size="small"
              autoFocus
              slotProps={{ input: { style: { fontFamily: 'monospace' } }, inputLabel: { shrink: true } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Don&apos;t have one? Go to{' '}
              <Box component="a" href="/api-keys" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}>
                Tokens
              </Box>{' '}
              to create one.
            </Typography>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
            <Button onClick={handleSaveApiToken} variant="contained" disabled={!apiTokenInput.trim()} sx={{ borderRadius: 2 }}>
              Save to session
            </Button>
          </DialogActions>
        </Dialog>

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
                        // console.log('Platform card clicked:', p);
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

        {/* Add Platform Flow (inline, like platforms/index.jsx) */}
        {addingPlatform && false && (
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
                        {qrImage.startsWith('data:') ? (
                          <img
                            src={qrImage}
                            alt="QR Code"
                            style={{ width: 320, height: 320, maxWidth: '90vw', maxHeight: '90vw', background: '#fff', display: 'block' }}
                          />
                        ) : (
                          <QRCodeSVG value={qrImage} size={320} style={{ maxWidth: '90vw', maxHeight: '90vw' }} />
                        )}
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
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <MainCard
            title="Connected Devices"
            borderRadius={4}
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
                    <Avatar sx={{ mr: 2, bgcolor: 'grey.100' }} variant="rounded">
                      {platformIcons[device.platform]}
                    </Avatar>
                    <ListItemText primary={device.id} secondary={device.platform} />
                  </ListItem>
                ))}
              </List>
            )}
          </MainCard>
        </Grid>

        {/* My Services */}
        <Grid size={{ xs: 12, md: 12, lg: 6 }}>
          <MainCard borderRadius={4} title="My Services">
            {subsLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  Loading subscriptions…
                </Typography>
              </Box>
            ) : subscriptions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No active subscriptions. Subscribe to a service to get started.
              </Typography>
            ) : (
              <List disablePadding>
                {subscriptions.map((svc) => (
                  <ListItem
                    key={svc.name}
                    disableGutters
                    sx={{
                      py: 1.25,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 }
                    }}
                    secondaryAction={
                      SERVICE_ROUTES[svc.name] ? (
                        <Button
                          component={Link}
                          to={SERVICE_ROUTES[svc.name]}
                          size="small"
                          endIcon={<ArrowRightOutlined />}
                          sx={{ borderRadius: 1.5 }}
                        >
                          Open
                        </Button>
                      ) : null
                    }
                  >
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.lighter', width: 36, height: 36 }} variant="rounded">
                      {SERVICE_ICONS[svc.name] ?? <AppstoreOutlined style={{ fontSize: 20 }} />}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2">{svc.display_name || svc.name}</Typography>
                          <Chip
                            label={svc.is_expired ? 'Expired' : svc.is_enabled ? 'Active' : 'Disabled'}
                            color={svc.is_expired ? 'error' : svc.is_enabled ? 'success' : 'warning'}
                            size="small"
                            sx={{ borderRadius: 1, height: 18, fontSize: '0.65rem' }}
                          />
                        </Box>
                      }
                      secondary={svc.expires_at ? `Expires ${new Date(svc.expires_at).toLocaleDateString()}` : svc.description || ''}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </MainCard>
        </Grid>

        {/* Webhook */}
        {/* <Grid size={{ xs: 12, md: 12, lg: 6 }}>
        <MainCard
          title="Webhooks"
          secondary={
            !showAddWebhook && (
              <Button variant="text" color="primary" startIcon={<PlusOutlined />} onClick={() => setShowAddWebhook(true)} sx={{ ml: 2 }}>
                Add Webhook
              </Button>
            )
          }
        >
          {webhooks.length === 0 && !showAddWebhook && (
            <Typography variant="body2" color="text.secondary">
              No webhooks added.
            </Typography>
          )}

          {webhooks.length > 0 && (
            <List>
              {webhooks.map((url, idx) => (
                <ListItem key={url + idx} sx={{ pl: 0 }}>
                  <ListItemText primary={url} />
                </ListItem>
              ))}
            </List>
          )}

          {(showAddWebhook || webhooks.length === 0) && (
            <>
              <TextField
                label="Your Webhook URL"
                variant="filled"
                fullWidth
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.com/webhook/messages"
                sx={{ mb: 2, mt: 2 }}
              />
              <Box display="flex" gap={2}>
                <Button size="small" variant="contained" onClick={handleSaveWebhook}>
                  Save Webhook
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setShowAddWebhook(false);
                    setWebhookUrl('');
                    setWebhookError('');
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}

          {webhookSaved && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Webhook added!
            </Alert>
          )}
          {webhookError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {webhookError}
            </Alert>
          )}
        </MainCard>
      </Grid> */}

        {/* Filters Section */}
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
    </>
  );
}
