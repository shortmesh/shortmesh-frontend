// material-ui
import { Box, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import Nav from '../../components/nav';

// ==============================|| DOCUMENTATION PAGE ||============================== //

export default function Pricing() {
  return (
    <Box>
      <Box sx={{ justifyContent: 'center', alignContent: 'center', my: 'auto', textAlign: 'center', height: '100vh' }}>
        <Nav />
        <Typography variant="h1" gutterBottom>
          Coming soon
        </Typography>
      </Box>
      <Box component="footer" sx={{ py: 4, px: 2, textAlign: 'center', bottom: 0 }}>
        <Divider />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          &copy; {new Date().getFullYear()} Afkanerd. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
