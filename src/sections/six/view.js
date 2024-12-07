import {
  Box,
  Card,
  Container,
  Grid,
  Typography,
  Avatar,
  Stack,
  Divider,
  Link,
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School'; // Example icons for "Our Aims"
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';

const developers = [
  {
    name: 'Dev 1',
    image: '/assets/hashir.jpeg',
    description: 'Hashir',
    linkedIn: 'https://www.linkedin.com/in/hashirahmedkhan/',
    github: 'https://github.com/hash1khn',
  },
  {
    name: 'Dev 2',
    image: '/assets/kainat.jpg',
    description: 'Kainat',
    linkedIn: 'https://www.linkedin.com/in/kainat-faisal-a2b090282/',
    github: 'https://github.com/kainatff',
  },
  {
    name: 'Dev 3',
    image: '/assets/raahim1.jpg',
    description: 'Raahim',
    linkedIn: 'https://www.linkedin.com/in/raahim-hussain-07b107232/',
    github: 'https://github.com/raahimhussa',
  },
];

const aims = [
  {
    title: 'Personalized Learning',
    description: 'We aim to provide a tailored academic experience for every student.',
    icon: <SchoolIcon fontSize="large" />,
  },
  {
    title: 'Empowering Tutors',
    description: 'Supporting tutors with advanced tools to enhance their teaching experience.',
    icon: <PeopleIcon fontSize="large" />,
  },
  {
    title: 'Seamless Connections',
    description: 'Connecting students with the right tutors for a more effective learning journey.',
    icon: <StarIcon fontSize="large" />,
  },
  {
    title: 'Global Reach',
    description:
      'Making quality education accessible globally, bridging gaps and fostering learning.',
    icon: <PublicIcon fontSize="large" />,
  },
];

export default function MeetTheDevs() {
  return (
    <Container>
      {/* Introduction Section */}
      <Box sx={{ py: 6 }}>
        <Grid container spacing={5} alignItems="center">
          {/* Title */}
          <Grid item xs={12} md={5}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>
              Welcome to Tutorly!
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>
              Your one-stop platform for tutors and students to achieve academic success.
            </Typography>
          </Grid>
          {/* Description */}
          <Grid item xs={12} md={7}>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              Tutorly connects students of all ages with expert tutors for personalized, one-on-one
              learning sessions. Whether you&apos;re looking for flexible tutoring schedules or
              tailored academic guidance, Tutorly is here to make learning seamless and effective.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      <Box sx={{ py: 6 }}>
        <Grid container spacing={5} alignItems="center">
          {/* Problem */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'primary.main', mb: 2 }}>
              The Problem
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              Many students face challenges in finding qualified tutors who fit their unique
              academic needs. Platforms often fail to provide the personalization and flexibility
              required to connect the right tutors with the right students.
            </Typography>
          </Grid>
          {/* Solution */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'primary.main', mb: 2 }}>
              Our Solution
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
              Tutorly redefines the tutoring experience by offering a seamless, user-friendly
              platform that prioritizes personalized academic journeys. With flexible scheduling,
              expert guidance, and tailored lesson plans, Tutorly ensures both students and tutors
              thrive.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Our Aims Section */}
      <Divider sx={{ my: 6 }} />
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary.main"
          sx={{ mb: 4, textAlign: 'center' }}
        >
          Our Aim
        </Typography>
        <Grid container spacing={5} justifyContent="center">
          {aims.map((aim, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: 'transparent',
                    border: '2px solid',
                    color: 'primary.main',
                    width: 50,
                    height: 50,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {aim.icon}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  {aim.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {aim.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Meet the Developers Section */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ mb: 4 }}>
          Meet the Developers
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {developers.map((dev, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 3,
                  boxShadow: 3,
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <Avatar
                  src={dev.image}
                  alt={dev.name}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 3 }}
                />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {dev.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  {dev.description}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Link href={dev.linkedIn} target="_blank" color="inherit">
                    <LinkedInIcon fontSize="large" />
                  </Link>
                  <Link href={dev.github} target="_blank" color="inherit">
                    <GitHubIcon fontSize="large" />
                  </Link>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
