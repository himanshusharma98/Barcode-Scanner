import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography>Are you sure you want to delete this record?</Typography>
            </DialogContent>
            <DialogActions>
                <IconButton onClick={onClose} color="primary">
                    <CancelIcon />
                </IconButton>
                <IconButton onClick={onConfirm} color="error">
                    <DeleteIcon />
                </IconButton>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
