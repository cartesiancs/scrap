
import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

function CropImage({ imageUrl, setImageCanvas }) {
  const cropperRef = useRef(null);
  const [croppedImage, setCroppedImage]: any = useState(null);

  const onCrop = () => {
    const imageElement: any = cropperRef?.current;
    // const cropper = imageElement?.cropper;
    // const blobUrl = cropper.getCroppedCanvas().toDataURL()
    // setCroppedImage(blobUrl)
    setImageCanvas(imageElement.cropper.getCroppedCanvas())
  };

  return (
    <div>
      <Cropper src={imageUrl} crop={onCrop} ref={cropperRef} />
      <img style={{ display: 'none' }} src={croppedImage} />
    </div>
  );
}



export { CropImage }