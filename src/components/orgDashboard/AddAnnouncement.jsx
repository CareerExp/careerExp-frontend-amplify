import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    Paper,
    InputAdornment,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { fonts } from '../../utility/fonts';
import uploadDocument from '../../assets/uploadDocument.svg';
import { createAnnouncement, selectAnnouncementLoading } from '../../redux/slices/announcementSlice';
import { selectToken } from '../../redux/slices/authSlice';
import { notify } from '../../redux/slices/alertSlice';

const AddAnnouncement = ({ onBack, announcementToEdit }) => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const isLoading = useSelector(selectAnnouncementLoading);

    const [formData, setFormData] = useState({
        title: announcementToEdit?.title || '',
        description: announcementToEdit?.description || '',
        liveStartDate: announcementToEdit?.liveStartDate ? new Date(announcementToEdit.liveStartDate).toISOString().split('T')[0] : '',
        liveEndDate: announcementToEdit?.liveEndDate ? new Date(announcementToEdit.liveEndDate).toISOString().split('T')[0] : '',
        ctaType: announcementToEdit?.cta?.type || 'LINK',
        ctaValue: announcementToEdit?.cta?.value || '',
        ctaLabel: announcementToEdit?.cta?.label || 'Apply Now',
        coverImage: null,
    });
    const [imagePreview, setImagePreview] = useState(announcementToEdit?.coverImage || null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, coverImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleCTATypeChange = (type) => {
        setFormData(prev => ({ ...prev, ctaType: type }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.liveStartDate || !formData.liveEndDate || !formData.ctaValue) {
            dispatch(notify({ message: "Please fill all required fields", type: "error" }));
            return;
        }

        if (!token) {
            dispatch(notify({ message: "You must be logged in to create announcements", type: "error" }));
            return;
        }

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('liveStartDate', new Date(formData.liveStartDate).toISOString());
            data.append('liveEndDate', new Date(formData.liveEndDate).toISOString());
            data.append('status', 'LIVE');
            data.append('cta', JSON.stringify({
                type: formData.ctaType,
                value: formData.ctaValue,
                label: formData.ctaLabel || 'Apply Now'
            }));

            if (formData.coverImage) {
                data.append('file', formData.coverImage);
            }

            if (announcementToEdit) {
                const updateAction = await dispatch(updateAnnouncement({ id: announcementToEdit._id, formData: data, token }));
                if (updateAnnouncement.fulfilled.match(updateAction)) {
                    dispatch(notify({ message: "Announcement updated successfully!", type: "success" }));
                    onBack();
                } else {
                    dispatch(notify({ message: updateAction.payload?.error || "Failed to update announcement", type: "error" }));
                }
            } else {
                const createAction = await dispatch(createAnnouncement({ formData: data, token }));
                if (createAnnouncement.fulfilled.match(createAction)) {
                    dispatch(notify({ message: "Announcement created successfully!", type: "success" }));
                    onBack();
                } else {
                    dispatch(notify({ message: createAction.payload?.error || "Failed to create announcement", type: "error" }));
                }
            }
        } catch (error) {
            console.error("Announcement creation error:", error);
            dispatch(notify({ message: "An unexpected error occurred", type: "error" }));
        }
    };

    return (
        <Box sx={{ p: 4, minHeight: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <IconButton onClick={onBack} sx={{ p: 0 }}>
                    <Box
                        sx={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            border: '1px solid #EAECF0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff'
                        }}
                    >
                        <ArrowBackIcon sx={{ color: '#000' }} />
                    </Box>
                </IconButton>
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 700,
                        fontSize: '26px',
                        color: '#000',
                    }}
                >
                    {announcementToEdit ? 'Edit Announcement' : 'Add Announcement'}
                </Typography>
            </Box>

            {/* Form Container */}
            <Box sx={{ maxWidth: '881px', mx: 'auto', mt: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3.5}>
                        {/* Image Upload Section */}
                        <Grid item xs={12}>
                            <Box
                                onClick={handleUploadClick}
                                sx={{
                                    height: '194px',
                                    borderRadius: '12px',
                                    border: '1px dashed #BC2876',
                                    backgroundColor: '#f2f2f2',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                            >
                                {imagePreview ? (
                                    <Box
                                        component="img"
                                        src={imagePreview}
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <>
                                        <Box
                                            component="img"
                                            src={uploadDocument}
                                            sx={{ width: '140px', height: '140px', mb: -2 }}
                                        />
                                        <Typography
                                            sx={{
                                                fontFamily: fonts.sans,
                                                fontSize: '14px',
                                                color: 'rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            Upload Announcement Picture
                                        </Typography>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                            </Box>
                        </Grid>

                        {/* Title */}
                        <Grid item xs={12}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>
                                Announcement title
                            </Typography>
                            <TextField
                                fullWidth
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter Announcement title"
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '90px',
                                        backgroundColor: '#f2f2f2',
                                        height: '54px',
                                        '& fieldset': { border: 'none' },
                                        px: 2
                                    },
                                    '& .MuiInputBase-input': {
                                        fontFamily: fonts.sans,
                                        fontSize: '16px',
                                        color: '#000',
                                        '&::placeholder': { color: 'rgba(0,0,0,0.5)', opacity: 1 }
                                    }
                                }}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>
                                Description
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Announcement Description"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '24px',
                                        backgroundColor: '#f2f2f2',
                                        '& fieldset': { border: 'none' },
                                        p: 2
                                    },
                                    '& .MuiInputBase-input': {
                                        fontFamily: fonts.sans,
                                        fontSize: '16px',
                                        color: '#000',
                                        '&::placeholder': { color: 'rgba(0,0,0,0.5)', opacity: 1 }
                                    }
                                }}
                            />
                        </Grid>

                        {/* Dates */}
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>
                                Live Start date
                            </Typography>
                            <TextField
                                fullWidth
                                type="date"
                                name="liveStartDate"
                                value={formData.liveStartDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '90px',
                                        backgroundColor: '#f2f2f2',
                                        height: '54px',
                                        '& fieldset': { border: 'none' },
                                        px: 2,
                                        '& input::-webkit-calendar-picker-indicator': {
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: '100%',
                                            height: '100%',
                                            margin: 0,
                                            padding: 0,
                                            cursor: 'pointer',
                                            opacity: 0,
                                        }
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CalendarTodayIcon
                                                sx={{ color: 'rgba(0,0,0,0.5)', fontSize: '20px', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    const input = e.currentTarget.closest('.MuiInputBase-root').querySelector('input');
                                                    if (input.showPicker) input.showPicker();
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>
                                Live End date
                            </Typography>
                            <TextField
                                fullWidth
                                type="date"
                                name="liveEndDate"
                                value={formData.liveEndDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '90px',
                                        backgroundColor: '#f2f2f2',
                                        height: '54px',
                                        '& fieldset': { border: 'none' },
                                        px: 2,
                                        '& input::-webkit-calendar-picker-indicator': {
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: '100%',
                                            height: '100%',
                                            margin: 0,
                                            padding: 0,
                                            cursor: 'pointer',
                                            opacity: 0,
                                        }
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CalendarTodayIcon
                                                sx={{ color: 'rgba(0,0,0,0.5)', fontSize: '20px', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    const input = e.currentTarget.closest('.MuiInputBase-root').querySelector('input');
                                                    if (input.showPicker) input.showPicker();
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* CTA Section */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454' }}>
                                    Add link or email
                                </Typography>
                                <Tooltip title="Enter the URL or email where users should be directed when they click the announcement.">
                                    <InfoOutlinedIcon sx={{ fontSize: '20px', color: '#545454', cursor: 'pointer' }} />
                                </Tooltip>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <TextField
                                    fullWidth
                                    name="ctaValue"
                                    value={formData.ctaValue}
                                    onChange={handleChange}
                                    placeholder="Call to Action"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '90px',
                                            backgroundColor: '#f2f2f2',
                                            height: '54px',
                                            '& fieldset': { border: 'none' },
                                            px: 2
                                        },
                                        '& .MuiInputBase-input': {
                                            fontFamily: fonts.sans,
                                            fontSize: '16px',
                                            color: '#000',
                                            '&::placeholder': { color: 'rgba(0,0,0,0.5)', opacity: 1 }
                                        }
                                    }}
                                />
                                <Box
                                    sx={{
                                        backgroundColor: '#f2f2f2',
                                        borderRadius: '90px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        px: '7px',
                                        height: '54px',
                                        gap: 1
                                    }}
                                >
                                    <IconButton
                                        onClick={() => handleCTATypeChange('LINK')}
                                        sx={{
                                            width: '44px',
                                            height: '44px',
                                            backgroundColor: formData.ctaType === 'LINK' ? '#bc2876' : 'transparent',
                                            '&:hover': { backgroundColor: formData.ctaType === 'LINK' ? '#bc2876' : 'rgba(0,0,0,0.05)' }
                                        }}
                                    >
                                        <LinkIcon sx={{ color: formData.ctaType === 'LINK' ? '#fff' : 'rgba(0,0,0,0.3)' }} />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleCTATypeChange('EMAIL')}
                                        sx={{
                                            width: '44px',
                                            height: '44px',
                                            backgroundColor: formData.ctaType === 'EMAIL' ? '#bc2876' : 'transparent',
                                            '&:hover': { backgroundColor: formData.ctaType === 'EMAIL' ? '#bc2876' : 'rgba(0,0,0,0.05)' }
                                        }}
                                    >
                                        <MailOutlineIcon sx={{ color: formData.ctaType === 'EMAIL' ? '#fff' : 'rgba(0,0,0,0.3)' }} />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    width: '243px',
                                    height: '48px',
                                    borderRadius: '90px',
                                    background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)',
                                    fontFamily: fonts.sans,
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    textTransform: 'none',
                                    textWrap: 'nowrap',
                                    '&:hover': { opacity: 0.9 }
                                }}
                            >
                                {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (announcementToEdit ? 'Save Changes' : 'Add New Announcement')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Box>
    );
};

export default AddAnnouncement;
