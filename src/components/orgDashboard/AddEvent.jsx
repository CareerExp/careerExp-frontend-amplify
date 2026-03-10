import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    InputAdornment,
    Tooltip,
    CircularProgress,
    FormControl,
    Select,
    MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import EditIcon from '@mui/icons-material/Edit';
import { fonts } from '../../utility/fonts';
import { uploadDocument } from '../../assets/assest';
import { createEvent, updateEvent, selectEventLoading } from '../../redux/slices/eventSlice';
import { selectToken } from '../../redux/slices/authSlice';
import { notify } from '../../redux/slices/alertSlice';

const AddEvent = ({ onBack, eventToEdit }) => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const isLoading = useSelector(selectEventLoading);

    const [formData, setFormData] = useState({
        title: eventToEdit?.title || '',
        description: eventToEdit?.description || '',
        mode: eventToEdit?.mode || 'ONLINE',
        liveStartDate: eventToEdit?.liveStartDate ? new Date(eventToEdit.liveStartDate).toISOString().split('T')[0] : '',
        liveEndDate: eventToEdit?.liveEndDate ? new Date(eventToEdit.liveEndDate).toISOString().split('T')[0] : '',
        registrationDeadline: eventToEdit?.registrationDeadline ? new Date(eventToEdit.registrationDeadline).toISOString().split('T')[0] : '',
        referenceNumber: eventToEdit?.referenceNumber || '',
        ctaType: eventToEdit?.cta?.type || 'LINK',
        ctaValue: eventToEdit?.cta?.value || '',
        ctaLabel: eventToEdit?.cta?.label || 'Register Now',
        coverImage: null,
    });
    const [imagePreview, setImagePreview] = useState(eventToEdit?.coverImage || null);
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

        if (!formData.title || !formData.description || !formData.mode || !formData.liveStartDate || !formData.liveEndDate || !formData.ctaValue) {
            dispatch(notify({ message: "Please fill all required fields", type: "error" }));
            return;
        }

        if (!token) {
            dispatch(notify({ message: "You must be logged in to create events", type: "error" }));
            return;
        }

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('mode', formData.mode);
            data.append('liveStartDate', new Date(formData.liveStartDate).toISOString());
            data.append('liveEndDate', new Date(formData.liveEndDate).toISOString());
            if (formData.registrationDeadline) {
                data.append('registrationDeadline', new Date(formData.registrationDeadline).toISOString());
            }
            if (formData.referenceNumber) {
                data.append('referenceNumber', formData.referenceNumber);
            }
            data.append('status', 'LIVE');
            data.append('cta', JSON.stringify({
                type: formData.ctaType,
                value: formData.ctaValue,
                label: formData.ctaLabel || 'Register Now'
            }));

            if (formData.coverImage) {
                data.append('file', formData.coverImage);
            }

            if (eventToEdit) {
                const updateAction = await dispatch(updateEvent({ id: eventToEdit._id, formData: data, token }));
                if (updateEvent.fulfilled.match(updateAction)) {
                    dispatch(notify({ message: "Event updated successfully!", type: "success" }));
                    onBack();
                } else {
                    dispatch(notify({ message: updateAction.payload?.error || "Failed to update event", type: "error" }));
                }
            } else {
                const createAction = await dispatch(createEvent({ formData: data, token }));
                if (createEvent.fulfilled.match(createAction)) {
                    dispatch(notify({ message: "Event created successfully!", type: "success" }));
                    onBack();
                } else {
                    dispatch(notify({ message: createAction.payload?.error || "Failed to create event", type: "error" }));
                }
            }
        } catch (error) {
            console.error("Event creation error:", error);
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
                    {eventToEdit ? 'Edit Event' : 'Add Event'}
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
                                    position: 'relative',
                                    '&:hover .event-edit-image-overlay': {
                                        opacity: 1,
                                    },
                                }}
                            >
                                {imagePreview ? (
                                    <>
                                        <Box
                                            component="img"
                                            src={imagePreview}
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        {eventToEdit && (
                                            <Box
                                                className="event-edit-image-overlay"
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'rgba(0,0,0,0.4)',
                                                    opacity: 0,
                                                    transition: 'opacity 0.2s',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: '50%',
                                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <EditIcon sx={{ fontSize: 24, color: '#BC2876' }} />
                                                </Box>
                                            </Box>
                                        )}
                                    </>
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
                                            Upload Event Picture
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
                                Event title
                            </Typography>
                            <TextField
                                fullWidth
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter Event title"
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

                        {/* Mode & Reference Number */}
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>
                                Event Mode
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="mode"
                                    value={formData.mode}
                                    onChange={handleChange}
                                    sx={{
                                        borderRadius: '90px',
                                        backgroundColor: '#f2f2f2',
                                        height: '54px',
                                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                        fontFamily: fonts.sans,
                                        fontSize: '16px',
                                        color: '#000',
                                        px: 1
                                    }}
                                >
                                    <MenuItem value="ONLINE">Online</MenuItem>
                                    <MenuItem value="HYBRID">Hybrid</MenuItem>
                                    <MenuItem value="IN_PERSON">In-person</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>
                                Reference Number (Optional)
                            </Typography>
                            <TextField
                                fullWidth
                                name="referenceNumber"
                                value={formData.referenceNumber}
                                onChange={handleChange}
                                placeholder="e.g. REF-123"
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
                                placeholder="Event Description"
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

                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>
                                Registration Deadline (Optional)
                            </Typography>
                            <TextField
                                fullWidth
                                type="date"
                                name="registrationDeadline"
                                value={formData.registrationDeadline}
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
                                <Tooltip title="Enter the URL or email where users should be directed when they click the event CTA.">
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
                                {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (eventToEdit ? 'Save Changes' : 'Add New Event')}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Box>
    );
};

export default AddEvent;
