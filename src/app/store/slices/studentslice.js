import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for getting student data
export const fetchStudentData = createAsyncThunk(
  'student/fetchStudentData',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Add authorization if required
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for saving student data
export const saveStudentData = createAsyncThunk(
  'student/saveStudentData',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        throw new Error('Failed to save student data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating student data
export const updateStudent = createAsyncThunk(
  'student/updateStudent',
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/students/${updatedData.student_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update student data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  student_id: null,
  guardian_phone: '',
  guardian_address: '',
  guardian_name: '',
  grade_domain: '',
  grade_sub_level: '',
  subjects: [],
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setGuardianPhone: (state, action) => {
      state.guardian_phone = action.payload;
    },
    setGuardianAddress: (state, action) => {
      state.guardian_address = action.payload;
    },
    setGuardianName: (state, action) => {
      state.guardian_name = action.payload;
    },
    setGradeDomain: (state, action) => {
      state.grade_domain = action.payload;
    },
    setGradeSubLevel: (state, action) => {
      state.grade_sub_level = action.payload;
    },
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch student data reducers
      .addCase(fetchStudentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentData.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchStudentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save student data reducers
      .addCase(saveStudentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveStudentData.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(saveStudentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update student data reducers
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectStudent = (state) => state.student;

export const {
  setGuardianPhone,
  setGuardianAddress,
  setGuardianName,
  setGradeDomain,
  setGradeSubLevel,
  setSubjects,
} = studentSlice.actions;

export default studentSlice.reducer;
