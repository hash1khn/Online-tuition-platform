// 'use client';

// import { useState, useCallback } from 'react';
// // @mui
// import Tab from '@mui/material/Tab';
// import Card from '@mui/material/Card';
// import Container from '@mui/material/Container';
// import Tabs, { tabsClasses } from '@mui/material/Tabs';
// // routes
// import { paths } from 'src/routes/paths';
// // hooks
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// // _mock
// import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';
// // components
// import Iconify from 'src/components/iconify';
// import { useSettingsContext } from 'src/components/settings';
// import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// //
// import ProfileHome from '../profile-home';
// import ProfileCover from '../profile-cover';
// // ----------------------------------------------------------------------


// export default function UserProfileView() {
//   const settings = useSettingsContext();

//   const { user } = useMockedUser();

//   const [searchFriends, setSearchFriends] = useState('');

//   const [currentTab, setCurrentTab] = useState('profile');

//   const handleChangeTab = useCallback((event, newValue) => {
//     setCurrentTab(newValue);
//   }, []);

//   const handleSearchFriends = useCallback((event) => {
//     setSearchFriends(event.target.value);
//   }, []);

//   return (
//     <Container maxWidth={settings.themeStretch ? false : 'lg'}>
//       <CustomBreadcrumbs
//         heading="Profile"
//         links={[
//           { name: 'Dashboard', href: paths.dashboard.root },
//           // { name: 'User', href: paths.dashboard.user.root },
//           // { name: user?.displayName },
//         ]}
//         sx={{
//           mb: { xs: 3, md: 5 },
//         }}
//       />

//         <ProfileCover
//           role={_userAbout.role}
//           name={user?.displayName}
//           avatarUrl={user?.photoURL}
          
//           coverUrl={_userAbout.coverUrl}
//           city_name={_userAbout.city_name}
//           email={_userAbout.email}
//           phone={_userAbout.phone}
//           age={_userAbout.age}
//         />


//       <ProfileHome info={_userAbout} posts={_userFeeds} />
//     </Container>
//   );
// }

