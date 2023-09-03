
import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, IconButton, Typography, Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkmode } from '../features/appSlice';
import { Link } from "react-router-dom"

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';


function ToggleDarkmode() {
    const dispatch = useDispatch();
  
    const isDarkmode = useSelector((state: any) => state.app.isDarkmode);
  
    const toggleColorMode = () => {
        dispatch(toggleDarkmode({
            isDarkmode: isDarkmode == false ? true : false
        }))
    }
  
    return (
      <Button onClick={toggleColorMode} color="primary">
        <b style={{ marginRight: '0.5rem' }}>다크모드</b> {isDarkmode === true ? <Brightness7Icon sx={{ fontSize: "1.2rem"  }} /> : <Brightness4Icon sx={{ fontSize: "1.2rem"  }} />}
      </Button>
    )
  }

  export default ToggleDarkmode