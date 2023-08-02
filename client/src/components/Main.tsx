import React, { useState, useEffect } from "react";
import { Button, Box, Grid } from '@mui/material';
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom"

import Navbar from './Navbar'

function Main() {
    const isLogin = useSelector((state: any) => state.auth.isLogin);

    return (
        <Grid container sx={{ marginTop: "3rem" }} spacing={3}>
            <Navbar>
                <ButtonBox isLogin={isLogin}></ButtonBox>
            </Navbar>

        <Grid item xs md>
        </Grid>
        <Grid item xs={10} md={6}>
        
            <Box sx={{ display: 'grid', marginBottom: "2rem", marginTop: "3rem" }}>
                <Box sx={{ justifyContent: 'center', textAlign: 'center' }}>
                    <h1>단순 게시판이 아닌데요</h1>
                    <p>환영합니다. 이 게시판은 실험용 게시판 입니다. 글이 언제든지 삭제될 수 있고 서버가 날라갈 우려도 있습니다. </p>
                </Box>

                <Box sx={{ justifyContent: 'center', textAlign: 'center' }}>
                    
                </Box>

            </Box>
        </Grid>
        <Grid item xs md>
        </Grid>
        </Grid>

    );
}


function ButtonBox({ isLogin }) {
    const handleClickSignup = () => {
        location.href = '/auth/signup'
    }

    const handleClickLogin = () => {
        location.href = '/auth/login'
    }

    const handleClickLogout = () => {
        document.cookie = 'user=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
        location.href = '/'
    }

    const handleClickProfile = () => {
        location.href = '/profile'
    }

    if (isLogin) {
        return (
            <Box sx={{ justifyContent: 'center' }}>
                <Link to={'/profile'}>
                    <Button variant="text" disableElevation>프로필</Button>
                </Link>
            </Box>

        );
    }

    return (
        <Box sx={{ justifyContent: 'center' }}>
            <Link to={'/auth/select'}>
                <Button variant="text" disableElevation>로그인 </Button>
            </Link>
        </Box>

    );
}
  
export default Main;