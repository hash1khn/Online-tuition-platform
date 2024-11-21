import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { saveUser, updateUser } from 'src/app/store/slices/setupslice';
import { fetchTeacherByUserId1, selectTeacher } from 'src/app/store/slices/teacherslice';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useSnackbar } from 'src/components/snackbar';
import React, { useState, useEffect } from 'react';

export default function UserEditForm({ currentUser }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const teacherData = useSelector(selectTeacher); 
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [languages, setLanguages] = useState([]);

  const NewUserSchema = Yup.object().shape({
    experience_years: Yup.number()
      .typeError('Experience years are required')
      .required('Experience years are required')
      .min(0, 'Experience years must be 1 or more')
      .max(100, 'Experience years must be realistic'),
    education: Yup.string()
      .required('Education is required')
      .max(100, 'Education details must not exceed 100 characters'),
    bio: Yup.string()
      .required('Bio is required')
      .max(500, 'Bio must not exceed 500 characters'),
    teaching_mode: Yup.string()
      .oneOf(['online', 'physical', 'hybrid'], 'Teaching mode must be online, physical, or hybrid')
      .required('Teaching mode is required'),
    languages: Yup.array()
      .of(Yup.string().required('Language is required'))
      .min(1, 'At least one language must be selected'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues: {
      education: '',
      experience_years: '',
      bio: '',
      teaching_mode: 'online',
      languages: [],
    },
  });

  const { handleSubmit, control, reset } = methods;

  useEffect(() => {
    if (!currentUser) {
      dispatch(fetchTeacherByUserId1());
      console.log('mycurrent', currentUser);
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (teacherData) {
      reset({
        education: teacherData.education || '',
        experience_years: teacherData.experience_years || '',
        bio: teacherData.bio || '',
        teaching_mode: teacherData.teaching_mode || 'online',
        languages: teacherData.languages || [],
      });
    }
  }, [teacherData, reset]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages');
        if (!response.ok) throw new Error('Failed to fetch languages');
        const data = await response.json();
        setLanguages(data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  const handleSaveOrUpdate = async (data, action) => {
    setIsNextLoading(true);
    const languageIds = data.languages.map(
      (languageName) => languages.find((lang) => lang.name === languageName)?.language_id
    );
    const submissionData = {
      ...data,
      languages: languageIds,
    };

    try {
      if (action === 'update') {
        await dispatch(updateUser(submissionData)).unwrap();
        enqueueSnackbar('Profile updated successfully!', { variant: 'success' });

      } else {
        await dispatch(saveUser(submissionData)).unwrap();
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

  const handleBackClick = () => {
    setIsBackLoading(true);
    setTimeout(() => {
      router.push(paths.dashboard.user.new);
      setIsBackLoading(false);
    }, 1000);
  };

  const isFormPopulated = teacherData && Object.values(teacherData).some(field => field !== '' && field !== null);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleNextClick)}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
          gap={2}
        >
          <RHFTextField name="education" label="Education" />
          <RHFTextField name="experience_years" label="Years of Experience" type="number" />
          
          <FormControl fullWidth>
            <InputLabel>Teaching Mode</InputLabel>
            <Controller
              name="teaching_mode"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Teaching Mode">
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="physical">Physical</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Languages</InputLabel>
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  multiple
                  value={field.value || []}
                  onChange={(e) => field.onChange(e.target.value)}
                  label="Languages"
                >
                  {languages.map((language) => (
                    <MenuItem key={language.language_id} value={language.name}>
                      {language.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Box>
      </Card>

      <Card sx={{ p: 3 }}>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr' }}>
          <RHFTextField name="bio" label="Bio" multiline rows={4} />
        </Box>
      </Card>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Stack sx={{ mt: 2 }}>
          <LoadingButton type="button" variant="contained" onClick={handleBackClick} loading={isBackLoading}>
            Back
          </LoadingButton>
        </Stack>
        <Stack alignItems="flex-end" sx={{ mt: 2 }}>
          <LoadingButton
            type="submit"
            variant="contained"
            onClick={isFormPopulated ? handleUpdateClick : handleNextClick}k={handleNextClick}
            loading={isNextLoading}
          >
            {isFormPopulated ? 'Update' : 'Next'}
          </LoadingButton>
        </Stack>
      </Box>
    </FormProvider>
  );
}

UserEditForm.propTypes = {
  currentUser: PropTypes.object,
};
