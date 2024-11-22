import React, { useState } from 'react';
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

  const theme = useTheme();

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
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Urdu">Urdu</MenuItem>
            <MenuItem value="Mandarin">Mandarin</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
            <MenuItem value="French">French</MenuItem>
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
            <MenuItem value="O levels">O levels</MenuItem>
            <MenuItem value="A levels">A levels</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
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
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="English Literature">English Literature</MenuItem>
            <MenuItem value="Computer Science">Computer Science</MenuItem>
            <MenuItem value="Art">Art</MenuItem>
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
