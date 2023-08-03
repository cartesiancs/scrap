
import React, { useEffect, useState } from "react";
import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';


function CheckSignin({ children }) {
    const isLogin = useSelector((state: any) => state.auth.isLogin);

    useEffect(() => {
        if (!isLogin) {
            location.href = '/auth/select'
        }
    }, [])

    return (
        <Box sx={{ display: isLogin? "block" : "none" }}>
            {children}
        </Box>
    );

}

export default CheckSignin;