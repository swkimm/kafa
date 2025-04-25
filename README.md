# 대한미식축구협회 차세대 프로젝트

## 프로젝트 개요

대한미식축구협회의 대회 운영과 관리를 디지털화한 차세대 시스템입니다.  
관리자, 심판, 사용자 각 역할에 맞는 기능을 제공하여 대회 운영을 효율적으로 지원합니다.

---

## 🖥️ 프론트엔드

- **기술 스택:**  
  - React (TypeScript)  
  - Vite  
  - Tailwind CSS  
  - Recoil  
  - Storybook

- **주요 폴더 구조 및 설명:**

<pre>
frontend/
├── public/                      # 정적 파일 (이미지, 파비콘, sitemap.xml, robots.txt 등)
│   ├── association/             # 협회 소개 이미지
│   ├── favicons/                # 다양한 해상도의 파비콘
│   ├── logo/                    # 로고 및 OG 이미지
│   ├── terms/                   # 약관 텍스트 파일
├── src/                         
│   ├── assets/                  # SVG, 로고 등 에셋 파일
│   ├── commons/                 # 공통 모듈
│   │   ├── layout/              # 페이지 레이아웃 (MainLayout, ConsoleLayout, PrivateRoute)
│   │   ├── functions/           # 공통 유틸 함수 (주차 계산, 포지션 출력 등)
│   │   ├── interfaces/          # 타입스크립트 인터페이스 (리그, 게임, 팀, 로스터 등 도메인별)
│   │   ├── error/               # 공통 에러 페이지 (Forbidden, NotFound)
│   │   ├── axios.tsx            # Axios 설정 파일
│   │   └── state/               # Recoil 상태 관리 (유저, 알림 등)
│
│   ├── components/              # 재사용 가능한 UI 컴포넌트
│   │   ├── buttons/             # 버튼 컴포넌트 (Storybook 포함)
│   │   ├── cards/               # 카드형 컴포넌트 (팀, 뉴스, 스코어 등)
│   │   ├── dropdown/            # 드롭다운 컴포넌트 (위치별 다양한 타입)
│   │   ├── footer/              # 푸터 컴포넌트
│   │   ├── header/              # 헤더 컴포넌트
│   │   ├── modal/               # 모달 컴포넌트 (리그 수정, 경기 생성 등 다양한 형태)
│   │   ├── pagination/          # 페이지네이션 컴포넌트
│   │   ├── sidebar/             # 사이드바 컴포넌트
│   │   ├── stackedList/         # 리스트 형태 UI (공지사항, 리그 리스트 등)
│   │   ├── tables/              # 테이블 컴포넌트 (랭킹, 경기, 게시판 등)
│   │   ├── toast/               # 알림용 Toast 컴포넌트
│   │   ├── notifications/       # 알림 컴포넌트
│
│   ├── hooks/                   # 커스텀 훅 (인증, 날짜 포맷, 알림 등)
│
│   ├── pages/                   # 실제 화면을 구성하는 페이지 컴포넌트
│   │   ├── auth/                # 로그인, 회원가입, 이메일 인증 등
│   │   ├── board/               # 게시판 (공지사항, 새 글 작성, 글 상세 등)
│   │   ├── calendar/            # 캘린더 (경기 일정)
│   │   ├── console/             # 콘솔 (관리자 기능 - 팀, 리그, 경기, 기록 관리)
│   │   ├── game/                # 경기 상세 페이지
│   │   ├── league/              # 리그 상세, 리그 홈
│   │   ├── national/            # 국가대표 페이지
│   │   ├── team/                # 팀 목록, 팀 상세
│   │   ├── roster/              # 로스터 상세
│   │   ├── huddle/              # 허들 (홈 화면)
│   │   ├── association/         # 협회 소개 (연혁, 조직도 등)
│   │   ├── appeal/              # 이의 신청 화면
│   │   ├── term/                # 약관 화면
│
│   ├── styles/                  # 전역 스타일 (Tailwind 설정, CKEditor 리셋, 스크롤바 등)
│
├── .storybook/                  # Storybook 설정
├── vite.config.ts               # Vite 설정
</pre>

- **주요 기능:**
  - 관리자/심판/사용자 역할에 따라 다양한 화면 제공
  - 공지사항, 경기 일정, 리그 관리 등 협회 운영에 필요한 모든 기능을 디지털화
  - Storybook을 통한 UI 컴포넌트 문서화 및 테스트

---

## ⚙️ 백엔드

- **기술 스택:**  
  - Node.js  
  - Express

- **주요 폴더 구조:**

<pre>
backend/
├── prisma/                # Prisma 스키마 및 마이그레이션
├── src/
│   ├── account/           # 계정 관리 (서비스, 컨트롤러, DTO)
│   ├── association/       # 협회 관리
│   ├── auth/              # 인증 (JWT, Guard, Strategy)
│   ├── board/             # 게시판 (게시글, 댓글, 첨부파일)
│   ├── calendar/          # 캘린더 (경기 일정 등)
│   ├── email/             # 이메일 서비스
│   ├── game/              # 경기 관리
│   ├── league/            # 리그 관리
│   ├── profile/           # 프로필 관리 (팀, 스폰서, 로스터 등)
│   ├── record/            # 기록 관리
│   ├── roster/            # 로스터 관리
│   ├── score/             # 스코어 관리
│   ├── sponser/           # 스폰서 관리
│   ├── storage/           # 파일/이미지 저장소
│   ├── team/              # 팀 관리
│   ├── team-league/       # 팀-리그 관계
│   ├── common/            # 공통 모듈 (예외 처리, 데코레이터, 캐시 등)
│   ├── app.module.ts      # 루트 모듈
│   ├── main.ts            # 진입점
├── package.json           # 의존성 및 스크립트

</pre>

---

## 🔧 실행 방법

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

### Storybook
```bash
cd frontend
npm run storybook
```

### 백엔드
```bash
cd backend
npm install
npm run dev
```

