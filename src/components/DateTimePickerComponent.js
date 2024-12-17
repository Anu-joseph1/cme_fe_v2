import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import './DateTimePickerComponent.css'; // Add this line to import your custom CSS

const DateTimePickerComponent = ({ value, label, onChange }) => {
  // Ensure that value is a valid dayjs object
  const isValidDayjs = (val) => val && val.isValid && val.isValid();

  const handleChange = (newValue) => {
    if (isValidDayjs(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="datetime-picker-box"> {/* Apply your custom class here */}
        <DateTimePicker
          label={label}
          slotProps={{ textField: { size: 'small' } }}
          value={isValidDayjs(value) ? value : null}
          onChange={handleChange}
          renderInput={(props) => <TextField {...props}/>}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;