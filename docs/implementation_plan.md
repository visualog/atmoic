# Atomic - Implementation Plan

## 1. Goal Description
**Atomic**은 디자이너가 주도하는 **Code-First 디자인 시스템 빌더**입니다.
이 계획서는 PRD를 바탕으로 실제 작동하는 소프트웨어를 만들기 위한 기술적 설계를 다룹니다.
핵심 목표는 **"확장 가능한 토큰 데이터 구조"** 설계와 **"직관적인 빌더 UI"** 구현입니다.

## 2. Technical Stack (Architecture)
*   **Framework**: Next.js 14+ (App Router) - 확장성과 라우팅 관리 용이
*   **Language**: TypeScript - 안정적인 데이터 모델링
*   **Styling (Builder UI)**: Tailwind CSS - 빌더 자체의 빠르고 유연한 UI 구축
*   **Styling (User System)**: Pure CSS Variables - 사용자가 생성할 시스템의 기반 기술
*   **State Management**: Zustand - 복잡한 토큰/컴포넌트 상태의 전역 관리
*   **Icons**: Lucide React

## 3. Data Model (The "Blueprint")
디자인 시스템의 핵심인 **데이터 저장 구조(Schema)**입니다. 이 구조가 곧 `tokens.json` 파일이 됩니다.

```typescript
// 1. Foundation Tokens
interface Token {
  id: string;          // e.g., "primary-500"
  name: string;        // e.g., "Primary 500"
  value: string;       // e.g., "#6200EE"
  type: 'color' | 'typography' | 'spacing';
}

// 2. Component Definitions (The Recipe)
interface ComponentSpec {
  id: string;          // e.g., "button-primary"
  name: string;        // "Primary Button"
  type: 'atom' | 'molecule';
  
  // 스타일 바인딩 (토큰과 연결)
  styles: {
    background: string; // Token ID reference (e.g., "{primary-500}")
    padding: string;    // Token ID reference (e.g., "{spacing-4}")
    borderRadius: string;
    fontSize: string;
  };
  
  // 상태 변형 (Variants)
  variants: {
    hover: Partial<ComponentSpec['styles']>;
    disabled: Partial<ComponentSpec['styles']>;
  };
}
```

## 4. Proposed Changes (Directory Structure)

### [Project Root]
*   Next.js 프로젝트 초기화
*   필수 라이브러리 설치 (Zustand, clsx, tailwind-merge)

### [src/app]
*   `page.tsx`: 랜딩 페이지 / 대시보드
*   `builder/page.tsx`: 메인 빌더 인터페이스 (하이브리드 뷰)
*   `builder/layout.tsx`: 빌더 전역 레이아웃

### [src/stores] (Data Center)
*   `useTokenStore.ts`: 컬러, 폰트 등 Foundation 데이터 관리
*   `useComponentStore.ts`: 버튼, 인풋 등 컴포넌트 데이터 관리

### [src/components/builder] (Core UI)
*   `Canvas.tsx`: 중앙 실시간 미리보기 영역
*   `Sidebar.tsx`: 좌측 계층 구조 네비게이션
*   `PropertyPanel.tsx`: 우측 속성 편집 패널

### [src/services/export] (Translation Engine)
*   `cssGenerator.ts`: 토큰 데이터를 CSS Variables 코드로 변환
*   `reactGenerator.ts`: 컴포넌트 데이터를 React 컴포넌트 코드로 변환
*   `jsonGenerator.ts`: Design Tokens Format (DTCG) 표준 JSON 변환

## 5. Implementation Roadmap (Step-by-Step)

### Phase 1: Foundation Builder (기초 공사)
1.  프로젝트 셋업 & 레이아웃 잡기
2.  **Color Palette Generator**: 색상 추가/수정 기능 구현
3.  **Typography & Spacing Editor**: 폰트 및 간격 설정 기능 구현
4.  실시간 CSS Variables 적용 로직 구현 (`:root` 스타일 주입)

### Phase 2: Atom Builder (부품 공장)
1.  **Box Model Editor**: div 기반의 기본 박스 스타일링 기능 (Padding, Border, Radius)
2.  **Token Binding**: Foundation 색상/간격을 컴포넌트 속성에 연결하는 UI
3.  **Button & Input**: 기본 템플릿 제공 및 커스터마이징

### Phase 3: Export Engine (수출 항구)
1.  **Code Preview**: 실시간으로 변환된 CSS/React 코드 보여주기
2.  **Download Feature**: ZIP 파일로 전체 시스템 다운로드 구현

### Phase 4: UI Polish & Refinement
1.  드래그 앤 드롭 UX 개선
2.  디자인 다듬기 (Atomic 자체의 UI/UX 개선) - 다크모드 등
