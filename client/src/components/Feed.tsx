import React, { useEffect, useRef, useState } from "react";
import { TextField, Button, Stack, Grid, Card, CardContent, Typography, Box, Skeleton, IconButton, Avatar, Menu, MenuItem, InputAdornment, List, ListSubheader, Autocomplete, CircularProgress } from '@mui/material';
import { Popup, AlertDialog } from './Alert'
import { useDispatch, useSelector } from 'react-redux';
import { push, unshift, remove, clear } from '../features/feedSlice';
import { Link } from "react-router-dom"
import { FeedAPI, BookAPI } from "../api";
import { LocalStorageJSON } from "../utils/localStorage"


import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@mui/icons-material/Search';

function Feed() {
    const dispatch = useDispatch();

    const isLogin = useSelector((state: any) => state.auth.isLogin);
    const feeds = useSelector((state: any) => state.feed.feeds);

    const [fetching, setFetching] = useState(0);
    const [fetchingLock, setFetchingLock] = useState(false);
    const [fetchingStop, setFetchingStop] = useState(false);

    const handleScroll = (e) => {
        if (fetchingLock) {
            return 0
        }

        if (document.documentElement.scrollTop + document.documentElement.clientHeight + 100 > document.documentElement.scrollHeight) {
            setFetchingLock(true)
            setFetching( fetching + 10 )

            setTimeout(() => {
                setFetchingLock(false)

            }, 1000);
        }
    }

    useEffect(() => {
        dispatch(clear({}))

    }, [])
    

    useEffect(() => {
        if (!fetchingStop) {
            const loadFeedData = async () => {

                let getFeeds = await FeedAPI.getFeed(fetching, {
                    isrange: 'true',
                    range: 10,
                    order: "DESC"
                })
    
                if (getFeeds.data.result.length == 0) {
                    setFetchingStop(true)
                }

                for (let index = 0; index < getFeeds.data.result.length; index++) {
                    const element = getFeeds.data.result[index];

                    const isQuotationNull = element.quotation == null
                    const quotation = isQuotationNull ? null : {
                        ...element.quotation
                    }
                    
                    dispatch(push({
                        idx: element.idx, 
                        thought: element.thought,
                        quotationText: element.quotationText,
                        quotation: quotation,
                        owner: element.owner, 
                        date: element.date, 
                        type: element.type, 
                    }))
                }
            };
    
            loadFeedData()  
        }
    }, [fetching])


    document.addEventListener('scroll', handleScroll)

    if (isLogin) {
        return (
            <Grid container sx={{ marginTop: "1rem" }} justifyContent="center" spacing={3}>
                <Grid item xs={12} md={6}>

                    <FeedSearchInput></FeedSearchInput>

                    {feeds.map(feed => (
                        <FeedBody feed={feed}></FeedBody>
    
                    ))}
                    <FeedSkeleton></FeedSkeleton>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container sx={{ marginTop: "1rem" }} justifyContent="center" spacing={3}>
            <Grid item xs={12} md={6}>

                <FeedSearchInput></FeedSearchInput>


                {feeds.map(feed => (
                    <FeedBody feed={feed}></FeedBody>

                ))}
                <FeedSkeleton></FeedSkeleton>
            </Grid>
        </Grid>
    );

}

type FeedInputPropsType = {
    defaultQuotationText?: string
}

function FeedInput({ defaultQuotationText }: FeedInputPropsType) {
    const dispatch = useDispatch();

    const [inputs, setInputs] = useState({
        thought: '',
        quotationText: '',
        quotationOrigin: '',
        quotation: {
            description: '1',
            author: '',
            publishYear: '',
            coverImage: '',
            url: '',
            type: 1
        }
    })

    const { thought, quotationText, quotationOrigin } = inputs

    const quotationOriginRef: any = useRef()

    const [alertTrigger, setAlertTrigger] = useState(0)
    const [alertSuccessTrigger, setAlertSuccessTrigger] = useState(0)

    const [quotationOptions, setQuotationOptions] = useState([])
    const [openQuotationOptions, setOpenQuotationOptions] = useState(false);

    
    const [countDelay, setCountDelay] = useState(3);

    useEffect(() => {
      const id = setInterval(() => {
        setCountDelay(countDelay => countDelay - 1);
      }, 1000);
      return () => clearInterval(id);
    }, []);

    useEffect(() => {
        intervalPatchBook()
    }, [countDelay])

    const intervalPatchBook = () => {
        if (countDelay == 0 && inputs.quotationOrigin != '') {
            patchBooks()
        }
    }

    const handleChange = (e) => {
        const { value, name } = e.target;
        setInputs({
          ...inputs,
          [name]: value
        });

        if (name == 'quotationOrigin') {
            setCountDelay(3)
            setOpenQuotationOptions(true)
            if (value == '') {
                setOpenQuotationOptions(false)
            }

        }
    }

    const handleClick = () => {
        if (inputs.thought.length > 1000) {
            setAlertTrigger(alertTrigger + 1)
            return 0
        }

        if (inputs.quotationText.length == 0) {
            return 0
        }
    
        FeedAPI.insertFeed({
            thought: thought,
            quotationText: quotationText,
            quotationTitle: quotationOrigin,
            quotation: {
                description: inputs.quotation.description,
                author: inputs.quotation.author,
                publishYear: inputs.quotation.publishYear,
                coverImage: inputs.quotation.coverImage,
                url: inputs.quotation.url,
                type: inputs.quotation.type
            }
        })
        
        setInputs({
            thought: '',
            quotationText: '',
            quotationOrigin: '',
            quotation: {
                description: '',
                author: '',
                publishYear: '',
                coverImage: '',
                url: '',
                type: 1
            }
        })

        const savedBookValue = {
            label: quotationOrigin,
            author: inputs.quotation.author,
            coverImage: inputs.quotation.coverImage,
            description: inputs.quotation.description,
            publishYear: inputs.quotation.publishYear,
            url: inputs.quotation.url,
            type: inputs.quotation.type
        }

        saveBookStorage(savedBookValue)

        setAlertSuccessTrigger(alertSuccessTrigger + 1)
    }

    const handleQuotationSelectChange = (e, values) => {
        console.log(values)
        setInputs({
            ...inputs,
            quotationOrigin: values.label,
            quotation: {
                description: values.description,
                author: values.author,
                publishYear: values.publishYear,
                coverImage: values.coverImage,
                url: values.url,
                type: values.type,
            }

        });
    }

    const isExistBookStorage = async (label) => {
        const store = new LocalStorageJSON()
        const isExistStorage = await store.exist("savedBooks")

        if (isExistStorage != true) {
            return false
        } 

        let values = await store.get("savedBooks")
        let isExist = false

        for (let index = 0; index < values.length; index++) {
            if (values[index].label == label) {
                isExist = true
            }
        }

        return isExist
    }

    const saveBookStorage = async (savedBookValue) => {
        
        const store = new LocalStorageJSON()
        const isExist = await store.exist("savedBooks")

        if (isExist == true) {
            const isExistValue = await isExistBookStorage(savedBookValue.label)
            if (!isExistValue) {
                let values = await store.get("savedBooks")
                values.push(savedBookValue)
                await store.set("savedBooks", values)
            }
        } else {
            const setValue = await store.set("savedBooks", [savedBookValue])
        }

    }

    const getSavedBookStorege = async () => {
        const store = new LocalStorageJSON()
        const isExist = await store.exist("savedBooks")

        if (isExist == false) {
            return []
        }

        const getValue = await store.get("savedBooks")
        return getValue
    }

    const loadSavedBooks = async () => {
        const savedBooks = await getSavedBookStorege()
        const bookArray = savedBooks.map(book => {
            return {
                label: book.label,
                author: book.author,
                coverImage: book.coverImage,
                description: book.description,
                publishYear: book.publishYear,
                url: book.url,
                type: 2
            }
        })

        console.log(bookArray)

        setQuotationOptions(bookArray)
    }

    const patchBooks = async () => {

        const response = await BookAPI.get({
            title: inputs.quotationOrigin
        })

        const bookArray = response.books.map(book => {
            return {
                label: book.title,
                author: book.author[0],
                coverImage: book.coverImage,
                description: book.description,
                publishYear: book.publishYear.substr(0, 4),
                url: book.url,
                type: 2
            }
        })

        setQuotationOptions(bookArray)
        setOpenQuotationOptions(false)
    }

    
    useEffect(() => {
        const insertQuotationText: string = defaultQuotationText || ''

        setInputs({
            ...inputs,
            ['quotationText']: insertQuotationText
        });
    }, [defaultQuotationText])

    useEffect(() => {
        loadSavedBooks()
    }, [])

    return (
        <Box>
            <Stack sx={{ marginTop: "1rem", marginBottom: "2rem" }} spacing={1}>
                <Autocomplete
                    freeSolo
                    disablePortal
                    options={quotationOptions}
                    onChange={handleQuotationSelectChange}
                    value={inputs.quotationOrigin}
                    renderOption={(props, option: any) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          <img
                            loading="lazy"
                            width="20"
                            src={option.coverImage}
                            alt=""
                          />
                          {option.label}
                        </Box>
                    )}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} onChange={handleChange} inputRef={quotationOriginRef} value={inputs.quotationOrigin} name="quotationOrigin" placeholder="예) 도서명, 사람 이름" variant="filled" label="인용구 출처" InputProps={{
                        ...params.InputProps,

                        endAdornment: (
                          <React.Fragment>
                            {openQuotationOptions ? <CircularProgress color="inherit" size={16} sx={{ position: "relative", top: '-8px' }} /> : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                    }} />}
                />


                <TextField
                    id="outlined-textarea"
                    label="인용구"
                    name="quotationText"
                    placeholder="책 속 구절, 인물의 명언" 
                    onChange={handleChange} 
                    value={quotationText}
                    rows={10}

                    multiline
                />
                <Typography sx={{ fontSize: "0.8rem", textAlign: 'right', color: inputs.quotationText.length < 990 ? "text.primary" : "#fc4242"  }}>{inputs.quotationText.length}/1000</Typography>

                <ToggleInput title={'생각 쓰기'}>
                    <TextField
                        id="outlined-textarea"
                        label="생각"
                        name="thought"
                        placeholder="글귀에 대한 생각" 
                        onChange={handleChange} 
                        value={thought}
                        multiline
                    />
                </ToggleInput>
            </Stack>
            <Button variant="contained" onClick={handleClick} sx={{ marginTop: '1rem', width: '100%' }} disableElevation><SendIcon /> </Button>
            <Popup trigger={alertTrigger} message="길이가 너무 길어요" severity="info"></Popup>
            <Popup trigger={alertSuccessTrigger} message="성공적으로 작성했어요" severity="success"></Popup>

        </Box>

    );
}


