import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel,
  Checkbox,
  Typography,
  Paper
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addStudent } from '../../redux/slices/studentsSlice';

const DAYS = ['월', '화', '수', '목', '금', '토'];
const TIMES = Array.from({ length: 12 }, (_, i) => {
  const hour = Math.floor(i / 2) + 14; // 14:00부터 시작
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

function StudentRegistration() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    time: '',
    isOneOnOne: false
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isOneOnOne' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.day || !formData.time) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    dispatch(addStudent({
      ...formData,
      schedule: `${formData.day} ${formData.time}`
    }));

    setFormData({
      name: '',
      day: '',
      time: '',
      isOneOnOne: false
    });
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        학생 등록
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="name"
          label="학생 이름"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />
        
        <FormControl fullWidth>
          <InputLabel>요일</InputLabel>
          <Select
            name="day"
            value={formData.day}
            onChange={handleChange}
            label="요일"
          >
            {DAYS.map(day => (
              <MenuItem key={day} value={day}>{day}요일</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>시간</InputLabel>
          <Select
            name="time"
            value={formData.time}
            onChange={handleChange}
            label="시간"
          >
            {TIMES.map(time => (
              <MenuItem key={time} value={time}>{time}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              name="isOneOnOne"
              checked={formData.isOneOnOne}
              onChange={handleChange}
            />
          }
          label="1:1 수업"
        />

        <Button type="submit" variant="contained" color="primary">
          등록하기
        </Button>
      </Box>
    </Paper>
  );
}

export default StudentRegistration; 