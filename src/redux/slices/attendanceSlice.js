import { createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('attendanceState');
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    
    // 날짜 변경 체크
    const currentDate = new Date().toLocaleDateString();
    const savedDate = state.lastSavedDate;
    
    if (savedDate !== currentDate) {
      // 날짜가 변경되었으면 초기화된 상태 반환
      return {
        ...defaultState,
        lastSavedDate: currentDate,
        weeklyAttendance: state.weeklyAttendance || defaultState.weeklyAttendance
      };
    }
    
    return state;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const currentDate = new Date().toLocaleDateString();
    // 현재 날짜의 출석 정보를 dailyAttendance에 저장
    state.dailyAttendance[currentDate] = {
      count: state.todayCount,
      attendedStudents: state.attendedStudents
    };
    
    const serializedState = JSON.stringify({
      ...state,
      lastSavedDate: currentDate
    });
    localStorage.setItem('attendanceState', serializedState);
    localStorage.setItem('attendanceHistory', JSON.stringify(state.history));
  } catch (err) {
    // Ignore write errors
  }
};

const defaultState = {
  todayCount: 0,
  history: {},
  attendedStudents: [],
  dailyAttendance: {},
  weeklyAttendance: {
    '월': 0,
    '화': 0,
    '수': 0,
    '목': 0,
    '금': 0,
    '토': 0,
  }
};

const initialState = {
  ...defaultState,
  ...(loadState() || {}),
  weeklyAttendance: (loadState() || {}).weeklyAttendance || defaultState.weeklyAttendance,
  attendedStudents: (loadState() || {}).attendedStudents || []
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    markAttendance: (state, action) => {
      const student = action.payload;
      
      if (!state.attendedStudents.includes(student.id)) {
        const increment = student.isOneOnOne ? 2 : 1;
        
        state.todayCount = (state.todayCount || 0) + increment;
        state.attendedStudents.push(student.id);
        
        const today = new Date().getDay();
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[today];
        
        if (!state.weeklyAttendance) {
          state.weeklyAttendance = defaultState.weeklyAttendance;
        }
        
        state.weeklyAttendance[dayName] = (state.weeklyAttendance[dayName] || 0) + increment;
        
        saveState(state);
      }
    },
    resetDayAttendance: (state, action) => {
      const dayToReset = action.payload;
      if (state.weeklyAttendance && state.weeklyAttendance[dayToReset] !== undefined) {
        state.weeklyAttendance[dayToReset] = 0;
        
        // 현재 요일의 출석을 초기화하는 경우 attendedStudents도 초기화
        const today = new Date().getDay();
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = days[today];
        
        if (dayToReset === dayName) {
          state.todayCount = 0;
          state.attendedStudents = [];
        }
        
        saveState(state);
      }
    },
    endDay: (state) => {
      state.todayCount = 0;
      state.attendedStudents = [];
      saveState(state);
    },
    endWeek: (state) => {
      state.todayCount = 0;
      state.history = {};
      state.attendedStudents = [];
      state.weeklyAttendance = defaultState.weeklyAttendance;
      state.lastReset = new Date().toISOString();
      saveState(state);
    },
  },
});

export const selectTodayCount = state => state.attendance.todayCount || 0;
export const selectWeeklyAttendance = state => state.attendance.weeklyAttendance || defaultState.weeklyAttendance;
export const selectWeeklyCount = state => {
  const weeklyAttendance = state.attendance.weeklyAttendance || defaultState.weeklyAttendance;
  return Object.values(weeklyAttendance).reduce((sum, count) => sum + count, 0);
};
export const selectAttendedStudents = state => state.attendance.attendedStudents || [];
export const selectDailyAttendance = (date) => state => {
  return state.attendance.dailyAttendance[date] || { count: 0, attendedStudents: [] };
};

export const { markAttendance, resetDayAttendance, endDay, endWeek } = attendanceSlice.actions;

// 미들웨어: 매주 월요일 자동 초기화
export const weeklyResetMiddleware = store => next => action => {
  const result = next(action);
  
  const state = store.getState();
  const lastReset = state.attendance.lastReset ? new Date(state.attendance.lastReset) : null;
  const now = new Date();
  
  if (lastReset) {
    const daysSinceReset = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));
    const isMonday = now.getDay() === 1;
    
    if (daysSinceReset >= 7 && isMonday) {
      store.dispatch(endWeek());
    }
  }
  
  return result;
};

export default attendanceSlice.reducer; 