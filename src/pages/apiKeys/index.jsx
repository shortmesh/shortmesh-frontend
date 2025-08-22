// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MainCard from 'components/MainCard';
import { useState } from 'react';
import { CopyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

export default function ApiKeys() {
  const apiKey = localStorage.getItem('token') || '';
  const [copiedKey, setCopiedKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Typography variant="h5">Api Keys</Typography>
      </Grid>
      <Grid size={12}>
        <Box sx={{ mt: 2 }}>
          {!apiKey ? (
            <Typography variant="body1" color="text.secondary">
              No API keys have been added yet.
            </Typography>
          ) : (
            <List>
              <MainCard key={apiKey} sx={{ mb: 2, p: 0 }}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                      <IconButton
                        sx={{ color: 'black', minWidth: 40 }}
                        edge="end"
                        aria-label="toggle visibility"
                        onClick={toggleApiKeyVisibility}
                      >
                        {showApiKey ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      </IconButton>
                      <IconButton sx={{ color: 'black', minWidth: 40 }} edge="end" aria-label="copy" onClick={() => handleCopy(apiKey)}>
                        <CopyOutlined />
                      </IconButton>
                    </Box>
                  }
                  sx={{ pr: 12 }}
                >
                  <ListItemIcon>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={showApiKey ? apiKey : '•'.repeat(Math.min(apiKey.length, 40))}
                    secondary={copiedKey === apiKey ? 'Copied!' : null}
                    sx={{
                      wordBreak: 'break-all',
                      mr: 2,
                      maxWidth: 'calc(100% - 120px)'
                    }}
                  />
                </ListItem>
              </MainCard>
            </List>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
