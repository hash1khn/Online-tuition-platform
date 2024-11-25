'use client';

// @mui
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import React from 'react';
import Box from '@mui/material/Box';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//


// Redux hooks
import { LoadingScreen } from 'src/components/loading-screen';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeachers } from '../../../app/store/slices/teacherslice';
import UserCardList from '../user-card-list';

// ----------------------------------------------------------------------

export default function UserCardsView() {
  const settings = useSettingsContext();
  const dispatch = useDispatch();

  // Fetch teacher data from Redux store
  const { teachers, loading, error } = useSelector((state) => state.teachers);

  // Dispatch fetch action on component mount
  React.useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  if (loading) return <Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  }}
>
  <LoadingScreen />
</Box>;
 
  if (error) return <div>Error: {error}</div>;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Teacher Cards"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Pass the fetched teachers data to UserCardList */}
      <UserCardList users={teachers} />
    </Container>
  );
}
