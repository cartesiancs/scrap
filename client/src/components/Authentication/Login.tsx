import React, { useState } from "react";
import { Button, Box, Grid, TextField, Stack, Alert } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Cookies from 'js-cookie'
import axios from "axios"
import { Link } from "react-router-dom"
import { AuthAPI } from "../../api";


function Login() {
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity]: any = React.useState('success');
  const [alertMessage, setAlertMessage] = React.useState('');

  const [inputs, setInputs] = useState({
    userId: '',
    userPw: ''
  });

  const { userId, userPw } = inputs;


  async function login() {
    let user_id = btoa(userId);
    let user_pw = btoa(userPw);
        

    const data = await AuthAPI.login({
      userId: user_id,
      userPw: user_pw
    })


    if (data.status == 1) {
      Cookies.set('user', data.token)

      showAlert("success", "로그인에 성공했어요")

      setTimeout(() => {
          location.href = '/'
      }, 1400);
    } else if (data.status == -1) {
      showAlert("info", "탈퇴한 회원이거나 권한이 없어요")

    } else {
      showAlert("info", "로그인 정보가 맞지 않아요")
    } 
}


  const handleClickLogin = () => {
    login()
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  }

  const showAlert = (severity, message) => {
    setOpenAlert(true)
    setAlertSeverity(severity)
    setAlertMessage(message)
  }

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

    return (
      <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}>

        <Box sx={{ justifyContent: 'center', textAlign: 'center' }}>

          <h3>로그인</h3>

          <Stack spacing={2} sx={{ marginBottom: '1rem' }}>
            <TextField type="text" label="Id" variant="outlined" placeholder="User ID" name="userId" onChange={onChange} value={userId} required autoFocus />
            <TextField type="password" label="Password" variant="outlined" placeholder="Password" name="userPw" onChange={onChange} value={userPw} required />

          </Stack>

          <Stack spacing={1}>
            <Button variant="contained" onClick={handleClickLogin} disableElevation>로그인 </Button>
            <Link to={'/auth/signup'}>
              <Button variant="text">빠른 회원가입 </Button>
            </Link>

          </Stack>

          


          <Snackbar
            open={openAlert}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={3000}>

            <Alert severity={alertSeverity} sx={{ width: '100%' }}>
              {alertMessage}
            </Alert>
          </Snackbar>

        </Box>
      </Grid>

  
    );
}


  
  export default Login;