// material-ui
import { Box, Typography, Link, List, ListItem, ListItemText, Divider } from '@mui/material';

export default function Help() {
  return (
    <Box sx={{ mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Help & Support
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to the ShortMesh Dashboard help page. Here you can find resources and support for using the platform.
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Resources
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={
              <Link href="https://github.com/shortmesh" target="_blank" rel="noopener">
                GitHub Repository
              </Link>
            }
            secondary="View source code, report issues, or contribute."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<Link href="/documentation">Documentation</Link>}
            secondary="Read the official documentation for setup and usage."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={<Link href="mailto:developers@smswithoutborders.com">Contact Support</Link>}
            secondary="Email us for help or to report a problem."
          />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="How do I add a new platform?"
            secondary="Go to the Dashboard or Platforms page and click 'Add Platform'. Follow the instructions to connect your device."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Where can I find my API key?"
            secondary="Your API key is shown on the Dashboard, API Keys and in the Settings page. You can copy it for use in your integrations."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="What if my QR code does not appear?"
            secondary="If the QR code does not arrive within 1 minute, you will see an error. Please try again or contact support."
          />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary">
        For more help, visit our{' '}
        <Link href="https://github.com/shortmesh/shortmesh-frontend/issues" target="_blank" rel="noopener">
          GitHub Issues
        </Link>{' '}
        page or email us at <Link href="mailto:developers@smswithoutborders.com">developers@smswithoutborders.com</Link>.
      </Typography>
    </Box>
  );
}
