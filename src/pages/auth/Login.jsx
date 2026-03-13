import { Link } from 'react-router-dom';

// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';

// ================================|| JWT - LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 0.75 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to your ShortMesh account
        </Typography>
      </Box>

      <AuthLogin />

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="text.secondary" align="center">
        Don&apos;t have an account?{' '}
        <Typography component={Link} to="/register" variant="body2" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
          Sign up
        </Typography>
      </Typography>
    </AuthWrapper>
  );
}
