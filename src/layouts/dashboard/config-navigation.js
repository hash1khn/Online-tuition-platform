import { useMemo } from 'react';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';

// Import Material Design icons (Mud Icons)
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info'; 
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GavelIcon from '@mui/icons-material/Gavel';
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; 

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

// Define icons for navigation
const ICONS = {
  user: <PersonIcon sx={{ fontSize: 24 }} />,
  dashboard: <DashboardIcon sx={{ fontSize: 24 }} />,
  analytics: <AnalyticsIcon sx={{ fontSize: 24 }} />,
  order: <ShoppingCartIcon sx={{ fontSize: 24 }} />,
  label: <ArticleIcon sx={{ fontSize: 24 }} />,
  contracts: <DescriptionIcon sx={{ fontSize: 24 }} />,
  about: <InfoIcon sx={{ fontSize: 24 }} />,
  profile: <AccountCircleIcon sx={{ fontSize: 24 }} />,
  terms: <GavelIcon sx={{ fontSize: 24 }} />,
  availability: <EventAvailableIcon sx={{ fontSize: 24 }} />,
  // Add more Material icons or custom SVG icons as needed
};

export function useNavData(teacherId) {
  const { user } = useAuthContext();
  const currentRole = user?.role;

  const data = useMemo(() => {
    const navItems = [
      {
        subheader: 'New Tutor',
        items: [
          {
            title: 'Update Profile',
            path: '/dashboard/user/new',
            icon: ICONS.user,
            roles: ['teacher', 'student'],
          },
          {
            title: 'Student Profile',
            path: '/dashboard/group/seven',
            icon: ICONS.profile,
            roles: ['student'],
          },
          {
            title: 'Setup Profile',
            path: '/dashboard/user/complete',
            icon: ICONS.profile,
            roles: ['teacher'],
          },
          {
            title: 'Terms & Conditions',
            path: '/dashboard/one',
            icon: ICONS.terms,
            roles: ['teacher'],
          },
          {
            title: 'Availability',
            path: '/dashboard/two',
            icon: ICONS.availability,
            roles: ['teacher'],
          },
          {
            title: 'Service',
            path: '/dashboard/three',
            icon: ICONS.analytics,
            roles: ['teacher'],
          },
          {
            title: 'Teachers Cards',
            path: '/dashboard/user/cards',
            icon: ICONS.dashboard,
            roles: ['student'],
          },
          {
            title: 'Reviews',
            path: '/dashboard/group/five',
            icon: ICONS.analytics,
            roles: ['student'],
          },
          {
            title: 'About Us',
            path: '/dashboard/group/six',
            icon: ICONS.about,
            roles: ['teacher', 'student'],
          },
          {
            title: 'Contracts',
            path: '/dashboard/user/list',
            icon: ICONS.contracts,
            roles: ['student'],
          },
        ],
      },
    ];

    return navItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(currentRole)),
    }));
  }, [currentRole]);

  return data;
}
