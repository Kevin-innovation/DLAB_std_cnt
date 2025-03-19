import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';
import { getWeekStart, formatDate } from '../../utils/dateUtils';

const initialState = {
  weeklyStats: loadFromLocalStorage(STORAGE_KEYS.WEEKLY_STATS) || [],
  currentWeekStart: formatDate(getWeekStart(new Date())),
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    updateWeeklyStats: (state, action) => {
      const { weekStartDate, dailyCounts } = action.payload;
      const existingStatIndex = state.weeklyStats.findIndex(
        stat => stat.weekStartDate === weekStartDate
      );
      
      const totalStudents = Object.values(dailyCounts).reduce((sum, count) => sum + count, 0);
      const newStat = {
        weekStartDate,
        dailyCounts,
        totalStudents,
        updatedAt: new Date().toISOString(),
      };
      
      if (existingStatIndex !== -1) {
        state.weeklyStats[existingStatIndex] = newStat;
      } else {
        state.weeklyStats.push(newStat);
      }
      
      saveToLocalStorage(STORAGE_KEYS.WEEKLY_STATS, state.weeklyStats);
    },
    
    setCurrentWeekStart: (state, action) => {
      state.currentWeekStart = action.payload;
    },
    
    clearWeeklyStats: (state) => {
      state.weeklyStats = [];
      saveToLocalStorage(STORAGE_KEYS.WEEKLY_STATS, []);
    },
  },
});

export const { updateWeeklyStats, setCurrentWeekStart, clearWeeklyStats } = statsSlice.actions;

// 선택자
export const selectAllWeeklyStats = (state) => state.stats.weeklyStats;
export const selectCurrentWeekStats = (state) => {
  const currentWeekStart = state.stats.currentWeekStart;
  return state.stats.weeklyStats.find(stat => stat.weekStartDate === currentWeekStart);
};
export const selectWeeklyStatsByDate = (state, weekStartDate) =>
  state.stats.weeklyStats.find(stat => stat.weekStartDate === weekStartDate);

export default statsSlice.reducer; 