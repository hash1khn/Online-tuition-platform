import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get availability data (API call to retrieve all availability data)
export const getAvailability = createAsyncThunk(
  'availability/getAvailability',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/teachers/get-teacher-availability`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch specific teacher availability by teacher_id
export const getTeacherAvailability = createAsyncThunk(
  'availability/getTeacherAvailability',
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/teachers/${teacherId}/availability`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Save new availability data (API call to save data)
export const saveAvailability = createAsyncThunk(
  'availability/saveAvailability',
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/teachers/save-teacher-availability', availabilityData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update existing availability data (API call to update data)
export const updateAvailability = createAsyncThunk(
  'availability/updateAvailability',
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/teachers/update-teacher-availability', availabilityData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  availability: {},
  loading: false,
  error: null,
};

const availabilitySlice = createSlice({
  name: 'availability',
  initialState,
  reducers: {
    toggleDayAvailability: (state, action) => {
      const { day } = action.payload;
      const isChecked = state.availability[day]?.checked;
      state.availability[day] = {
        checked: !isChecked,
        slots: isChecked ? [] : [{ start: '09:00 AM', end: '05:00 PM' }],
      };
    },
    addSlot: (state, action) => {
      const { day } = action.payload;
      state.availability[day]?.slots.push({ start: '09:00 AM', end: '05:00 PM' });
    },
    removeSlot: (state, action) => {
      const { day, index } = action.payload;
      state.availability[day]?.slots.splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(getAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTeacherAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(getTeacherAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(saveAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload;
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleDayAvailability, addSlot, removeSlot } = availabilitySlice.actions;

export default availabilitySlice.reducer;
