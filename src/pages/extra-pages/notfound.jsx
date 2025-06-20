// material-ui
import { Box, Button, List, ListItem, ListItemText } from '@mui/material';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| DOCUMENTATION PAGE ||============================== //

export default function NotFound() {
  return (
    <Box sx={{ justifyContent: 'center', alignContent: 'center', my: 'auto', textAlign: 'center', height: '100vh' }}>
      <Typography variant="h1" gutterBottom>
        OOPS!
      </Typography>
      <Typography variant="h4" gutterBottom>
        Seems the page you are looking for does not exist
      </Typography>
      <Button component="a" href="/" variant="text">
        Go back
      </Button>
    </Box>
  );
}
