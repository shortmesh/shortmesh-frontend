// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import MainCard from 'components/MainCard';
import { useState, useEffect } from 'react';
import {
  CopyOutlined,
  CheckOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  KeyOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

function maskKey(key) {
  if (!key || key.length < 8) return '********';
  return key.slice(0, 4) + '************' + key.slice(-4);
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function isExpired(expires_at) {
  if (!expires_at) return false;
  return new Date(expires_at) < new Date();
}

const COLUMNS = ['Name', 'Key ID', 'Created', 'Last Used', 'Expires', 'Status', ''];

export default function ApiKeys() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [revealedKeys, setRevealedKeys] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [successAlert, setSuccessAlert] = useState(null); // { message, key }
  const [deletingKey, setDeletingKey] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null); // { severity, message }

  useEffect(() => {
    const fetchKeys = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api-keys`, {
          headers: { Authorization: `Bearer ${token}`, accept: 'application/json' }
        });
        console.log('API keys response:', res.data);
        setRows(res.data || []);
      } catch (err) {
        setError('Failed to load API keys.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKeys();
  }, []);

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  const toggleReveal = (keyId) => {
    setRevealedKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

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
      setRows((prev) => [...prev, data]);
      setSuccessAlert({ message: message || 'API key created successfully.', key });
      setDialogOpen(false);
      setNewKeyName('');
    } catch (err) {
      setCreateError(err?.response?.data?.detail || 'Failed to create API key.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (keyId, keyName) => {
    setDeletingKey(keyId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api-keys`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        data: { key_id: keyId }
      });
      setRows((prev) => prev.filter((r) => r.key_id !== keyId));
      setDeleteAlert({ severity: 'success', message: `API key "${keyName}" deleted successfully.` });
    } catch (err) {
      console.error('Failed to delete API key:', err);
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Failed to delete API key.';
      setDeleteAlert({ severity: 'error', message: msg });
    } finally {
      setDeletingKey(null);
    }
  };

  const thSx = { fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5">API Keys</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              API keys are used to authenticate requests to the ShortMesh API.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<PlusOutlined />}
            onClick={() => {
              setDialogOpen(true);
              setCreateError('');
              setNewKeyName('');
            }}
            sx={{ mt: 0.5 }}
          >
            Add API Key
          </Button>
        </Box>
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

      {deleteAlert && (
        <Grid size={12}>
          <Alert severity={deleteAlert.severity} onClose={() => setDeleteAlert(null)}>
            {deleteAlert.message}
          </Alert>
        </Grid>
      )}
      {successAlert && (
        <Grid size={12}>
          <Alert severity="success" onClose={() => setSuccessAlert(null)} sx={{ alignItems: 'flex-start' }}>
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
                bgcolor: 'grey.100',
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
        </Grid>
      )}
      <Grid size={12}>
        <MainCard borderRadius={4} sx={{ p: 0, width: '100%' }}>
          {loading ? (
            <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={28} />
            </Box>
          ) : error ? (
            <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          ) : rows.length === 0 ? (
            <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ fontSize: '2.5rem', color: 'text.disabled' }}>
                <KeyOutlined />
              </Box>
              <Typography variant="body1" color="text.secondary">
                No API keys have been added yet.
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ width: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    {COLUMNS.map((col, i) => (
                      <TableCell key={i} align={i === COLUMNS.length - 1 ? 'right' : 'left'} sx={thSx}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const expired = isExpired(row.expires_at);
                    const revealed = !!revealedKeys[row.key_id];
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
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.75,
                              bgcolor: 'grey.100',
                              px: 1,
                              py: revealed ? 0.5 : 0,
                              borderRadius: 1
                            }}
                          >
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
                            <IconButton size="small" onClick={() => toggleReveal(row.key_id)} sx={{ color: 'text.secondary' }}>
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
                                <DeleteOutlined style={{ fontSize: 15 }} />
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
    </Grid>
  );
}
