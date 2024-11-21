'use client';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import StudentEditForm from './student-edit-form';

// ----------------------------------------------------------------------

export default function StudentEditView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4" gutterBottom>
        Complete your student profile
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please fill in the form below to update or complete your profile.
      </Typography>

          <StudentEditForm />
    </Container>
  );
}
