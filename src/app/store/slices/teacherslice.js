import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for fetching all teachers
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/teachers/get-all-teachers/');
      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }
      const data = await response.json(); // Expecting an array of teacher objects
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'An unexpected error occurred');
    }
  }
);

export const fetchTeacherByUserId1 = createAsyncThunk('teachers/fetchTeacherByUserId', async () => {
  try {
    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token found. Please log in.');
    }

    // Make API call with Authorization header
    const response = await fetch(`/api/teachers/setup-profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teacher');
    }

    const data = await response.json();
    console.log(data); // API response for a single teacher
    return data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
});

// Thunk for fetching a teacher by user ID
export const fetchTeacherByUserId = createAsyncThunk(
  'teachers/fetchTeacherByUserId',
  async (teacherId, { rejectWithValue }) => {
    // Decide on token storage: sessionStorage or localStorage
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    
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

      const data = await response.json(); // Return teacher data
      return data;
    } catch (error) {
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
        state.teachers = action.payload; // Store fetched teachers
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch teachers';
      })

      // Handling fetchTeacherByUserId thunk
      .addCase(fetchTeacherByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.teacher = action.payload; // Store fetched teacher
      })
      .addCase(fetchTeacherByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch teacher';
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
