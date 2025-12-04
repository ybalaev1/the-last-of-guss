import React, { useState } from 'react';
import { Button, Container, Stack, TextField, Typography, Alert, IconButton, InputAdornment } from '@mui/material';
import { useLoginMutation } from '../store/api';
import { api } from '../store/api';
import { useDispatch } from 'react-redux';
import { loginFailure } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ username, password }).unwrap();
      localStorage.setItem('token', result.token);
      dispatch(api.endpoints.me.initiate() as any);
      navigate('/rounds');
    } catch (err: any) {
      dispatch(loginFailure(err.data?.message || 'Ошибка входа'));
    }
  };

  return (
      <Container maxWidth="xl">
        <Stack sx={{ backgroundColor: '#0c0c0c', padding: 4, borderRadius: 4}} gap={4}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Войти
        </Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Имя пользователя"
                variant="outlined"
                margin="normal"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                    '& input': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input': {
                      '&::placeholder': {
                        color: 'white',
                        opacity: 1,
                      },
                      '&:focus::placeholder': {
                        color: 'white',
                        opacity: 1,
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'white',
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'white',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                    '& input': {
                      color: 'white',
                    },
                    '& .MuiInputBase-input': {
                      '&::placeholder': {
                        color: 'white',
                        opacity: 1,
                      },
                      '&:focus::placeholder': {
                        color: 'white',
                        opacity: 1,
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'white',
                    '&.Mui-focused': {
                      color: 'white',
                    },
                  },
                  '& .MuiFormHelperText-root': {
                    color: 'white',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: 'white', backgroundColor: 'transparent', marginRight: '0px' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem' }}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        {error && (
          <Alert severity="error">
            {(error as any).data?.message || 'Ошибка входа'}
          </Alert>
        )}
        </Stack>
      </Container>
  );
};

export default LoginPage;