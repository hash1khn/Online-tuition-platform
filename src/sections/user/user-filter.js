import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Button, MenuItem, Grid, useTheme, Typography, Slider } from '@mui/material';

const UserFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    languages: '',
    grade: '',
    subjects: '',
    keyword: '',
    price: [0, 1000],
  });

  const [languages, setLanguages] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);

  const theme = useTheme();

  // Fetch filter options from the backend
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch languages
        const langResponse = await fetch('/api/languages');
        if (!langResponse.ok) throw new Error('Failed to fetch languages');
        setLanguages(await langResponse.json());

        // Fetch subjects
        const subjectResponse = await fetch('/api/subjects');
        if (!subjectResponse.ok) throw new Error('Failed to fetch subjects');
        setSubjects(await subjectResponse.json());

        // Fetch grades (domain)
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
      price: filters.price.join('-'), // Convert the price array [0, 1000] to the string "0-1000"
    };
    onFilterChange(formattedFilters);
  };
  const handleClear = () => {
    setFilters({
      languages: '',
      grade: '',
      subjects: '',
      keyword: '',
      price: [0, 1000],
    });
    onFilterChange({});
  };
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        padding: 2,
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
          <TextField
            select
            label="Select Language"
            name="languages"
            value={filters.languages}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ flex: 1, minWidth: '170px',
              height: '40px',mt:2,
              '& .MuiInputBase-root': { height: '40px', padding: '0 10px' },
             }}
          >
            {languages.map((language) => (
              <MenuItem key={language.language_id} value={language.name}>
                {language.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Grade"
            name="grade"
            value={filters.grade}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ flex: 1, minWidth: '170px',mt:2,
              height: '40px',
              '& .MuiInputBase-root': { height: '40px', padding: '0 10px' },
             }}
          >
            {[...new Set(grades.map((grade) => grade.domain))].map((grade) => (
              <MenuItem key={grade} value={grade}>
                {grade}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Subject(s)"
            name="subjects"
            value={filters.subjects}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ flex: 1, minWidth: '170px',mt:2,
              height: '40px',
              '& .MuiInputBase-root': { height: '40px', padding: '0 10px' },
             }}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.subject_id} value={subject.name}>
                {subject.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Enter Keyword (optional)"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ flex: 1, minWidth: '300px',mt:2,
              height: '40px',
              '& .MuiInputBase-root': { height: '40px', padding: '0 10px' },
             }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ flex: 1, minWidth: '100px',mt:2, height: '40px', textTransform: 'none' }}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            color="info"
            onClick={handleClear}
            sx={{ flex: 1, minWidth: '100px',mt:2, height: '40px', textTransform: 'none' }}
          >
            Clear
          </Button>

       {/* Price Slider */}
      <Box sx={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Price Per Session
        </Typography>
        <Slider
          value={filters.price}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          sx={{
            width: '100%',
            maxWidth: '600px',
            color: theme.palette.primary.main,
            '& .MuiSlider-thumb': { borderRadius: '50%' },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px' }}>
          <Typography variant="body2">$0.00</Typography>
          <Typography variant="body2">$1000.00</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// PropTypes validation
UserFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default UserFilter;
