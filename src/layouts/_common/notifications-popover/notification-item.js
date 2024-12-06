import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
// utils
import { fToNow } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function NotificationItem({ notification }) {
  const renderAvatar = (
    <ListItemAvatar>
      <Avatar
        alt="User Profile"
        src={notification.image}
        sx={{
          width: 40,
          height: 40,
          bgcolor: 'background.neutral',
        }}
      />
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={
        <Typography variant="subtitle2" component="div">
          {notification.content}
        </Typography>
      }
      secondary={
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fToNow(notification.created_at)}
        </Typography>
      }
    />
  );

  const renderUnReadBadge = !notification.is_read && (
    <Box
      sx={{
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
        bgcolor: notification.is_read ? 'background.paper' : 'action.hover', // Unread notification has different background
        '&:hover': {
          bgcolor: 'action.selected', // Slightly darker background on hover
        },
        position: 'relative',
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
      </Stack>
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    notification_id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    is_read: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
    profile_picture: PropTypes.string.isRequired, // New profile picture field
  }).isRequired,
};
