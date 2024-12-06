'use client';

import { m } from 'framer-motion';
import { useCallback, useState, useMemo, useEffect } from 'react';
// @mui
import {
  Tab,
  Box,
  Tabs,
  List,
  Stack,
  Badge,
  Drawer,
  Button,
  Divider,
  Tooltip,
  IconButton,
  Typography,
} from '@mui/material';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead, fetchNotifications } from '../../../../src/app/store/slices/notificationSlice'; // Adjust path as needed
import NotificationItem from './notification-item';

const TABS = [
  { value: 'all', label: 'All' },
];

export default function NotificationsPopover() {
  const drawer = useBoolean();
  const smUp = useResponsive('up', 'sm');
  const dispatch = useDispatch();

  // Fetch notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const notifications = useSelector((state) => state.notifications.notifications);
  const loading = useSelector((state) => state.notifications.loading);
  const error = useSelector((state) => state.notifications.error);

  const totalUnRead = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications]
  );

  const [currentTab, setCurrentTab] = useState('all');
  const filteredNotifications = useMemo(
    () =>
      currentTab === 'all'
        ? notifications
        : notifications.filter((notification) => !notification.is_read),
    [notifications, currentTab]
  );

  const handleChangeTab = useCallback((_, newValue) => setCurrentTab(newValue), []);

  const handleMarkAllAsRead = () => {
    notifications
      .filter((notification) => !notification.is_read)
      .forEach((notification) =>
        dispatch(markAsRead({ notification_id: notification.notification_id }))
      );
  };

  const renderHeader = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, px: 2.5 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {totalUnRead > 0 && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderList = (
    <Scrollbar sx={{ px: 1, py: 2 }}>
      {loading && <Typography sx={{ px: 2 }}>Loading notifications...</Typography>}
      {error && <Typography sx={{ px: 2, color: 'error.main' }}>Failed to load notifications</Typography>}
      {!loading && !error && (
        <List disablePadding>
          {filteredNotifications.map((notification) => (
            <NotificationItem key={notification.notification_id} notification={notification} />
          ))}
        </List>
      )}
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHeader}
        <Divider sx={{ mt: 3 }} />
        {renderList}
        <Box sx={{ p: 1 }} />
      </Drawer>
    </>
  );
}
