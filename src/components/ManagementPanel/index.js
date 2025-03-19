import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Container,
  Paper,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { endDay, endWeek, resetDayAttendance, selectWeeklyAttendance, selectWeeklyCount } from '../../redux/slices/attendanceSlice';
import { useNavigate } from 'react-router-dom';

const DAYS = ['월', '화', '수', '목', '금', '토'];
const TIMES = Array.from({ length: 12 }, (_, i) => {
  const hour = Math.floor(i / 2) + 14; // 14:00부터 시작
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minute}`;
});

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

function ManagementPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({
    name: '',
    day: '',
    time: '',
    isOneOnOne: false
  });

  const weeklyAttendance = useSelector(selectWeeklyAttendance);
  const weeklyCount = useSelector(selectWeeklyCount);

  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
    setStudents(savedStudents);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleStudentFormChange = (e) => {
    const { name, value, checked } = e.target;
    setStudentForm(prev => ({
      ...prev,
      [name]: name === 'isOneOnOne' ? checked : value
    }));
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.day || !studentForm.time) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      ...studentForm
    };

    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('students', JSON.stringify(updatedStudents));

    setStudentForm({
      name: '',
      day: '',
      time: '',
      isOneOnOne: false
    });

    alert('학생이 등록되었습니다.');
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('이 학생을 삭제하시겠습니까?')) {
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
    }
  };

  const handleEndDay = () => {
    if (window.confirm('오늘 수업을 종료하시겠습니까?')) {
      dispatch(endDay());
      navigate('/');
    }
  };

  const handleEndWeek = () => {
    const today = new Date().getDay();
    if (today === 6) { // 토요일인 경우
      if (window.confirm('이번 주 수업을 종료하시겠습니까? 주간 출석 데이터가 초기화됩니다.')) {
        dispatch(endWeek());
        navigate('/');
      }
    } else {
      alert('주간 마감은 토요일에만 가능합니다.');
    }
  };

  const handleResetDayAttendance = (day) => {
    if (window.confirm(`${day}요일의 출석을 초기화하시겠습니까?`)) {
      dispatch(resetDayAttendance(day));
    }
  };

  const getStudentsByDay = (day) => {
    return students
      .filter(student => student.day === day)
      .sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
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
          <IconButton
            onClick={() => navigate('/')}
            sx={{ color: 'secondary.main' }}
          >
            <ArrowBackIcon />
          </IconButton>
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
            관리자 설정
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleEndDay}
          sx={{
            bgcolor: 'error.main',
            color: 'error.contrastText',
            '&:hover': {
              bgcolor: 'error.dark',
            },
          }}
        >
          수업 종료
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 2 }}>
        <Paper
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mt: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '1px solid #DBDBDB',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: '1px solid #DBDBDB',
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: 'primary.main',
              },
            }}
          >
            <Tab label="학생 등록" />
            <Tab label="학생 목록" />
            <Tab label="수업 관리" />
          </Tabs>

          {/* Student Registration Form */}
          <TabPanel value={currentTab} index={0}>
            <Box
              component="form"
              onSubmit={handleStudentSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3,
              }}
            >
              <TextField
                name="name"
                label="학생 이름"
                value={studentForm.name}
                onChange={handleStudentFormChange}
                required
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>요일</InputLabel>
                <Select
                  name="day"
                  value={studentForm.day}
                  onChange={handleStudentFormChange}
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
                  value={studentForm.time}
                  onChange={handleStudentFormChange}
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
                    checked={studentForm.isOneOnOne}
                    onChange={handleStudentFormChange}
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label="1:1 수업"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                등록
              </Button>
            </Box>
          </TabPanel>

          {/* Student List */}
          <TabPanel value={currentTab} index={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {DAYS.map(day => {
                const dayStudents = getStudentsByDay(day);
                return dayStudents.length > 0 ? (
                  <Box key={day}>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        color: '#262626',
                      }}
                    >
                      {day}요일
                    </Typography>
                    <List>
                      {dayStudents.map(student => (
                        <ListItem 
                          key={student.id}
                          sx={{
                            borderBottom: '1px solid #DBDBDB',
                            py: 1.5,
                          }}
                        >
                          <ListItemText
                            primary={student.name}
                            secondary={`${student.time} ${student.isOneOnOne ? '(1:1)' : ''}`}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                fontWeight: 600,
                                color: '#262626',
                              },
                              '& .MuiListItemText-secondary': {
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                color: '#8e8e8e',
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
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteStudent(student.id)}
                              sx={{
                                color: 'error.main',
                                '&:hover': {
                                  color: 'error.dark',
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ) : null;
              })}
            </Box>
          </TabPanel>

          {/* Class Management */}
          <TabPanel value={currentTab} index={2}>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Weekly Attendance Summary */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #DBDBDB',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  이번 주 출석 현황
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {weeklyAttendance && Object.entries(weeklyAttendance).map(([day, count]) => (
                    <Box
                      key={day}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderBottom: '1px solid #DBDBDB',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ color: 'text.primary' }}>
                          {day}요일
                        </Typography>
                        <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>
                          {count}명
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleResetDayAttendance(day)}
                        size="small"
                        sx={{
                          color: 'warning.main',
                          '&:hover': {
                            color: 'warning.dark',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      mt: 1,
                      pt: 2,
                      borderTop: '2px solid #DBDBDB',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>
                      주간 총계
                    </Typography>
                    <Typography
                      sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                      }}
                    >
                      {weeklyCount}명
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Button
                variant="contained"
                onClick={handleEndWeek}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                주간 결산
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Box>
    </Box>
  );
}

export default ManagementPanel; 