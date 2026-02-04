import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import { fonts } from '../../utility/fonts';
import { languages as availableLanguages } from '../../utility/category';
import { countryList } from '../../utility/countryList';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  TikTokIcon,
  TelegramIcon
} from '../../assets/assest';
import { selectToken } from '../../redux/slices/authSlice';
import {
  getMyOrganizationProfile,
  updateMyOrganizationProfile,
  selectOrganizationProfile,
  selectOrganizationLoading
} from '../../redux/slices/organizationSlice';
import { notify } from '../../redux/slices/alertSlice';
import { State } from 'country-state-city';

const AddLocationModal = ({ open, handleClose, handleSave, initialData }) => {
  const [formData, setFormData] = useState({
    address: '',
    state: '',
    country: '',
    countryFlag: '',
    email: '',
    mobile: '',
  });

  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const country = countryList.find(c => c.name === initialData.country);
      if (country) {
        setAvailableStates(State.getStatesOfCountry(country.code));
      }
    } else {
      setFormData({
        address: '',
        state: '',
        country: '',
        countryFlag: '',
        email: '',
        mobile: '',
      });
      setAvailableStates([]);
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const selectedCountry = countryList.find(c => c.name === value);
      setFormData({
        ...formData,
        country: value,
        state: '', // Reset state when country changes
        countryFlag: selectedCountry ? selectedCountry.image : ''
      });

      if (selectedCountry) {
        setAvailableStates(State.getStatesOfCountry(selectedCountry.code));
      } else {
        setAvailableStates([]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: '15px',
          width: '100%',
          maxWidth: '550px',
          p: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogTitle sx={{
        textAlign: 'center',
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: '26px',
        pt: 0
      }}>
        {initialData ? 'Edit Location' : 'Add Location'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 0.5 }}>
              Address
            </Typography>
            <TextField
              fullWidth
              name="address"
              placeholder="Enter location"
              variant="standard"
              value={formData.address}
              onChange={handleChange}
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: '#f2f2f2', borderRadius: '90px', px: 3, py: 1 }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 0.5 }}>
              Select Country
            </Typography>
            <TextField
              select
              fullWidth
              name="country"
              variant="standard"
              value={formData.country}
              onChange={handleChange}
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: '#f2f2f2', borderRadius: '90px', px: 3, py: 1 }
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                    }
                  }
                }
              }}
            >
              <MenuItem value="">Select Country</MenuItem>
              {countryList.map((c) => (
                <MenuItem key={c.code} value={c.name}>
                  <Box component="img" src={c.image} sx={{ width: 20, height: 15, mr: 1, objectFit: 'cover' }} />
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 0.5 }}>
              Select State
            </Typography>
            <TextField
              select
              fullWidth
              name="state"
              variant="standard"
              value={formData.state}
              onChange={handleChange}
              disabled={!formData.country}
              InputProps={{
                disableUnderline: true,
                sx: {
                  backgroundColor: !formData.country ? '#e0e0e0' : '#f2f2f2',
                  borderRadius: '90px',
                  px: 3,
                  py: 1
                }
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                    }
                  }
                }
              }}
            >
              <MenuItem value="">Select State/City</MenuItem>
              {availableStates.map((s) => (
                <MenuItem key={s.name} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 0.5 }}>
              Email
            </Typography>
            <TextField
              fullWidth
              name="email"
              placeholder="info@campusname.com"
              variant="standard"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: '#f2f2f2', borderRadius: '90px', px: 3, py: 1 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#545454', mb: 0.5 }}>
              Mobile Number
            </Typography>
            <TextField
              fullWidth
              name="mobile"
              placeholder="+1 000 0000 000"
              variant="standard"
              value={formData.mobile}
              onChange={handleChange}
              InputProps={{
                disableUnderline: true,
                sx: { backgroundColor: '#f2f2f2', borderRadius: '90px', px: 3, py: 1 }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: '#787876',
            color: 'white',
            borderRadius: '90px',
            px: 4,
            py: 1,
            '&:hover': { backgroundColor: '#666' }
          }}
        >
          Close
        </Button>
        <Button
          onClick={() => handleSave(formData)}
          sx={{
            background: 'linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)',
            color: 'white',
            borderRadius: '90px',
            px: 4,
            py: 1,
            '&:hover': { opacity: 0.9 }
          }}
        >
          Add Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LocationCard = ({ location, index, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '12px',
        border: '1px solid #ddd',
        width: '273px',
        height: '245px', // Fixed height to match dashed card
        position: 'relative',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '16px', color: '#000' }}>
          Location {index + 1}
        </Typography>
        <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon sx={{ color: '#999' }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              boxShadow: '2px 4px 13px rgba(0,0,0,0.25)',
              borderRadius: '7px',
              minWidth: '89px'
            }
          }}
        >
          <MenuItem
            onClick={() => {
              onEdit(location, index);
              handleClose();
            }}
            sx={{ fontSize: '13px', fontFamily: fonts.sans, color: '#787876' }}
          >
            <Box component="img" src="https://www.figma.com/api/mcp/asset/a89f8b68-3606-47d0-857f-d5f14b2df4b0" sx={{ width: 20, height: 20, mr: 1 }} /> Edit
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              onDelete(index);
              handleClose();
            }}
            sx={{ fontSize: '13px', fontFamily: fonts.sans, color: '#787876' }}
          >
            <Box component="img" src="https://www.figma.com/api/mcp/asset/f548a0c0-faff-4904-b474-0ad5306de2a3" sx={{ width: 20, height: 20, mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </Box>
      <Divider sx={{ mb: 1.5 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box component="img" src="https://www.figma.com/api/mcp/asset/d65b2ec5-0b04-49aa-ab13-72486b8377da" sx={{ width: 20, height: 20, flexShrink: 0 }} />
          <Typography sx={{ fontFamily: fonts.sans, fontSize: '13px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.4 }}>
            {location.address}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box component="img" src={location.countryFlag || "https://www.figma.com/api/mcp/asset/b7575811-3196-432c-8469-b8b40ffbad6e"} sx={{ width: 20, height: 20, flexShrink: 0, objectFit: 'cover', borderRadius: '50%' }} />
          <Typography sx={{ fontFamily: fonts.sans, fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>
            {location.country}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box component="img" src="https://www.figma.com/api/mcp/asset/d73f5eda-2372-4258-8ae8-d00cb755f000" sx={{ width: 20, height: 20, flexShrink: 0 }} />
          <Typography sx={{ fontFamily: fonts.sans, fontSize: '13px', color: 'rgba(0,0,0,0.5)' }}>
            {location.state}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box component="img" src="https://www.figma.com/api/mcp/asset/7097e9ff-8337-4f24-8c70-660cc18bc125" sx={{ width: 20, height: 20, flexShrink: 0 }} />
          <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
            {location.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box component="img" src="https://www.figma.com/api/mcp/asset/bfbcffe9-45aa-43f6-8e0d-5ec5ca983c74" sx={{ width: 20, height: 20, flexShrink: 0 }} />
          <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
            {location.mobile}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const CorporateInformation = ({ profile }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectOrganizationLoading);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [specializations, setSpecializations] = useState([
    { name: 'Careers Advice', checked: false },
    { name: 'Study Abroad', checked: false },
    { name: 'Admissions Counselling', checked: false },
    { name: 'Visa guidance', checked: false },
    { name: 'Student Accommodation', checked: false },
    { name: 'Test preparation', checked: false },
    { name: 'Mentoring', checked: false },
    { name: 'Tutoring', checked: false },
  ]);

  const [hashtags, setHashtags] = useState([]);
  const [showNewSpecInput, setShowNewSpecInput] = useState(false);
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newHashtagValue, setNewHashtagValue] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.organizationName || '');
      setTagline(profile.subtitle || ''); // subtitle in model
      setDescription(profile.description || '');
      if (profile.tags) setHashtags(profile.tags); // tags in model

      if (profile.specializations) {
        // Mark existing specs as checked
        const updated = specializations.map(s => ({
          ...s,
          checked: profile.specializations.includes(s.name)
        }));

        // Add any new specs from API that aren't in default list
        profile.specializations.forEach(s => {
          if (!updated.find(item => item.name === s)) {
            updated.push({ name: s, checked: true });
          }
        });
        setSpecializations(updated);
      }
    }
  }, [profile]);

  const handleToggleSpecialization = (index) => {
    const updated = [...specializations];
    updated[index].checked = !updated[index].checked;
    setSpecializations(updated);
  };

  const handleRemoveHashtag = (tag) => {
    setHashtags(hashtags.filter((h) => h !== tag));
  };

  const handleAddSpecialization = (e) => {
    if (e.key === 'Enter' && newSpecValue.trim()) {
      setSpecializations([...specializations, { name: newSpecValue.trim(), checked: true }]);
      setNewSpecValue('');
      setShowNewSpecInput(false);
    }
  };

  const handleAddHashtag = (e) => {
    if (e.key === 'Enter' && newHashtagValue.trim()) {
      if (!hashtags.includes(newHashtagValue.trim())) {
        setHashtags([...hashtags, newHashtagValue.trim()]);
      }
      setNewHashtagValue('');
    }
  };

  const handleSave = async () => {
    const selectedSpecs = specializations
      .filter(s => s.checked)
      .map(s => s.name);

    const updateData = {
      organizationName: name,
      subtitle: tagline,
      description: description,
      specializations: selectedSpecs,
      tags: hashtags,
    };

    try {
      const result = await dispatch(updateMyOrganizationProfile({ updateData, token })).unwrap();
      if (result.success) {
        dispatch(notify({ message: 'Corporate Information updated successfully!', type: 'success' }));
      }
    } catch (error) {
      dispatch(notify({ message: error.error || 'Failed to update information', type: 'error' }));
    }
  };

  return (
    <Box sx={{ mt: 3, width: '100%', maxWidth: '881px', mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Name of ESP */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: '16px',
              color: '#545454',
              mb: 1,
            }}
          >
            Name of ESP
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter Name of ESP"
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: '#f2f2f2',
                borderRadius: '90px',
                px: 3,
                py: 1.5,
                fontFamily: fonts.sans,
                fontSize: '16px',
              },
            }}
          />
        </Grid>

        {/* Add Tagline */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: '16px',
              color: '#545454',
              mb: 1,
            }}
          >
            Add Tagline
          </Typography>
          <TextField
            fullWidth
            placeholder="Add tagline (e.g. Empowering Minds, Shaping Futures: Your Partner in Education.)"
            variant="standard"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: '#f2f2f2',
                borderRadius: '90px',
                px: 3,
                py: 1.5,
                fontFamily: fonts.sans,
                fontSize: '16px',
              },
            }}
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: '16px',
              color: '#545454',
              mb: 1,
            }}
          >
            Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder="Enter Description"
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: '#f2f2f2',
                borderRadius: '18px',
                p: 3,
                fontFamily: fonts.sans,
                fontSize: '16px',
                lineHeight: 'normal',
              },
            }}
          />
        </Grid>

        {/* Specializations */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: '16px',
                color: '#000',
              }}
            >
              Specializations
            </Typography>
            <Button
              onClick={() => setShowNewSpecInput(true)}
              startIcon={<AddIcon sx={{ color: '#BC2876' }} />}
              sx={{
                color: '#BC2876',
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
              }}
            >
              Add New
            </Button>
          </Box>
          <Grid container spacing={1}>
            {specializations.map((spec, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={spec.checked}
                      onChange={() => handleToggleSpecialization(index)}
                      sx={{
                        color: '#ddd',
                        '&.Mui-checked': {
                          color: '#BC2876',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 500,
                        fontSize: '15px',
                        color: spec.checked ? '#000' : '#666',
                      }}
                    >
                      {spec.name}
                    </Typography>
                  }
                />
              </Grid>
            ))}
          </Grid>
          {showNewSpecInput && (
            <TextField
              fullWidth
              placeholder="Enter new specialization"
              variant="standard"
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              onKeyDown={handleAddSpecialization}
              autoFocus
              InputProps={{
                disableUnderline: true,
                sx: {
                  backgroundColor: '#f2f2f2',
                  borderRadius: '90px',
                  px: 3,
                  py: 1.5,
                  mt: 2,
                  fontFamily: fonts.sans,
                  fontSize: '16px',
                },
              }}
            />
          )}
        </Grid>

        {/* Hashtags */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: '16px',
              color: '#545454',
              mb: 1,
            }}
          >
            Enter Hashtags
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter Hashtags"
            variant="standard"
            value={newHashtagValue}
            onChange={(e) => setNewHashtagValue(e.target.value)}
            onKeyDown={handleAddHashtag}
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: '#f2f2f2',
                borderRadius: '90px',
                px: 3,
                py: 1.5,
                fontFamily: fonts.sans,
                fontSize: '16px',
              },
            }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {hashtags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveHashtag(tag)}
                deleteIcon={<CloseIcon sx={{ fontSize: '16px !important' }} />}
                sx={{
                  backgroundColor: 'rgba(188, 40, 118, 0.07)',
                  color: '#BC2876',
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: '14px',
                  borderRadius: '90px',
                  '& .MuiChip-deleteIcon': {
                    color: '#BC2876',
                    '&:hover': { color: '#BC2876' },
                  },
                }}
              />
            ))}
          </Box>
        </Grid>

        {/* Save Changes Button */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(156.46deg, #BF2F75 3.87%, #720361 63.8%)',
              borderRadius: '90px',
              px: 6,
              py: 1.5,
              textTransform: 'none',
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: '16px',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const Offices = ({ profile }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectOrganizationLoading);
  const [selectedLangs, setSelectedLangs] = useState(['', '', '']);
  const [enabledCount, setEnabledCount] = useState(1);
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (profile) {
      if (profile.locations) {
        setLocations(profile.locations);
      }
      if (profile.languages) {
        const langs = ['', '', ''];
        profile.languages.forEach((l, i) => {
          if (i < 3) langs[i] = l;
        });
        setSelectedLangs(langs);
        setEnabledCount(Math.min(profile.languages.length + 1, 3));
      }
    }
  }, [profile]);

  const handleAddLanguage = (index) => {
    if (selectedLangs[index] && enabledCount === index + 1 && enabledCount < 3) {
      setEnabledCount(enabledCount + 1);
    }
  };

  const handleOpenModal = (index = null) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
    setIsModalOpen(false);
  };

  const handleSaveLocation = (newLocation) => {
    if (editingIndex !== null) {
      const updatedLocations = [...locations];
      updatedLocations[editingIndex] = newLocation;
      setLocations(updatedLocations);
    } else {
      setLocations([...locations, newLocation]);
    }
    handleCloseModal();
  };

  const handleDeleteLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const activeLangs = selectedLangs.filter(l => l !== '');
    const updateData = {
      languages: activeLangs,
      locations: locations,
    };

    try {
      const result = await dispatch(updateMyOrganizationProfile({ updateData, token })).unwrap();
      if (result.success) {
        dispatch(notify({ message: 'Offices Information updated successfully!', type: 'success' }));
      }
    } catch (error) {
      dispatch(notify({ message: error.error || 'Failed to update information', type: 'error' }));
    }
  };

  return (
    <Box sx={{ mt: 3, width: '100%', maxWidth: '881px', mx: 'auto' }}>
      <Grid container spacing={3}>
        {/* Locations Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: '16px',
                color: '#000',
                whiteSpace: 'nowrap',
              }}
            >
              Locations
            </Typography>
            <Divider sx={{ flexGrow: 1, borderColor: '#ddd' }} />
            <Button
              variant="contained"
              onClick={() => handleOpenModal()}
              startIcon={<Box component="img" src="https://www.figma.com/api/mcp/asset/e6b4438f-4457-42fb-b3b5-d80a6a413329" sx={{ width: 21, height: 24 }} />}
              sx={{
                background: 'linear-gradient(158deg, #BF2F75 3.87%, #720361 63.8%)',
                borderRadius: '90px',
                textTransform: 'none',
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: '16px',
                px: 3,
                py: 1,
              }}
            >
              Add Location
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            {locations.map((loc, index) => (
              <LocationCard
                key={index}
                location={loc}
                index={index}
                onEdit={() => handleOpenModal(index)}
                onDelete={handleDeleteLocation}
              />
            ))}
            <Box
              onClick={() => handleOpenModal()}
              sx={{
                width: '273px',
                height: '216px',
                border: '1px dashed #BC2876',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#fcfcfc',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <Box component="img" src="https://www.figma.com/api/mcp/asset/95f48c99-513a-4d96-85db-a0ecc6cd07a4" sx={{ width: 71, height: 81, mb: 1 }} />
              <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '16px', color: '#9e9e9e' }}>
                Add Location
              </Typography>
            </Box>
          </Box>
        </Grid>

        <AddLocationModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          handleSave={handleSaveLocation}
          initialData={editingIndex !== null ? locations[editingIndex] : null}
        />

        {/* Languages Spoken Section */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: '16px',
              color: '#000',
              mb: 1,
            }}
          >
            Languages spoken
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {selectedLangs.map((lang, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  select
                  fullWidth
                  placeholder="Select Languages"
                  variant="standard"
                  value={lang}
                  disabled={index >= enabledCount}
                  onChange={(e) => {
                    const newLangs = [...selectedLangs];
                    newLangs[index] = e.target.value;
                    setSelectedLangs(newLangs);
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 300,
                          mt: 1,
                          borderRadius: '12px',
                          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                          '&::-webkit-scrollbar': {
                            width: '6px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ddd',
                            borderRadius: '10px',
                          },
                        },
                      },
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                      },
                    },
                  }}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      backgroundColor: index < enabledCount ? '#f2f2f2' : '#f9f9f9',
                      borderRadius: '90px',
                      px: 3,
                      py: 1.5,
                      fontFamily: fonts.sans,
                      fontSize: '16px',
                      // Removed opacity here to keep it visible but disabled
                    },
                  }}
                  sx={{
                    '& .Mui-disabled': {
                      color: 'rgba(0, 0, 0, 0.38)',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.38)',
                    }
                  }}
                >
                  <MenuItem value="">Select Languages</MenuItem>
                  {availableLanguages.map((l) => (
                    <MenuItem key={l.code} value={l.name} sx={{ fontFamily: fonts.sans }}>
                      {l.flag} {l.name}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton
                  onClick={() => handleAddLanguage(index)}
                  sx={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '90px',
                    background: index < enabledCount
                      ? 'linear-gradient(124.89deg, #BF2F75 3.87%, #720361 63.8%)'
                      : '#9e9e9e',
                    color: '#fff',
                    opacity: index < enabledCount ? 1 : 0.5,
                    '&:hover': {
                      opacity: 0.9,
                      background: index < enabledCount
                        ? 'linear-gradient(124.89deg, #BF2F75 3.87%, #720361 63.8%)'
                        : '#9e9e9e',
                    }
                  }}
                >
                  <AddIcon sx={{ fontSize: '28px' }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Save Changes Button */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(156.46deg, #BF2F75 3.87%, #720361 63.8%)',
              borderRadius: '90px',
              px: 6,
              py: 1.5,
              textTransform: 'none',
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: '16px',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const SocialChannels = ({ profile }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectOrganizationLoading);
  const [socialLinks, setSocialLinks] = useState({
    linkedIn: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
    telegram: '',
  });

  useEffect(() => {
    if (profile && profile.socialLinks) {
      setSocialLinks({
        linkedIn: profile.socialLinks.linkedIn || '',
        twitter: profile.socialLinks.twitter || '',
        facebook: profile.socialLinks.facebook || '',
        instagram: profile.socialLinks.instagram || '',
        youtube: profile.socialLinks.youtube || '',
        telegram: profile.socialLinks.telegram || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const updateData = {
      socialLinks: socialLinks,
    };

    try {
      const result = await dispatch(updateMyOrganizationProfile({ updateData, token })).unwrap();
      if (result.success) {
        dispatch(notify({ message: 'Social Channels updated successfully!', type: 'success' }));
      }
    } catch (error) {
      dispatch(notify({ message: error.error || 'Failed to update information', type: 'error' }));
    }
  };

  const socialPlatforms = [
    { name: 'linkedIn', label: 'LinkedIn', icon: LinkedinIcon, placeholder: 'https://linkedin.com/in/username' },
    { name: 'twitter', label: 'Twitter', icon: TwitterIcon, placeholder: 'https://twitter.com/username' },
    { name: 'facebook', label: 'Facebook', icon: FacebookIcon, placeholder: 'https://facebook.com/username' },
    { name: 'instagram', label: 'Instagram', icon: InstagramIcon, placeholder: 'https://instagram.com/username' },
    { name: 'youtube', label: 'Youtube', icon: YoutubeIcon, placeholder: 'https://youtube.com/c/username' },
    { name: 'telegram', label: 'Telegram', icon: TelegramIcon, placeholder: 'https://t.me/username' },
  ];

  return (
    <Box sx={{ mt: 3, width: '100%', maxWidth: '881px', mx: 'auto' }}>
      <Grid container spacing={3}>
        {socialPlatforms.map((platform) => (
          <Grid item xs={12} md={6} key={platform.name}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: '16px',
                color: '#545454',
                mb: 1,
              }}
            >
              {platform.label}
            </Typography>
            <TextField
              fullWidth
              name={platform.name}
              placeholder={platform.placeholder}
              variant="standard"
              value={socialLinks[platform.name]}
              onChange={handleChange}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <Box
                    component="img"
                    src={platform.icon}
                    sx={{ width: 24, height: 24, mr: 2 }}
                  />
                ),
                sx: {
                  backgroundColor: '#f2f2f2',
                  borderRadius: '90px',
                  px: 3,
                  py: 1.5,
                  fontFamily: fonts.sans,
                  fontSize: '16px',
                },
              }}
            />
          </Grid>
        ))}

        {/* Save Changes Button */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(156.46deg, #BF2F75 3.87%, #720361 63.8%)',
              borderRadius: '90px',
              px: 6,
              py: 1.5,
              textTransform: 'none',
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: '16px',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const OrgAboutUs = () => {
  const dispatch = useDispatch();
  const orgProfile = useSelector(selectOrganizationProfile);
  const isLoading = useSelector(selectOrganizationLoading);
  const token = useSelector(selectToken);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (token) {
      dispatch(getMyOrganizationProfile({ token }));
    }
  }, [dispatch, token]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f9fafb', minHeight: '100%' }}>
      {isLoading && !orgProfile && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#BC2876' }} />
        </Box>
      )}
      {/* Header */}
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: '26px',
          color: '#000',
          mb: 4,
        }}
      >
        About Us
      </Typography>

      {/* Main Content Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: '15px',
          boxShadow: '0px 6px 9px 0px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        {/* Banner and Logo Section */}
        <Box sx={{ position: 'relative', mb: 10 }}>
          {/* Banner */}
          <Box
            sx={{
              height: '182px',
              backgroundColor: '#ff8a00',
              backgroundImage: `url(${orgProfile?.bannerImage || 'https://www.figma.com/api/mcp/asset/e6e68a41-fb9f-4ecd-894f-3169eb600bf1'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px 20px 0 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                boxShadow: 'inset 0px -16px 24px 0px rgba(0,0,0,0.6)',
                pointerEvents: 'none',
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '37px',
                height: '37px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                zIndex: 1,
              }}
            >
              <EditIcon sx={{ fontSize: '20px', color: '#ff8a00' }} />
            </Box>
          </Box>

          {/* Logo */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '-80px',
              left: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '126px',
                height: '126px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                border: '1px solid #f2f2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
                mb: 1,
                position: 'relative',
              }}
            >
              {orgProfile?.logo ? (
                <Box
                  component="img"
                  src={orgProfile.logo}
                  sx={{ width: '80%', height: '80%', objectFit: 'contain' }}
                />
              ) : (
                <AddPhotoAlternateIcon sx={{ fontSize: 46, color: 'rgba(0,0,0,0.2)' }} />
              )}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '0px',
                  right: '0px',
                  width: '37px',
                  height: '37px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                  border: '1px solid #eee',
                }}
              >
                <EditIcon sx={{ fontSize: '20px', color: '#ff8a00' }} />
              </Box>
            </Box>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: '16px',
                color: '#000',
              }}
            >
              Change Logo
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: '#ddd', mt: 12 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#BC2876',
                height: '2px',
              },
            }}
          >
            <Tab
              label="Corporate Information"
              sx={{
                textTransform: 'none',
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: '16px',
                color: '#999',
                px: { xs: 2, md: 4.5 },
                '&.Mui-selected': {
                  color: '#BC2876',
                },
              }}
            />
            <Tab
              label="Offices"
              sx={{
                textTransform: 'none',
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: '16px',
                color: '#999',
                px: { xs: 2, md: 4.5 },
                '&.Mui-selected': {
                  color: '#BC2876',
                },
              }}
            />
            <Tab
              label="Social channels"
              sx={{
                textTransform: 'none',
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: '16px',
                color: '#999',
                px: { xs: 2, md: 4.5 },
                '&.Mui-selected': {
                  color: '#BC2876',
                },
              }}
            />
          </Tabs>
        </Box>

        {/* Tab Panel */}
        {tabValue === 0 && <CorporateInformation profile={orgProfile} />}
        {tabValue === 1 && <Offices profile={orgProfile} />}
        {tabValue === 2 && <SocialChannels profile={orgProfile} />}
      </Paper>
    </Box>
  );
};

export default OrgAboutUs;
