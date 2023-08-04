
import React, { useEffect, useState } from "react";

import { FeedInput } from './Feed'


import Navbar from './Navbar'
import CheckSignin from './CheckSignin'
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

import Tesseract from 'tesseract.js';





function FeedWrite() {


    const [recognizeText, setRecognizeText] = useState('')


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

                <FeedInput defaultQuotationText={recognizeText}></FeedInput>

                <TakePicture setRecognizeText={setRecognizeText}></TakePicture>

                
            </Box>

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
            <Button onClick={handleClickButton}>이미지 가져오기</Button>
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
        <h1>{progress}%</h1>
    )
}

export default FeedWrite;