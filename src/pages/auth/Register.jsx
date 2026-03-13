import { Link } from 'react-router-dom';

// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

// project imports
import AuthWrapper from 'sections/auth/AuthWrapper';
import FirebaseRegister from 'sections/auth/AuthRegister';

// ================================|| JWT - REGISTER ||================================ //

export default function Register() {
  return (
    <AuthWrapper>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 0.75 }}>
          Create an account
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start messaging at scale with ShortMesh
        </Typography>
      </Box>

      <FirebaseRegister />

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" color="text.secondary" align="center">
        Already have an account?{' '}
        <Typography component={Link} to="/login" variant="body2" color="primary" sx={{ textDecoration: 'none', fontWeight: 600 }}>
          Sign in
        </Typography>
      </Typography>
    </AuthWrapper>
  );
}
