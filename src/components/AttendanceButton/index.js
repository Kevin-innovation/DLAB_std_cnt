import React, { useState } from 'react';
import { Box, IconButton, Typography, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { markAttendance, selectAttendedStudents, selectDailyAttendance, selectWeeklyAttendance } from '../../redux/slices/attendanceSlice';

const PASSWORD = '1234'; // 관리자 비밀번호

function AttendanceButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dateOffset, setDateOffset] = useState(0); // 0: 오늘, -1: 어제, 1: 내일
  const todayCount = useSelector(state => state.attendance.todayCount || 0);
  const attendedStudents = useSelector(selectAttendedStudents);
  const weeklyAttendance = useSelector(selectWeeklyAttendance);
  const students = JSON.parse(localStorage.getItem('students') || '[]');

  // 날짜 계산 함수
  const getTargetDate = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  };

  // 선택된 날짜 정보
  const targetDate = getTargetDate(dateOffset);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDay = days[targetDate.getDay()];
  const currentDate = `${targetDate.getFullYear()}년 ${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일`;
  const currentTime = targetDate.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // 해당 날짜의 학생 목록
  const targetDayStudents = students
    .filter(student => student.day === currentDay)
    .sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

  // 선택된 날짜의 출석 기록 가져오기
  const targetDateString = targetDate.toLocaleDateString();
  const dailyAttendance = useSelector(selectDailyAttendance(targetDateString));

  // 해당 요일의 주간 출석 수 가져오기
  const weeklyCount = weeklyAttendance[currentDay] || 0;

  // 날짜 이동 핸들러
  const handleDateChange = (direction) => {
    setDateOffset(prev => prev + direction);
  };

  const handleSettingsClick = () => {
    const password = prompt('비밀번호를 입력하세요:');
    if (password === PASSWORD) {
      navigate('/management');
    } else if (password !== null) {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleAttendanceClick = (student) => {
    if (dateOffset !== 0) {
      return;
    }
    dispatch(markAttendance(student));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        pt: 2
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderBottom: '1px solid #DBDBDB',
          py: 2,
          px: 3,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={process.env.PUBLIC_URL + '/logo.png'}
            alt="DLAB Logo"
            sx={{
              height: 32,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              fontWeight: 600,
            }}
          >
            Kevin's Class
          </Typography>
        </Box>
        <IconButton
          onClick={handleSettingsClick}
          sx={{
            color: 'secondary.main',
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          mt: 3,
        }}
      >
        {/* Date Navigation */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: 600, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <IconButton 
            onClick={() => handleDateChange(-1)}
            sx={{ color: 'primary.main' }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {currentDate}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {currentDay}요일
            </Typography>
          </Box>
          
          <IconButton 
            onClick={() => handleDateChange(1)}
            sx={{ color: 'primary.main' }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        {/* Date and Time Display */}
        <Box
          sx={{
            width: '100%',
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid #DBDBDB',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
            }}
          >
            {currentDate} ({currentDay}요일)
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {currentTime}
          </Typography>
        </Box>

        {/* Today's Students List */}
        <Box
          sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid #DBDBDB',
            overflow: 'hidden',
          }}
        >
          <Typography
            sx={{
              p: 2,
              borderBottom: '1px solid #DBDBDB',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            오늘의 수업
          </Typography>
          <List>
            {targetDayStudents.map((student) => (
              <ListItem
                key={student.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              >
                <ListItemText
                  primary={student.name}
                  secondary={`${student.time} ${student.isOneOnOne ? '(1:1)' : ''}`}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {student.isOneOnOne && (
                    <Chip
                      label="1:1"
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 600,
                      }}
                    />
                  )}
                  <Button
                    variant="contained"
                    onClick={() => handleAttendanceClick(student)}
                    disabled={dateOffset !== 0 || attendedStudents.includes(student.id)}
                    sx={{
                      bgcolor: dateOffset === 0 && !attendedStudents.includes(student.id)
                        ? 'primary.main'
                        : 'grey.300',
                      color: dateOffset === 0 && !attendedStudents.includes(student.id)
                        ? 'primary.contrastText'
                        : 'text.secondary',
                      '&:hover': {
                        bgcolor: dateOffset === 0 && !attendedStudents.includes(student.id)
                          ? 'primary.dark'
                          : 'grey.300',
                      },
                    }}
                  >
                    {dateOffset !== 0 ? '출석 불가' : 
                     attendedStudents.includes(student.id) ? '출석완료' : '출석'}
                  </Button>
                </Box>
              </ListItem>
            ))}
            {targetDayStudents.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="오늘은 예정된 수업이 없습니다."
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                />
              </ListItem>
            )}
          </List>
        </Box>

        {/* Attendance Count */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid #DBDBDB',
            textAlign: 'center',
            mt: 2
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {dateOffset === 0 ? 
              `오늘 출석: ${todayCount}명` : 
              dateOffset < 0 ? 
                `${currentDay}요일 출석 기록: ${weeklyCount}명` : 
                '다음 날짜의 예정된 수업'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default AttendanceButton; 