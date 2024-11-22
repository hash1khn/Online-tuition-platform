import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// theme
import { bgGradient } from 'src/theme/css';
// icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const convertToInternationalFormat = (phoneNumber) => {
  if (!phoneNumber.startsWith('+92') && phoneNumber.startsWith('0')) {
    // Replace leading '0' with '+92' for Pakistan
    return phoneNumber.replace(/^0/, '+92');
  }
  return phoneNumber; // Return as-is if already in international format
};

// ----------------------------------------------------------------------

export default function ProfileCover({
  name,
  role,
  phone_number,
  email,
  city_name,
  coverUrl,
  profile_picture,
}) {
  const theme = useTheme();

  const handleWhatsAppClick = () => {
    if (phone_number) {
      const formattedPhoneNumber = convertToInternationalFormat(phone_number);
      const whatsappUrl = `https://wa.me/${formattedPhoneNumber}`;
      window.open(whatsappUrl, '_blank'); // Open WhatsApp in a new tab
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.primary.darker, 0.8),
          imgUrl: coverUrl,
        }),
        height: 1,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 20 },
          zIndex: { md: 10 },
          pt: { xs: 4, md: 2 },
          position: { md: 'absolute' },
        }}
      >
        <Avatar
          src={profile_picture}
          alt={name}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.palette.common.white}`,
          }}
        />

        <ListItemText
          sx={{
            mt: 2,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
            color: theme.palette.mode === 'light' ? 'common.white' : 'text.primary',
          }}
          primary={name}
          secondary={
            <>
              {phone_number && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    onClick={handleWhatsAppClick}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      opacity: 0.7,
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <WhatsAppIcon sx={{ mr: 0.5, color: 'common.white' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 0.5,
                        color: theme.palette.mode === 'light' ? 'common.white' : 'text.secondary',
                      }}
                    >
                      {phone_number}
                    </Typography>
                  </Box>
                </Stack>
              )}
              {email && (
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    mt: 0.5,
                    color: theme.palette.mode === 'light' ? 'common.white' : 'text.secondary',
                  }}
                >
                  ✉️ {email}
                </Typography>
              )}
              {city_name && (
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    mt: 0.5,
                    color: theme.palette.mode === 'light' ? 'common.white' : 'text.secondary',
                  }}
                >
                  📍 {city_name}
                </Typography>
              )}
            </>
          }
          primaryTypographyProps={{
            typography: 'h4',
          }}
        />
      </Stack>
      <Button
        variant="contained"
        sx={{
          position: 'absolute',
          bottom: 25,
          right: 16,
          backgroundColor: theme.palette.primary.dark,
          color: 'common.white',
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        Book a Session
      </Button>
    </Box>
  );
}

ProfileCover.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  phone_number: PropTypes.string,
  email: PropTypes.string,
  city_name: PropTypes.string,
  coverUrl: PropTypes.string.isRequired,
  profile_picture: PropTypes.string.isRequired,
};
