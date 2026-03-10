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
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import {
  CopyOutlined,
  CheckOutlined,
  WhatsAppOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  AppstoreOutlined,
  MobileOutlined,
  KeyOutlined,
  DeleteOutlined,
  DeleteFilled
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { TextField } from '@mui/material';

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
  const access_token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'User';

  const apiKey = localStorage.getItem('token') || '';

  const [copiedKey, setCopiedKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyRows, setApiKeyRows] = useState([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(true);
  const [revealedDashKeys, setRevealedDashKeys] = useState({});
  const [deletingKey, setDeletingKey] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [successAlert, setSuccessAlert] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null); // { severity, message }
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
  // const [webhookUrl, setWebhookUrl] = useState('');
  // const [webhookSaved, setWebhookSaved] = useState(false);
  // const [webhookError, setWebhookError] = useState('');
  // const [webhooks, setWebhooks] = useState([]);
  // const [showAddWebhook, setShowAddWebhook] = useState(false);
  const wsRef = useRef(null);
  const navigate = useNavigate();

  let platforms = [];

  const fetchPlatforms = async () => {
    const access_token = localStorage.getItem('token');
    const username = localStorage.getItem('username') || 'User';
    const email = localStorage.getItem('email') || '';
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

  useEffect(() => {
    const fetchApiKeys = async () => {
      setApiKeysLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api-keys`, {
          headers: { Authorization: `Bearer ${token}`, accept: 'application/json' }
        });
        console.log('Dashboard API keys response:', res.data);
        setApiKeyRows(res.data || []);
      } catch (err) {
        console.error('Error fetching API keys', err);
      } finally {
        setApiKeysLoading(false);
      }
    };
    fetchApiKeys();
  }, []);

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const toggleDashKeyReveal = (keyId) => {
    setRevealedDashKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskKey = (key) => {
    if (!key || key.length < 8) return '••••••••';
    return key.slice(0, 4) + '••••••••••••' + key.slice(-4);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  };

  const isExpired = (expires_at) => {
    if (!expires_at) return false;
    return new Date(expires_at) < new Date();
  };

  const handleDeleteKey = async (keyId, keyName) => {
    setDeletingKey(keyId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api-keys`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { key_id: keyId }
      });
      setApiKeyRows((prev) => prev.filter((r) => r.key_id !== keyId));
      setDeleteAlert({ severity: 'success', message: `API key "${keyName}" deleted successfully.` });
    } catch (err) {
      console.error('Failed to delete API key:', err);
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Failed to delete API key.';
      setDeleteAlert({ severity: 'error', message: msg });
    } finally {
      setDeletingKey(null);
    }
  };

  const apiKeysCount = apiKeyRows.length;

  const handleAddPlatformClick = () => {
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
    setAddDeviceDialogOpen(false);
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
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;
    setCreating(true);
    setCreateError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api-keys`,
        { name: newKeyName.trim() },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      const { data, key, message } = res.data;
      setApiKeyRows((prev) => [...prev, data]);
      setSuccessAlert({ message: message || 'API key created successfully.', key });
      setDialogOpen(false);
      setNewKeyName('');
    } catch (err) {
      setCreateError(err?.response?.data?.detail || 'Failed to create API key.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* <Grid sx={{ mb: 1 }} size={12}>
        <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
          Hi {email ? `, ${email}` : ''}!👋🏼
        </Typography>
      </Grid> */}
      <Grid size={12}>
        <Grid container columnSpacing={1.5}>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <AnalyticEcommerce title="Platforms" count={platformSet.size} icon={<AppstoreOutlined />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <AnalyticEcommerce title="Devices" count={devices.length} icon={<MobileOutlined />} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
            <AnalyticEcommerce title="API Keys" count={apiKeysCount} icon={<KeyOutlined />} />
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent sx={{ pt: '12px !important' }}>
          <TextField
            label="Key Name"
            placeholder="e.g. Production API Key"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
            fullWidth
            autoFocus
            size="small"
            error={!!createError}
            helperText={createError || ' '}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit" size="small">
            Cancel
          </Button>
          <Button onClick={handleCreateKey} variant="contained" size="small" disabled={creating || !newKeyName.trim()}>
            {creating ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
            Create
          </Button>
        </DialogActions>
      </Dialog>
      {/* API Key Display */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        {deleteAlert && (
          <Alert severity={deleteAlert.severity} onClose={() => setDeleteAlert(null)} sx={{ mb: 2 }}>
            {deleteAlert.message}
          </Alert>
        )}
        {successAlert && (
          <Alert severity="success" onClose={() => setSuccessAlert(null)} sx={{ mb: 2, alignItems: 'flex-start' }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
              {successAlert.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75, display: 'block' }}>
              Copy and store this key now — it will not be shown again.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                px: 1.5,
                py: 0.75,
                width: 'fit-content'
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {successAlert.key}
              </Typography>
              <Tooltip title={copiedKey === successAlert.key ? 'Copied!' : 'Copy'} placement="top">
                <IconButton
                  size="small"
                  onClick={() => handleCopy(successAlert.key)}
                  sx={{ color: copiedKey === successAlert.key ? 'success.main' : 'text.secondary', flexShrink: 0 }}
                >
                  {copiedKey === successAlert.key ? <CheckOutlined style={{ fontSize: 13 }} /> : <CopyOutlined style={{ fontSize: 13 }} />}
                </IconButton>
              </Tooltip>
            </Box>
          </Alert>
        )}
        <MainCard
          title="API Keys"
          borderRadius={4}
          sx={{ p: 0 }}
          secondary={
            <Button
              variant="text"
              color="primary"
              startIcon={<PlusOutlined />}
              onClick={() => {
                setDialogOpen(true);
                setCreateError('');
                setNewKeyName('');
              }}
              sx={{ ml: 2 }}
            >
              Add API Key
            </Button>
          }
        >
          {apiKeysLoading ? (
            <Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : apiKeyRows.length === 0 ? (
            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No API keys found.
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ width: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    {['Name', 'Key ID', 'Created', 'Last Used', 'Expires', 'Status', ''].map((col, i, arr) => (
                      <TableCell
                        key={i}
                        align={i === arr.length - 1 ? 'right' : 'left'}
                        sx={{
                          fontWeight: 600,
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiKeyRows.map((row) => {
                    const expired = isExpired(row.expires_at);
                    const revealed = !!revealedDashKeys[row.key_id];
                    return (
                      <TableRow
                        key={row.key_id}
                        sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: 'grey.50' }, transition: 'background 0.15s' }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {row.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', letterSpacing: '0.04em' }}>
                              {revealed ? row.key_id : maskKey(row.key_id)}
                            </Typography>
                            <Tooltip title={copiedKey === row.key_id ? 'Copied!' : 'Copy'} placement="top">
                              <IconButton
                                size="small"
                                onClick={() => handleCopy(row.key_id)}
                                sx={{ color: copiedKey === row.key_id ? 'success.main' : 'text.secondary' }}
                              >
                                {copiedKey === row.key_id ? (
                                  <CheckOutlined style={{ fontSize: 12 }} />
                                ) : (
                                  <CopyOutlined style={{ fontSize: 12 }} />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(row.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(row.last_used_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color={expired ? 'error.main' : 'text.secondary'}>
                            {formatDate(row.expires_at)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={expired ? 'Expired' : 'Active'}
                            size="small"
                            sx={{
                              bgcolor: expired ? 'error.lighter' : 'success.lighter',
                              color: expired ? 'error.dark' : 'success.dark',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 22,
                              borderRadius: '6px'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={revealed ? 'Hide key' : 'Reveal key'} placement="top">
                            <IconButton size="small" onClick={() => toggleDashKeyReveal(row.key_id)} sx={{ color: 'text.secondary' }}>
                              {revealed ? <EyeInvisibleOutlined style={{ fontSize: 15 }} /> : <EyeOutlined style={{ fontSize: 15 }} />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete key" placement="top">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteKey(row.key_id, row.name)}
                              disabled={deletingKey === row.key_id}
                              sx={{ color: 'error.main', ml: 0.5 }}
                            >
                              {deletingKey === row.key_id ? (
                                <CircularProgress size={12} color="error" />
                              ) : (
                                <DeleteFilled style={{ fontSize: 15 }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </MainCard>
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
  );
}
