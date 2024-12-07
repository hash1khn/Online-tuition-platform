import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action to fetch reviews (GET)
export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (teacherId, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3035/api/reviews/${teacherId}`);
      const data = await response.json();

      if (!response.ok) {
        // Reject with error message if API response is not okay
        return rejectWithValue(data.message || 'Failed to fetch reviews');
      }

      // Return the fetched reviews
      return data;
    } catch (error) {
      // Handle unexpected errors like network issues
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Async action to create a review (POST)
export const createReview = createAsyncThunk(
  'review/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Reject with error message if API response is not okay
        return rejectWithValue(data.message || 'Failed to create review');
      }

      // Return the data if the response is successful
      return data;
    } catch (error) {
      // Handle unexpected errors like network issues
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const initialState = {
  loading: false,
  review: [], // Reviews will be fetched and populated here
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling fetchReviews action (GET)
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when fetching reviews
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload; // Set the fetched reviews
        state.error = null; // Clear any previous error
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message if the request fails
      });

    // Handling createReview action (POST)
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when making a new review request
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.review = [...state.review, action.payload]; // Append the new review to the array
        state.error = null; // Clear any previous error
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message if the request fails
      });
  },
});

export default reviewSlice.reducer;
