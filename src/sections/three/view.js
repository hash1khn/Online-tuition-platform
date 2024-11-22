'use client';

import React, {useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { saveService,fetchGradeLevels,fetchSubjects } from 'src/app/store/slices/serviceslice';
import { fetchTeacherByUserId1 } from 'src/app/store/slices/teacherslice';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
// Sample domains data
// const domains = [
//   { domain: 'O-level', subLevels: ['O1', 'O2', 'O3'] },
//   { domain: 'A-level', subLevels: ['AS', 'A2'] },
//   { domain: 'Intermediate', subLevels: ['Part 1', 'Part 2'] },
// ];


const subjects = [
  'Math',
  'Science',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Business'
];


// Yup validation schema
const validationSchema = Yup.object({
  subject: Yup.array().min(1, 'At least one subject is required').required('Subject is required'),
  domain: Yup.array().min(1, 'At least one domain is required').required('Domain is required'),
  subLevel: Yup.array().min(1, 'At least one sublevel is required').required('Sublevel is required'),
  duration: Yup.string().required('Duration is required'),
  fees: Yup.number()
    .required('Fees are required')
    .positive('Fees must be a positive number')
    .typeError('Fees must be a number'),
  discount: Yup.number()
    .required('Discount is required')
    .positive('Discount must be a positive number')
    .typeError('Discount must be a number'),
});


export default function Service(currentUser) {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState([]);
  const [selectedSubLevel, setSelectedSubLevel] = useState('');
  const [errorBar, setErrorBar] = useState(false);
    const [isBackLoading, setIsBackLoading] = useState(false);
  const [successBar, setSuccessBar] = useState(false);
  const dispatch = useDispatch();
  const { subjects, gradeLevels, loading } = useSelector((state) => state.service);

  const service = useSelector((state) => state.service);

  // React Hook Form setup

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      subject: [],
      domain: [],
      subLevel: [],
      duration: '',
      fees: '',
      discount: '',
    },
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors }, 
  } = methods;
  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchGradeLevels());
  }, [dispatch]);

