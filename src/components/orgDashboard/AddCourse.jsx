import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Chip,
    CircularProgress,
    InputAdornment,
    Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinkIcon from '@mui/icons-material/Link';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { fonts } from '../../utility/fonts';
import { categories } from '../../utility/category';
import { uploadDocument } from '../../assets/assest';
import { createCourse, updateCourse, selectCourseLoading } from '../../redux/slices/courseSlice';
import { selectToken } from '../../redux/slices/authSlice';
import { notify } from '../../redux/slices/alertSlice';

const AddCourse = ({ onBack, courseToEdit }) => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const isLoading = useSelector(selectCourseLoading);

    const [formData, setFormData] = useState({
        title: courseToEdit?.title || '',
        description: courseToEdit?.description || '',
        category: courseToEdit?.category || (categories?.[0] ?? ''),
        priceType: courseToEdit?.priceType || 'FREE',
        price: courseToEdit?.price ?? '',
        currency: courseToEdit?.currency || 'INR',
        referenceNumber: courseToEdit?.referenceNumber || '',
        durationValue: courseToEdit?.duration?.value ?? '',
        durationUnit: courseToEdit?.duration?.unit || 'weeks',
        deliveryMode: courseToEdit?.deliveryMode || 'ONLINE',
        ctaType: courseToEdit?.cta?.type || 'LINK',
        ctaValue: courseToEdit?.cta?.value || '',
        ctaLabel: courseToEdit?.cta?.label || 'Enroll Now',
        coverImage: null,
    });

    const [whatsIncluded, setWhatsIncluded] = useState(courseToEdit?.whatsIncluded || []);
    const [newItemIncluded, setNewItemIncluded] = useState('');
    const [whatYouWillLearn, setWhatYouWillLearn] = useState(courseToEdit?.whatYouWillLearn || []);
    const [newItemLearn, setNewItemLearn] = useState('');
    const [imagePreview, setImagePreview] = useState(courseToEdit?.coverImage || null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, coverImage: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => fileInputRef.current?.click();
    const handleCTATypeChange = (type) => setFormData((prev) => ({ ...prev, ctaType: type }));

    const addItem = (list, setList, item, setItem) => {
        if (item.trim()) {
            setList([...list, item.trim()]);
            setItem('');
        }
    };
    const removeItem = (list, setList, index) => setList(list.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description) {
            dispatch(notify({ message: 'Please fill title and description', type: 'error' }));
            return;
        }
        if (formData.priceType === 'PAID' && !formData.price) {
            dispatch(notify({ message: 'Please enter the price for paid course', type: 'error' }));
            return;
        }
        if (!token) {
            dispatch(notify({ message: 'You must be logged in', type: 'error' }));
            return;
        }

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('priceType', formData.priceType);
            if (formData.priceType === 'PAID') {
                data.append('price', formData.price);
                data.append('currency', formData.currency);
            }
            if (formData.referenceNumber) data.append('referenceNumber', formData.referenceNumber);
            data.append('duration', JSON.stringify({ value: Number(formData.durationValue) || 0, unit: formData.durationUnit }));
            data.append('deliveryMode', formData.deliveryMode);
            data.append('whatsIncluded', JSON.stringify(whatsIncluded));
            data.append('whatYouWillLearn', JSON.stringify(whatYouWillLearn));
            data.append('status', 'PUBLISHED');
            data.append('cta', JSON.stringify({ type: formData.ctaType, value: formData.ctaValue, label: formData.ctaLabel || 'Enroll Now' }));
            if (formData.coverImage) data.append('file', formData.coverImage);

            if (courseToEdit) {
                const updateAction = await dispatch(updateCourse({ id: courseToEdit._id, formData: data, token }));
                if (updateCourse.fulfilled.match(updateAction)) {
                    dispatch(notify({ message: 'Course updated successfully!', type: 'success' }));
                    onBack();
                } else {
                    dispatch(notify({ message: updateAction.payload?.error || 'Failed to update course', type: 'error' }));
                }
            } else {
                const createAction = await dispatch(createCourse({ formData: data, token }));
                if (createCourse.fulfilled.match(createAction)) {
                    dispatch(notify({ message: 'Course created successfully!', type: 'success' }));
                    onBack();
                } else {
                    dispatch(notify({ message: createAction.payload?.error || 'Failed to create course', type: 'error' }));
                }
            }
        } catch (error) {
            dispatch(notify({ message: 'An unexpected error occurred', type: 'error' }));
        }
    };

    return (
        <Box sx={{ p: 4, minHeight: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <IconButton onClick={onBack} sx={{ p: 0 }}>
                    <Box sx={{ width: '44px', height: '44px', borderRadius: '12px', border: '1px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                        <ArrowBackIcon sx={{ color: '#000' }} />
                    </Box>
                </IconButton>
                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '26px', color: '#000' }}>
                    {courseToEdit ? 'Edit Course' : 'Add Course'}
                </Typography>
            </Box>

            <Box sx={{ maxWidth: '881px', mx: 'auto', mt: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3.5}>
                        <Grid item xs={12}>
                            <Box onClick={handleUploadClick} sx={{ height: '194px', borderRadius: '12px', border: '1px dashed #BC2876', backgroundColor: '#f2f2f2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                                {imagePreview ? (
                                    <Box sx={{ width: '100%', height: '100%', position: 'relative', '&:hover .edit-image-overlay': { opacity: 1 } }}>
                                        <Box component="img" src={imagePreview} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <Box
                                            className="edit-image-overlay"
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                backgroundColor: 'rgba(0,0,0,0.4)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0,
                                                transition: 'opacity 0.2s',
                                            }}
                                        >
                                            <Box sx={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <EditIcon sx={{ fontSize: 24, color: '#BC2876' }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                ) : (
                                    <>
                                        <Box component="img" src={uploadDocument} sx={{ width: '140px', height: '140px', mb: -2 }} />
                                        <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>Upload Course Picture</Typography>
                                    </>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Course title</Typography>
                            <TextField fullWidth name="title" value={formData.title} onChange={handleChange} placeholder="Enter course title" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& fieldset': { border: 'none' }, px: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px', color: '#000', '&::placeholder': { color: 'rgba(0,0,0,0.5)', opacity: 1 } } }} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Category (Optional)</Typography>
                            <FormControl fullWidth>
                                <Select name="category" value={formData.category} onChange={handleChange} sx={{ borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, fontFamily: fonts.sans, fontSize: '16px', color: '#000', px: 1 }}>
                                    <MenuItem value="">
                                        <em>Select category</em>
                                    </MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat} sx={{ fontFamily: fonts.sans }}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Reference Number (Optional)</Typography>
                            <TextField fullWidth name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} placeholder="Ref no" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& fieldset': { border: 'none' }, px: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px', color: '#000' } }} />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Description</Typography>
                            <TextField fullWidth multiline rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Enter a detailed description" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '24px', backgroundColor: '#f2f2f2', '& fieldset': { border: 'none' }, p: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px', color: '#000', '&::placeholder': { color: 'rgba(0,0,0,0.5)', opacity: 1 } } }} />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Price Type</Typography>
                            <FormControl fullWidth>
                                <Select name="priceType" value={formData.priceType} onChange={handleChange} sx={{ borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, fontFamily: fonts.sans, fontSize: '16px', color: '#000', px: 1 }}>
                                    <MenuItem value="FREE">Free</MenuItem>
                                    <MenuItem value="PAID">Paid</MenuItem>
                                    <MenuItem value="CUSTOM">Custom</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {formData.priceType === 'PAID' && (
                            <>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Price</Typography>
                                    <TextField fullWidth type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Enter amount" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& fieldset': { border: 'none' }, px: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px', color: '#000' } }} />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Currency</Typography>
                                    <FormControl fullWidth>
                                        <Select name="currency" value={formData.currency} onChange={handleChange} sx={{ borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, fontFamily: fonts.sans, fontSize: '16px', color: '#000', px: 1 }}>
                                            <MenuItem value="INR">INR</MenuItem>
                                            <MenuItem value="USD">USD</MenuItem>
                                            <MenuItem value="AED">AED</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Duration Value</Typography>
                            <TextField fullWidth type="number" name="durationValue" value={formData.durationValue} onChange={handleChange} placeholder="e.g. 4" variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& fieldset': { border: 'none' }, px: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px', color: '#000' } }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Duration Unit</Typography>
                            <FormControl fullWidth>
                                <Select name="durationUnit" value={formData.durationUnit} onChange={handleChange} sx={{ borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, fontFamily: fonts.sans, fontSize: '16px', color: '#000', px: 1 }}>
                                    <MenuItem value="minutes">Minutes</MenuItem>
                                    <MenuItem value="hours">Hours</MenuItem>
                                    <MenuItem value="days">Days</MenuItem>
                                    <MenuItem value="weeks">Weeks</MenuItem>
                                    <MenuItem value="months">Months</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>Delivery Mode</Typography>
                            <FormControl fullWidth>
                                <Select name="deliveryMode" value={formData.deliveryMode} onChange={handleChange} sx={{ borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, fontFamily: fonts.sans, fontSize: '16px', color: '#000', px: 1 }}>
                                    <MenuItem value="ONLINE">Online</MenuItem>
                                    <MenuItem value="OFFLINE">In-person</MenuItem>
                                    <MenuItem value="HYBRID">Hybrid</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>What's Included (List what participants will receive)</Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                                <TextField fullWidth value={newItemIncluded} onChange={(e) => setNewItemIncluded(e.target.value)} placeholder="e.g., Personalized career development action plan" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& fieldset': { border: 'none' }, px: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px' } }} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(whatsIncluded, setWhatsIncluded, newItemIncluded, setNewItemIncluded); } }} />
                                <Button variant="contained" onClick={() => addItem(whatsIncluded, setWhatsIncluded, newItemIncluded, setNewItemIncluded)} sx={{ borderRadius: '90px', minWidth: '100px', background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)' }}><AddIcon /></Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {whatsIncluded.map((item, index) => (
                                    <Chip key={index} label={item} onDelete={() => removeItem(whatsIncluded, setWhatsIncluded, index)} deleteIcon={<DeleteOutlineIcon style={{ color: '#bc2876' }} />} sx={{ fontFamily: fonts.sans, backgroundColor: '#f2f2f2', color: '#545454', fontWeight: 500, borderRadius: '8px', '& .MuiChip-deleteIcon': { color: '#bc2876', '&:hover': { color: '#720361' } } }} />
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 1 }}>What Participants Will Learn</Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                                <TextField fullWidth value={newItemLearn} onChange={(e) => setNewItemLearn(e.target.value)} placeholder="e.g., Identify your core strengths and unique value proposition" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& fieldset': { border: 'none' }, px: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px' } }} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(whatYouWillLearn, setWhatYouWillLearn, newItemLearn, setNewItemLearn); } }} />
                                <Button variant="contained" onClick={() => addItem(whatYouWillLearn, setWhatYouWillLearn, newItemLearn, setNewItemLearn)} sx={{ borderRadius: '90px', minWidth: '100px', background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)' }}><AddIcon /></Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {whatYouWillLearn.map((item, index) => (
                                    <Chip key={index} label={item} onDelete={() => removeItem(whatYouWillLearn, setWhatYouWillLearn, index)} deleteIcon={<DeleteOutlineIcon style={{ color: '#bc2876' }} />} sx={{ fontFamily: fonts.sans, backgroundColor: '#f2f2f2', color: '#545454', fontWeight: 500, borderRadius: '8px', '& .MuiChip-deleteIcon': { color: '#bc2876', '&:hover': { color: '#720361' } } }} />
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454' }}>CTA (Link or Email)</Typography>
                                <Tooltip title="URL or email for enrollment or contact."><InfoOutlinedIcon sx={{ fontSize: '20px', color: '#545454', cursor: 'pointer' }} /></Tooltip>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <TextField fullWidth name="ctaValue" value={formData.ctaValue} onChange={handleChange} placeholder="https://... or email@example.com" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& fieldset': { border: 'none' }, px: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px', color: '#000' } }} />
                                <Box sx={{ backgroundColor: '#f2f2f2', borderRadius: '90px', display: 'flex', alignItems: 'center', px: '7px', height: '54px', gap: 1 }}>
                                    <IconButton onClick={() => handleCTATypeChange('LINK')} sx={{ width: '44px', height: '44px', backgroundColor: formData.ctaType === 'LINK' ? '#bc2876' : 'transparent', '&:hover': { backgroundColor: formData.ctaType === 'LINK' ? '#bc2876' : 'rgba(0,0,0,0.05)' } }}><LinkIcon sx={{ color: formData.ctaType === 'LINK' ? '#fff' : 'rgba(0,0,0,0.3)' }} /></IconButton>
                                    <IconButton onClick={() => handleCTATypeChange('EMAIL')} sx={{ width: '44px', height: '44px', backgroundColor: formData.ctaType === 'EMAIL' ? '#bc2876' : 'transparent', '&:hover': { backgroundColor: formData.ctaType === 'EMAIL' ? '#bc2876' : 'rgba(0,0,0,0.05)' } }}><MailOutlineIcon sx={{ color: formData.ctaType === 'EMAIL' ? '#fff' : 'rgba(0,0,0,0.3)' }} /></IconButton>
                                </Box>
                            </Box>
                            <TextField fullWidth name="ctaLabel" value={formData.ctaLabel} onChange={handleChange} placeholder="Button label (e.g. Enroll Now)" sx={{ mt: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '90px', backgroundColor: '#f2f2f2', height: '54px', '& fieldset': { border: 'none' }, px: 2 }, '& .MuiInputBase-input': { fontFamily: fonts.sans, fontSize: '16px' } }} />
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button type="submit" variant="contained" disabled={isLoading} sx={{ width: '243px', height: '48px', borderRadius: '90px', background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)', fontFamily: fonts.sans, fontWeight: 600, fontSize: '16px', textTransform: 'none', '&:hover': { opacity: 0.9 } }}>
                                {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Box>
    );
};

export default AddCourse;
