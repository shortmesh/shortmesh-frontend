import PropTypes from 'prop-types';
// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';

// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function AnalyticEcommerce({ color = 'primary', title, count, percentage, isLoss, extra, icon }) {
  return (
    <MainCard contentSX={{ p: 2.25 }} borderRadius={5}>
      <Stack direction="row" alignItems="center" sx={{ gap: 2 }}>
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              height: 70,
              borderRadius: '10px',
              bgcolor: `grey.100`,
              color: 'text.primary',
              fontSize: '1.5rem',
              flexShrink: 0
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="body1" color="text.secondary">
              {title}
            </Typography>
            <Grid container alignItems="center">
              <Grid>
                <Typography variant="h4" color="inherit">
                  {count}
                </Typography>
              </Grid>
              {percentage && (
                <Grid>
                  <Chip
                    variant="combined"
                    color={color}
                    icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                    label={`${percentage}%`}
                    sx={{ ml: 1.25, pl: 1 }}
                    size="small"
                  />
                </Grid>
              )}
            </Grid>
          </Stack>
          <Box>
            <Typography variant="caption" color="text.secondary">
              <Typography variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
                {extra}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Stack>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
  icon: PropTypes.node
};
