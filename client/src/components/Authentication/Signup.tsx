import React, { useState, useRef } from "react";
import Cookies from 'js-cookie'
import { Button, Box, Grid, TextField, Stack, Alert } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import axios from "axios"
import { Link } from "react-router-dom"
import { AuthAPI } from "../../api";


function Signup() {
  const [openAlert, setOpenAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity]: any = React.useState('success');
  const [alertMessage, setAlertMessage] = React.useState('');

  const [inputs, setInputs] = useState({
      userId: '',
      userEmail: '',
      userPw: ''
  });

  const [inputsVaild, setInputsVaild] = useState({
    userId: {
      isVaild: true,
      message: ''
    },
    userEmail: {
      isVaild: true,
      message: ''
    },
    userPw: {
      isVaild: true,
      message: ''
    },
});

  
  const { userId, userEmail, userPw } = inputs;
  const userIdRef: any = useRef();
  const userEmailRef: any = useRef();
  const userPwRef: any = useRef();


  async function signup() {
    try {
      let user_id = btoa(userId);
      let user_pw = btoa(userPw);
      let user_email = btoa(userEmail);
    
      if (user_id == '' || user_pw == '' || user_email == '') {
        return showAlert("info", "입력칸을 확인해주세요")
      }
  
      const data = await AuthAPI.signup({
        userId: user_id,
        userPw: user_pw,
        userEmail: user_email
      })

      if (data.status == 1) {
        Cookies.set('user', data.token)

        showAlert("success", "가입에 성공했어요")

        setTimeout(() => {
          location.href = '/'
        }, 1200);
      } else if (data.status == 2) { // 비번 8자리
        showAlert("info", "바밀번호는 8자리 이상이여야 해요")

      } else if (data.status == 5) { // 특수문자
        showAlert("info", "아이디에 특수문자는 입력할 수 없어요")

      } else if (data.status == 0) {
        showAlert("info", "사용 불가한 아이디 또는 이메일이에요")

      }
    } catch (error) {
      console.log(error)

      showAlert("info", "에러가 발생했어요")
    }
  }

  const userFormCheck = {
    userId: function (value) {
      let pattern_spc = /[^\w]/;
      
      if (pattern_spc.test(String(value)) == true || value == '' ) {
        return {
          bool: false,
          message: "특수문자를 포함할 수 없어요"
        }
      } else {
        return {
          bool: true,
          message: ""
        }
      }
    },
      
      userPw: function (value) {
      let form_pw = value
      
      if (value.length < 8) {
        return {
          bool: false,
          message: "비밀번호는 8자리 이상이어야 해요"
        }
      } else {
        return {
          bool: true,
          message: ""
        }
      }
    },
      
    userEmail: function (value) {
      let patten_eml = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      
      if (patten_eml.test(String(value)) == false) {
        return {
          bool: false,
          message: "이메일 형식을 확인해주세요"
        }
      } else {
        return {
          bool: true,
          message: ""
        }
      }
    }
  }


  const handleClickSignup = () => {
    signup()
  }

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });

    validForm({ name: name, value: value })
  };

  const validForm = ({ name, value }) => {
    console.log(name, value, inputsVaild )

    let check = userFormCheck[name](value)

    setInputsVaild({
      ...inputsVaild,
      [name]: {
        isVaild: check.bool,
        message:  check.message
      }
    })

    
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  }

  const showAlert = (severity, message) => {
    setOpenAlert(true)
    setAlertSeverity(severity)
    setAlertMessage(message)
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

          <h3>회원가입</h3>

          <Stack spacing={2} sx={{ marginBottom: '1rem' }}>
            <TextField type="text" label="Id" variant="outlined" name="userId" error={!inputsVaild['userId'].isVaild} helperText={inputsVaild['userId'].message} ref={userIdRef} onChange={onChange} value={userId} required autoFocus />
            <TextField type="email" label="Email" variant="outlined" name="userEmail" error={!inputsVaild['userEmail'].isVaild} helperText={inputsVaild['userEmail'].message} ref={userEmailRef} onChange={onChange} value={userEmail} required />            
            <TextField type="password" label="Password" variant="outlined" error={!inputsVaild['userPw'].isVaild} ref={userPwRef} helperText={inputsVaild['userPw'].message} onChange={onChange} value={userPw} name="userPw" required />

          </Stack>



          <Stack spacing={1}>
            <Button variant="contained" onClick={handleClickSignup} disableElevation>가입 </Button>
            <Link to={'/auth/login'}>
              <Button variant="text" href="/auth/login">이미 계정이 있어요 </Button>
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
  
  export default Signup;