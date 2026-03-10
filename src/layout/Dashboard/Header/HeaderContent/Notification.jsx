import { useState } from 'react';

// material-ui
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent',
          ...theme.applyStyles('dark', { bgcolor: open ? 'background.default' : 'transparent' })
        })}
        aria-label="open notifications"
        aria-controls={open ? 'notification-menu' : undefined}
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <BellOutlined />
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { width: 300, mt: 1, boxShadow: 3 }
          }
        }}
      >
        <MainCard title="Notifications" elevation={0} border={false} content={false}>
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <BellOutlined style={{ fontSize: 28, color: '#aaa', marginBottom: 8 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        </MainCard>
      </Menu>
    </Box>
  );
}
