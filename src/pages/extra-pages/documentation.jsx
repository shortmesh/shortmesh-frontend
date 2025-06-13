// material-ui
import { Box, Typography, Link, Divider } from '@mui/material';

// ==============================|| DOCUMENTATION PAGE ||============================== //

export default function Documentation() {
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Documentation
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to the ShortMesh Dashboard documentation. Here you'll find guides and references for using the platform.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Quick Links
      </Typography>
      <ul>
        <li>
          <Link href="https://github.com/shortmesh/" target="_blank" rel="noopener">
            GitHub Repository
          </Link>
        </li>
        <li>
          <Link href="/help" underline="hover">
            Help & Support
          </Link>
        </li>
      </ul>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary">
        More documentation coming soon. For immediate help, visit the{' '}
        <Link href="/help" underline="hover">
          Help page
        </Link>{' '}
        or contact us at <Link href="mailto:developers@smswithoutborder.com">developers@smswithoutborder.com</Link>.
      </Typography>
    </Box>
  );
}
