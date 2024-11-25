import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'; 
import { LoadingScreen } from 'src/components/loading-screen';
//
import UserCard from './user-card';
import UserFilter from './user-filter';


// ----------------------------------------------------------------------

export default function UserCardListBySubject() {
  const [users, setUsers] = useState([]); // State for user data
  const [filters, setFilters] = useState({ subject: '' }); // State for subject filter
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchFilteredUsersBySubject = async (filterParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/teachers/filter-teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filterParams),
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


  // Initial fetch on mount
  useEffect(() => {
    fetchFilteredUsersBySubject(filters);
  }, [filters]); // Add 'filters' as a dependency

  return (
    <Stack spacing={4}>
    

      {loading && <div><LoadingScreen /></div>}
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
