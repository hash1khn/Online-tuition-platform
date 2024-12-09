'use client';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  IconButton,
  Divider,
  Stack,
  FormHelperText,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  saveStudentData,
  updateStudent,
  fetchStudentData,
  selectStudent,
} from 'src/app/store/slices/studentslice';
import { enqueueSnackbar } from 'notistack';

// Validation schema
const StudentSchema = Yup.object().shape({
  domain: Yup.string().required('Domain is required'),
  subDomain: Yup.string().required('Sub-domain is required'),
  address: Yup.string().required('Address is required'),
  guardianName: Yup.string().required('Guardian name is required'),
  guardianPhone: Yup.string()
    .required('Guardian phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  subjects: Yup.array()
    .of(Yup.string().required('Subject is required'))
    .min(1, 'At least one subject must be added'),
});

export default function StudentEditForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [domains, setDomains] = useState([]);
  const router = useRouter();
  const [subDomains, setSubDomains] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [gradeLevels, setGradeLevels] = useState([]);
  const studentData = useSelector(selectStudent);
  const dispatch = useDispatch();
  const studentState = useSelector(selectStudent);
  const [isNextLoading, setIsNextLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(StudentSchema),
    defaultValues: {
      domain: studentState?.grade_domain || '',
      subDomain: studentState?.grade_sub_level || '',
      address: studentState?.guardian_address || '',
      guardianName: studentState?.guardian_name || '',
      guardianPhone: studentState?.guardian_phone || '',
      subjects: studentState?.subjects || [],
    },
  });
  const isFormPopulated = studentData && Object.values(studentData).some(field => field !== '' && field !== null);
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch('/api/grade-levels');
        const gradeLevelsData = await response.json();
        setGradeLevels(gradeLevelsData);

        const uniqueDomains = [
          ...new Set(gradeLevelsData.map((grade) => grade.domain)),
        ];
        setDomains(uniqueDomains);
      } catch (error) {
        console.error('Failed to fetch domains:', error);
      }
    };

    const fetchStudent = async () => {
      try {
        const result = await dispatch(fetchStudentData()).unwrap();
        if (result) {
          console.log(result)
          Object.keys(result).forEach((key) => {
            if (methods.getValues(key) !== undefined) {
              setValue(key, result[key]);
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/subjects');
        const subjectsData = await response.json();
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };

    fetchDomains();
    fetchSubjects();
    fetchStudent();
  }, [dispatch, methods, setValue,studentState]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    const grade_level_id = gradeLevels.find(
      (grade) => grade.sub_level === data.subDomain
    )?.grade_level_id;

    const subjectIds = data.subjects.map(
      (subjectName) =>
        subjects.find((subject) => subject.name === subjectName)?.subject_id
    );

    const payload = {
      grade_level_id,
      guardian_address: data.address,
      guardian_name: data.guardianName,
      guardian_phone: data.guardianPhone,
      subjects: subjectIds,
    };

    try {
      console.log('hello',payload)
      await dispatch(saveStudentData(payload));
      alert('Form submitted successfully!');
      router.push(paths.dashboard.user.cards)
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainChange = async (e) => {
    const selectedDomain = e.target.value;
    setValue('domain', selectedDomain);
    setSubDomains([]);
    setValue('subDomain', '');

    try {
      const response = await fetch('/api/grade-levels');
      const gradeLevelsFetch = await response.json();
      const filteredSubDomains = gradeLevelsFetch
        .filter((grade) => grade.domain === selectedDomain)
        .map((grade) => grade.sub_level);
      setSubDomains(filteredSubDomains);
    } catch (error) {
      console.error('Failed to fetch sub-domains:', error);
    }
  };

  const handleAddSubject = () => {
    const currentSubjects = watch('subjects') || [];
    setValue('subjects', [...currentSubjects, '']);
  };
  const handleSaveOrUpdate = async (data, action) => {
    const subjectIds = data.subjects.map(
      (subjectName) => subjects.find((subject) => subject.name === subjectName)?.subject_id
    );
    console.log('studentState',studentState)
    setIsNextLoading(true);
  
    const submissionData = {
      ...data,
      subjects:subjectIds,
    };
console.log('data',data);


    try {
      if (action === 'update') {
        await dispatch(saveStudentData(submissionData)).unwrap();
        enqueueSnackbar('Profile updated successfully!', { variant: 'success' });

      } else {
        await dispatch(saveStudentData(submissionData)).unwrap();
        enqueueSnackbar('Profile created successfully!', { variant: 'success' });
      }
      router.push(paths.dashboard.one);
    } catch (error) {
      enqueueSnackbar('Failed to submit form', { variant: 'error' });
    } finally {
      setIsNextLoading(false);
    }
  };

  const handleNextClick = handleSubmit((data) => handleSaveOrUpdate(data, 'save'));
  const handleUpdateClick = handleSubmit((data) => handleSaveOrUpdate(data, 'update'));

  const handleRemoveSubject = (index) => {
    const currentSubjects = watch('subjects') || [];
    const updatedSubjects = currentSubjects.filter((_, i) => i !== index);
    setValue('subjects', updatedSubjects);
  };

  const handleSubjectChange = (index, value) => {
    const currentSubjects = watch('subjects') || [];
    currentSubjects[index] = value;
    setValue('subjects', [...currentSubjects]);
  };

  const subjectCount = watch('subjects')?.length || 0;


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Academic Details */}
        <Card sx={{ p: 3, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Academic Details
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box display="grid" gap={2}>
            {/* Domain */}
            <FormControl fullWidth error={!!errors.domain}>
              <InputLabel>Domain</InputLabel>
              <Controller
                name="domain"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleDomainChange(e);
                    }}
                    label="Domain"
                  >
                    {domains.map((domain) => (
                      <MenuItem key={domain} value={domain}>
                        {domain}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.domain && <FormHelperText>{errors.domain.message}</FormHelperText>}
            </FormControl>

            {/* Sub-Domain */}
            <FormControl fullWidth error={!!errors.subDomain}>
              <InputLabel>Sub-Domain</InputLabel>
              <Controller
                name="subDomain"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Sub-Domain"
                    disabled={!subDomains.length}
                  >
                    {subDomains.map((subDomain) => (
                      <MenuItem key={subDomain} value={subDomain}>
                        {subDomain}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.subDomain && <FormHelperText>{errors.subDomain.message}</FormHelperText>}
            </FormControl>

            {/* Subjects */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">
                Subjects ({subjectCount})
              </Typography>
              <LoadingButton
                variant="outlined"
                startIcon={<AddOutlined />}
                onClick={handleAddSubject}
              >
                Add Subject
              </LoadingButton>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
              }}
            >
              {watch('subjects').map((subject, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <FormControl fullWidth error={!!errors.subjects?.[index]}>
                    <InputLabel>Subject {index + 1}</InputLabel>
                    <Select
                      value={subject}
                      onChange={(e) => handleSubjectChange(index, e.target.value)}
                    >
                      {subjects.map((subjectItem) => (
                        <MenuItem key={subjectItem.subject_id} value={subjectItem.name}>
                          {subjectItem.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.subjects?.[index] && (
                      <FormHelperText>{errors.subjects[index]?.message}</FormHelperText>
                    )}
                  </FormControl>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveSubject(index)}
                    aria-label={`Remove Subject ${index + 1}`}
                  >
                    <DeleteOutlined />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
         {/* Guardian Details */}
         <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Guardian Details
          </Typography>

          <Divider sx={{ mb: 2 }} />
          <Box display="grid" gap={2}>
            <RHFTextField
              name="guardianName"
              label="Guardian Name"
              placeholder="e.g., Abdul Basit"
              error={!!errors.guardianName}
              helperText={errors.guardianName?.message}
            />
            <RHFTextField
              name="guardianPhone"
              label="Guardian Phone Number"
              placeholder="e.g., 1234567890"
              error={!!errors.guardianPhone}
              helperText={errors.guardianPhone?.message}
            />
            <RHFTextField
              name="address"
              label="Address"
              placeholder="e.g., 123 Main St, Springfield"
              error={!!errors.address}
              helperText={errors.address?.message}
              fullWidth
            />
          </Box>
        </Card>

        {/* Save */}
       
      
        <Stack alignItems="flex-end" sx={{ mt: 2 }}>
  <LoadingButton
    type="submit"
    variant="contained"
    onClick={isFormPopulated ? handleSubmit(handleUpdateClick) : handleSubmit(onSubmit)}
    loading={isNextLoading || isLoading} // Updated to include isLoading state
  >
    {isFormPopulated ? 'Update' : 'Save'}
  </LoadingButton>
</Stack>
      </Box>
      {/* </Box> */}
    </FormProvider>
  );
}