// function FeedQuotaionSearch({ title }) {
//     const options = ['The Godfather', 'Pulp Fiction'];


//     // useEffect(() => {
//     //     BookAPI.get({
//     //         title: title
//     //     })
//     // }, [])

//     return (



//     )
// }

function ToggleInput({ children, title }) {
    const [activate, setActivate] = useState(false)

    const handleClick = () => {
        setActivate(true)
    }

    if (activate) {
        return (
            <>
                {children}
            </>
        )  
    }

    return (
        <div>
            <Button sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', padding: "16.5px 14px" }} variant="outlined" onClick={handleClick}><Typography sx={{ flexDirection: 'row' }} >{title}</Typography></Button>
        </div>

    )
}

type FeedBodyType = {
    feed: string
    isShowUsername?: boolean
}

function FeedBody({ feed, isShowUsername = true }) {
    const cutCriteria = 400
    const isDarkmode = useSelector((state: any) => state.app.isDarkmode);
    const [isOverflow, setIsOverflow] = useState(false)
    const typographyStyle = { whiteSpace: 'pre-line', wordWrap: 'break-word', padding: '1rem', backgroundColor: isDarkmode? '#18181a' : '#f5f5f7', fontFamily: 'Gowun Batang' }
    

    if (feed.type == 0) {
        return (
            <></>
        )
    }


    const handleClickMoreView = () => {
        setIsOverflow(false)
    }


    useEffect(() => {
        if (feed.quotationText.length > 0) {
            setIsOverflow(feed.quotationText.length > cutCriteria ? true : false)
        } 
    }, [])

    if (!isShowUsername) {  
        return (
            <Box sx={{ marginBottom: '2rem', padding: '0rem', backgroundColor: isDarkmode? '#1d1e1f' : '#ebebed', borderRadius: '0.3rem' }}>
                {isOverflow ? (
                    <Box sx={{fontSize: 18, ...typographyStyle}} color="text.secondary">
                        {feed.quotationText.substr(0, cutCriteria)} 
                        <Typography onClick={handleClickMoreView}>(더보기)</Typography>
                    </Box>

                    ) : (
                    <Box sx={{fontSize: 18, ...typographyStyle}} color="text.secondary">
                        {feed.quotationText}
                        <br /> 
                        <Typography sx={{ fontSize: "0.9rem", marginTop: '1.3rem', fontFamily: 'Gowun Batang' }}>_<FeedQuotation quotation={feed.quotation}></FeedQuotation></Typography>
                        
        
                    </Box>
                )}

            </Box>
        )
    }


    return (
        <Box sx={{ marginBottom: '2rem', padding: '0rem', backgroundColor: isDarkmode? '#1d1e1f' : '#ebebed', borderRadius: '0.3rem' }}>
            <Box sx={{ paddingTop: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <FeedProfile feed={feed}></FeedProfile>

            </Box>

            {isOverflow ? (
                <Box sx={{fontSize: 18, ...typographyStyle}} color="text.secondary">
                    {feed.quotationText.substr(0, cutCriteria)} 
                    <Typography onClick={handleClickMoreView}>(더보기)</Typography>
                </Box>

                ) : (
                <Box sx={{fontSize: 18, ...typographyStyle}} color="text.secondary">
                    {feed.quotationText}
                    <br /> 
                    <Typography sx={{ fontSize: "0.9rem", marginTop: '1.3rem', fontFamily: 'Gowun Batang' }}>_<FeedQuotation quotation={feed.quotation}></FeedQuotation></Typography>
                    
    
                </Box>
            )}



            {feed.thought == '' ? (
                <></>
            ) : (
                <Box sx={{ fontSize: 14, padding: '1rem', whiteSpace: 'pre-line', wordWrap: 'break-word' }} color="text.secondary">
                    {feed.thought}
                </Box>
            )}



        </Box>
    )
}


function FeedQuotation({ quotation }: any) {
    if (quotation == null) {
        return (
            '출처 없음'
        )
    }
    return (
        <>
        {quotation.title}
        </>
        
    )
}


function FeedProfile({ feed }) {
    const dateSplit = feed.date.split('.')

    const getElapsedTime = () => {
        const feedTime = new Date(dateSplit[0], dateSplit[1] - 1, dateSplit[2], dateSplit[3], dateSplit[4], dateSplit[5]).getTime()
        const nowTime = new Date().getTime()

        const calcTime = {
            "년 전": 1000 * 60 * 60 * 24 * 365,
            "달 전": 1000 * 60 * 60 * 24 * 30,
            "일 전": 1000 * 60 * 60 * 24,
            "시간 전": 1000 * 60 * 60,
            "분 전": 1000 * 60
        }

        for (const key in calcTime) {
            if (Object.prototype.hasOwnProperty.call(calcTime, key)) {
                const element = calcTime[key];

                const diffTime = Math.floor((nowTime - feedTime) / calcTime[key])
                if (diffTime > 0) {
                    return `${diffTime}${key}`
                }
            }
        }
        return "방금 전"
    }


    return (
        <Box sx={{ flexGrow: 1, overflow: 'hidden', marginBottom: "1rem", alignContent: 'center' }}>
            <Grid container wrap="nowrap" spacing={2} sx={{ alignContent: 'center', alignItems: 'center' }}>
                <Grid item>
                    <Link to={'/@' + feed.owner.userId}>
                        <Avatar sx={{ width: '2rem', height: '2rem', fontSize: '1rem' }}>{feed.owner.userDisplayName.slice(0, 1)}</Avatar>

                    </Link>
                </Grid>

                <Grid item xs zeroMinWidth sx={{ alignContent: 'center'}}>
                <Link to={'/@' + feed.owner.userId}>
                <Typography sx={{ fontSize: '1rem' }} noWrap>{feed.owner.userDisplayName}</Typography>

                </Link>
                    <Typography sx={{ fontSize: '0.7rem' }} color="text.secondary" noWrap>{getElapsedTime()}</Typography>

                </Grid>
                <Grid item xs zeroMinWidth sx={{ justifyContent: 'flex-end',  }}>
                    <Typography sx={{ textAlign: 'right'}} noWrap>
                        <FeedMenu feed={feed}></FeedMenu>
                    </Typography>
                </Grid>
            </Grid>   
        </Box>
    )
}


function FeedMenu({ feed }) {
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [alertTrigger, setAlertTrigger] = useState(0)
    const [alertDialogTrigger, setAlertDialogTrigger] = useState(0)
    const [alertCopyTrigger, setAlertCopyTrigger] = useState(0)

    const isLogin = useSelector((state: any) => state.auth.isLogin);
    const userId = useSelector((state: any) => state.auth.userId);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDelete = async () => {
        const deleteThisFeed = await FeedAPI.deleteFeed(feed.idx)

        dispatch(remove({
            idx: feed.idx
        }))

        if (deleteThisFeed.status == 1) {
            setAlertTrigger(alertTrigger + 1)
        }

        handleClose()
    }

    const handleShowInfo = () => {
        setAlertDialogTrigger(alertDialogTrigger + 1)
        handleClose()
    }


    const handleClickShareButton = () => {
        let text = location.origin + '/feed/' + feed.idx;
 
        navigator.clipboard.writeText(text)
        .then(() => {
            setAlertCopyTrigger( alertCopyTrigger + 1 )
        })
        .catch(err => {
            console.error('Error in copying text: ', err);
        });
    }

    return (
        <>
        <IconButton
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick} 
        aria-label="delete" 
        size="small">
            <MoreVertIcon sx={{ fontSize: '1.2rem' }}></MoreVertIcon>
        </IconButton>

        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}>

            <MenuItem color="primary" onClick={handleShowInfo}>피드 정보</MenuItem>
            <MenuItem color="primary" onClick={handleClickShareButton}>링크 복사</MenuItem>

            {(isLogin && feed.owner.userId == userId) ? (
                <MenuItem sx={{ color: "#e64840" }} onClick={handleDelete}>삭제</MenuItem>
               
            ) : (
                <></>
            )}
        </Menu>

        <Popup trigger={alertTrigger} message="삭제 완료" severity="success"></Popup>
        <Popup trigger={alertCopyTrigger} message="성공적으로 복사했어요" severity="success"></Popup>

        <AlertDialog trigger={alertDialogTrigger} title="피드 정보">
            <p>{feed.date}</p>
            <TextField
                label="주소"
                sx={{ m: 1, width: '25ch' }}
                defaultValue={location.origin + '/feed/' + feed.idx}

                InputProps={{
                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}/>
        </AlertDialog>
        </>

    )
}


type FeedActionButtonType = {
    children: any
    onClick?: any
}

type FeedSearchInputType = {
    value?: string
}

function FeedActionButton({ children, onClick }: FeedActionButtonType) {
    return (
        <IconButton aria-label="delete" onClick={onClick}>
            {children}
        </IconButton>
    )
}

function FeedSearchInput({ value = '' }: FeedSearchInputType) {
    const [searchValue, setSearchValue] = useState(value)

    const handleSubmit = () => {
        location.href = '/search/'+searchValue
    }

    const handleOnchange = (e) => {
        setSearchValue(e.target.value)
    }

    const handleOnKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }


    return (
        <TextField 
            sx={{ width: '100%', marginBottom: "3rem" }}
            label="글 검색" 
            variant="outlined"
            onSubmit={handleSubmit}
            onChange={handleOnchange}
            onKeyDown={handleOnKeyDown}
            value={decodeURI(searchValue)}
            InputProps={{endAdornment: <SearchIcon />}}
        />

    )
}

function FeedSkeleton() {
    return (
        <Card sx={{ marginBottom: '1rem' }}>
            <CardContent>
                <Box sx={{ fontSize: 14, whiteSpace: 'pre-line', wordWrap: 'break-word' }} color="text.secondary">
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                </Box>

            </CardContent>
        </Card>
    )
}
  
export default Feed;
export { FeedBody, FeedInput, FeedSearchInput }