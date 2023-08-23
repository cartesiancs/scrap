
import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Grid, Card, CardContent, Typography, Box, Skeleton, IconButton, Avatar, Menu, MenuItem, Tabs, Tab } from '@mui/material';
import { Popup } from './Alert'
import { FeedBody, FeedSearchInput } from './Feed'
import { useDispatch, useSelector } from 'react-redux';
import { FeedAPI } from "../api";

import Navbar from './Navbar'
import { Link } from "react-router-dom";


function FeedSearch() {
    const [content, setContent] = useState([{idx: 0, thought:'', quotationText:'', quotationOrigin:'', owner: { userId: 'none', userDisplayName: 'none'}, date: '', type: 1}])
    const [searchValue, setSearchValue] = useState(location.pathname.split('/')[2])



  
    const fetchFeed = async () => {
        const getFeedData = await FeedAPI.search({ sentence: searchValue })

        setContent(getFeedData.data)
    }

    const searchBook = async () => {
        const getFeed = await FeedAPI.searchBook({ bookTitle: searchValue })
        console.log(getFeed)
        setContent(getFeed.data.result)

    }

    const handleClickBook = () => {
        searchBook()
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue == 1) {
            searchBook()
        }

        if (newValue == 0) {
            fetchFeed()
        }
    };

    useEffect(() => {
        fetchFeed()
    }, [])


    return (
        <Grid container spacing={3}>
            <Grid item xs md>
            </Grid>
            <Grid item xs={10} md={6} sx={{ marginTop: "6rem" }}>
                <Navbar></Navbar>


                <FeedSearchInput value={searchValue}></FeedSearchInput>

                <FeedSearchTab onChange={handleTabChange}></FeedSearchTab>


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

type FeedSearchTabType = {
    onChange?: any
    tabValue?: any
}

function FeedSearchTab({ tabValue, onChange }: FeedSearchTabType) {
    return (
        <Tabs value={tabValue} onChange={onChange} centered>
            <Tab label="검색" />
            <Tab label="도서" />
        </Tabs>
    )
}

export default FeedSearch;