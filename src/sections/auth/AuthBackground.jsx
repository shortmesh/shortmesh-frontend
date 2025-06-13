// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

export default function AuthBackground() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'absolute',
        filter: 'blur(10px)',
        zIndex: -1,
        bottom: 0,
        transform: 'inherit'
      }}
    >
      <Box component="img" src="/background.png" alt="background" width="100%" height="100%" />
    </Box>
  );
}
