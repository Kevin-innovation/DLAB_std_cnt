# DLAB 학생 카운터

학생 정보를 관리하고 추적하기 위한 React 기반 웹 애플리케이션입니다.

## 🚀 주요 기능

- Material-UI를 사용한 현대적이고 반응형 사용자 인터페이스
- Redux Toolkit을 이용한 상태 관리
- React Router를 통한 라우팅
- Date-fns를 이용한 날짜 처리
- 테마 커스터마이징 지원

## 🛠 기술 스택

- **프론트엔드 프레임워크:** React 18
- **UI 라이브러리:** Material-UI (MUI) v5
- **상태 관리:** Redux Toolkit
- **라우팅:** React Router v6
- **스타일링:** Emotion (CSS-in-JS)
- **날짜 처리:** date-fns
- **개발 도구:** Create React App

## 📁 프로젝트 구조

```
src/
├── assets/        # 정적 자산 (이미지, 폰트 등)
├── components/    # 재사용 가능한 UI 컴포넌트
├── pages/         # 페이지 컴포넌트
├── redux/         # Redux 스토어, 슬라이스, 액션
├── utils/         # 유틸리티 함수
├── theme.js       # MUI 테마 커스터마이징
├── App.js         # 메인 애플리케이션 컴포넌트
└── index.js       # 애플리케이션 진입점
```

## 🚦 시작하기

1. **저장소 클론**
   ```bash
   git clone https://github.com/Kevin-innovation/DLAB_std_cnt.git
   cd DLAB_std_cnt
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 시작**
   ```bash
   npm start
   ```
   애플리케이션이 기본 브라우저에서 `http://localhost:3000`으로 열립니다.

4. **프로덕션 빌드**
   ```bash
   npm run build
   ```

## 📝 사용 가능한 스크립트

- `npm start` - 개발 모드로 앱 실행
- `npm test` - 테스트 러너 실행
- `npm run build` - 프로덕션용 앱 빌드
- `npm run eject` - Create React App에서 설정 추출

## 🔧 환경 설정

- Node.js 14.0.0 이상
- npm 6.0.0 이상

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/멋진기능`)
3. 변경사항 커밋 (`git commit -m '멋진 기능 추가'`)
4. 브랜치에 푸시 (`git push origin feature/멋진기능`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 제작자

- **Kevin** - *초기 작업* - [Kevin-innovation](https://github.com/Kevin-innovation)

## 🙏 감사의 말

- 초기 프로젝트 설정을 위한 Create React App 팀
- 훌륭한 UI 컴포넌트를 제공한 Material-UI 팀
- 프로젝트 발전에 도움을 준 모든 기여자들