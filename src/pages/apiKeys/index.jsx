import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import MainCard from 'components/MainCard';
import { CopyOutlined, CheckOutlined, KeyOutlined, PlusOutlined, SendOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function ApiKeys() {
  const [copiedKey, setCopiedKey] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [successAlert, setSuccessAlert] = useState(null); // { token }
  const [sessionSaved, setSessionSaved] = useState(false);

  const hasSessionToken = Boolean(sessionStorage.getItem('api_token'));

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', accept: 'application/json' };
  };

  const handleCopy = (val) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(val);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  const handleSaveToSession = (token) => {
    sessionStorage.setItem('api_token', token);
    setSessionSaved(true);
  };

  const handleCreateToken = async () => {
    setCreating(true);
    setCreateError('');
    try {
      const body = expiresAt ? { expires_at: new Date(expiresAt).toISOString() } : {};
      const res = await axios.post(`${API_URL}/tokens`, body, { headers: authHeaders() });
      const newToken = res.data?.token || res.data;
      // Auto-save to sessionStorage so device calls work immediately
      sessionStorage.setItem('api_token', newToken);
      setSessionSaved(true);
      setSuccessAlert({ token: newToken });
      setDialogOpen(false);
      setExpiresAt('');
    } catch (err) {
      setCreateError(err?.response?.data?.detail || err?.response?.data?.message || 'Failed to create token.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5">Tokens</Typography>
            {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Tokens authenticate device API calls. Each token is shown once on creation — save it immediately.
            </Typography> */}
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<PlusOutlined />}
            onClick={() => {
              setDialogOpen(true);
              setCreateError('');
              setExpiresAt('');
            }}
            sx={{ mt: 0.5 }}
          >
            New Token
          </Button>
        </Box>
      </Grid>

      {/* Create dialog */}
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
            Set an optional expiry date. Defaults to 6 months if left blank.
          </Typography>
        </Box>
        <Divider />
        <DialogContent sx={{ pt: 2.5 }}>
          <TextField
            label="Expires at (optional)"
            type="datetime-local"
            fullWidth
            size="small"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
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
          <Button onClick={() => setDialogOpen(false)} disabled={creating} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateToken}
            variant="contained"
            disabled={creating}
            endIcon={creating ? <CircularProgress size={14} color="inherit" /> : <SendOutlined />}
            sx={{ borderRadius: 2, minWidth: 110 }}
          >
            {creating ? 'Creating\u2026' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success alert */}
      {successAlert && (
        <Grid size={12}>
          <Alert severity="success" onClose={() => setSuccessAlert(null)} sx={{ alignItems: 'flex-start' }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
              Token created copy it now, it will not be shown again.
            </Typography>
            {sessionSaved && (
              <Chip label="Saved to session storage" size="small" color="success" sx={{ mb: 1, fontWeight: 600, fontSize: '0.7rem' }} />
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'grey.100',
                borderRadius: 1,
                px: 1.5,
                py: 0.75,
                mt: 0.5,
                width: 'fit-content',
                maxWidth: '100%',
                flexWrap: 'wrap'
              }}
            >
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', flexGrow: 1 }}>
                {successAlert.token}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                <Tooltip title={copiedKey === successAlert.token ? 'Copied!' : 'Copy token'} placement="top">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(successAlert.token)}
                    sx={{ color: copiedKey === successAlert.token ? 'success.main' : 'text.secondary' }}
                  >
                    {copiedKey === successAlert.token ? (
                      <CheckOutlined style={{ fontSize: 13 }} />
                    ) : (
                      <CopyOutlined style={{ fontSize: 13 }} />
                    )}
                  </IconButton>
                </Tooltip>
                {!sessionSaved && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => handleSaveToSession(successAlert.token)}
                    sx={{ fontSize: '0.7rem', py: 0.25, px: 1, borderRadius: 1, minWidth: 0 }}
                  >
                    Create token
                  </Button>
                )}
              </Box>
            </Box>
          </Alert>
        </Grid>
      )}

      {/* Info card */}
      <Grid size={12}>
        <MainCard borderRadius={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Session status */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <KeyOutlined style={{ fontSize: 22, color: hasSessionToken ? '#52c41a' : '#faad14' }} />
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {hasSessionToken ? 'API token active' : 'No API token'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hasSessionToken
                      ? 'Device calls are authenticated. Token is cleared when you close the browser tab.'
                      : 'Create a token or paste an existing one to enable device calls.'}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={hasSessionToken ? 'Active' : 'Not set'}
                size="small"
                sx={{
                  bgcolor: hasSessionToken ? 'success.lighter' : 'warning.lighter',
                  color: hasSessionToken ? 'success.dark' : 'warning.dark',
                  fontWeight: 700,
                  fontSize: '0.72rem'
                }}
              />
            </Box>

            <Divider />

            {/* How it works */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <InfoCircleOutlined style={{ fontSize: 16, color: '#8c8c8c', marginTop: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Tokens are <strong>view-once</strong> they cannot be retrieved after creation. Create a new token, copy it immediately, and
                keep it safe. The token is stored in <code>sessionStorage</code> for this browser session only. You&apos;ll be prompted to
                enter it again after closing the tab.
              </Typography>
            </Box>

            {!hasSessionToken && (
              <>
                <Divider />
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Already have a token? Paste it here:
                  </Typography>
                  <PasteTokenField onSave={() => window.location.reload()} />
                </Box>
              </>
            )}
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}

function PasteTokenField({ onSave }) {
  const [val, setVal] = useState('');
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!val.trim()) return;
    sessionStorage.setItem('api_token', val.trim());
    setSaved(true);
    setTimeout(() => onSave(), 800);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
      <TextField
        size="small"
        placeholder="sk_..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        fullWidth
        onKeyDown={(e) => e.key === 'Enter' && save()}
        disabled={saved}
        slotProps={{ input: { style: { fontFamily: 'monospace' } } }}
      />
      <Button
        variant="contained"
        size="small"
        onClick={save}
        disabled={!val.trim() || saved}
        sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        endIcon={saved ? <CheckOutlined /> : null}
      >
        {saved ? 'Saved!' : 'Save to session'}
      </Button>
    </Box>
  );
}
