import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'; 
//
import UserCard from './user-card';
import UserFilter from './user-filter';

// ----------------------------------------------------------------------

export default function UserCardList() {
  const [users, setUsers] = useState([]); // State for user data
  const [filters, setFilters] = useState({}); // State for filters
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchFilteredUsers = async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/teachers/filter-teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data); // Update the users state with filtered data
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchFilteredUsers(newFilters); // Fetch users based on new filters
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchFilteredUsers(filters);
  }, []); // Empty dependency array to fetch on component mount

  return (
    <Stack spacing={4}>
      <UserFilter onFilterChange={handleFilterChange} />

      {loading && <div>Loading users...</div>}
      {error && <div>{error}</div>}

      {!loading && !error && (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {users.length > 0 ? (
            users.map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <div>No users found</div>
          )}
        </Box>
      )}
    </Stack>
  );
}

UserCardList.propTypes = {
  users: PropTypes.array,
};
