// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

// assets
import { LockOutlined } from '@ant-design/icons';

// ==============================|| AUTHY - COMING SOON ||============================== //

export default function Authy() {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Stack alignItems="center" spacing={2.5}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 3,
            bgcolor: 'primary.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LockOutlined style={{ fontSize: 32, color: '#1890ff' }} />
        </Box>
        <Chip label="Coming Soon" color="primary" size="small" />
        <Typography variant="h4" fontWeight={700} textAlign="center">
          Authy
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ maxWidth: 380 }}>
          Two-factor authentication and token management via Authy is on its way. Check back soon.
        </Typography>
      </Stack>
    </Box>
  );
}
