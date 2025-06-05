import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [apiError, setApiError] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Username is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(64, 'Password must be less than 64 characters')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          setApiError('');
          setSuccessMsg('');
          setLoading(true);
          try {
            const res = await axios.post('https://sherlockwisdom.com:8080/login', {
              username: values.username,
              password: values.password
            });
            console.log('Login server response:', res.data);
            if (res.data?.access_token && res.data?.status === 'logged in') {
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('token', res.data.access_token);
              setSuccessMsg('Login successful! Redirecting...');
              setTimeout(() => {
                navigate('/dashboard');
              }, 1000);
            } else {
              setApiError('Login failed: Unexpected server response');
              console.error('Login failed: Unexpected server response', res.data);
            }
          } catch (err) {
            setApiError(err.response?.data?.message || err.message || 'Login failed');
            console.error('Login error:', err, err?.response);
          } finally {
            setLoading(false);
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {apiError && (
                <Grid size={12}>
                  <FormHelperText error>{apiError}</FormHelperText>
                </Grid>
              )}
              {successMsg && (
                <Grid size={12}>
                  <FormHelperText>{successMsg}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="username-login">Username</InputLabel>
                  <OutlinedInput
                    id="username-login"
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter username"
                    fullWidth
                    error={Boolean(touched.username && errors.username)}
                  />
                </Stack>
                {touched.username && errors.username && (
                  <FormHelperText error id="standard-weight-helper-text-username-login">
                    {errors.username}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              <Grid sx={{ mt: -1 }} size={12}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Keep me signed in</Typography>}
                  />
                  {/* <Link variant="h6" component={RouterLink} to="#" color="text.primary">
                    Forgot Password?
                  </Link> */}
                </Stack>
              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button type="submit" fullWidth size="large" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
