import React, { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { useTheme, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
<<<<<<< HEAD
import { bgGradient } from 'src/theme/css';
=======
>>>>>>> 5d83b68c87d1d2a058797781bdf88a09f19a3011
import Button from '@mui/material/Button';
// icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

// Helper function to convert phone number to international format
const convertToInternationalFormat = (phoneNumber) => {
  if (!phoneNumber.startsWith('+92') && phoneNumber.startsWith('0')) {
    return phoneNumber.replace(/^0/, '+92');
  }
  return phoneNumber;
};

// ----------------------------------------------------------------------

export default function ProfileCover({
  name,
  role,
  phone_number,
  email,
  city_name,
  profile_picture,
  age,
}) {
  const theme = useTheme();

  // Function to handle WhatsApp click
  const handleWhatsAppClick = () => {
    if (phone_number) {
      const formattedPhoneNumber = convertToInternationalFormat(phone_number);
      const whatsappUrl = `https://wa.me/${formattedPhoneNumber}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Box
<<<<<<< HEAD
    sx={{
      ...bgGradient({
        color: alpha(theme.palette.primary.darker, 0.8),
  
      }),
      height: 1,
      color: 'common.white',
    }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        sx={{
          pt: { xs: 4, md: 6 },
          px: 3,
          pb: 2,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Avatar
          src={profile_picture}
          alt={name}
          sx={{
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
            border: `3px solid ${theme.palette.common.white}`,
=======
      sx={{
        p: 5,
        width: '100%',
        height: '100%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={3} sx={{ maxWidth: '900px', width: '100%', mt: 0.25 }}>
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'center',
>>>>>>> 5d83b68c87d1d2a058797781bdf88a09f19a3011
          }}
        >
          {/* Profile Picture */}
          <Avatar
            src={profile_picture}
            alt={name}
            sx={{
              width: 160,
              height: 160,
              border: '3px solid',
              borderColor: theme.palette.primary.main,
              ml: -9,
            }}
          />
          {/* Profile Details */}
          <Box>
            {/* Name */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {name} 
            </Typography>
            {/* Role */}
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                mb: 2,
              }}
            >
              {role || 'No Experience Added'}
            </Typography>
            {/* Email */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <MailOutlineIcon fontSize="medium" color="action" />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: 'normal',
                    color: 'text.primary',
                  }}
                >
                  email address
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '1rem',
                    color: 'text.secondary',
                  }}
                >
                  {email || 'N/A'}
                </Typography>
              </Box>
            </Box>
            {/* Mobile Number */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: phone_number ? 'pointer' : 'default',
              }}
              onClick={handleWhatsAppClick}
            >
              <WhatsAppIcon fontSize="medium" color="action" />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.95rem',
                    fontWeight: 'normal',
                    color: 'text.primary',
                  }}
                >
                  contact number
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.95rem',
                    color: 'text.secondary',
                  }}
                >
                  {phone_number || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

<<<<<<< HEAD
        <ListItemText
          primary={name}
          secondary={
            <>
              {role && (
                <Typography variant="subtitle1" sx={{ mt: 0.5, color: alpha(theme.palette.common.white, 0.9) }}>
                  {role}
                </Typography>
              )}
              {phone_number && (
                <Box
                  onClick={handleWhatsAppClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    mt: 0.5,
                    opacity: 0.7,
                    '&:hover': { opacity: 1 },
                  }}
                >
                  <WhatsAppIcon sx={{ mr: 0.5, color: 'common.white' }} />
                  <Typography variant="body2" sx={{ color: 'common.white' }}>
                    {phone_number}
                  </Typography>
                </Box>
              )}
              {email && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    opacity: 0.7,
                    color: alpha(theme.palette.common.white, 0.8),
                  }}
                >
                  ✉️ {email}
                </Typography>
              )}
              {city_name && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    opacity: 0.7,
                    color: alpha(theme.palette.common.white, 0.8),
                  }}
                >
                  📍 {city_name}
                </Typography>
              )}
            </>
          }
          primaryTypographyProps={{
            typography: 'h4',
            fontWeight: 'bold',
          }}
          sx={{ ml: { md: 3 } }}
        />
      </Stack>

      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
=======
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
            mt: 9,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="medium" color="action" />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 'normal',
                  color: 'text.primary',
                }}
              >
                city
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.95rem',
                  color: 'text.secondary',
                }}
              >
                {city_name || 'N/A'}
              </Typography>
            </Box>
          </Box>
          {/* Age */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <AccountBoxIcon fontSize="medium" color="action" /> {/* Mature icon */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 'normal',
                  color: 'text.primary',
                }}
              >
                age
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.95rem',
                  color: 'text.secondary',
                }}
              >
                {age || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{
          position: 'absolute',
          top: 25,
>>>>>>> 5d83b68c87d1d2a058797781bdf88a09f19a3011
          right: 16,
        }}
      >
        <Button variant="contained" color="primary">
          Book Now
        </Button>
      </Box>
    </Box>
  );
}

ProfileCover.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  phone_number: PropTypes.string,
  email: PropTypes.string,
  city_name: PropTypes.string,
  profile_picture: PropTypes.string.isRequired,
  age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
