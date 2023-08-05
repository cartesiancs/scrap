
import React, { useEffect, useState } from "react";

import { FeedInput } from './Feed'


import Navbar from './Navbar'
import CheckSignin from './CheckSignin'
import { Box, Button, Drawer, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import Tesseract from 'tesseract.js';




type Anchor = 'top' | 'left' | 'bottom' | 'right';

function FeedWrite() {


    const [recognizeText, setRecognizeText] = useState('')

    const [listState, setListState] = React.useState({
        bottom: false
    });
    
    const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
        return;
        }

        setListState({ ...listState, [anchor]: open });
    };
    

    const list = (anchor: Anchor) => (
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >

            <TakePicture setRecognizeText={setRecognizeText}></TakePicture>
            <ListButton>수동으로 입력</ListButton>

        </Box>
    );

      
    useEffect(() => {
        setListState({ ...listState, bottom: true });
    }, [])

    return (
        <CheckSignin>
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

            <Box sx={{ marginTop: '5rem', display: listState.bottom ? 'none' : 'block' }}>
                <FeedInput defaultQuotationText={recognizeText}></FeedInput>
            </Box>

            {(['bottom'] as const).map((anchor) => (
                <React.Fragment key={anchor}>
                    <Drawer
                    anchor={anchor}
                    open={listState[anchor]}
                    onClose={toggleDrawer(anchor, false)}
                    >
                    {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </CheckSignin>

    );

}

function TakePicture({ setRecognizeText }) {
    const [isProcess, setProcess] = useState(false)
    const [imageBlobUrl, setImageBlobUrl] = useState('')

    const getFile = async (): Promise<any> => {
        const getFileUrl = new Promise((response, reject): any => {
            let input = document.createElement('input');
            input.type = 'file';
    
            input.onchange = (e: any) => { 
                let file = e.target.files[0]; 
                let objectURL = URL.createObjectURL(file);
    
                response(objectURL)
            }
    
            input.click();
        })

        return getFileUrl

    }

    const handleClickButton = async () => {
        const blobUrl: string = await getFile()
        setImageBlobUrl(blobUrl)
        setProcess(true)
        console.log(blobUrl)
    }

    return (
        <Box>
            <ListButton onClick={handleClickButton}>이미지 가져오기</ListButton>
            <ProcessImageRecognize setRecognizeText={setRecognizeText} isProcess={isProcess} url={imageBlobUrl}></ProcessImageRecognize>
        </Box>
    )
}


function ProcessImageRecognize({ setRecognizeText, isProcess, url }) {

    const [progress, setProgress] = useState(0)
    
    useEffect(() => {
        if (isProcess) {
            Tesseract.recognize(
                url,
                'kor',
                { logger: (m: any) => {
                    setProgress(m.progress * 100)
                } }
            ).then(({ data: { text } }) => {
                console.log(text);
                
                setRecognizeText(text)
            })
        }
          
    }, [isProcess])

    return (
        <Typography sx={{ display: 'none' }}>{progress}%</Typography>
    )
}

type ListButtonType = {
    children: any
    onClick?: any
}

function ListButton({ children, onClick }: ListButtonType) {

    return (
        <Button sx={{ padding: '1rem', width: "100%", fontSize: "1.2rem" }} onClick={onClick}>{children}</Button>

    )
}

export default FeedWrite;