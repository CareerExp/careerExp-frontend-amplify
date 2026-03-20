import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fonts } from '../../utility/fonts';

const SendMessageModal = ({ open, onClose, user, onSend, loading }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '500px',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '20px', color: '#101828' }}>
                    Send a message to {user?.firstName}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '14px', color: '#344054', mb: 1 }}>
                        Message
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#F9FAFB',
                                '& fieldset': { borderColor: '#EAECF0' },
                                '&:hover fieldset': { borderColor: '#D0D5DD' },
                                '&.Mui-focused fieldset': { borderColor: '#BC2876' },
                            },
                            '& .MuiInputBase-input': {
                                fontFamily: fonts.sans,
                                fontSize: '14px',
                                color: '#101828',
                            }
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1.5 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        borderRadius: '90px',
                        textTransform: 'none',
                        fontFamily: fonts.sans,
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#344054',
                        border: '1px solid #D0D5DD',
                        px: 3,
                        py: 1,
                        flex: 1
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={!message.trim() || loading}
                    sx={{
                        borderRadius: '90px',
                        textTransform: 'none',
                        fontFamily: fonts.sans,
                        fontWeight: 600,
                        fontSize: '14px',
                        background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)',
                        color: '#fff',
                        boxShadow: 'none',
                        px: 3,
                        py: 1,
                        flex: 1,
                        '&:hover': { opacity: 0.9, boxShadow: 'none' }
                    }}
                >
                    Send Message
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SendMessageModal;
