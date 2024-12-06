import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  Slider,
  useTheme,
} from '@mui/material';

const UserFilterDialog = ({ open, onClose, onFilterChange }) => {
  const [filters, setFilters] = useState({
    languages: '',
    grade: '',
    subjects: '',
    keyword: '',
    price: [0, 100],
  });

  const [languages, setLanguages] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);

  const theme = useTheme();

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const langResponse = await fetch('/api/languages');
        if (!langResponse.ok) throw new Error('Failed to fetch languages');
        setLanguages(await langResponse.json());

        const subjectResponse = await fetch('/api/subjects');
        if (!subjectResponse.ok) throw new Error('Failed to fetch subjects');
        setSubjects(await subjectResponse.json());

        const gradeResponse = await fetch('/api/grade-levels');
        if (!gradeResponse.ok) throw new Error('Failed to fetch grades');
        setGrades(await gradeResponse.json());
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (event, newValue) => {
    setFilters((prev) => ({ ...prev, price: newValue }));
  };

  const handleSearch = () => {
    const formattedFilters = {
      ...filters,
      price: filters.price.join('-'), // Convert the price array [0, 100] to the string "0-100"
    };
    onFilterChange(formattedFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      languages: '',
      grade: '',
      subjects: '',
      keyword: '',
      price: [0, 100],
    });
    onFilterChange({});
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        '& .MuiDialog-paper': {
          width: '90%',
          maxWidth: '400px', 
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" textAlign="center" sx={{ fontWeight: 'bold' }}>
          Filter Teachers
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          {/* Language Selector */}
          <Grid item xs={8}>
            <TextField
              select
              label="Select Language"
              name="languages"
              value={filters.languages}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              size="small"
            >
              {languages.map((language) => (
                <MenuItem key={language.language_id} value={language.name}>
                  {language.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Grade Selector */}
          <Grid item xs={8}>
            <TextField
              select
              label="Select Grade"
              name="grade"
              value={filters.grade}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              size="small"
            >
              {[...new Set(grades.map((grade) => grade.domain))].map((grade) => (
                <MenuItem key={grade} value={grade}>
                  {grade}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Subjects Selector */}
          <Grid item xs={8}>
            <TextField
              select
              label="Select Subject(s)"
              name="subjects"
              value={filters.subjects}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              size="small"
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.subject_id} value={subject.name}>
                  {subject.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Keyword Input */}
          <Grid item xs={8}>
            <TextField
              label="Enter Keyword (optional)"
              name="keyword"
              value={filters.keyword}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              size="small"
            />
          </Grid>

          {/* Price Slider */}
          <Grid item xs={8}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Price Per Session
            </Typography>
            <Slider
              value={filters.price}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              sx={{
                color: theme.palette.primary.main,
                '& .MuiSlider-thumb': { borderRadius: '50%' },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">$0.00</Typography>
              <Typography variant="body2">$100.00</Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            width: '100%',
            px: 2,
            pb: 1,
          }}
        >
          <Button variant="outlined" color="info" onClick={handleClear}>
            Clear
          </Button>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// PropTypes validation
UserFilterDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default UserFilterDialog;
