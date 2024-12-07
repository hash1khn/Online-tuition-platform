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
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(contractData),
      });

      // Check if response is successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create contract');
      }

      // Parse and return response if successful
      return await response.json();
    } catch (error) {
      console.error('Error creating contract:', error);
      return rejectWithValue(error.message);
    }
  }
);


// Thunk for fetching all contracts
export const fetchAllContracts = createAsyncThunk(
  'contracts/fetchAllContracts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/contracts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch contracts');
      }

      return await response.json(); // Assuming API returns a list of contracts
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Thunk for updating contract status
// Thunk for updating contract status
// Thunk for updating contract status
export const updateContractStatus = createAsyncThunk(
  'contracts/updateContractStatus',
  async ({ contractId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ status }), // Ensure you're sending status in the body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update contract status');
      }

      return { contractId, status }; // Return the contractId and new status
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateContractStatusToRejected = createAsyncThunk(
  'contracts/updateContractStatusToRejected',
  async ({ contractId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/rejected`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update contract status to rejected');
      }

      return { contractId, status }; // Return the contractId and new status
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContractStatusToCancelled = createAsyncThunk(
  'contracts/updateContractStatusToCancelled',
  async ({ contractId, status }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/cancelled`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update contract status to rejected');
      }

      return { contractId, status }; // Return the contractId and new status
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);





// Contract slice
const contractSlice = createSlice({
  name: 'contracts',
  initialState: {
    contracts: [],
    contract: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contract = action.payload;
        state.contracts.push(action.payload);
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create contract';
      })
      .addCase(fetchAllContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload;
      })
      .addCase(fetchAllContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch contracts';
      })
      .addCase(updateContractStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContractStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { contractId, status } = action.payload;
        const contractToUpdate = state.contracts.find(contract => contract.id === contractId);
        if (contractToUpdate) {
          contractToUpdate.status = status;
        }
      })
      .addCase(updateContractStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update contract status';
      })
      .addCase(updateContractStatusToRejected.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContractStatusToRejected.fulfilled, (state, action) => {
        state.loading = false;
        const { contractId,status } = action.payload; // Only contractId is returned
        const contractToUpdate = state.contracts.find(contract => contract.id === contractId);
        if (contractToUpdate) {
          contractToUpdate.status = status; // Manually set the status to 'rejected'
        }
        
      })
      .addCase(updateContractStatusToRejected.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update contract status';
      })
      .addCase(updateContractStatusToCancelled.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContractStatusToCancelled.fulfilled, (state, action) => {
        state.loading = false;
        const { contractId,status } = action.payload; // Only contractId is returned
        const contractToUpdate = state.contracts.find(contract => contract.id === contractId);
        if (contractToUpdate) {
          contractToUpdate.status = status; // Manually set the status to 'rejected'
        }
        
      })

      .addCase(updateContractStatusToCancelled.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update contract status';
      });
      ;
  },
});
export const selectContracts = (state) => state.contracts.contracts;
export const selectSingleContract = (state) => state.contracts.contract;
export const selectContractsLoading = (state) => state.contracts.loading;
export const selectContractsError = (state) => state.contracts.error;

// Export the reducer
export default contractSlice.reducer;