const onSubmit = (data) => {
  try {
    const gradeLevelIds = data.subLevel.map((subLevel) => 
      gradeLevels.find((level) => level.sub_level === subLevel)?.grade_level_id
    );
    const subjectIds = data.subject.map((subject) => 
      subjects.find((subj) => subj.name === subject)?.subject_id
    );
    const payload = {
      hourly_rate: data.fees, 
      duration_per_session: data.duration,
      grade_levels: gradeLevelIds,
      subjects: subjectIds,
    };
    console.log('Submitting Payload:', payload);

    dispatch(saveService(payload));
    setSuccessBar(true);
  } catch (error) {
    console.error('Submission error:', error);
    setErrorBar(true); // Display error message if submission fails
  }
};


  // Handle domain selection
  const handleDomainSelect = (e) => {
    const selectedDomainValue = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
    const selectedSubLevels = selectedDomainValue.flatMap((domain) =>
      domains.find((domainObj) => domainObj.domain === domain)?.subLevels || []
    );
    setSelectedDomain(selectedDomainValue);
    setSelectedSubLevel([]);
    setValue('domain', selectedDomainValue);
    setValue('subLevel', []);
  };

  const handleNextClick = () => {
    handleSubmit(onSubmit)();
  };

  const handleBackClick = () => {
    setIsBackLoading(true);
    setTimeout(() => {
      router.push(paths.dashboard.two);
      setIsBackLoading(false);
    }, 1000); // Simulate async call
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Select Details
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography sx={{ mb: 5 }} variant="h6" gutterBottom>
                    Choose Subject, Domain, and Grade Level
                  </Typography>

                  {/* Dropdown for Subject */}
                  <FormControl fullWidth sx={{ mb: 5 }} error={Boolean(errors.subject)}>
  <InputLabel id="subject-label">Choose Subject(s)</InputLabel>
  <Controller
    name="subject"
    control={control}
    render={({ field }) => (
      <Select labelId="subject-label" label="Choose Subject(s)" multiple {...field}>
        {subjects.map((subject) => (
          <MenuItem key={subject.subject_id} value={subject.name}>
            {subject.name}
          </MenuItem>
        ))}
      </Select>
    )}
  />
  {/* Display error message if subject has an error */}
  {errors.subject && <Typography color="error">{errors.subject.message}</Typography>}
</FormControl>


                  {/* Dropdown for Domain */}
                 
<FormControl fullWidth sx={{ mb: 5 }} error={Boolean(errors.domain)}>
  <InputLabel id="domain-label">Choose Domain</InputLabel>
  <Controller
    name="domain"
    control={control}
    render={({ field }) => (
      <Select
        labelId="domain-label"
        label="Choose Domain(s)"
        multiple
        value={selectedDomain}
        {...field}
        onChange={(e) => {
          const selectedDomains = e.target.value;
          field.onChange(selectedDomains);
          setSelectedDomain(selectedDomains); // Update selected domain state
          setSelectedSubLevel([]); // Reset sublevels when domain changes
          setValue('subLevel', []); // Clear sublevel values in form
        }}
      >
        {[...new Set(gradeLevels.map((gl) => gl.domain))].map((domain) => (
          <MenuItem key={domain} value={domain}>
            {domain}
          </MenuItem>
        ))}
      </Select>
    )}
  />
  {errors.domain && (
    <Typography color="error">{errors.domain.message}</Typography>
  )}
</FormControl>

{/* Dropdown for Sublevel */}
<FormControl fullWidth sx={{ mb: 5 }} error={Boolean(errors.subLevel)}>
  <InputLabel id="sublevel-label">Choose Sublevel</InputLabel>
  <Controller
    name="subLevel"
    control={control}
    render={({ field }) => (
      <Select
        labelId="sublevel-label"
        label="Choose Sublevel(s)"
        multiple
        value={field.value || selectedSubLevel}
        onChange={(e) => {
          const selectedSubLevels = e.target.value;
          field.onChange(selectedSubLevels);
          setSelectedSubLevel(selectedSubLevels); // Update selected sublevel state
        }}
        disabled={!selectedDomain.length} // Disable sublevels until a domain is selected
        {...field}
      >
        {gradeLevels
          .filter((gl) => selectedDomain.includes(gl.domain))
          .map((subLevel) => (
            <MenuItem key={subLevel.grade_level_id} value={subLevel.sub_level}>
              {subLevel.sub_level}
            </MenuItem>
          ))}
      </Select>
    )}
  />
  {errors.subLevel && (
    <Typography color="error">{errors.subLevel.message}</Typography>
  )}
</FormControl>


                  <Snackbar
                    open={errorBar}
                    autoHideDuration={3000}
                    // onClose={() => setErrorBar(false)}
                    onClose={() => setSuccessBar(false)} 
                  >
                    <Alert onClose={() => setErrorBar(false)} severity="error">
                      Please select a domain first!
                    </Alert>
                  </Snackbar>
                </CardContent>
              </Card>
              <Card sx={{ mt: 5 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 5 }}>
                    Duration
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.duration)}>
                    <InputLabel id="duration-label">Select Duration</InputLabel>
                    <Controller
                      name="duration"
                      control={control}
                      render={({ field }) => (
                        <Select labelId="duration-label" label="Select Duration" {...field}>
                          <MenuItem value={30}>30 min</MenuItem>
                          <MenuItem value={60}>60 min</MenuItem>
                          <MenuItem value={90}>90 min</MenuItem>
                          <MenuItem value={120}>120 min</MenuItem>
                        </Select>
                      )}
                    />
                    {errors.duration && (
                      <Typography color="error">{errors.duration.message}</Typography>
                    )}
                  </FormControl>
                </CardContent>
              </Card>
              <Card sx={{ mt: 5 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 5 }}>
                    Fees and Discounts
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex', // Set display to flex
                      gap: 2, // Add space between fields
                      flexDirection: { xs: 'column', sm: 'row' }, // Column on small screens, row on larger screens
                    }}
                  >
                    <RHFTextField
                      name="fees"
                      label="Fees"
                      variant="outlined"
                      type="number"
                      inputProps={{ min: 0 }} // Ensure only positive values are allowed
                      fullWidth // Makes the input take the full width of its container
                    />
                    <RHFTextField
                      name="discount"
                      label="Discount"
                      variant="outlined"
                      type="number"
                      sx={{ mb: 5 }}
                      inputProps={{ min: 0 }} // Ensure only positive values are allowed
                      fullWidth // Makes the input take the full width of its container
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <LoadingButton
          type="submit"
          variant="contained"
          onClick={handleBackClick}
          loading={isBackLoading}
        >
          Back
        </LoadingButton>
            <LoadingButton variant="contained" onClick={handleNextClick}>
              Next
            </LoadingButton>
        </Box>
        <Snackbar
          open={successBar}
          autoHideDuration={30000}
          onClose={() => setSuccessBar(false)}
        >
          <Alert onClose={() => setSuccessBar(false)} severity="success">
            User information has been updated!
          </Alert>
        </Snackbar>
      </Container>
    </FormProvider>
  );
}
Service.propTypes = {
  currentUser: Service.object,
};