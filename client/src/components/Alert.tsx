import React, { useEffect, useState } from "react";
import { Button, Box, Grid, TextField, Stack, Alert, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';


function Popup(props) {
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertSeverity, setAlertSeverity]: any = React.useState(props.severity);
    const [alertMessage, setAlertMessage] = React.useState(props.message);

    useEffect(() => {
        console.log(props.trigger)
        if (props.trigger > 0) {
            showAlert()
        }
    }, [props.trigger])

    const handleCloseAlert = () => {
        setOpenAlert(false);
    }
    
    const showAlert = () => {
        setOpenAlert(true)
    }

    return (

        <Snackbar
        open={openAlert}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}>

            <Alert severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMessage}
            </Alert>
        </Snackbar>
    )
}


function AlertDialog(props) {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (props.trigger > 0) {
            setOpen(true);
        }
    }, [props.trigger])
  

  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">

          <DialogTitle id="alert-dialog-title">
            {props.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.children}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

export { Popup, AlertDialog }