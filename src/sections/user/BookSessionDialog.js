import React, { useEffect, useState } from 'react';
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
  Chip,
  OutlinedInput,
} from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import RHFTextField from 'src/components/hook-form/rhf-text-field'; // Ensure this path is correct
import getStripe from "src/utils/get-stripe";
import { useSelector, useDispatch } from 'react-redux';
import {createContract} from '../../app/store/slices/contractSlice';

const BookSessionDialog = ({ open, onClose, teacher_id }) => {
  const [subjects, setSubjects] = useState([]);
  const dispatch = useDispatch();
  const [successSnackbar, setSuccessSnackbar] = useState(false);


  // Fetch teacher's subjects using teacher_id
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`/api/teachers/${teacher_id}/subjects`);
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (teacher_id) {
      fetchSubjects();
    }
  }, [teacher_id]);

  // Validation schema
  const schema = Yup.object().shape({
    start_date: Yup.date().required('Start Date is required'),
    end_date: Yup.date().required('End Date is required'),
    mode: Yup.string().required('Mode is required'),
    subjects: Yup.array()
      .of(Yup.number().required('Subject is required'))
      .min(1, 'At least one subject must be selected'),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      start_date: '',
      end_date: '',
      mode: '',
      subjects: [],
      teacher_id,
    },
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const handlePrice = async () => {
    const checkoutSession = await fetch('/api/checkout_sess', {
      method: 'POST',
      headers: { origin: 'http://localhost:3035' },
    });
    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSessionJson.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  // Submit function
  const onSubmit = async (data) => {
    const payload = {
      teacher_id,
      ...data,
    };
    try {
      console.log(payload)
      const action = await dispatch(createContract(payload));
      console.log('Dispatched Action:', action); // Dispatch the thunk
      setSuccessSnackbar(true);
      // reset(); // Reset form on success
      onClose(); // Close dialog
    } catch (error) {
      console.error('Failed to create contract:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Book a Session</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'grid', gap: 3 }}>
              {/* Session Details Card */}
              <Card sx={{ p: 3 }}>
                <Typography sx={{ mb: 2 }} variant="h6" gutterBottom>
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
                            <MenuItem value="physical">Physical</MenuItem>
                          </Select>
                        )}
                      />
                      <FormHelperText>{errors.mode?.message}</FormHelperText>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
  <Box sx={{ mb: 2 }}>
    <InputLabel>Subjects</InputLabel>
    <Controller
      name="subjects"
      control={control}
      render={({ field }) => (
        <Select
          {...field}
          fullWidth
          multiple
          value={field.value || []} // Ensure the value is always an array
          onChange={(e) => field.onChange(e.target.value)} // Handle array value updates
          input={<OutlinedInput />}
          renderValue={(selected) =>
            subjects
              .filter((subject) => selected.includes(subject.subject_id))
              .map((subject) => subject.name)
              .join(', ')
          }
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.subject_id} value={subject.subject_id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      )}
    />
    <FormHelperText>{errors.subjects?.message}</FormHelperText>
  </Box>
</Grid>

                </Grid>
              </Card>


              {/* Payment Information Card */}
              {/* <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <RHFTextField
                      name="payment_terms"
                      label="Payment Terms"
                      fullWidth
                      helperText={errors.payment_terms?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <RHFTextField
                      name="status"
                      label="Status"
                      fullWidth
                      helperText={errors.status?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm= {4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick= {handlePrice}
                    >
                      Pay Now
                    </Button>
                  </Grid>
                </Grid>
              </Card> */}
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
  teacher_id: PropTypes.number.isRequired,
};

export default BookSessionDialog;