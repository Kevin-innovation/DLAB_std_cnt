# DLAB 학생 출석 관리 시스템 기술 문서

## 1. 기술 스택

### 프론트엔드
- **React** (v18.2.0): 사용자 인터페이스 구축
- **Redux Toolkit** (v1.9.5): 상태 관리
- **Material-UI** (v5.17.1): UI 컴포넌트 및 스타일링
- **React Router DOM** (v6.22.3): 라우팅 관리

### 개발 도구
- **Node.js & npm**: 개발 환경 및 패키지 관리
- **Git & GitHub**: 버전 관리 및 배포
- **GitHub Pages**: 웹 호스팅

## 2. 데이터 구조

### Redux Store 구조
```javascript
{
  attendance: {
    todayCount: number,          // 오늘의 출석 학생 수
    history: object,             // 출석 기록 히스토리
    attendedStudents: string[],  // 출석한 학생 ID 목록
    dailyAttendance: {          // 날짜별 출석 기록
      [date: string]: {
        count: number,
        attendedStudents: string[]
      }
    },
    weeklyAttendance: {         // 요일별 출석 현황
      '월': number,
      '화': number,
      '수': number,
      '목': number,
      '금': number,
      '토': number
    }
  },
  students: {
    students: Student[],         // 전체 학생 목록
    selectedStudent: Student     // 선택된 학생 정보
  }
}
```

### 주요 인터페이스
```typescript
interface Student {
  id: string;
  name: string;
  day: string;          // 수업 요일
  time: string;         // 수업 시간
  isOneOnOne: boolean;  // 1:1 수업 여부
  attended: boolean;    // 출석 상태
}
```

## 3. 주요 기능 및 알고리즘

### 1) 출석 체크 시스템
```javascript
// 출석 처리 로직
const markAttendance = (state, action) => {
  const student = action.payload;
  
  if (!state.attendedStudents.includes(student.id)) {
    // 1:1 수업은 2명으로 카운트
    const increment = student.isOneOnOne ? 2 : 1;
    state.todayCount += increment;
    state.attendedStudents.push(student.id);
    
    // 요일별 통계 업데이트
    const today = new Date().getDay();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = days[today];
    state.weeklyAttendance[dayName] += increment;
  }
};
```

### 2) 자동 초기화 시스템
```javascript
// 날짜 변경 시 자동 초기화 로직
const loadState = () => {
  const state = JSON.parse(localStorage.getItem('attendanceState'));
  const currentDate = new Date().toLocaleDateString();
  
  if (state.lastSavedDate !== currentDate) {
    return {
      ...defaultState,
      lastSavedDate: currentDate,
      weeklyAttendance: state.weeklyAttendance
    };
  }
  return state;
};
```

### 3) 날짜 네비게이션 시스템
- 날짜 오프셋 기반 네비게이션
- 과거/미래 날짜의 수업 목록 표시
- 요일별 출석 데이터 연동

## 4. 데이터 지속성

### LocalStorage 구조
```javascript
{
  'attendanceState': {
    // 출석 현황 데이터
    lastSavedDate: string,
    todayCount: number,
    attendedStudents: string[],
    weeklyAttendance: object
  },
  'students': [
    // 학생 정보 배열
  ]
}
```

### 데이터 동기화 프로세스
1. 앱 초기화 시 LocalStorage 데이터 로드
2. 상태 변경 시 자동 저장
3. 날짜 변경 시 자동 초기화
4. 주간 데이터 유지 관리

## 5. 성능 최적화

### 렌더링 최적화
- React.memo를 통한 불필요한 리렌더링 방지
- useCallback과 useMemo를 통한 함수/값 메모이제이션
- 리스트 렌더링 시 적절한 key 사용

### 상태 관리 최적화
- Redux Toolkit의 createSlice 사용으로 불변성 관리
- 선택적 상태 구독으로 불필요한 리렌더링 방지
- 효율적인 상태 업데이트 로직

## 6. 보안

### 관리자 인증
- 간단한 비밀번호 기반 관리자 접근 제어
- 설정 변경 및 데이터 초기화 권한 관리

### 데이터 보호
- LocalStorage를 통한 클라이언트 사이드 데이터 저장
- 중요 데이터 암호화 고려사항

## 7. 확장성

### 추가 가능한 기능
1. 백엔드 연동을 통한 데이터 영구 저장
2. 다중 사용자 지원
3. 통계 분석 기능 강화
4. 알림 시스템 구현

### 코드 모듈화
- 기능별 컴포넌트 분리
- 재사용 가능한 커스텀 훅 구현
- 유틸리티 함수 모듈화 