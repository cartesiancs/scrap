import React from "react";
import { Button, Box, Grid, Typography, ThemeProvider } from '@mui/material';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function NotFound() {
  function handleClickHome() {
    location.href = '/'
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}>

      <Box sx={{ justifyContent: 'center', textAlign: 'center' }}>
        <ThemeProvider theme={theme}>
          <Typography variant="h3" sx={{ marginBottom: '1rem', fontWeight: 'bold' }}>오 이게 무슨일이죠..?</Typography>
          <Typography variant="h6"sx={{ marginBottom: '1.7rem', color: 'text.secondary' }} >페이지를 표시하지 못했어요ㅠㅠ </Typography>
        </ThemeProvider>


        <Button variant="contained" onClick={handleClickHome}>홈으로 </Button>
      </Box>
  </Grid>

  );
}
  
export default NotFound;