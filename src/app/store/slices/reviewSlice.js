import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action to create a review
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
  review: null,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    // You can add custom reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when making a new request
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload; // Save the newly created review
        state.error = null; // Clear any previous error
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message if the request fails
      });
  },
});

export default reviewSlice.reducer;
