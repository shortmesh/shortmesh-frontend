import { useState } from 'react';

// material-ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { MuiTelInput } from 'mui-tel-input';

// assets
import { WhatsAppOutlined, SendOutlined, EditOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';

import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

function PlatformIcon({ platform }) {
  if (platform === 'wa') return <WhatsAppOutlined style={{ color: '#25D366' }} />;
  if (platform === 'signal') return <FontAwesomeIcon icon={faSignalMessenger} style={{ color: '#3A76F0' }} />;
  return null;
}

function platformLabel(p) {
  if (p === 'wa') return 'WhatsApp';
  if (p === 'signal') return 'Signal';
  return p;
}

export default function ComposeMessage() {
  const [open, setOpen] = useState(false);
  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [contact, setContact] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const token = localStorage.getItem('token');
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const fetchDevices = async () => {
    setDevicesLoading(true);
    try {
      const res = await axios.get(`${API_URL}/devices`, { headers });
      setDevices(res.data?.devices || []);
    } catch (err) {
      console.error('Failed to fetch devices', err);
    } finally {
      setDevicesLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    fetchDevices();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDevice('');
    setContact('');
    setMessageText('');
    setError('');
    setSent(false);
  };

  const selected = devices.find((d) => d.id === selectedDevice);

  const handleSend = async () => {
    const rawContact = contact.replace(/\s+/g, '').replace(/^\+/, '');
    if (!selectedDevice || !rawContact || !messageText.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSending(true);
    try {
      await axios.post(
        `${API_URL}/${selectedDevice}/message`,
        { contact: rawContact, platform: selected?.platform || 'wa', text: messageText.trim() },
        { headers }
      );
      setSent(true);
      setTimeout(handleClose, 2000);
    } catch (err) {
      console.error('Send failed:', err);
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Tooltip title="Send message">
        <Fab
          color="primary"
          size="medium"
          onClick={handleOpen}
          aria-label="compose message"
          sx={{ position: 'fixed', bottom: 50, right: 32, zIndex: 1200 }}
        >
          <EditOutlined style={{ fontSize: 20 }} />
        </Fab>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
        {/* Header */}
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography variant="h5" fontWeight={700}>
            New Message
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Send a message via a connected device.
          </Typography>
        </Box>
        <Divider />

        <DialogContent sx={{ pt: 2.5, pb: 1 }}>
          {sent ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <SendOutlined style={{ fontSize: 36, color: '#52c41a', marginBottom: 12 }} />
              <Typography variant="h6">Message sent!</Typography>
              <Typography variant="body2" color="text.secondary">
                Closing dialog…
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2.5}>
              <TextField
                select
                label="Device"
                fullWidth
                size="small"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                disabled={devicesLoading}
                helperText={devicesLoading ? 'Loading devices…' : ''}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {devices.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    <Stack direction="row" alignItems="center" gap={1} sx={{ width: '100%' }}>
                      <PlatformIcon platform={d.platform} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {d.id}
                      </Typography>
                      <Chip label={platformLabel(d.platform)} size="small" />
                    </Stack>
                  </MenuItem>
                ))}
                {!devicesLoading && devices.length === 0 && <MenuItem disabled>No devices connected</MenuItem>}
              </TextField>

              <MuiTelInput
                label="Contact number"
                fullWidth
                size="small"
                value={contact}
                onChange={(val) => setContact(val)}
                defaultCountry="CM"
                forceCallingCode
                focusOnSelectCountry
              />

              <TextField
                label="Message"
                fullWidth
                size="small"
                multiline
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSend();
                }}
                helperText="Ctrl+Enter to send"
                slotProps={{ inputLabel: { shrink: true } }}
              />

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        {!sent && (
          <>
            <Divider sx={{ mt: 2 }} />
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
              <Button onClick={handleClose} disabled={sending} sx={{ borderRadius: 2 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={sending}
                endIcon={sending ? <CircularProgress size={14} color="inherit" /> : <SendOutlined />}
                sx={{ borderRadius: 2, minWidth: 110 }}
              >
                {sending ? 'Sending…' : 'Send'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
