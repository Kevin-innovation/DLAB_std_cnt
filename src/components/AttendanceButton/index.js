import React from 'react';
import { Box, IconButton, Typography, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { markAttendance, selectAttendedStudents } from '../../redux/slices/attendanceSlice';

const PASSWORD = '1234'; // 관리자 비밀번호

function AttendanceButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const todayCount = useSelector(state => state.attendance.todayCount || 0);
  const attendedStudents = useSelector(selectAttendedStudents);
  const students = JSON.parse(localStorage.getItem('students') || '[]');

  // 현재 날짜와 시간 정보
  const now = new Date();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDay = days[now.getDay()];
  const currentDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  const currentTime = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // 오늘의 학생 목록
  const todayStudents = students
    .filter(student => student.day === currentDay)
    .sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

  const handleSettingsClick = () => {
    const password = prompt('비밀번호를 입력하세요:');
    if (password === PASSWORD) {
      navigate('/management');
    } else if (password !== null) {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleAttendanceClick = (student) => {
    if (window.confirm('출석을 체크하시겠습니까?')) {
      dispatch(markAttendance(student));
      alert(`${student.name} 학생 출석이 완료되었습니다.${student.isOneOnOne ? ' (1:1 수업)' : ''}`);
    }
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
            {todayStudents.map((student) => (
              <ListItem
                key={student.id}
                sx={{
                  borderBottom: '1px solid #DBDBDB',
                  '&:last-child': {
                    borderBottom: 'none',
                  },
                }}
              >
                <ListItemText
                  primary={student.name}
                  secondary={student.time}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                      color: 'text.primary',
                    },
                    '& .MuiListItemText-secondary': {
                      color: 'text.secondary',
                    },
                  }}
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
                    disabled={attendedStudents.includes(student.id)}
                    sx={{
                      bgcolor: !attendedStudents.includes(student.id)
                        ? 'primary.main'
                        : 'grey.300',
                      color: !attendedStudents.includes(student.id)
                        ? 'primary.contrastText'
                        : 'text.secondary',
                      '&:hover': {
                        bgcolor: !attendedStudents.includes(student.id)
                          ? 'primary.dark'
                          : 'grey.300',
                      },
                    }}
                  >
                    {attendedStudents.includes(student.id) ? '출석완료' : '출석'}
                  </Button>
                </Box>
              </ListItem>
            ))}
            {todayStudents.length === 0 && (
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
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid #DBDBDB',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            오늘 출석: {todayCount}명
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default AttendanceButton; 