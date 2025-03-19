import { 
  format as dateFnsFormat, 
  startOfWeek as dateFnsStartOfWeek,
  endOfWeek as dateFnsEndOfWeek,
  isWithinInterval as dateFnsIsWithinInterval
} from 'date-fns';
import { ko } from 'date-fns/locale/ko';

// 현재 날짜 포맷팅
export const formatDate = (date) => {
  return dateFnsFormat(date, 'yyyy-MM-dd', { locale: ko });
};

// 현재 시간 포맷팅
export const formatTime = (date) => {
  return dateFnsFormat(date, 'HH:mm', { locale: ko });
};

// 주의 시작일 구하기 (일요일)
export const getWeekStart = (date) => {
  return dateFnsStartOfWeek(date, { weekStartsOn: 0 });
};

// 주의 마지막일 구하기 (토요일)
export const getWeekEnd = (date) => {
  return dateFnsEndOfWeek(date, { weekStartsOn: 0 });
};

// 해당 주에 속하는지 확인
export const isInCurrentWeek = (date, weekStart) => {
  const weekEnd = getWeekEnd(weekStart);
  return dateFnsIsWithinInterval(date, { start: weekStart, end: weekEnd });
};

// 주차 표시 (예: 2024년 1주차)
export const formatWeek = (date) => {
  const weekStart = getWeekStart(date);
  return dateFnsFormat(weekStart, "'Week' w, yyyy", { locale: ko });
};
