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
import { CopyOutlined } from '@ant-design/icons';

export default function ApiKeys() {
  let initialKeys = [];
  try {
    initialKeys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
  } catch {
    initialKeys = [];
  }
  const [apiKeys] = useState(initialKeys);
  const [copiedKey, setCopiedKey] = useState('');

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Typography variant="h5">Api Keys</Typography>
      </Grid>
      <Grid size={12}>
        <Box sx={{ mt: 2 }}>
          {apiKeys.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No API keys have been added yet.
            </Typography>
          ) : (
            <List>
              {apiKeys.map((key, idx) => (
                <MainCard key={key} sx={{ mb: 2, p: 0 }}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="copy" onClick={() => handleCopy(key)}>
                        <CopyOutlined />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    </ListItemIcon>
                    <ListItemText primary={key} secondary={copiedKey === key ? 'Copied!' : null} sx={{ wordBreak: 'break-all' }} />
                  </ListItem>
                </MainCard>
              ))}
            </List>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
