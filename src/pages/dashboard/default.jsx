// material-ui
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Hi there 👋🏼</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce title="Posts" count="0" extra="Number of Posts" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2 }}>
        <AnalyticEcommerce title="Platforms" count="0" extra="Number of Platforms" />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />
      {/* Filters Section */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <MainCard sx={{ mt: 1 }} content={false}>
          <Box sx={{ p: 3 }}></Box>
        </MainCard>
      </Grid>

      {/* row 2 */}
      {/* <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard filters={filtersApplied} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <CountryTable filters={filtersApplied} />
      </Grid>
      
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <UserTable filters={filtersApplied} />
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <ReportCard />
      </Grid> */}
    </Grid>
  );
}
