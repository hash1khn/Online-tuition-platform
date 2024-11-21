'use client';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BookIcon from '@mui/icons-material/Book';
import LanguageIcon from '@mui/icons-material/Language';
import LayersIcon from '@mui/icons-material/Layers';
import ProfilePostItem from './profile-post-item';
// ----------------------------------------------------------------------

export default function ProfileHome({ info, posts }) {
  const theme = useTheme();

  const chipStyle = (color) => ({
    color: theme.palette.common.white,
    backgroundColor: color,
    borderRadius: '16px',
    padding: '8px 12px',
    fontWeight: 500,
  });

  const sectionTitle = (icon, title) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
  );

  const renderBio = (
    <Card>
      <CardHeader title={sectionTitle(<SchoolIcon />, 'Biography & Education')} />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>
        <Typography component="span" variant="subtitle1" sx={{ fontWeight: 700 }}>
          Bio:
        </Typography>{' '}
        {info.bio || 'No bio available'}
        </Box>
        <Box sx={{ typography: 'body2' }}>
        <Typography component="span" variant="subtitle1" sx={{ fontWeight: 700 }}>
          Education:
        </Typography>{' '}
        {info.education || 'No education available'}
        </Box>
      </Stack>
    </Card>
  );

  const renderOverview = (
    <Card sx={{ p: 3 }}>
      {sectionTitle(<InfoIcon />, 'Overview')}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      <Chip
        label={`ID: ${info.teacher_id || 'Not Available'}`}
        sx={chipStyle(theme.palette.primary.main)}
      />
      <Chip
        label={`Gender: ${info.gender || 'Not Specified'}`}
        sx={chipStyle(theme.palette.primary.main)}
      />
      {/* <Chip
        label={`Age: ${info.age || 'Not Specified'}`}
        sx={chipStyle(theme.palette.primary.main)}
      /> */}
        <Chip
          label={`Experience: ${info.experience_years} years`}
          sx={chipStyle(theme.palette.primary.main)}
        />
        <Chip
          label={`Verified Status: ${info.is_verified ? 'Verified' : 'Not Verified'}`}
          sx={chipStyle(theme.palette.success.main)}
        />
        <Chip
          label={`Rating: ${info.rating || 'Not Rated'} stars`}
          sx={chipStyle(theme.palette.success.main)}
        />
      </Box>
    </Card>
  );

  const renderSessionDetails = (
    <Card sx={{ p: 3 }}>
      {sectionTitle(<ScheduleIcon />, 'Session Details')}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        <Chip
          label={`Hourly Rate: $${info.hourly_rate}`}
          sx={chipStyle(theme.palette.info.main)}
        />
        <Chip
          label={`Session Duration: ${info.duration_per_session} mins`}
          sx={chipStyle(theme.palette.info.main)}
        />
        <Chip
          label={`Teaching Mode: ${info.teaching_mode}`}
          sx={chipStyle(theme.palette.info.main)}
        />
      </Box>
    </Card>
  );

  const renderSubjects = (
    <Card sx={{ p: 3 }}>
      {sectionTitle(<BookIcon />, 'Subjects')}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      {info.subjects && info.subjects.length > 0 ? (
        info.subjects.map((subject, index) => (
          <Chip
            key={index}
            label={subject}
            sx={chipStyle(theme.palette.secondary.main)}
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No subjects available.
        </Typography>
      )}
      </Box>

      <Box sx={{ mt: 3 }}>
      {sectionTitle(<LayersIcon />, 'Grade Levels')}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {info.grade_levels && info.grade_levels.length > 0 ? (
          info.grade_levels.map((level, index) => (
            <Chip
              key={index}
              label={level}
              sx={chipStyle(theme.palette.secondary.light)}
            />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No grade levels available.
          </Typography>
        )}
      </Box>
      </Box>
    </Card>
  );

  const renderLanguages = (
    <Card sx={{ p: 3 }}>
      {sectionTitle(<LanguageIcon />, 'Languages')}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      {info.languages && info.languages.length > 0 ? (
        info.languages.map((language, index) => (
          <Chip
            key={index}
            label={language}
            sx={chipStyle(theme.palette.primary.dark)}
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No languages available.
        </Typography>
      )}
    </Box>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        {renderBio}
      </Grid>

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

      {/* <Grid xs={12}>
        <Card sx={{ p: 3, boxShadow: 2, borderRadius: '16px' }}>
          <CardHeader title="Posts" /> */}
          {/* <Stack spacing={3}>
            {posts.map((post) => (
              <ProfilePostItem key={post.id} post={post} />
            ))}
          </Stack> */}
        {/* </Card>
      </Grid> */}
    </Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.shape({
    bio: PropTypes.string,
    experience_years: PropTypes.number,
    teacher_id: PropTypes.string,
    gender: PropTypes.string,
    age: PropTypes.number,
    education: PropTypes.string,
    name :  PropTypes.string,
    is_verified: PropTypes.bool,
    rating: PropTypes.number,
    area :PropTypes.string,
    hourly_rate: PropTypes.string,
    duration_per_session: PropTypes.number,
    teaching_mode: PropTypes.string,
    subjects: PropTypes.arrayOf(PropTypes.string),
    grade_levels: PropTypes.arrayOf(PropTypes.string),
    languages: PropTypes.arrayOf(PropTypes.string),
  }),
  posts: PropTypes.array,
};
