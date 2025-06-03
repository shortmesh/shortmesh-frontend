// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

export default function ApiKeys() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h5">Api Keys</Typography>
      </Grid>
    </Grid>
  );
}
