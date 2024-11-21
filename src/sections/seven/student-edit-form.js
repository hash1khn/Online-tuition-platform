'use client';

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { MenuItem, Select, InputLabel, FormControl, Typography, FormHelperText } from '@mui/material';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; 
import { saveStudentData,updateStudent } from 'src/app/store/slices/studentslice';

// ----------------------------------------------------------------------

export default function StudentEditForm({ currentStudent }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const StudentSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    guardianName: Yup.string().required('Guardian name is required'),
    guardianPhone: Yup.string()
      .required('Guardian phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
    subjects: Yup.array()
      .of(Yup.string().required('Subject is required'))
      .min(1, 'At least one subject must be added'),
    grade: Yup.string().required('Grade level is required'),
  });

  const methods = useForm({
    resolver: yupResolver(StudentSchema),
    defaultValues: {
      name: currentStudent?.name || '',
      address: currentStudent?.address || '',
      phone: currentStudent?.phone || '',
      guardianName: currentStudent?.guardianName || '',
      guardianPhone: currentStudent?.guardianPhone || '',
      subjects: currentStudent?.subjects || [],
      grade: currentStudent?.grade || '',
    },
  });

  const { handleSubmit, control, watch, setValue, formState: { errors } } = methods;

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('Form Data Submitted:', data);

    dispatch(updateStudent({ ...data, id: currentStudent.id }));

    setTimeout(() => {
      setIsLoading(false);
      alert('Form submitted successfully!');
    }, 1500);
  };

  const handleAddSubject = () => {
    const subjects = watch('subjects');
    setValue('subjects', [...subjects, '']);
  };

  const handleRemoveSubject = (index) => {
    const subjects = watch('subjects');
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setValue('subjects', updatedSubjects);
  };

  const handleSubjectChange = (index, value) => {
    const subjects = watch('subjects');
    subjects[index] = value;
    setValue('subjects', [...subjects]);
  };

  const subjectCount = watch('subjects').length;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Academic Details */}
        <Card sx={{ p: 3, mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Academic Details
          </Typography>
          <Box display="grid" gap={2}>
            {/* Grade Level */}
            <FormControl fullWidth error={!!errors.grade}>
              <InputLabel>Grade Level</InputLabel>
              <Controller
                name="grade"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Grade Level">
                    <MenuItem value="O level">O level</MenuItem>
                    <MenuItem value="A level">A level</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                  </Select>
                )}
              />
              {errors.grade && (
                <FormHelperText>{errors.grade.message}</FormHelperText>
              )}
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Flexible layout
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
                  <RHFTextField
                    name={`subjects[${index}]`}
                    label={`Subject ${index + 1}`}
                    placeholder="e.g., Mathematics"
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    fullWidth
                  />
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
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} // 1 column for small screens, 2 for larger
            gap={2}
          >
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
          </Box>
          <Box sx={{ mt: 2 }}>
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
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Stack alignItems="flex-end">
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
            >
              Save
            </LoadingButton>
          </Stack>
        </Box>
      </Box>
    </FormProvider>
  );
}

StudentEditForm.propTypes = {
  currentStudent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string, // Add this line
    phone: PropTypes.string, 
    guardianName: PropTypes.string,
    guardianPhone: PropTypes.string,
    address: PropTypes.string,
    subjects: PropTypes.arrayOf(PropTypes.string),
    grade: PropTypes.string,
  }),
};
