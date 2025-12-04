import React, { useState } from 'react';
import { Button, Container, List, ListItem, ListItemText, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useGetRoundsQuery, useCreateRoundMutation } from '../store/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const RoundsListPage: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetRoundsQuery(undefined);
  const [createRound, { isLoading: isCreating }] = useCreateRoundMutation();
  const rounds = Array.isArray(data?.data) ? data?.data : [];
  const user = useSelector((state: RootState) => state.auth.user);
  const [creationError, setCreationError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Функция для определения статуса раунда
  const getRoundStatus = (round: any) => {
    const now = new Date();
    const startTime = new Date(round.startTime);
    const endTime = new Date(round.endTime);
    
    if (now < startTime) {
      return 'Еще не начат';
    } else if (now >= startTime && now <= endTime) {
      return 'Активен';
    } else {
      return 'Завершен';
    }
  };

  const handleCreateRound = async () => {
    try {
      setCreationError(null);
      const result: any = await createRound(Math.random()).unwrap();
      navigate(`/round/${result.id}`)
      refetch();
    } catch (err: any) {
      console.error('Ошибка создания раунда:', err);
      setCreationError(err.data?.message || 'Ошибка создания раунда');
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%'
      }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%'
      }}>
        <Alert severity="error">
          Ошибка загрузки раундов: {(error as any).data?.message || 'Неизвестная ошибка'}
        </Alert>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      flexDirection: 'column'
    }}>
      <Container maxWidth="xl" sx={{justifyContent: 'center', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Список раундов
        </Typography>
        
        {creationError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {creationError}
          </Alert>
        )}
        
        {user?.role === 'ADMIN' && (
          <Box sx={{ width: '100%', mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateRound}
              disabled={isCreating}
              fullWidth
            >
              {isCreating ? 'Создание...' : 'Создать новый раунд'}
            </Button>
          </Box>
         )}
        
        <List sx={{ width: '100%' }}>
          {rounds.map((round: any) => {
            const status = getRoundStatus(round);
            return (
              <ListItem
                key={round.id}
                component={RouterLink}
                to={`/round/${round.id}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#cfd8dc',
                  '&:hover': {
                    backgroundColor: '#4098bf',
                  }
                }}
              > 
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <span style={{
                        fontSize: '0.875rem',
                        color: 'black'
                      }}>
                      <span>{`ID: ${round.id}`}</span>
                      </span>
                    </Box>
                  }
                />
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <span style={{
                        fontSize: '0.875rem',
                        color: status === 'Активен' ? 'green' : status === 'Завершен' ? 'red' : 'orange'
                      }}>
                        {status}
                      </span>
                    </Box>
                  }
                />
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <span style={{
                        fontSize: '0.875rem',
                        color: 'black'
                      }}>
                        <span>{`Start: ${new Date(round.startTime).toLocaleString()}`}</span>
                      </span>
                    </Box>
                  }
                />
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <span style={{
                        fontSize: '0.875rem',
                        color: 'black'
                      }}>
                        <span>{`End: ${new Date(round.endTime).toLocaleString()}`}</span>
                      </span>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Container>
    </div>
  );
};

export default RoundsListPage;