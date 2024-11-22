'use client';

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import { TextField, Typography, Rating, Grid, Divider } from '@mui/material';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react';

// ----------------------------------------------------------------------

export default function ReviewForm({ onSubmitReview, studentId }) {
  const [isLoading, setIsLoading] = useState(false);

  const ReviewSchema = Yup.object().shape({
    studentId: Yup.string()
      .required('Student ID is required'),
    contractId: Yup.string()
      .required('Contract ID is required'),
    teacherId: Yup.string()
      .required('Teacher ID is required'),
    rating: Yup.number()
      .min(1, 'Minimum rating is 1')
      .max(5, 'Maximum rating is 5')
      .required('Rating is required'),
    reviewText: Yup.string().required('Review text is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues: {
      studentId: '',
      contractId: '',
      teacherId: '',
      rating: 0,
      reviewText: '',
    },
  });

  const { handleSubmit, control, formState: { errors } } = methods;

  const handleReviewSubmit = async (data) => {
    setIsLoading(true);

    const reviewData = { ...data, studentId };

    console.log('Submitting Review:', reviewData);
    if (onSubmitReview) onSubmitReview(reviewData);

    setTimeout(() => {
      setIsLoading(false);
      alert('Review submitted successfully!');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit(handleReviewSubmit)}>

      {/* Student and Contract Information */}
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Student and Contract Info
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Student ID"
              placeholder="Enter student ID"
              error={!!errors.studentId}
              helperText={errors.studentId?.message}
              {...methods.register('studentId')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contract ID"
              placeholder="Enter contract ID"
              error={!!errors.contractId}
              helperText={errors.contractId?.message}
              {...methods.register('contractId')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teacher ID"
              placeholder="Enter teacher ID"
              error={!!errors.teacherId}
              helperText={errors.teacherId?.message}
              {...methods.register('teacherId')}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Review Details */}
      <Card sx={{ p: 3, mb: 3 }}>
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
          error={!!errors.reviewText}
          helperText={errors.reviewText?.message}
          {...methods.register('reviewText')}
          sx={{ mt: 2 }}
        />
      </Card>

      {/* Submit Button */}
      <Stack alignItems="flex-end" sx={{ mt: 4 }}>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isLoading}
        >
          Submit Review
        </LoadingButton>
      </Stack>
    </form>
  );
}

ReviewForm.propTypes = {
  onSubmitReview: PropTypes.func,
  studentId: PropTypes.string.isRequired,
};
