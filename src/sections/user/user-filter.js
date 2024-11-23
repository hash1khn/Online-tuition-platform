import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Button, MenuItem, Grid, useTheme } from '@mui/material';

const UserFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    languages: '',
    grade: '',
    subjects: '',
    keyword: '',
    price: '',
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

  const handleSearch = () => {
    onFilterChange(filters);
  };

  const handleClear = () => {
    setFilters({
      languages: '',
      grade: '',
      subjects: '',
      keyword: '',
      price: '',
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
      }}
    >
      <Grid container spacing={2}>
        {/* First Row */}
        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Select Language"
            name="languages"
            value={filters.languages}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.background.default } }}
          >
            {languages.map((language) => (
              <MenuItem key={language.language_id} value={language.name}>
                {language.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Select Grade"
            name="grade"
            value={filters.grade}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.background.default } }}
          >
            {[...new Set(grades.map((grade) => grade.domain))].map((grade) => (
              <MenuItem key={grade} value={grade}>
                {grade}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            select
            label="Select Subject(s)"
            name="subjects"
            value={filters.subjects}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.background.default } }}
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.subject_id} value={subject.name}>
                {subject.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Second Row */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Price Per Session"
            name="price"
            value={filters.price}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.background.default } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Enter Keyword (optional)"
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
            variant="outlined"
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-root': { backgroundColor: theme.palette.background.default } }}
          />
        </Grid>

        {/* Buttons */}
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
            sx={{ height: '40px', textTransform: 'none' }}
          >
            Search
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            variant="outlined"
            color="info"
            onClick={handleClear}
            fullWidth
            sx={{ height: '40px', textTransform: 'none' }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// PropTypes validation
UserFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default UserFilter;
