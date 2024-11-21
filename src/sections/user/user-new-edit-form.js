import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { MenuItem, FormControlLabel, Switch } from '@mui/material';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar, RHFSelect } from 'src/components/hook-form';
// Import the fetchCities and selectCities

import { useRouter } from 'src/routes/hooks';
import { fData } from 'src/utils/format-number';
import { paths } from 'src/routes/paths';
import { getUserById, saveUser } from '../../app/store/slices/userSlice';
import { fetchCities, selectCities } from '../../app/store/slices/citySlice'; 
import  {uploadImageToCloudinary} from '../../utils/uploadImage';


export default function UserNewEditForm({ userId }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state) => state.user.currentUser);
  const cities = useSelector(selectCities); // Get cities from the Redux store
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [isNextLoading, setIsNextLoading] = useState(false);

  console.log(currentUser);
  // Adjust according to your Redux state

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('Gender is required'),
    city: Yup.string().required('City is required'),
    dob: Yup.date()
      .nullable()
      .required('Date of birth is required')
      .typeError('Must be a valid date')
      .max(new Date(), 'Date of birth cannot be in the future'),
    area: Yup.string().required('Area code is required'),
    profile_picture: Yup.mixed().nullable(),
    isVerified: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    dispatch(getUserById());
    dispatch(fetchCities());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      console.log('Setting form values for user:', currentUser);
      const [firstName, ...lastNameArr] = currentUser.name.split(' ');
      const lastName = lastNameArr.join(' '); // Join the rest in case of multiple last names
      reset({
        firstName: firstName || '',
        lastName: lastName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phone_number || '', // Adjusted to match backend field
        gender: currentUser.gender || '', // Normalize to lowercase
        dob: currentUser.dob ? currentUser.dob.split('T')[0] : '',
        area: currentUser.area || '',
        city: currentUser.city_id || '', // Adjust if you're fetching city names separately // Adjust according to your backend data
        profile_picture: currentUser.profile_picture || null,
        isVerified: currentUser.isVerified || true,
      });
      setSelectedCity(currentUser.city_id || '');
      setSelectedGender(currentUser.gender || '');
    }
  }, [currentUser, reset]);
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setValue('city', e.target.value); // Update the form value as well
  };
  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
    setValue('gender', e.target.value); // Update the form value as well
  };

  const onSubmit = async (data) => {

    try {
      // Prepare the data to match the backend structure
      const payload = {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`, // Concatenate first and last name
        phone_number: data.phoneNumber, // Map to backend expected field
        gender: data.gender,
        city_id: data.city, // Ensure this matches your backend's expected field name
        area: data.area,
        dob: data.dob,
        profile_picture: data.profile_picture, // If needed, map this to the expected field
      };
      console.log('printing payload:',payload)
  
      // Dispatch the saveUser action with the prepared payload
      await dispatch(saveUser(payload)).unwrap(); // Use your save user action here
      
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!', { variant: 'success' });
      router.push(paths.dashboard.user.complete);
    } catch (error) {
      console.error(error);
      // enqueueSnackbar('Failed to save user: '+ error.message, { variant: 'error' }); // Notify error
    }
  };

// Modify the handleDrop function
const handleDrop = useCallback(
  async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const previewUrl = URL.createObjectURL(file);
        
        // Set the preview in the form (for displaying locally before upload)
        setValue('profile_picture', previewUrl, { shouldValidate: true });
        // Upload image to Cloudinary
        const cloudinaryUrl = await uploadImageToCloudinary(file);
        console.log('Cloudinary URL received:', cloudinaryUrl); // Debug: Verify URL from Cloudinary

        // Set Cloudinary URL in form
        setValue('profile_picture', cloudinaryUrl, { shouldValidate: true });
        console.log('Form state avatarUrl set to:', cloudinaryUrl); // Debug: Verify URL assignment
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        enqueueSnackbar('Failed to upload image', { variant: 'error' });
      }
    }
  },
  [setValue, enqueueSnackbar]
);

  const handleNextClick = () => {
    const formValues = methods.getValues();
  
    NewUserSchema.validate(formValues, { abortEarly: false })
      .then(() => {
        setIsNextLoading(true);
        setTimeout(() => {
          router.push(paths.dashboard.user.complete);
          setIsNextLoading(false);
        }, 1000);
      })
      .catch((validationErrors) => {
        enqueueSnackbar('Please fill in all required fields before proceeding.', { variant: 'warning' });
  
        validationErrors.inner.forEach((error) => {
          enqueueSnackbar(error.message, { variant: 'warning' });
        });
      });
  };
  

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="profile_picture"
                maxSize={3145728}
                value={methods.watch('profile_picture')}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
            {/* {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={methods.control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={<Typography variant="subtitle2">Banned</Typography>}
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )} */}
            {/* {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )} */}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="firstName"
                  label="First Name"
                  InputLabelProps={{
                    shrink: methods.getValues('firstName') ,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="lastName"
                  label="Last Name"
                  InputLabelProps={{
                    shrink: methods.getValues('lastName') ,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="email"
                  label="Email Address"
                  InputLabelProps={{
                    shrink: methods.getValues('email') ,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="phoneNumber"
                  label="Phone Number"
                  InputLabelProps={{
                    shrink: methods.getValues('phoneNumber') ,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="gender"
                  control={methods.control}
                  render={({ field }) => (
                    <RHFSelect
                      {...field}
                      label="Gender"
                      value={selectedGender}
                      onChange={handleGenderChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>{' '}
                      {/* Add any additional options as needed */}
                    </RHFSelect>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="area"
                  label="Area"
                  InputLabelProps={{
                    shrink: methods.getValues('area') ,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="city"
                  control={methods.control}
                  render={({ field }) => (
                    <RHFSelect
                      {...field}
                      label="City"
                      value={selectedCity}
                      onChange={handleCityChange}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.city_id} value={city.city_id}>
                          {city.city_name}
                        </MenuItem>
                      ))}
                    </RHFSelect>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="dob"
                  label="Date of Birth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiInputLabel-root': { top: '5px' } }} // Custom styling
                />
              </Grid>
            </Grid>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                variant="contained"
                loading={isSubmitting || isNextLoading}
                onClick={currentUser ? handleSubmit(onSubmit) : handleNextClick}
              >
                {currentUser ? 'Update' : 'Next'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

UserNewEditForm.propTypes = {
  userId: PropTypes.string.isRequired, // Pass the userId as a prop
};
