
import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Grid, Card, CardContent, Typography, Box, Skeleton, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Popup } from './Alert'
import { FeedBody } from './Feed'
import { useDispatch, useSelector } from 'react-redux';
import { FeedAPI } from "../api";

import Navbar from './Navbar'


function FeedContent() {
    const [content, setContent] = useState([{idx: 0, thought:'', quotationText:'', quotationOrigin:'', owner: { userId: 'none', userDisplayName: 'none'}, date: '', type: 1}])

    const fetchFeed = async () => {
        const feedIdx = Number(location.pathname.split('/')[2])
        const getFeedData = await FeedAPI.getFeed(feedIdx, {})

        setContent([{...getFeedData.data.result[0]}])
    }

    useEffect(() => {
        fetchFeed()
    }, [])

    return (
        <Grid container spacing={3}>
            <Grid item xs md>
            </Grid>
            <Grid item xs={10} md={6} sx={{ marginTop: "6rem" }}>
                <Navbar></Navbar>

                {content.map(feed => (
                    <FeedBody feed={feed}></FeedBody>
                ))}

            </Grid>
            <Grid item xs md>
            </Grid>
        </Grid>
    );

}

export default FeedContent;