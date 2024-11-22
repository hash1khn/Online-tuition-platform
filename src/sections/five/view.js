'use client';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';

import ReviewForm from 'src/sections/five/review-form';

// ----------------------------------------------------------------------

export default function FiveView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }} >
       Submit a Review </Typography>
    
      <ReviewForm onSubmitReview={(data) => console.log('Review Submitted:', data)} />
    </Container>
  );
}
