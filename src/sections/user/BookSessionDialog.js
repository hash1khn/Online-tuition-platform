import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText,
  Grid,
  Typography,
  Card,
  Box,
} from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import RHFTextField from 'src/components/hook-form/rhf-text-field'; // Ensure this path is correct

const BookSessionDialog = ({ open, onClose }) => {
  // Validation schema
  const schema = Yup.object().shape({
    // student_id: Yup.string().required('Student ID is required'),
    // teacher_id: Yup.string().required('Teacher ID is required'),
    // subject_id: Yup.string().required('Subject ID is required'),
    start_date: Yup.date().required('Start Date is required'),
    end_date: Yup.date().required('End Date is required'),
    mode: Yup.string().required('Mode is required'),
    payment_terms: Yup.string().required('Payment terms are required'),
    status: Yup.string().required('Status is required'),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
    //   student_id: '',
    //   teacher_id: '',
    //   subject_id: '',
      start_date: '',
      end_date: '',
      mode: '',
      payment_terms: '',
      status: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  // Dummy onSubmit function
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    onClose(); // Close dialog after submission
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Book a Session</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              {/* Contract Details Card */}
              {/* <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Contract Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name="student_id"
                      label="Student ID"
                      fullWidth
                      helperText={errors.student_id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name="teacher_id"
                      label="Teacher ID"
                      fullWidth
                      helperText={errors.teacher_id?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name="subject_id"
                      label="Subject ID"
                      fullWidth
                      helperText={errors.subject_id?.message}
                    />
                  </Grid>
                </Grid>
              </Card> */}

              {/* Session Details Card */}
              <Card sx={{ p: 3 }}>
                <Typography  sx={{ mb: 2 }} variant="h6" gutterBottom>
                  Session Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name="start_date"
                      type="date"
                      label="Start Date"
                      fullWidth
                      helperText={errors.start_date?.message}
                      InputLabelProps={{
                        shrink: true, // Prevent label overlap
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name="end_date"
                      type="date"
                      label="End Date"
                      fullWidth
                      helperText={errors.end_date?.message}
                      InputLabelProps={{
                        shrink: true, // Prevent label overlap
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <InputLabel>Mode</InputLabel>
                      <Controller
                        name="mode"
                        control={control}
                        render={({ field }) => (
                          <Select {...field} fullWidth defaultValue="">
                            <MenuItem value="online">Online</MenuItem>
                            <MenuItem value="offline">Offline</MenuItem>
                          </Select>
                        )}
                      />
                      <FormHelperText>{errors.mode?.message}</FormHelperText>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              {/* Payment Information Card */}
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name="payment_terms"
                      label="Payment Terms"
                      fullWidth
                      helperText={errors.payment_terms?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RHFTextField
                      name="status"
                      label="Status"
                      fullWidth
                      helperText={errors.status?.message}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Cancel
        </Button>
        <LoadingButton onClick={handleSubmit(onSubmit)} variant="contained">
          Save Contract
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

BookSessionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BookSessionDialog;
