import { Box, Card, Container, Grid, Typography, Avatar, Stack, Link } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const developers = [
  {
    name: 'Dev 1',
    image: '/assets/hashir.jpeg', // Correct path for Next.js
    description: 'Hashir\nPod',
    linkedIn: '#',
    github: '#',
  },
  {
    name: 'Dev 2',
    image: '/assets/kainat.jpg', // Correct path for Next.js
    description: 'Kainat\nBoth',
    linkedIn: '#',
    github: '#',
  },
  {
    name: 'Dev 3',
    image: '/assets/raahim1.jpg', // Correct path for Next.js
    description: 'Raahim\nCigarette',
    linkedIn: '#',
    github: '#',
  },
];

export default function MeetTheDevs() {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography sx={{ mb:4}} variant="h4" gutterBottom>
          Welcome to Tutorly, your one-stop platform for becoming a tutor and helping students achieve their academic goals.
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          Tutorly offers personalized online tutoring for students of all ages, covering a wide range of subjects. Connect with expert tutors for flexible, one-on-one sessions tailored to your needs. Start learning today and achieve your academic goals with ease!
        </Typography>
      </Box>

      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Meet the Devs
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {developers.map((dev, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Avatar src={dev.image} alt={dev.name}  sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}  />
              <Typography variant="h6" gutterBottom>
                {dev.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {dev.description}
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Link href={dev.linkedIn} target="_blank" color="inherit">
                  <LinkedInIcon />
                </Link>
                <Link href={dev.github} target="_blank" color="inherit">
                  <GitHubIcon />
                </Link>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
