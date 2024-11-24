// @mui
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useAuthContext } from 'src/auth/hooks';

// routes
import { paths } from 'src/routes/paths';
// locales
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const{user}=useAuthContext();
  const [open, setOpen] = useState(false);
  const referralLink = 'https://tutorlypk.vercel.app/auth/jwt/login/?returnTo=%2Fdashboard%2Fuser%2Fnew%2F';

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.profile_picture} alt={user?.name} sx={{ width: 48, height: 48 }} />
          {/* <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label> */}
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

        <Button variant="contained" onClick={handleOpen}>
          Refer a friend
        </Button>
      </Stack>

     <Dialog
     open={open}
     onClose={handleClose}
     maxWidth="md"
     fullWidth
     sx={{
       '& .MuiDialog-paper': {
         padding: 3, 
       },
     }}
   >
     <DialogTitle>Refer a Friend</DialogTitle>
     <DialogContent>
       <Typography variant="body2" sx={{ mb: 2 }}>
         Invite your friends to TutorlyPK and learn together! Share the referral link below.
       </Typography>

       <Typography
         variant="body1"
         component="a"
         href={referralLink}
         target="_blank"
         rel="noopener"
         sx={{
           color: 'primary.main',
           textDecoration: 'none',
           wordBreak: 'break-all',
           '&:hover': {
             textDecoration: 'underline',
           },
         }}
       >
         {referralLink}
       </Typography>

       <Divider sx={{ my: 3 }} />

       {/* Sharing Options */}
       <Typography variant="body2" sx={{ mb: 1 }}>
         Share via:
       </Typography>
       <Stack direction="row" spacing={2} justifyContent="center">
         <Button
           size="small"
           variant="outlined"
           href={`mailto:?subject=Join TutorlyPK&body=Sign up using my referral link: ${referralLink}`}
         >
           Email
         </Button>
         <Button
           size="small"
           variant="outlined"
           href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
           target="_blank"
         >
           Facebook
         </Button>
         <Button
           size="small"
           variant="outlined"
           href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=Check out TutorlyPK!`}
           target="_blank"
         >
           Twitter
         </Button>
         <Button
           size="small"
           variant="outlined"
           href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(referralLink)}`}
           target="_blank"
         >
           LinkedIn
         </Button>
       </Stack>
     </DialogContent>
     <DialogActions>
       <Button onClick={handleClose} color="info">
         Close
       </Button>
     </DialogActions>
   </Dialog>
 </Stack>
  );
}
