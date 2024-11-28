'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Checkbox,
  IconButton,
  FormControlLabel,
  Select,
  MenuItem,
  Button,
  Card,
  FormLabel,
  InputLabel,
} from '@mui/material';
import { Icon } from '@iconify/react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSettingsContext } from 'src/components/settings';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { saveAvailability, updateAvailability, getAvailability } from 'src/app/store/slices/availabilityslice';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const times = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM',
];

const convertToDate = (timeString) => {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return new Date(0, 0, 0, hours, minutes);
};

const validationSchema = Yup.object().shape({
  availability: Yup.object().shape(
    days.reduce((acc, day) => {
      acc[day] = Yup.object().shape({
        checked: Yup.boolean().required(),
        slots: Yup.array().of(
          Yup.object().shape({
            start: Yup.string().required(),
            end: Yup.string()
              .required()
              .test('is-greater', 'End time must be greater than start time', function (value) {
                const { start } = this.parent;
                return convertToDate(value) > convertToDate(start);
              }),
          })
        ),
      });
      return acc;
    }, {})
  ),
});

export default function AvailabilityView() {
  const router = useRouter();
  const settings = useSettingsContext();
  const dispatch = useDispatch();
  const availabilityState = useSelector((state) => state.availability);

  const [isBackLoading, setIsBackLoading] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isFormPopulated, setIsFormPopulated] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      availability: days.reduce((acc, day) => {
        acc[day] = {
          checked: false,
          slots: [],
        };
        return acc;
      }, {}),
    },
  });

  useEffect(() => {
    dispatch(getAvailability())
      .unwrap()
      .then((data) => {
        if (data) {
          console.log(data)
          // Transform API response into the required form format
          const availabilityData = days.reduce((acc, day) => {
            const daySlots = data.filter((slot) => slot.day === day);
            acc[day] = {
              checked: daySlots.length > 0, // Set `checked` to true if slots exist
              slots: daySlots.map((slot) => ({
                start: new Date(`1970-01-01T${slot.start_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                end: new Date(`1970-01-01T${slot.end_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              })),
            };
            return acc;
          }, {});

          days.forEach((day) => {
            setValue(`availability.${day}.checked`, availabilityData[day].checked);
            setValue(`availability.${day}.slots`, availabilityData[day].slots);
          });
          setIsFormPopulated(true);
        }
      });
  }, [dispatch, setValue]);

  const handleBackClick = () => {
    setIsBackLoading(true);
    setTimeout(() => {
      router.push(paths.dashboard.one);
      setIsBackLoading(false);
    }, 1000);
  };

  const onSubmit = async (data) => {
    setIsNextLoading(true);

    try {
      if (isFormPopulated) {
        await dispatch(updateAvailability(data)).unwrap();
      } else {
        await dispatch(saveAvailability(data)).unwrap();
      }
      router.push(paths.dashboard.three);
    } catch (error) {
      console.error('Error submitting availability:', error);
    } finally {
      setIsNextLoading(false);
    }
  };

  const addSlot = (day) => {
    const currentSlots = getValues(`availability.${day}.slots`);
    const newSlot = { start: '09:00 AM', end: '05:00 PM' };
    setValue(`availability.${day}.slots`, [...currentSlots, newSlot]);
  };

  const removeSlot = (day, index) => {
    const currentSlots = getValues(`availability.${day}.slots`);
    const newSlots = currentSlots.filter((_, idx) => idx !== index);
    setValue(`availability.${day}.slots`, newSlots);
  };

  const handleCheckboxChange = (day) => {
    const isChecked = getValues(`availability.${day}.checked`);
    setValue(`availability.${day}.checked`, !isChecked);
    if (!isChecked) {
      setValue(`availability.${day}.slots[0].start`, '09:00 AM');
      setValue(`availability.${day}.slots[0].end`, '05:00 PM');
    } else {
      setValue(`availability.${day}.slots`, []);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography variant="h5" sx={{ mb: 4, fontSize: '1.25rem' }}>
        Availability
      </Typography>
  
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {days.map((day) => (
              <Card key={day} sx={{ p: 3, mb: 3 }}>
               <Grid container spacing={2} alignItems="flex-start" justifyContent="space-between">
  <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'flex-start' }}>
    <Controller
      name={`availability.${day}.checked`}
      control={control}
      render={({ field }) => (
<FormControlLabel
  control={
    <Checkbox
      {...field}
      checked={field.value}
      onChange={() => handleCheckboxChange(day)}
      sx={{ padding: '0 8px 0 0' }} // Adjust spacing between checkbox and label
    />
  }
  label={
    <Typography variant="body2" sx={{ fontSize: '1rem' }}>
      {day}
    </Typography>
  }
  sx={{ display: 'flex', mb: 2 }} // Ensures both are on the same line
/>

      )}
    />
  </Grid>

  <Grid item xs={12} sm={9} sx={{ flexGrow: 1 }}>
    <Controller
      name={`availability.${day}.slots`}
      control={control}
      render={({ field }) => (
        <Box>
          {field.value.map((slot, index) => (
            <Grid container spacing={2} alignItems="center" key={index}>
              <Grid item xs={12} sm={5}>
                <InputLabel htmlFor={`start-time-${day}-${index}`} sx={{ fontSize: '0.875rem', mb: 1 }}>
                  Start Time
                </InputLabel>
                <Select
                  id={`start-time-${day}-${index}`}
                  fullWidth
                  value={slot.start}
                  onChange={(e) => {
                    const updatedSlots = [...field.value];
                    updatedSlots[index].start = e.target.value;
                    setValue(`availability.${day}.slots`, updatedSlots);
                  }}
                  variant="outlined"
                  displayEmpty
                  sx={{ height: '56px', mb: 1 }}
                >
                  {times.map((time) => (
                    <MenuItem key={time} value={time}>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {time}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12} sm={5}>
                <InputLabel htmlFor={`end-time-${day}-${index}`} sx={{ fontSize: '0.875rem', mb: 1 }}>
                  End Time
                </InputLabel>
                <Select
                  id={`end-time-${day}-${index}`}
                  fullWidth
                  value={slot.end}
                  onChange={(e) => {
                    const updatedSlots = [...field.value];
                    updatedSlots[index].end = e.target.value;
                    setValue(`availability.${day}.slots`, updatedSlots);
                  }}
                  variant="outlined"
                  displayEmpty
                  sx={{ height: '56px', mb: 1 }}
                >
                  {times.map((time) => (
                    <MenuItem key={time} value={time}>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {time}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
                {errors.availability?.[day]?.slots?.[index]?.end && (
                  <Typography color="error" sx={{ fontSize: '0.75rem', mb: 1 }}>
                    {errors.availability[day].slots[index].end.message}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={2}>
                <IconButton color="error" onClick={() => removeSlot(day, index)}>
                  <Icon icon="ion:trash-outline" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => addSlot(day)} variant="outlined">
              Add Slot
            </Button>
          </Box>
        </Box>
      )}
    />
  </Grid>
</Grid>
              </Card>
            ))}
          </Grid>
        </Grid>
  
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <LoadingButton
            type="button"
            loading={isBackLoading}
            onClick={handleBackClick}
            variant="contained"
            color="inherit"
          >
            Back
          </LoadingButton>
          <LoadingButton type="submit" variant="contained" loading={isNextLoading}>
            {isFormPopulated ? 'Update' : 'Next'}
          </LoadingButton>
        </Box>
      </form>
    </Container>
  );
}
