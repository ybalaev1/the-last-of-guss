import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { useLogoutMutation, useMeQuery } from '../store/api';
import type { RootState } from '../store';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const { data: userData } = useMeQuery(undefined);
  const user = useSelector((state: any) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      await logoutApi({}).unwrap();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch(logout());
      navigate('/login');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: 'auth/loginSuccess', payload: userData.user || userData });
    }
  }, [isAuthenticated, userData, dispatch]);

  if (window.location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar position="static" sx={{width: '100dvw'}}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, '&:hover': { cursor: 'pointer'} }} onClick={() => navigate('/rounds')}>
          The Last of Guss
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">{user.username}</Typography>
            <Button color="inherit" onClick={handleLogout}>
              Выйти
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;