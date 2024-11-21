import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for fetching teacher data
// Thunk for fetching teacher data
export const fetchTeachers = createAsyncThunk('teachers/fetchTeachers', async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch('/api/teachers/get-all-teachers/');
    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }
    const data = await response.json(); // The API response is an array of teacher objects
    return data;
  } catch (error) {
    // If an error occurs, throw it to be caught in the rejected case of the thunk
    throw error;
  }
});
// Thunk for fetching a teacher by user ID
export const fetchTeacherByUserId = createAsyncThunk(
  'teachers/fetchTeacherByUserId',
  async (teacherId, { rejectWithValue }) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      return rejectWithValue('No token found. Please log in.');
    }

    try {
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch teacher');
      }

      return await response.json(); // Return teacher data
    } catch (error) {
      // Return the error message in the rejected case
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);




// Teacher slice
const teacherSlice = createSlice({
  name: 'teachers',
  initialState: {
    teachers: [], // List of all teachers
    teacher: null, // Single teacher data for a specific user
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchTeachers thunk
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload; // Store the fetched teacher data
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teachers';
      })

      // Handling fetchTeacherByUserId thunk
      .addCase(fetchTeacherByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.teacher = action.payload; // Store the specific teacher data
      })
      .addCase(fetchTeacherByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teacher';
      });
  },
});

// Selectors
export const selectTeachers = (state) => state.teachers.teachers;
export const selectTeacher = (state) => state.teachers.teacher;
export const selectTeachersLoading = (state) => state.teachers.loading;
export const selectTeachersError = (state) => state.teachers.error;

// Export the reducer
export default teacherSlice.reducer;