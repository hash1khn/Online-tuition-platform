'use client';

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Rating,
  Divider,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react';

// ----------------------------------------------------------------------

export default function ReviewForm({ onSubmitReview, open, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const ReviewSchema = Yup.object().shape({
    rating: Yup.number()
      .min(1, 'Minimum rating is 1')
      .max(5, 'Maximum rating is 5')
      .required('Rating is required'),
    review_text: Yup.string().required('Review text is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      review_text: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const handleReviewSubmit = async (data) => {
    setIsLoading(true);

    try {
      console.log('Submitting review...');

      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (onSubmitReview) await onSubmitReview(data);

      setSnackbarMessage('Review submitted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      console.log('Snackbar opened: success');
    } catch (error) {
      setSnackbarMessage('Failed to submit the review.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      console.error('Snackbar opened: error', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return; // Prevent Snackbar from closing on clickaway
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Submit a Review</DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit(handleReviewSubmit)}>
            <Typography variant="h6" gutterBottom>
              Review Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Rating Field */}
            <Typography sx={{ mb: 1 }}>Rating</Typography>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating {...field} size="large" max={5} precision={0.5} />
              )}
            />
            {errors.rating && (
              <Typography variant="caption" color="error">
                {errors.rating.message}
              </Typography>
            )}

            {/* Review Text Field */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Review"
              placeholder="Share your experience..."
              error={!!errors.review_text}
              helperText={errors.review_text?.message}
              {...methods.register('review_text')}
              sx={{ mt: 2 }}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            onClick={handleSubmit(handleReviewSubmit)}
          >
            Submit Review
          </LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

ReviewForm.propTypes = {
  onSubmitReview: PropTypes.func,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
