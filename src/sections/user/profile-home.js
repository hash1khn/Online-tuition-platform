'use client';

import PropTypes from 'prop-types';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherAvailability } from 'src/app/store/slices/availabilityslice';
import dayjs from 'dayjs';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BookIcon from '@mui/icons-material/Book';
import LanguageIcon from '@mui/icons-material/Language';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

// Local imports
import UserCardListBySubject from './user-card-profile-home';


export default function ProfileHome({ info, teacher_id, posts }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { availability, loading, error } = useSelector((state) => state.availability);

  useEffect(() => {
    if (teacher_id) {
      dispatch(getTeacherAvailability(teacher_id));
    }
  }, [dispatch, teacher_id]);

  const sectionColors = {
    overview: '#A5D6A7',       
    sessionDetails: '#80CBC4', 
    subjects: '#FFD27F',       
    languages: '#FFE0B2',      
  };  
  

  const dayColors = {
    Monday: '#FFD27F',     
    Tuesday: '#FFE082',    
    Wednesday: '#80CBC4',  
    Thursday: '#80DEEA',   
    Friday: '#A5D6A7',     
    Saturday: '#FFE0B2',   
    Sunday: '#FFF59D',     
  };
  
  

  const chipStyle = (backgroundColor) => ({
    backgroundColor,
    color: '#000',
    fontSize: '0.9rem',
    padding: '4px 8px',
    borderRadius: '16px',
  });

  const sectionTitle = (icon, title) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
  );

  const renderOverview = (
    <Card sx={{ p: 3 }}>
      {sectionTitle(<InfoIcon />, 'Overview')}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip label={`Gender: ${info.gender || 'Not Specified'}`} sx={chipStyle(sectionColors.overview)} />
        <Chip label={`Experience: ${info.experience_years || 0} years`} sx={chipStyle(sectionColors.overview)} />
        <Chip
          label={`Verified: ${info.is_verified ? 'Yes' : 'No'}`}
          sx={chipStyle(sectionColors.overview)}
        />
      </Box>
    </Card>
  );

    const renderBio = (
    <Card>
      <CardHeader title={sectionTitle(<SchoolIcon />, 'Biography & Education')} />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body1' }}>
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 800 }}>
            Bio:
          </Typography>{' '}
          {info.bio || 'No bio available'}
        </Box>
        <Box sx={{ typography: 'body1' }}>
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 800 }}>
            Education:
          </Typography>{' '}
          {info.education || 'No education available'}
        </Box>
      </Stack>
    </Card>
  );
  const renderReview = (
    <Card>
      <CardHeader title={sectionTitle(<SchoolIcon />, 'Biography & Education')} />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body1' }}>
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 800 }}>
            Bio:
          </Typography>{' '}
          {info.bio || 'No bio available'}
        </Box>
        <Box sx={{ typography: 'body1' }}>
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 800 }}>
            Education:
          </Typography>{' '}
          {info.education || 'No education available'}
        </Box>
      </Stack>
    </Card>
  );

  const renderSessionDetails = (
    <Card sx={{ p: 3 }}>
      {sectionTitle(<ScheduleIcon />, 'Session Details')}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip label={`Hourly Rate: $${info.hourly_rate}`} sx={chipStyle(sectionColors.sessionDetails)} />
        <Chip
          label={`Duration: ${info.duration_per_session || 0} mins`}
          sx={chipStyle(sectionColors.sessionDetails)}
        />
        <Chip
          label={`Mode: ${info.teaching_mode}`}
          sx={chipStyle(sectionColors.sessionDetails)}
        />
      </Box>
    </Card>
  );

  const renderSubjects = (
    <Card sx={{ p: 3 }}>
      {sectionTitle(<BookIcon />, 'Subjects')}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {info.subjects?.length > 0 ? (
          info.subjects.map((subject, index) => (
            <Chip key={index} label={subject} sx={chipStyle(sectionColors.subjects)} />
          ))
        ) : (
          <Typography>No subjects available</Typography>
        )}
      </Box>
    </Card>
  );

  const renderLanguages = (
    <Card sx={{ p: 3 }}>
      {sectionTitle(<LanguageIcon />, 'Languages')}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {info.languages?.length > 0 ? (
          info.languages.map((language, index) => (
            <Chip key={index} label={language} sx={chipStyle(sectionColors.languages)} />
          ))
        ) : (
          <Typography>No languages available</Typography>
        )}
      </Box>
    </Card>
  );

  const renderAvailability = () => {
    if (loading) {
      return <Typography variant="body2" color="text.secondary">Loading availability...</Typography>;
    }
  
    if (error) {
      return <Typography variant="body2" color="text.secondary">Failed to load availability.</Typography>;
    }
  
    const availabilityData = Array.isArray(availability) ? availability : [];
  
    if (availabilityData.length === 0) {
      return <Typography variant="body2" color="text.secondary">No availability information provided.</Typography>;
    }
  
    const groupedAvailability = availabilityData.reduce((acc, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = [];
      }
  
      const startTime = `${new Date().toISOString().split('T')[0]}T${slot.start_time}`;
      const endTime = `${new Date().toISOString().split('T')[0]}T${slot.end_time}`;
      const formattedSlot = `${dayjs(startTime).format('hh:mm A')} - ${dayjs(endTime).format('hh:mm A')}`;
      acc[slot.day].push(formattedSlot);
      return acc;
    }, {});
  
    return (
      <Card sx={{ p: 3 }}>
        {sectionTitle(<EventAvailableIcon />, 'Availability')}
        <Stack spacing={2}>
          {Object.entries(groupedAvailability).map(([day, times], index) => (
            <Box key={index}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                }}
              >
                {day}:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {times.map((time, idx) => (
                  <Chip
                    key={idx}
                    label={time}
                    sx={chipStyle(dayColors[day] || sectionColors.availability)}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
      </Card>
    );
  };
  
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={6}>
        <Stack spacing={3}>
          {renderOverview}
          {renderSessionDetails}
        </Stack>
      </Grid>

      <Grid xs={12} md={6}>
        <Stack spacing={3}>
          {renderSubjects}
          {renderLanguages}
        </Stack>
      </Grid>
      <Grid xs={12}>{renderBio}</Grid>
      <Grid xs={12}>{renderAvailability()}</Grid>
      {/* <Grid xs={12}>{renderReview}</Grid> */}

      <Grid xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">Similar Subject Faculty</Typography>
        </Box>
        <UserCardListBySubject subjects={info.subjects} />
      </Grid>
    </Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.shape({
    bio: PropTypes.string,
    experience_years: PropTypes.number,
    teacher_id: PropTypes.string,
    education: PropTypes.string,
    gender: PropTypes.string,
    rating: PropTypes.number,
    is_verified: PropTypes.bool,
    hourly_rate: PropTypes.number,
    duration_per_session: PropTypes.number,
    subjects: PropTypes.array,
    grade_levels: PropTypes.array,
    languages: PropTypes.array,
    teaching_mode: PropTypes.string,
  }).isRequired,
  teacher_id: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
};
