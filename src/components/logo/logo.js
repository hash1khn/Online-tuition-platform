import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
// next
import NextLink from 'next/link';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="img"
      src="/logo/beelogo.png" // Replace with the correct path to your image
      alt="Logo"
      sx={{
        width: 70, // Adjust size as needed
        height: 70, // Adjust size as needed
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link
      component={NextLink}
      href="/" // This is the Next.js equivalent of routing to the homepage
      sx={{ display: 'inline-flex' }}
    >
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
