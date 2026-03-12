import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

import MainCard from 'components/MainCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';
import { WhatsAppOutlined, SendOutlined } from '@ant-design/icons';

import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

function PlatformIcon({ platform }) {
  if (platform === 'wa') return <WhatsAppOutlined style={{ color: '#25D366' }} />;
  if (platform === 'signal') return <FontAwesomeIcon icon={faSignalMessenger} style={{ color: '#3A76F0' }} />;
  return null;
}

function platformLabel(platform) {
  if (platform === 'wa') return 'WhatsApp';
  if (platform === 'signal') return 'Signal';
  return platform;
}

export default function Posts() {
  const token = localStorage.getItem('token');
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const [devices, setDevices] = useState([]);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [contact, setContact] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sentMessages, setSentMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sentMessages') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchDevices = async () => {
      setDevicesLoading(true);
      try {
        const res = await axios.get(`${API_URL}/devices`, { headers });
        // console.log('Devices response:', res.data);
        setDevices(res.data?.devices || []);
      } catch (err) {
        console.error('Failed to fetch devices', err);
      } finally {
        setDevicesLoading(false);
      }
    };
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = devices.find((d) => d.id === selectedDevice);

  const handleSend = async () => {
    if (!selectedDevice || !contact.trim() || !messageText.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSending(true);
    try {
      await axios.post(
        `${API_URL}/${selectedDevice}/message`,
        { contact: contact.trim(), platform: selected?.platform || 'wa', text: messageText.trim() },
        { headers }
      );

      const newMsg = {
        deviceId: selectedDevice,
        platform: selected?.platform,
        contact: contact.trim(),
        text: messageText.trim(),
        timestamp: new Date().toISOString()
      };
      const updated = [newMsg, ...sentMessages];
      setSentMessages(updated);
      localStorage.setItem('sentMessages', JSON.stringify(updated));
      setMessageText('');
    } catch (err) {
      console.error('Send failed:', err);
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h5">Message Tester</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Send a test message through a connected device.
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <MainCard title="Compose">
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
            >
              {devices.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <PlatformIcon platform={d.platform} />
                    <span>{d.id}</span>
                    <Chip label={platformLabel(d.platform)} size="small" sx={{ ml: 'auto' }} />
                  </Stack>
                </MenuItem>
              ))}
              {!devicesLoading && devices.length === 0 && <MenuItem disabled>No devices connected</MenuItem>}
            </TextField>

            <TextField
              label="Contact number"
              fullWidth
              size="small"
              placeholder="e.g. 1234567890"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
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
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              variant="contained"
              endIcon={sending ? <CircularProgress size={16} color="inherit" /> : <SendOutlined />}
              onClick={handleSend}
              disabled={sending}
              fullWidth
            >
              {sending ? 'Sending…' : 'Send Message'}
            </Button>
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <MainCard
          title="Sent"
          secondary={
            sentMessages.length > 0 && (
              <Button
                size="small"
                color="error"
                onClick={() => {
                  setSentMessages([]);
                  localStorage.removeItem('sentMessages');
                }}
              >
                Clear
              </Button>
            )
          }
        >
          {sentMessages.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <SendOutlined style={{ fontSize: 32, color: '#ccc', marginBottom: 8 }} />
              <Typography variant="body2" color="text.secondary">
                No messages sent yet.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={0} divider={<Divider />}>
              {sentMessages.map((msg, i) => (
                <Box key={i} sx={{ py: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <PlatformIcon platform={msg.platform} />
                      <Typography variant="caption" color="text.secondary">
                        {msg.deviceId}
                      </Typography>
                      <Typography variant="caption" fontWeight={600}>
                        → {msg.contact}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" color="text.disabled">
                      {new Date(msg.timestamp).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      bgcolor: 'primary.lighter',
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                      display: 'inline-block',
                      maxWidth: '100%',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}
