'use client';

import * as Yup from 'yup';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { useForm, Controller } from 'react-hook-form';
import { useState,useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui components
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// hooks and other imports
import { useBoolean } from 'src/hooks/use-boolean';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { PATH_AFTER_SIGNUP } from 'src/config-global';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { RHFSelect } from 'src/components/hook-form/rhf-select';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField } from 'src/components/hook-form';


export default function JwtRegisterView() {
  const { control, watch, setValue } = useForm();
  const { register } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const password = useBoolean();
  const [cities, setCities] = useState([]); // State to store cities
  const [selectedCity, setSelectedCity] = useState('');

    // Fetch cities from backend on component load
    useEffect(() => {
      const fetchCities = async () => {
        try {
          const response = await fetch('/api/cities'); // Adjust API URL as needed
          const data = await response.json();
          console.log(data); // Log the cities data for debugging
          setCities(data); // Assuming data is an array of city objects with id and name
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      };
      
      fetchCities();
    }, []);

  // Validation schema
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    gender: Yup.string().required('gender is required'),
    dob: Yup.date().required('Date of birth is required'),
    city_id: Yup.number().required('City is required').integer(), // city_id is an integer
    area: Yup.string().required('area code is required'),
    role: Yup.string().required('role code is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: '',
    city_id: '',
    area: '', 
    role: 'student',
    dob: null, // Add dob to the default values
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting ,errors},
    reset,
  } = methods;
  console.log('form errors',errors)
  
  const onSubmit = async (data) => {
    console.info('Form submitted with data:', data);
  
    // Transform form data to match the required backend format
    const formData = {
      email: data.email,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`, // Combine first and last name
      phone_number: data.phoneNumber,
      gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase(), // Capitalize gender
      dob: data.dob.toISOString().split('T')[0], // Convert date to YYYY-MM-DD format
      city_id: parseInt(data.city_id, 10), // Convert city_id to an integer
      area: data.area,
      role: data.role.toLowerCase(),
    };
  
    try {
      console.info('Transformed formData:', formData); // Log the transformed data
  
      // Attempt to register the user
      console.log('Calling register function...');
      await register?.(formData, () => {
        console.log('Redirecting to login page...');
        router.push(paths.auth.jwt.login); // Redirect after successful registration
      });
  
      console.log('Registration successful. Resetting form...');
      reset(); // Reset the form after successful registration
      setErrorMsg(''); // Clear error messages
    } catch (error) {
      console.error('Registration error:', error);
  
      // Handle error messages
      setErrorMsg(
        error.response?.data?.message || typeof error === 'string' ? error : 'Registration failed'
      );
      reset(); // Reset form even on error
    }
  };

  return (
    <>
      {/* Header */}
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Get started absolutely free</Typography>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>
          <Link href='/auth/jwt/login/?returnTo=%2Fdashboard%2Fuser%2Fnew%2F' component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>

      {/* Form */}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

          {/* First Name and Last Name */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="firstName" label="First name" />
            <RHFTextField name="lastName" label="Last name" />
          </Stack>

          {/* Email and Password */}
          <RHFTextField name="email" label="Email address" />
          <RHFTextField
            name="password"
            label="Password"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Phone Number and Gender */}
          <Stack direction="row" spacing={2}>
            <RHFTextField name="phoneNumber" label="Phone number" />
            <RHFSelect name="gender" label="Gender">
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </RHFSelect>
          </Stack>

          {/* Date of Birth Fields */}
          <RHFTextField
            name="dob"
            label="Date of Birth"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ '& .MuiInputLabel-root': { top: '-5px' } }} // Custom styling
          />

           {/* City Dropdown */}
           <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Controller
              name="city_id"
              control={methods.control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    field.onChange(e); // Update form state
                  }}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <RHFTextField name="area" label="Area" />

          {/* Role Checkboxes */}

          <Stack direction="row" spacing={2}>
  <Controller
    name="role"
    control={methods.control}
    defaultValue="student" // Set a default role
    render={({ field }) => (
      <RadioGroup {...field} row>
        <FormControlLabel
          value="student"
          control={<Radio />}
          label="Sign up as Learner"
          onChange={(e) => field.onChange(e.target.value)} // Update form state
        />
        <FormControlLabel
          value="teacher"
          control={<Radio />}
          label="Sign up as Tutor"
          onChange={(e) => field.onChange(e.target.value)} // Update form state
        />
      </RadioGroup>
    )}
  />
</Stack>
          {/* Submit Button */}
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create account
          </LoadingButton>
        </Stack>
      </FormProvider>

      {/* Terms and Conditions */}
      <Typography
        component="div"
        sx={{ color: 'text.secondary', mt: 2.5, typography: 'caption', textAlign: 'center' }}
      >
        {'By signing up, I agree to '}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>
        {' and '}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
        .
      </Typography>
    </>
  );
}
