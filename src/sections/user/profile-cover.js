import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import React from 'react';
import Stack from '@mui/material/Stack';
import { useTheme, alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { bgGradient } from 'src/theme/css';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BookSessionDialog from './BookSessionDialog';

// ----------------------------------------------------------------------

const convertToInternationalFormat = (phoneNumber) => {
  if (!phoneNumber.startsWith('+92') && phoneNumber.startsWith('0')) {
    // Replace leading '0' with '+92' for Pakistan
    return phoneNumber.replace(/^0/, '+92');
  }
  return phoneNumber; // Return as-is if already in international format
};

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
  const [open, setOpen] = React.useState(false); // State for dialog

  const handleWhatsAppClick = () => {
    if (phone_number) {
      const formattedPhoneNumber = convertToInternationalFormat(phone_number);
      const whatsappUrl = `https://wa.me/${formattedPhoneNumber}`;
      window.open(whatsappUrl, '_blank'); // Open WhatsApp in a new tab
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
      sx={{
        position: 'relative',
        p: { xs: 2, sm: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 3,
       
        width: '100%', // Ensures it takes up available space
        maxWidth: 10000,  // Adjust the maxWidth to match the other cards
        margin: '0 auto',  // Centers the card
        mb : 5 ,
      }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            alignItems: 'center',
            gap: 3,
            mt: { xs: 3, md: 0 },
            width: '100%', // Ensure Stack takes full width
          }}
        >
          <Avatar
            src={profile_picture}
            alt={name}
            sx={{
              width: { xs: 140, sm: 140, md: 140 },
              height: { xs: 140, sm: 140, md: 140 },
              border: `4px solid ${theme.palette.common.white}`,
            }}
          />
          <CardContent
            sx={{
              textAlign: 'center',
              mt: { xs: 2, md: 0 },
              width: '100%', // Full width content area
            }}
          >
             <Grid item xs={12} sm={6}>
             <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {name}
            </Typography>
            </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
             <Stack direction="row" alignItems="center" spacing={1}>
           
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {role || 'No Experience Added'}
            </Typography>
            </Stack>
            </Grid>
            
            <Grid container spacing={2} justifyContent="center">
              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <MailOutlineIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {email || 'N/A'}
                  </Typography>
                </Stack>
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={1} onClick={handleWhatsAppClick}>
                  <WhatsAppIcon color="action" sx={{ cursor: 'pointer' }} />
                  <Typography variant="body2" color="text.secondary">
                    {phone_number || 'N/A'}
                  </Typography>
                </Stack>
              </Grid>

              {/* City */}
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {city_name || 'N/A'}
                  </Typography>
                </Stack>
              </Grid>

              {/* Age */}
              <Grid item xs={12} sm={6}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccountBoxIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {age || 'N/A'}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Stack>

        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            position: 'absolute',
            bottom: 20, // Position button at the bottom
            right: 20, // Position button at the right
         

            backgroundColor: theme.palette.info.dark,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.info.main,
            },
          }}
        >
          Book a Session
        </Button>
      </Card>

      {/* Dialog for booking a session */}
      <BookSessionDialog open={open} onClose={handleClose} />
    </>
  );
}

ProfileCover.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  phone_number: PropTypes.string,
  email: PropTypes.string,
  city_name: PropTypes.string,
  profile_picture: PropTypes.string.isRequired,
  age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
