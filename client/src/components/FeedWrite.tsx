
import React, { useEffect, useState } from "react";

import { FeedInput } from './Feed'


import Navbar from './Navbar'
import CheckSignin from './CheckSignin'
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";


function FeedWrite() {
    return (
        <CheckSignin>
            <Box sx={{ marginTop: '5rem' }}>
                <Navbar>
                    <Box sx={{ justifyContent: 'center' }}>
                        <Link to={'/write'}>
                            <Button variant="text" disableElevation>작성</Button>
                        </Link>

                        <Link to={'/profile'}>
                            <Button variant="text" disableElevation>프로필</Button>
                        </Link>
                    </Box>
                </Navbar>

                <FeedInput></FeedInput>
            </Box>

        </CheckSignin>

    );

}

export default FeedWrite;