import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, loadFromLocalStorage, saveToLocalStorage } from '../../utils/localStorage';

const initialState = {
  students: loadFromLocalStorage(STORAGE_KEYS.STUDENTS) || [],
  selectedStudent: null,
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      const newStudent = {
        id: Date.now().toString(),
        ...action.payload,
        attended: false
      };
      state.students.push(newStudent);
      saveToLocalStorage(STORAGE_KEYS.STUDENTS, state.students);
    },
    
    updateStudent: (state, action) => {
      const { id, ...updates } = action.payload;
      const studentIndex = state.students.findIndex(student => student.id === id);
      if (studentIndex !== -1) {
        state.students[studentIndex] = {
          ...state.students[studentIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        saveToLocalStorage(STORAGE_KEYS.STUDENTS, state.students);
      }
    },
    
    deleteStudent: (state, action) => {
      state.students = state.students.filter(student => student.id !== action.payload);
      saveToLocalStorage(STORAGE_KEYS.STUDENTS, state.students);
    },
    
    setSelectedStudent: (state, action) => {
      state.selectedStudent = action.payload;
    },

    resetAttendance: (state) => {
      state.students.forEach(student => {
        student.attended = false;
      });
      saveToLocalStorage(STORAGE_KEYS.STUDENTS, state.students);
    }
  },
});

export const { addStudent, updateStudent, deleteStudent, setSelectedStudent, resetAttendance } = studentsSlice.actions;

// 선택자
export const selectAllStudents = (state) => state.students.students;
export const selectSelectedStudent = (state) => state.students.selectedStudent;
export const selectStudentById = (state, studentId) => 
  state.students.students.find(student => student.id === studentId);

export const selectTodayStudents = (state) => {
  const today = new Date();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const currentDay = dayNames[today.getDay()];
  
  return state.students.students.filter(student => student.day === currentDay);
};

export default studentsSlice.reducer; 