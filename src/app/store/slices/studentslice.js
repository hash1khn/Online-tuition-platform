import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for saving student data
export const saveStudentData = createAsyncThunk(
  'student/saveStudentData',
  async (studentData, { rejectWithValue }) => {
    try {
      // Simulating an API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(studentData), 1500)
      );
      return response;
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
      // Simulating an API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve(updatedData), 1500)
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  name: '',
  address: '',
  phone: '',
  guardianName: '',
  guardianPhone: '',
  subjects: [],
  grade: '',
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setPhone: (state, action) => {
      state.phone = action.payload;
    },
    setGuardianName: (state, action) => {
      state.guardianName = action.payload;
    },
    setGuardianPhone: (state, action) => {
      state.guardianPhone = action.payload;
    },
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    setGrade: (state, action) => {
      state.grade = action.payload;
    },
    addSubject: (state) => {
      state.subjects.push('');
    },
    removeSubject: (state, action) => {
      state.subjects.splice(action.payload, 1);
    },
    updateSubject: (state, action) => {
      const { index, value } = action.payload;
      state.subjects[index] = value;
    },
  },
  extraReducers: (builder) => {
    builder
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

export const {
  setName,
  setAddress,
  setPhone,
  setGuardianName,
  setGuardianPhone,
  setSubjects,
  setGrade,
  addSubject,
  removeSubject,
  updateSubject,
} = studentSlice.actions;

export default studentSlice.reducer;
