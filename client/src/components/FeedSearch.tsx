
import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Grid, Card, CardContent, Typography, Box, Skeleton, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { Popup } from './Alert'
import { FeedBody } from './Feed'
import { useDispatch, useSelector } from 'react-redux';
import { FeedAPI } from "../api";

import Navbar from './Navbar'
import { Link } from "react-router-dom";


function FeedSearch() {
    const [content, setContent] = useState([{idx: 0, thought:'', quotationText:'', quotationOrigin:'', owner: { userId: 'none', userDisplayName: 'none'}, date: '', type: 1}])

    const fetchFeed = async () => {
        const searchValue = location.pathname.split('/')[2]
        const getFeedData = await FeedAPI.search({ sentence: searchValue })

        console.log(getFeedData)

        setContent(getFeedData.data)
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
                    <Link to={'/feed/'+String(feed.idx)}>
                    <FeedBody feed={feed} isShowUsername={false}></FeedBody>

                    </Link>
                ))}

                <br />

            </Grid>
            <Grid item xs md>
            </Grid>
        </Grid>
    );

}

export default FeedSearch;