// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import MainCard from 'components/MainCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';
import { EyeOutlined, EyeInvisibleOutlined, WhatsAppOutlined, PlusOutlined } from '@ant-design/icons';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { MuiTelInput } from 'mui-tel-input';

const API_URL = import.meta.env.VITE_APP_API_URL;

export default function Posts() {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'User';
  const headers = {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('localMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [platformDevices, setPlatformDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [contact, setContact] = useState('');
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState({});

  const fetchDevices = async () => {
    const platforms = ['wa', 'signal'];
    const allDevices = [];

    for (const p of platforms) {
      try {
        const res = await axios.post(`${API_URL}/${p}/list/devices`, { username }, { headers });
        if (res.data?.devices?.length) {
          res.data.devices.forEach((device) => {
            allDevices.push({
              platform: p,
              device
            });
          });
        }
      } catch (err) {
        console.error(`Error fetching ${p} devices`, err);
      }
    }
    setPlatformDevices(allDevices);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const getPlatformIcon = (type) => {
    return type === 'wa' ? (
      <WhatsAppOutlined style={{ color: '#25D366' }} />
    ) : (
      <FontAwesomeIcon icon={faSignalMessenger} style={{ color: '#3A76F0' }} />
    );
  };

  const handleSend = async () => {
    const cleanedContact = contact.replace(/\s+/g, '');
    if (!selectedDevice || !cleanedContact || !messageText) {
      setError('All fields are required.');
      return;
    }

    const { platform, device } = platformDevices.find((d) => d.device === selectedDevice) || {};
    if (!platform || !device) {
      setError('Selected device not valid.');
      return;
    }

    setError('');
    try {
      await axios.post(
        `${API_URL}/${platform}/message/${cleanedContact}`,
        {
          username,
          device_name: device,
          message: messageText
        },
        { headers }
      );

      const newMsg = {
        platform: platform === 'wa' ? 'WhatsApp' : 'Signal',
        icon: platform,
        contact: cleanedContact,
        message: messageText,
        device,
        timestamp: new Date().toLocaleString()
      };

      const updatedMessages = [newMsg, ...messages];
      setMessages(updatedMessages);
      localStorage.setItem('localMessages', JSON.stringify(updatedMessages));

      setSuccess(true);
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDevice('');
    setContact('');
    setMessageText('');
    setError('');
    setSuccess(false);
  };

  const toggleMessageVisibility = (index) => {
    setVisibleMessages((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={{ xs: 12 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Messages</Typography>
          <Button startIcon={<PlusOutlined />} variant="contained" onClick={() => setDialogOpen(true)}>
            Send New Message
          </Button>
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <MainCard title="Messages">
          {messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No messages to display.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell>Device</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {messages.map((msg, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {getPlatformIcon(msg.icon)}&nbsp;{msg.platform}
                      </TableCell>
                      <TableCell>{msg.device}</TableCell>
                      <TableCell>{msg.contact}</TableCell>
                      <TableCell>
                        {visibleMessages[index] ? (
                          <>
                            {msg.message}{' '}
                            <IconButton onClick={() => toggleMessageVisibility(index)}>
                              <EyeInvisibleOutlined />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton onClick={() => toggleMessageVisibility(index)}>
                            <EyeOutlined />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>{msg.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </MainCard>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Send a Message</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Select Device"
            fullWidth
            margin="normal"
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
          >
            {platformDevices.map(({ platform, device }) => (
              <MenuItem key={device} value={device}>
                {platform === 'wa' ? (
                  <>
                    <WhatsAppOutlined style={{ color: '#25D366', marginRight: 8 }} /> {device} (WhatsApp)
                  </>
                ) : platform === 'signal' ? (
                  <>
                    <FontAwesomeIcon icon={faSignalMessenger} style={{ color: '#3A76F0', marginRight: 8 }} /> {device} (Signal)
                  </>
                ) : (
                  device
                )}
              </MenuItem>
            ))}
          </TextField>

          <MuiTelInput
            label="Contact"
            fullWidth
            margin="normal"
            value={contact}
            onChange={(value) => setContact(value)}
            defaultCountry="CM"
          />
          <TextField
            label="Message"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Message sent successfully!
        </Alert>
      </Snackbar>
    </Grid>
  );
}
