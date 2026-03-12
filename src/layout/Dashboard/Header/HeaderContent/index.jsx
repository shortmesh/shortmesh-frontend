// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

function ApiTokenChip() {
  const [hasToken, setHasToken] = useState(!!sessionStorage.getItem('api_token'));
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setHasToken(!!sessionStorage.getItem('api_token'));
    window.addEventListener('storage', onStorage);
    const interval = setInterval(() => setHasToken(!!sessionStorage.getItem('api_token')), 2000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <Tooltip title={hasToken ? 'API token is active for this session' : 'No API token — click to set one'}>
      <Chip
        label={hasToken ? 'Token Active' : 'No Token'}
        size="small"
        onClick={() => navigate('/api-keys')}
        sx={{
          mx: 1,
          cursor: 'pointer',
          bgcolor: hasToken ? 'success.lighter' : 'warning.lighter',
          color: hasToken ? 'success.dark' : 'warning.dark',
          fontWeight: 700,
          fontSize: '0.72rem',
          '&:hover': { opacity: 0.85 }
        }}
      />
    </Tooltip>
  );
}

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <ApiTokenChip />
      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
