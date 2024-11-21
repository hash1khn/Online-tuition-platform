import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunks for asynchronous actions
export const saveUser = createAsyncThunk('user/saveUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/user', { // Ensure this matches your API endpoint
      method: 'PUT', // Change method to PUT
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Access token from sessionStorage
      },
      body: JSON.stringify(userData), // Send the user data
    });

    if (!response.ok) throw new Error('Failed to update user'); // Update error message accordingly
    return await response.json(); // Return the updated user data
  } catch (error) {
    return rejectWithValue(error.message); // Handle errors
  }
});

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (_, { rejectWithValue }) => { // Removed userId from the parameters
    try {
      const response = await fetch(`/api/user`, { // Ensure this matches your API endpoint
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Use the correct token
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      return data; // This will return the user data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const getAllUsers = createAsyncThunk('user/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete user');
    return userId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUser = createAsyncThunk('user/updateUser', async ({ userId, updatedData }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Initial state
const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  gender: '',
  area: '',
  cityId: '',
  region: '',
  dob: '',
  profile_picture: '',
  status: 'active',
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFirstName: (state, action) => { state.firstName = action.payload; },
    setLastName: (state, action) => { state.lastName = action.payload; },
    setEmail: (state, action) => { state.email = action.payload; },
    setPhoneNumber: (state, action) => { state.phoneNumber = action.payload; },
    setGender: (state, action) => { state.gender = action.payload; },
    setArea: (state, action) => { state.area = action.payload; },
    setCityId: (state, action) => { state.cityId = action.payload; },
    setRegion: (state, action) => { state.region = action.payload; },
    setDob: (state, action) => { state.dob = action.payload; },
    setprofile_picture: (state, action) => { state.profile_picture = action.payload; },
    setStatus: (state, action) => { state.status = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(saveUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(getUserById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(getAllUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user.user_id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.user_id === action.payload.user_id);
        if (index !== -1) state.users[index] = action.payload;
        if (state.currentUser?.user_id === action.payload.user_id) state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

// Export actions for use in the form component
export const {
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setGender,
  setArea,
  setCityId,
  setRegion,
  setDob,
  setprofile_picture,
  setStatus,
} = userSlice.actions;

// Export the reducer to configure in store
export default userSlice.reducer;
