import { useRef, useState } from 'react';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

// project imports
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import avatar1 from 'assets/images/users/user.png';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const email = localStorage.getItem('email') || '';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={(theme) => ({
          p: 0.25,
          bgcolor: open ? 'grey.100' : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 }
        })}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center', p: 0.5 }}>
          <Avatar alt="profile user" size="sm" />
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <ClickAwayListener onClickAway={handleClose}>
              <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: 220, minWidth: 180 })}>
                <MainCard elevation={0} border={false} content={false}>
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      Signed in as
                    </Typography>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuList sx={{ p: 0.5 }}>
                    <MenuItem onClick={handleLogout} sx={{ borderRadius: 1, color: 'error.main', gap: 1.5, py: 1 }}>
                      <LogoutOutlined style={{ fontSize: 16 }} />
                      <Typography variant="body2">Logout</Typography>
                    </MenuItem>
                  </MenuList>
                </MainCard>
              </Paper>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
