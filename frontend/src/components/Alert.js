import React, { useState } from 'react'
import { Snackbar } from '@material-ui/core';
import { Alert as AlertSnackbar } from '@material-ui/lab';

export function Alert({message, variant}) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={ {vertical: 'top', horizontal: 'center'} }>
                <AlertSnackbar elevation={6} variant="filled" onClose={handleClose} severity={variant}>
                    {message}
                </AlertSnackbar>
            </Snackbar>
        </div>
    )
}

