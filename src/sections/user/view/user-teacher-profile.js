'use client';

import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
import { _userList } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';

// Corrected import: Capitalized TeacherProfile
import TeacherProfile from '../[id]';

// ----------------------------------------------------------------------

export default function UserTeacherProfile({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Complete Profile"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* Corrected component usage */}
      <TeacherProfile id={id} />
    </Container>
  );
}

UserTeacherProfile.propTypes = {
  id: PropTypes.number.isRequired,  // id should be a number if you're passing it as such
};
