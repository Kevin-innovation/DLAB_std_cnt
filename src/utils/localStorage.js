// 로컬 스토리지 키 상수
export const STORAGE_KEYS = {
  STUDENTS: 'dlab_students',
  ATTENDANCE: 'dlab_attendance',
  WEEKLY_STATS: 'dlab_weekly_stats',
};

// 데이터 저장
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// 데이터 불러오기
export const loadFromLocalStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

// 주간 통계 저장
export const saveWeeklyStats = (weekStats) => {
  const existingStats = loadFromLocalStorage(STORAGE_KEYS.WEEKLY_STATS) || [];
  const updatedStats = [...existingStats, weekStats];
  return saveToLocalStorage(STORAGE_KEYS.WEEKLY_STATS, updatedStats);
};

// 특정 주의 통계 불러오기
export const getWeeklyStats = (weekStartDate) => {
  const allStats = loadFromLocalStorage(STORAGE_KEYS.WEEKLY_STATS) || [];
  return allStats.find(stats => stats.weekStartDate === weekStartDate);
};
