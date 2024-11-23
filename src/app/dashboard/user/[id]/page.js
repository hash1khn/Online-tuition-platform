'use client';

import PropTypes from 'prop-types';

import { Userteacherprofile } from 'src/sections/user/view';



import { useAuthContext } from 'src/auth/hooks';
// import RoleBasedGuard from 'src/auth/guard/role-based-guard';
// import SevenView from 'src/sections/seven/view';
import { View403 } from 'src/sections/error';
 // Import the 403 error page

 export default function UserTeacherPage({ params }) {
  const { id } = params;
  const { user } = useAuthContext();
  const role = user?.role;

  return role === 'student' ? (
    <Userteacherprofile id={id} /> // Render FiveView if role is 'student'
  ) : (
    <View403 /> // Render View403 (error page) if role is not 'student'
  );
}

UserTeacherPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
  }),
};

