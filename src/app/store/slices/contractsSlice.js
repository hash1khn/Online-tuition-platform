// src/app/store/slices/contractSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk for creating a contract
export const createContract = createAsyncThunk(
  'contracts/createContract',
  async (contractData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include Authorization header
        },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create contract');
      }

      return await response.json(); // Assuming the API returns the created contract
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Contract slice
const contractSlice = createSlice({
  name: 'contracts',
  initialState: {
    contracts: [], // List of all contracts
    contract: null, // Single contract (for newly created or fetched details)
    loading: false, // Loading state
    error: null, // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling createContract thunk
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contract = action.payload; // Set the created contract
        state.contracts.push(action.payload); // Add to the contracts list if needed
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create contract';
      });
  },
});

// Selectors
export const selectContracts = (state) => state.contracts.contracts;
export const selectSingleContract = (state) => state.contracts.contract;
export const selectContractsLoading = (state) => state.contracts.loading;
export const selectContractsError = (state) => state.contracts.error;

// Export the reducer
export default contractSlice.reducer;
