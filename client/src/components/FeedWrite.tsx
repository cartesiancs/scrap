
import React, { useEffect, useRef, useState } from "react";

import { FeedInput } from './Feed'


import Navbar from './Navbar'
import CheckSignin from './CheckSignin'
import { Backdrop, Box, Button, CircularProgress, Drawer, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { CropImage } from "./CropImage";

// import Tesseract from 'tesseract.js';
import axios from "axios"

import { OcrAPI } from "../api";
import { AlertDialog } from "./Alert";



type Anchor = 'top' | 'left' | 'bottom' | 'right';

function FeedWrite() {
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [recognizeText, setRecognizeText] = useState('')    
    const [alertDialogTrigger, setAlertDialogTrigger] = useState(0)

    const [imageFile, setImageFile] = useState<any>()
    const [imageFileUrl, setImageFileUrl] = useState('')
    const [cropImageCanvas, setImageCanvas]: any = useState('')

    const [listState, setListState] = React.useState({
        bottom: false
    });

    const fileUpload: any = useRef()
    

    
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

            <ListButton onClick={handleClickButton}>이미지 가져오기</ListButton>
            <ListButton>수동으로 입력</ListButton>

        </Box>
    );

    const handleCropButtonClick = async () => {
        setAlertDialogTrigger( -1 )

        const blobImageObject: any = await new Promise((resolve, reject) => {
            cropImageCanvas.toBlob((blob) => {
                if (!blob) {
                  console.error('Canvas is empty');
                  return;
                }
                blob.name = 'a.jpg';
    
                setBackdropOpen(true)

                resolve(blob)

            }, 'image/jpeg');
        })

        const blobImage = new File([blobImageObject], blobImageObject.name, { type: blobImageObject.type });
    
        const formData = new FormData();
        formData.append("file", blobImage);

        const response = await OcrAPI.requestOCR({
            formData: formData
        })

        setRecognizeText(response.data)
    }

    const getFile = () => {
        const getFileObject = new Promise((response, reject): any => {
            let input = document.createElement('input');
            input.type = 'file';
            input.setAttribute('accept', 'image/*')

            // input.onchange = (e: any) => { 

            // }

            console.log(input)

            input.addEventListener("change", (e: any) => {
                let file = e.target.files[0]; 
                let objectURL = window.URL.createObjectURL(file);
                console.log(e)

                // setBackdropOpen(true)

    
                response({
                    object: file,
                    url: objectURL
                })
            });
    
            input.click();
        })

        return getFileObject
    }



    const handleClickButton = async () => {


        fileUpload.current.onchange = (e: any) => {
            let file = e.target.files[0]; 
            let objectURL = window.URL.createObjectURL(file);

            const result = {
                object: file,
                url: objectURL
            }


            setImageFile(result.object)
            setImageFileUrl(result.url)

            setAlertDialogTrigger(1 + Math.random()) 
        }


        fileUpload.current.click();
    }


    useEffect(() => {
        setListState({ ...listState, bottom: true });
    }, [])

    useEffect(() => {
        if (recognizeText != '') {
            setBackdropOpen(false);
        }
    }, [recognizeText])

    // useEffect(() => {
    //     if (imageFileUrl != '') {
    //         setAlertDialogTrigger( alertDialogTrigger + 1 )
    //     }
    // }, [imageFileUrl])

    return (
        <CheckSignin>
            <BackdropProgress isOpen={backdropOpen}></BackdropProgress>

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

            <Box sx={{ marginTop: '5rem', marginBottom: '5rem', display: listState.bottom ? 'none' : 'block' }}>
                <FeedInput defaultQuotationText={recognizeText}></FeedInput>
            </Box>

            <input type="file" id="fileUpload" ref={fileUpload} accept='image/*' style={{ display: 'none' }} />


            <br />


            <AlertDialog trigger={alertDialogTrigger} title="Image Crop">
                <CropImage setImageCanvas={setImageCanvas} imageUrl={imageFileUrl}></CropImage>
                <Button variant="contained" onClick={handleCropButtonClick} sx={{ marginTop: '1rem', width: '100%' }} disableElevation>자르기</Button>

            </AlertDialog>


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



function BackdropProgress({ isOpen }) {
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: 10000 }}
            open={isOpen}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}


function ProcessImageRecognize({ setRecognizeText, isProcess, file }) {

    const [progress, setProgress] = useState(0)
    
    useEffect(() => {
        if (isProcess) {
            // Tesseract.recognize(
            //     url,
            //     'kor',
            //     { logger: (m: any) => {
            //         setProgress(m.progress * 100)
            //     } }
            // ).then(({ data: { text } }) => {
            //     console.log(text);
                
            //     setRecognizeText(text)
            // })

            const formData = new FormData();
            console.log("dd", file)
            formData.append("files", file);

            axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/recognize',
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: console
            });
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