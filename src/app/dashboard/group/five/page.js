'use client';

import { useAuthContext } from 'src/auth/hooks';
import RoleBasedGuard from 'src/auth/guard/role-based-guard';
import FiveView from 'src/sections/five/view';
import { View403 } from 'src/sections/error';
 // Import the 403 error page

export default function Page() {
  const { user } = useAuthContext();
  const role = user?.role;

  return role === 'student' ? (
    <FiveView /> // Render FiveView if role is 'student'
  ) : (
    <View403 /> // Render View403 (error page) if role is not 'student'
  );
}
