import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack'; 
import { LoadingScreen } from 'src/components/loading-screen';
import UserCard from './user-card';

// ----------------------------------------------------------------------

UserCardListBySubject.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.string),
};

export default function UserCardListBySubject({ subjects = [] }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilteredTeachers = async (filters) => {
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
        throw new Error('Failed to fetch teachers');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      fetchFilteredTeachers({ subjects }); // Only send `subjects` in filters
    }
  }, [subjects]);

  return (
    <Stack spacing={4}>
      {loading && <LoadingScreen />}
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
            users.map((user) => <UserCard key={user.teacher_id} user={user} />)
          ) : (
            <div>No teachers found</div>
          )}
        </Box>
      )}
    </Stack>
  );
}
