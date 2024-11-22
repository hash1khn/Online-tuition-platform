import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks for API Calls

// Fetch Subjects
export const fetchSubjects = createAsyncThunk(
  'service/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/subjects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const data = await response.json();
      return data; // Returns array of subjects
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch Grade Levels
export const fetchGradeLevels = createAsyncThunk(
  'service/fetchGradeLevels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/grade-levels', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grade levels');
      }

      const data = await response.json();
      return data; // Returns array of domains and sublevels
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to Save Service
export const saveService = createAsyncThunk(
  'service/saveService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/teachers/update-teacher-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        throw new Error('Failed to update service data');
      }

      const data = await response.json();
      return data; // Returns the updated service data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  subjects: [], // Holds fetched subjects
  gradeLevels: [], // Holds fetched grade levels
  subject: '',
  domain: '',
  subLevel: '',
  duration: '',
  fees: '',
  discount: '',
  loading: false,
  error: null,
};

// Slice
const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setSubject: (state, action) => {
      state.subject = action.payload;
    },
    setDomain: (state, action) => {
      state.domain = action.payload;
    },
    setSubLevel: (state, action) => {
      state.subLevel = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setFees: (state, action) => {
      state.fees = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchSubjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload; // Update with fetched subjects
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchGradeLevels
      .addCase(fetchGradeLevels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGradeLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.gradeLevels = action.payload; // Update with fetched grade levels
      })
      .addCase(fetchGradeLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle saveService
      .addCase(saveService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveService.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload); // Update state with saved service data
      })
      .addCase(saveService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSubject,
  setDomain,
  setSubLevel,
  setDuration,
  setFees,
  setDiscount,
} = serviceSlice.actions;

export default serviceSlice.reducer;
