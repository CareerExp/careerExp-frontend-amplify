import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Paper,
    TextField,
    InputAdornment,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { fonts } from '../../utility/fonts';
import { uploadDocument, eventsPlaceholder } from '../../assets/assest';
import AddEvent from './AddEvent';
import EventDetail from './EventDetail';
import { fetchMyEvents, getEventById, selectMyEvents, selectEventLoading, deleteEvent } from '../../redux/slices/eventSlice';
import { selectToken } from '../../redux/slices/authSlice';
import { notify } from '../../redux/slices/alertSlice';

const EventCard = ({ event, onEdit, onDelete, onView }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        handleClose();
        onEdit(event);
    };

    const handleDeleteClick = () => {
        handleClose();
        onDelete(event);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'LIVE':
                return {
                    bg: 'rgba(43, 192, 13, 0.3)',
                    color: '#2BC00D'
                };
            case 'UPCOMING':
                return {
                    bg: 'rgba(21, 140, 255, 0.3)',
                    color: '#158CFF'
                };
            case 'EXPIRED':
                return {
                    bg: 'rgba(255, 85, 93, 0.3)',
                    color: '#FF555E'
                };
            case 'DRAFT':
                return {
                    bg: '#F2F4F7',
                    color: '#667085'
                };
            default:
                return {
                    bg: '#F2F4F7',
                    color: '#667085'
                };
        }
    };

    const statusStyles = getStatusStyles(event.status);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB'); // dd/mm/yyyy
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: '16px',
                borderRadius: '20px',
                backgroundColor: '#fff',
                boxShadow: '0px 6px 24px 0px rgba(0,0,0,0.05)',
                border: '1px solid #EAECF0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Image Section */}
            <Box
                sx={{
                    width: '100%',
                    height: '195px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    mb: 2,
                    backgroundColor: '#f2f2f2',
                    position: 'relative'
                }}
            >
                <Box
                    component="img"
                    src={event.banner || event.coverImage || event.image || eventsPlaceholder}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '6px',
                        px: 1.5,
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#101828',
                            textTransform: 'capitalize'
                        }}
                    >
                        {event.mode?.toLowerCase() || 'Online'}
                    </Typography>
                </Box>
            </Box>

            {/* Content Section */}
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontWeight: 600,
                                fontSize: '18px',
                                color: '#101828',
                                mb: 0.5,
                            }}
                        >
                            {event.title}
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontSize: '12px',
                                color: '#9E9E9E',
                            }}
                        >
                            Ref no – {event.referenceNumber || (event._id ? event._id.slice(-8).toUpperCase() : 'N/A')}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleClick}>
                        <MoreVertIcon sx={{ color: '#667085' }} />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 2.5, mb: 2 }}>
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '13px', color: '#BC2876', fontWeight: 500 }}>
                        Live Start : <span style={{ color: 'rgba(0,0,0,0.5)', fontWeight: 400 }}>{formatDate(event.liveStartDate)}</span>
                    </Typography>
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '13px', color: '#BC2876', fontWeight: 500 }}>
                        Live End : <span style={{ color: 'rgba(0,0,0,0.5)', fontWeight: 400 }}>{formatDate(event.liveEndDate)}</span>
                    </Typography>
                </Box>

                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontSize: '14px',
                        color: '#475467',
                        lineHeight: 1.5,
                        mb: 2,
                        height: '42px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {event.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                        sx={{
                            backgroundColor: statusStyles.bg,
                            borderRadius: '10px',
                            px: '11px',
                            py: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontWeight: 500,
                                fontSize: '15px',
                                color: statusStyles.color,
                                textTransform: 'capitalize',
                            }}
                        >
                            {event.status}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: '#F5F5F5',
                            px: '12px',
                            py: '6px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontSize: '11px',
                                fontWeight: 500,
                                color: '#9E9E9E',
                            }}
                        >
                            CTAs received
                        </Typography>
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontSize: '18px',
                                fontWeight: 600,
                                color: '#BC2876',
                            }}
                        >
                            {String(event.totalCtaClicks || event.ctasReceived || 0).padStart(2, '0')}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Button
                variant="outlined"
                fullWidth
                onClick={() => onView(event)}
                sx={{
                    borderRadius: '8px',
                    borderColor: '#D0D5DD',
                    color: '#344054',
                    textTransform: 'none',
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: '14px',
                    py: 1,
                    '&:hover': { backgroundColor: '#F9FAFB', borderColor: '#D0D5DD' }
                }}
            >
                View
            </Button>

            {/* Context Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                elevation={0}
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '12px',
                        minWidth: '160px',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                        border: '1px solid #EAECF0',
                        mt: 1,
                    }
                }}
            >
                <MenuItem onClick={handleEditClick} sx={{ gap: 1.5, py: 1.2 }}>
                    <EditIcon sx={{ fontSize: '18px', color: '#667085' }} />
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', color: '#344054' }}>Edit</Typography>
                </MenuItem>
                <Divider sx={{ my: '0 !important' }} />
                <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, py: 1.2 }}>
                    <DeleteIcon sx={{ fontSize: '18px', color: '#D92D20' }} />
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', color: '#D92D20' }}>Delete</Typography>
                </MenuItem>
            </Menu>
        </Paper>
    );
};

const EmptyState = ({ isSearch }) => (
    <Box sx={{
        textAlign: 'center',
        py: 12,
        backgroundColor: '#fff',
        borderRadius: '20px',
        boxShadow: '0px 6px 24px 0px rgba(0,0,0,0.05)',
        border: '1px solid #EAECF0',
        mt: 2
    }}>
        <Box
            component="img"
            src={uploadDocument}
            sx={{ width: '120px', height: '120px', mb: 3, opacity: 0.2, filter: 'grayscale(100%)' }}
        />
        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '20px', color: '#101828', mb: 1 }}>
            {isSearch ? 'No results found' : 'No events yet'}
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: '16px', color: '#667085', maxWidth: '400px', mx: 'auto' }}>
            {isSearch
                ? "We couldn't find any events matching your search. Try a different keyword."
                : "Get started by creating your first event to engage with students."}
        </Typography>
    </Box>
);

const DeleteConfirmationModal = ({ open, onClose, onConfirm, isLoading }) => (
    <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
            sx: {
                borderRadius: '15px',
                width: '403px',
                height: '255px',
                p: 0,
                position: 'relative',
                overflow: 'hidden'
            }
        }}
    >
        <IconButton
            onClick={onClose}
            sx={{
                position: 'absolute',
                right: '13px',
                top: '13px',
                color: '#000',
                p: 0
            }}
        >
            <CloseIcon sx={{ fontSize: '24px' }} />
        </IconButton>

        <DialogContent sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: '35px 30px',
            gap: '20px'
        }}>
            <Typography sx={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: '26px',
                color: '#000',
                textAlign: 'center',
                lineHeight: 'normal',
                letterSpacing: '-0.52px'
            }}>
                Delete Event
            </Typography>

            <Typography sx={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: '22px',
                color: '#787876',
                textAlign: 'center',
                lineHeight: 'normal'
            }}>
                Are you sure you want to delete this event ?
            </Typography>

            <Box sx={{ display: 'flex', gap: '10px', mt: '10px' }}>
                <Button
                    onClick={onClose}
                    disabled={isLoading}
                    sx={{
                        width: '120px',
                        height: '48px',
                        borderRadius: '90px',
                        backgroundColor: '#787876',
                        color: '#fff',
                        textTransform: 'none',
                        fontFamily: fonts.sans,
                        fontWeight: 600,
                        fontSize: '16px',
                        '&:hover': { backgroundColor: '#60605e' }
                    }}
                >
                    No
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    variant="contained"
                    sx={{
                        width: '120px',
                        height: '48px',
                        borderRadius: '90px',
                        background: 'linear-gradient(150.17deg, #BF2F75 3.87%, #720361 63.8%)',
                        color: '#fff',
                        textTransform: 'none',
                        fontFamily: fonts.sans,
                        fontWeight: 600,
                        fontSize: '16px',
                        '&:hover': { opacity: 0.9 }
                    }}
                >
                    {isLoading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Yes'}
                </Button>
            </Box>
        </DialogContent>
    </Dialog>
);

const OrgMyEvents = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const events = useSelector(selectMyEvents);
    const isLoading = useSelector(selectEventLoading);

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (token) {
                dispatch(fetchMyEvents({ token, search: searchQuery }));
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [dispatch, token, searchQuery]);

    const handleEditEvent = (event) => {
        setEventToEdit(event);
        setShowAddEvent(true);
    };

    const handleDeleteEvent = (event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete || !token) return;

        setIsDeleting(true);
        try {
            const resultAction = await dispatch(deleteEvent({ id: eventToDelete._id, token }));
            if (deleteEvent.fulfilled.match(resultAction)) {
                dispatch(notify({ message: "Event deleted successfully!", type: "success" }));
                setIsDeleteModalOpen(false);
                setEventToDelete(null);
            } else {
                dispatch(notify({ message: resultAction.payload?.error || "Failed to delete event", type: "error" }));
            }
        } catch (error) {
            console.error("Delete error:", error);
            dispatch(notify({ message: "An unexpected error occurred", type: "error" }));
        } finally {
            setIsDeleting(false);
        }
    };

    if (showAddEvent) {
        return <AddEvent
            onBack={() => {
                setShowAddEvent(false);
                setEventToEdit(null);
                dispatch(fetchMyEvents({ token }));
            }}
            eventToEdit={eventToEdit}
        />;
    }

    if (selectedEvent) {
        return <EventDetail
            event={selectedEvent}
            onBack={() => setSelectedEvent(null)}
            onEdit={(evt) => {
                setSelectedEvent(null);
                handleEditEvent(evt);
            }}
            onDelete={(evt) => {
                handleDeleteEvent(evt);
            }}
        />;
    }

    return (
        <Box sx={{ p: 4, minHeight: '100%' }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 700,
                        fontSize: '26px',
                        color: '#000',
                        flexGrow: 1,
                    }}
                >
                    My Events
                </Typography>

                <TextField
                    placeholder="Search events by name"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        width: '379px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '90px',
                            backgroundColor: '#fff',
                            px: 2,
                            boxShadow: '0px 7px 6px 0px rgba(0,0,0,0.03)',
                            '& fieldset': { borderColor: 'rgba(0,0,0,0.16)' },
                        },
                        '& .MuiInputBase-input': {
                            fontFamily: fonts.sans,
                            fontSize: '16px',
                            color: '#787876',
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {searchQuery && (
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchQuery('')}
                                        sx={{ mr: 0.5, color: 'rgba(0,0,0,0.4)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
                                        aria-label="Clear search"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                )}
                                <SearchIcon sx={{ color: 'rgba(0,0,0,0.4)' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddEvent(true)}
                    sx={{
                        height: '48px',
                        borderRadius: '90px',
                        px: 3,
                        background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)',
                        fontFamily: fonts.sans,
                        fontWeight: 600,
                        fontSize: '16px',
                        textTransform: 'none',
                        '&:hover': { opacity: 0.9 },
                    }}
                >
                    Add Event
                </Button>
            </Box>

            {/* Events Grid */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ color: '#BC2876' }} />
                </Box>
            ) : (
                <>
                    {events && events.length > 0 ? (
                        <Grid container spacing={3}>
                            {events.map((event) => (
                                <Grid item key={event._id} xs={12} sm={6} lg={4}>
                                    <EventCard
                                        event={event}
                                        onEdit={handleEditEvent}
                                        onDelete={handleDeleteEvent}
                                        onView={async (evt) => {
                                            setSelectedEvent(evt);
                                            if (token) {
                                                try {
                                                    const res = await dispatch(getEventById({ id: evt._id, token })).unwrap();
                                                    if (res?.data) setSelectedEvent(res.data);
                                                } catch {
                                                    // keep showing list item if fetch fails
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <EmptyState isSearch={!!searchQuery} />
                    )}
                </>
            )}

            <DeleteConfirmationModal
                open={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setEventToDelete(null);
                }}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
            />
        </Box>
    );
};

export default OrgMyEvents;
