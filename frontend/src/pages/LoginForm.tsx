import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, styled, TextField, Typography } from '@mui/material';

// create a custom button container
const StyledButtonContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(217, 217, 217, 0.4)',
  borderRadius: '1.5vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
  },
  transition: 'all 0.3s ease',
}));

// create a custom input box style
const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(217, 217, 217, 0.4)',
    borderRadius: '1.5vw',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#000',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 200,
  },
  '& .MuiOutlinedInput-input': {
    color: '#000',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: 200,
    fontSize: 'clamp(16px, 2vw, 24px)',
  },
});

const ButtonText = styled('div')({
  color: '#000000',
  fontSize: 'clamp(16px, 2vw, 24px)',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 200,
  whiteSpace: 'nowrap',
});

const ErrorText = styled(Typography)({
  color: '#ff0000',
  fontSize: 'clamp(14px, 1.5vw, 18px)',
  fontFamily: 'Outfit, sans-serif',
  fontWeight: 200,
  marginTop: '1vh',
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Enter the username and password for your account');
      return;
    }

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`http://localhost:8000/api/auth/${endpoint}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          user_type: userType?.toUpperCase()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.user_type);
        if (userType === 'city') {
          navigate('/city');
        } else if (userType === 'company') {
          navigate('/company');
        }
      } else {
        setError(data.message || 'Operation failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #37CAFB 0%, #217895 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: '90%',
          height: '90vh',
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row'
          },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2vw',
        }}
      >
        {/* left icon */}
        <Box
          sx={{
            width: { xs: '70%', md: '40%' },
            aspectRatio: '1/1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="/icon1.png"
            alt="City Buildings"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* right form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: { xs: '90%', md: '45%' },
            display: 'flex',
            flexDirection: 'column',
            gap: '2vh',
          }}
        >
          <ButtonText sx={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>
            {userType?.toUpperCase()}
          </ButtonText>

          <StyledTextField
            fullWidth
            label="USERNAME"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            error={!!error}
          />

          <StyledTextField
            fullWidth
            type="password"
            label="PASSWORD"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={!!error}
          />

          {error && <ErrorText>{error}</ErrorText>}

          <Box
            sx={{
              display: 'flex',
              gap: '2vw',
              justifyContent: 'space-between',
            }}
          >
            <StyledButtonContainer
              onClick={handleSubmit}
              sx={{
                width: '48%',
                height: '5vh',
                minHeight: '40px',
              }}
            >
              <ButtonText>{isLogin ? 'LOGIN' : 'REGISTER'}</ButtonText>
            </StyledButtonContainer>

            <StyledButtonContainer
              onClick={() => setIsLogin(!isLogin)}
              sx={{
                width: '48%',
                height: '5vh',
                minHeight: '40px',
              }}
            >
              <ButtonText>{isLogin ? 'SIGN UP' : 'BACK TO LOGIN'}</ButtonText>
            </StyledButtonContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm; 