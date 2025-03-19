import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllStudents, addStudent } from '../../redux/slices/studentsSlice';

function Management() {
  const students = useSelector(selectAllStudents);
  const dispatch = useDispatch();

  const handleAddTestStudent = () => {
    dispatch(addStudent({
      name: `테스트 학생 ${students.length + 1}`,
      schedule: '14:00',
      isOneOnOne: Math.random() > 0.5
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        학생 관리
      </Typography>
      <Button 
        variant="contained" 
        onClick={handleAddTestStudent}
        sx={{ mb: 2 }}
      >
        테스트 학생 추가
      </Button>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          등록된 학생 목록 ({students.length}명)
        </Typography>
        {students.map(student => (
          <Box key={student.id} sx={{ mb: 1 }}>
            <Typography>
              {student.name} - {student.schedule}
              {student.isOneOnOne && ' (1:1 수업)'}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}

export default Management; 