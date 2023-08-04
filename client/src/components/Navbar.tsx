import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, IconButton, Typography, Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkmode } from '../features/appSlice';
import { Link } from "react-router-dom"

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FeedIcon from '@mui/icons-material/Feed';
import CreateIcon from '@mui/icons-material/Create';
import PersonIcon from '@mui/icons-material/Person';

import ToggleDarkmode from "./ToggleDarkmode";

function Navbar(props) {
    const dispatch = useDispatch();

    const isDarkmode = useSelector((state: any) => state.app.isDarkmode);
    const colorMode = isDarkmode == false ? 'rgba(255,255,255,0.7)' : 'rgba(18, 18, 18,0.7)'
    const itemColor = isDarkmode == false ? '#000000' : '#ffffff'

    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
    const blurBackground = { backdropFilter: "blur(8px)", backgroundColor: colorMode, boxShadow: "none", backgroundImage: "none" }



    const handleTitleClick = () => {
        location.href = '/'
    }


    if (isMobile) {
      return (
        <AppBar position="fixed" color="primary" sx={{ paddingX: "1rem", top: 'auto', bottom: 0, ...blurBackground }}>
          <Toolbar>
            <Button sx={{ padding: '1rem'}} color="inherit" aria-label="open drawer">
              <Link to={'/'}>
                <FeedIcon sx={{ fontSize: '1.2rem', color: itemColor, position: 'relative', top: '0.2rem' }} />
              </Link>
            </Button>
            <Box sx={{ flexGrow: 1 }} />

            <Button sx={{ padding: '1rem'}} color="inherit">
              <Link to={'/write'}>
                <CreateIcon sx={{ fontSize: '1.2rem', color: itemColor, position: 'relative', top: '0.2rem' }} />
              </Link>
            </Button>
            <Box sx={{ flexGrow: 1 }} />


            <Button sx={{ padding: '1rem'}} color="inherit">
              <Link to={'/profile'}>
                <PersonIcon sx={{ fontSize: '1.2rem', color: itemColor, position: 'relative', top: '0.2rem' }} />
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
      )
    }

    return (
        <Box sx={{ flexGrow: 1, width: '100%' }} >
          <AppBar position="fixed" sx={{ ...blurBackground }}>
            <Toolbar>
              <Typography component="div" color="text.primary" onClick={handleTitleClick} sx={{ flexGrow: 1, fontSize: "1rem" }}>
                <Link to={'/'}>
                    <b>Scrap</b>

                </Link>
              </Typography>

              {props.children}
            </Toolbar>
          </AppBar>
        </Box>
      );
}


export default Navbar;
