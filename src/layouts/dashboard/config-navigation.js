import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';

// Define icons
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

export function useNavData(teacherId) {
  // Get the current user's role from the authentication context
  const { user } = useAuthContext();
  const currentRole = user?.role;

  // Memoize the filtered navigation data
  const data = useMemo(() => {
    const navItems = [
      {
        subheader: 'New Tutor',
        items: [
          {
            title: 'Update Profile',
            path: paths.dashboard.user.new,
            icon: ICONS.user,
            roles: ['teacher', 'student'],
          },
          {
            title: 'Student profile',
            path: paths.dashboard.group.seven,
            icon: ICONS.user,
            roles: ['student'],
          },
          {
            title: 'Setup Profile',
            path: paths.dashboard.user.complete,
            icon: ICONS.dashboard,
            roles: ['teacher'],
          },
          {
            title: 'Terms & Conditions',
            path: paths.dashboard.one,
            icon: ICONS.order,
            roles: ['teacher'],
          },
          {
            title: 'Availability',
            path: paths.dashboard.two,
            icon: ICONS.ecommerce,
            roles: ['teacher'],
          },
          {
            title: 'Service',
            path: paths.dashboard.three,
            icon: ICONS.analytics,
            roles: ['teacher'],
          },
          {
            title: 'Teachers Cards',
            path: paths.dashboard.user.cards,
            icon: ICONS.dashboard,
            roles: ['student'],
          },
          {
            title: 'Reviews',
            path: paths.dashboard.group.five,
            icon: ICONS.analytics,
            roles: ['student'],
          },
             {
          title: 'About Us',
          path: paths.dashboard.group.six,
          icon: ICONS.ecommerce,
          roles: ['teacher', 'student'],
        },
          // {
        //   title: 'Teachers profile',
        //   path: paths.dashboard.user.id(teacherId), // Ensure teacherId is passed
        //   icon: ICONS.user,
        //   roles: ['student'],
        // },
        ],
      },
    ];

    // Filter items based on the user's role
    return navItems.map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.roles.includes(currentRole)
      ),
    }));
  }, [currentRole]); // Re-compute only when currentRole changes

  return data;
}
