import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Card } from '@mui/material'; 
import {
  fetchTeacherByUserId,
  selectTeacher,
  selectTeachersLoading,
  selectTeachersError,
} from '../../app/store/slices/teacherslice'; // Adjust the path if needed
import ProfileHome from './profile-home';
import ProfileCover from './profile-cover'; // Assuming a ProfileCover component exists
// Importing Material-UI Card component

// The component will use the teacher data from Redux state
export default function TeacherProfile({ id }) {
  const dispatch = useDispatch();
  const teacher = useSelector(selectTeacher);
  const loading = useSelector(selectTeachersLoading);
  const error = useSelector(selectTeachersError);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeacherByUserId(id)); // Fetch the teacher data based on ID
    }
  }, [id, dispatch]);

  // If data is loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // If there's an error fetching the data
  if (error) {
    return <p>Error: {error}</p>;
  }

  // If teacher data is not found
  if (!teacher) {
    return <p>Teacher not found!</p>;
  }

  return (
    <div>
      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          name={teacher.name || 'Anonymous'}
          avatarUrl={teacher.profile_picture || '/default-avatar.png'}
          coverUrl={teacher.coverURL || '/default-cover.jpg'}
          city_name={teacher.city_name || 'Unknown'}
          email={teacher.email || 'No email provided'}
          phone_number={teacher.phone_number || 'No phone number provided'}
        />
      </Card>

      <ProfileHome info={teacher} posts={[]} />
    </div>
  );
}

// Add PropTypes for better type checking
TeacherProfile.propTypes = {
  id: PropTypes.string.isRequired,
};

// Fetch teacher ID from URL in getServerSideProps to pass as prop
export async function getServerSideProps(context) {
  const { id } = context.params; // Get teacher ID from the URL

  return {
    props: {
      id, // Pass the teacher ID as a prop
    },
  };
}
