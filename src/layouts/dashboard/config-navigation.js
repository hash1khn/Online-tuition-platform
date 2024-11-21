import { useMemo } from 'react';

// routes

import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
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

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'New Tutor',
        items: [
          {
            title: 'Update Profile',
            path: paths.dashboard.user.new,
            icon: ICONS.user,
            roles: ['teacher','student'],
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
            roles: ['teacher',],
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
            title: 'Devs',
            path: paths.dashboard.group.six,
            icon: ICONS.ecommerce,
            roles: ['teacher','student'],
          },
          {
            title: 'Teachers Cards',
            path:paths.dashboard.user.cards,
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
            title: 'Teachers profile',
            path:paths.dashboard.user.root,
            icon: ICONS.user,
            roles: ['student'],
          },
          {
          title: 'Student profile',
          path:paths.dashboard.group.seven,
          icon: ICONS.user,
          roles: ['student'],
        },
        
    
          // {
          //   title: 'Reviews',
          //   path:paths.dashboard.group.four,
          //   icon: ICONS.user,
          //   roles: ['student'],
          // },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      // {
      //   subheader: 'management',
      //   items: [
      //     {
      //       title: 'user',
      //       path: paths.dashboard.user.root,
      //       icon: ICONS.user,
      //       children: [
      //         { title: 'profile', path: paths.dashboard.user.root },
      //         { title: 'cards', path: paths.dashboard.user.cards },
      //         { title: 'list', path: paths.dashboard.user.list },
      //         { title: 'create', path: paths.dashboard.user.new },
      //         { title: 'edit', path: paths.dashboard.user.demo.edit },
      //         // { title: 'account', path: paths.dashboard.user.account },
      //       ],
      //     },
      //   ],
      // },
    ],
    []
  );

  return data;
}
