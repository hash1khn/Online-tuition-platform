import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const saveUser = createAsyncThunk(
  'user/saveUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/teachers/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to save user data');
      }
      const data = await response.json(); // Returns the saved user data

      localStorage.setItem('teacher_id', data.teacher.teacher_id);
      return data; // Returns the saved user data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Thunk for updating existing user data
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/teachers/update-teacher-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      const data = await response.json();
      return data; // Returns the updated user data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  education: '',
  experience_years: '',
  bio: '',
  teachingMode: 'online',
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEducation: (state, action) => {
      state.education = action.payload;
    },
    setExperienceYears: (state, action) => {
      state.experience_years = action.payload;
    },
    setBio: (state, action) => {
      state.bio = action.payload;
    },
    setTeachingMode: (state, action) => {
      state.teachingMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases for saveUser thunk
      .addCase(saveUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload); // Update state with saved user data
      })
      .addCase(saveUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cases for updateUser thunk
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload); // Update state with updated user data
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setEducation,
  setExperienceYears,
  setBio,
  setTeachingMode,
} = userSlice.actions;

export default userSlice.reducer;