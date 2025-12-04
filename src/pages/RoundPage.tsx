import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useGetRoundByIdQuery, useTapRoundMutation } from '../store/api';

const RoundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetRoundByIdQuery(id || '');
  const [tapRound] = useTapRoundMutation();
  const [tapCount, setTapCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<any>(null);

  const roundData = data?.round;
  
  const getRoundStatus = () => {
    if (!roundData) return 'Неизвестно';
    
    const now = new Date();
    const startTime = new Date(roundData.startTime);
    const endTime = new Date(roundData.endTime);
    
    if (now < startTime) {
      return 'Еще не начат';
    } else if (now >= startTime && now <= endTime) {
      return 'Активен';
    } else {
      return 'Завершен';
    }
  };
  
  // Эффект для обновления времени обратного отсчета
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!roundData) return null;
      
      const now = new Date();
      const startTime = new Date(roundData.startTime);
      const endTime = new Date(roundData.endTime);
      
      // Если раунд еще не начался, считаем время до начала
      if (now < startTime) {
        const diff = startTime.getTime() - now.getTime();
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return { seconds, isCountdown: true };
      }
      
      // Если раунд активен, считаем время до окончания
      if (now >= startTime && now <= endTime) {
        const diff = endTime.getTime() - now.getTime();
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return {seconds, isCountdown: false };
      }
      
      // Если раунд завершен
      return null;
    };
    
    setTimeRemaining(calculateTimeRemaining());
    
    // Устанавливаем интервал для обновления времени каждую секунду
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [roundData]);

  const handleTap = async () => {
    if (id) {
      try {
        await tapRound(id).unwrap();
        setTapCount(prev => prev + 1);
      } catch (err) {
        console.error('Ошибка при нажатии:', err);
      }
    }
  };

  useEffect(() => {
    setTapCount(0);
  }, [id]);

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
          Ошибка загрузки раунда: {(error as any).data?.message || 'Неизвестная ошибка'}
        </Alert>
      </div>
    );
  }

  if (!roundData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%'
      }}>
        <Alert severity="warning">
          Раунд не найден
        </Alert>
      </div>
    );
  }

  const status = getRoundStatus();
  const isActive = status === 'Активен';
  
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
          {roundData.name}
        </Typography>
        
        <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom>
            Статус раунда:
            <span style={{
              color: status === 'Активен' ? 'green' : status === 'Завершен' ? 'red' : 'orange',
              marginLeft: '8px'
            }}>
              {status}
            </span>
          </Typography>
          <Typography variant="body1">
            <strong>ID:</strong> {roundData.id}
          </Typography>
          <Typography variant="body1">
            <strong>Начало:</strong> {new Date(roundData.startTime).toLocaleString('ru-RU')}
          </Typography>
          <Typography variant="body1">
            <strong>Окончание:</strong> {new Date(roundData.endTime).toLocaleString('ru-RU')}
          </Typography>
          {!!data?.topStats?.length && roundData.totalScore !== undefined && (
            <>
            <Typography variant="body1">
              <strong>Всего:</strong> {roundData.totalScore}
            </Typography>
            <Typography variant="body1">
              <strong>Победитель:</strong> {`${data?.topStats?.reduce((prev: any, current: any) => (prev.score > current.score) ? prev : current)?.user?.username} - ${data?.topStats?.reduce((prev: any, current: any) => (prev.score > current.score) ? prev : current)?.score}`}
            </Typography>

            <Typography variant="body1">
              <strong>Мои очки:</strong> {data.myStats?.score}
            </Typography>
            </>
          )}
        </Box>
        
        {isActive && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Гусь
            </Typography>
            <Box
              sx={{
                width: 200,
                height: 200,
                backgroundColor: '#8B4513',
                borderRadius: '50%',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#A0522D'
                }
              }}
              onClick={handleTap}
            >
              <Typography variant="h1">
                🦆
              </Typography>
            </Box>
            <Typography variant="body1" gutterBottom>
              Нажатий: {tapCount}
            </Typography>
          </Box>
        )}
        {timeRemaining && (
          <Typography variant="body1" gutterBottom>
            {timeRemaining.isCountdown ? 'До начала раунда:' : 'Осталось:'} {timeRemaining.seconds}с
          </Typography>
        )}
        {!isActive && status === 'Еще не начат' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Раунд еще не начат. Нажатие на гуся будет доступно после начала раунда.
          </Alert>
        )}
        
        <Button variant="contained" color="secondary" component={RouterLink} to="/rounds">
          Назад к списку раундов
        </Button>
      </Container>
    </div>
  );
};

export default RoundPage;