import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { markAttendance, endDay, endWeek } from '../../redux/slices/attendanceSlice';
import { selectTodayStudents } from '../../redux/slices/studentsSlice';

function AttendanceManagement() {
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const todayStudents = useSelector(selectTodayStudents);
  const attendanceCount = useSelector(state => state.attendance.todayCount);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  const isWithinOneHour = (scheduleTime) => {
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const scheduleDate = new Date();
    scheduleDate.setHours(hours, minutes, 0);
    
    const diffMs = scheduleDate - currentTime;
    const diffMins = diffMs / 60000;
    
    return diffMins <= 60 && diffMins > -60; // 수업 1시간 전부터 수업 종료까지
  };

  const handleAttendance = (studentId) => {
    dispatch(markAttendance(studentId));
  };

  const handleEndDay = () => {
    if (window.confirm('오늘 수업을 종료하시겠습니까?')) {
      dispatch(endDay());
    }
  };

  const handleEndWeek = () => {
    const today = new Date().getDay();
    if (today === 6) { // 토요일인 경우
      if (window.confirm('이번 주 수업을 종료하시겠습니까?')) {
        dispatch(endWeek());
      }
    } else {
      alert('주간 마감은 토요일에만 가능합니다.');
    }
  };

  const upcomingStudents = todayStudents.filter(student => 
    isWithinOneHour(student.time)
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        출석 관리
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          현재 시간: {currentTime.toLocaleTimeString()}
        </Typography>
        <Typography variant="subtitle1">
          오늘 출석 학생 수: {attendanceCount}명
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        예정된 수업
      </Typography>
      
      <List>
        {upcomingStudents.map(student => (
          <ListItem key={student.id}>
            <ListItemText
              primary={student.name}
              secondary={`${student.time} ${student.isOneOnOne ? '(1:1)' : ''}`}
            />
            <ListItemSecondaryAction>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAttendance(student.id)}
                disabled={student.attended}
              >
                {student.attended ? '출석완료' : '출석하기'}
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleEndDay}
          fullWidth
        >
          퇴근하기
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleEndWeek}
          fullWidth
        >
          주간마감
        </Button>
      </Box>
    </Paper>
  );
}

export default AttendanceManagement; 