# Atomic - Design System Builder PRD

## 1. 프로젝트 개요 (Overview)
**Atomic**은 개발 지식이 없는 디자이너도 **코드 레벨의 완벽한 디자인 시스템**을 구축할 수 있게 돕는 웹 기반 SaaS입니다. Figma에 의존하지 않고 독립적으로 디자인 시스템을 생성하며, 생성된 시스템을 코드로 내보내거나 역으로 Figma에 동기화할 수 있는 **Code-First** 접근 방식을 취합니다.

## 2. 타겟 사용자 (Goal & Audience)
*   **핵심 타겟**: 스타트업 및 중소기업의 프로덕트 팀 (디자이너 & 개발자)
*   **문제 해결**:
    *   디자이너와 개발자 간의 핸드오프 마찰 제거
    *   디자인 시스템 구축의 높은 진입 장벽과 초기 비용 절감
    *   코드와 디자인 간의 불일치(Sync) 문제 해결

## 3. 핵심 가치 제안 (Value Proposition)
1.  **Framework Agnostic**: 특정 프레임워크에 종속되지 않는 범용적인 코드(CSS Variables) 생성.
2.  **Reverse Sync**: 웹에서 구축한 시스템을 Figma로 내보내기 지원.
3.  **Atomic Automation**: 하위 요소(Atoms) 수정 시 상위 요소(Molecules, Organisms) 자동 업데이트.

## 4. 핵심 기능 요구사항 (Functional Requirements - MVP)

### 4.1. Foundation Builder (기초 요소)
디자인 시스템의 가장 기본이 되는 스타일 토큰을 정의합니다.
*   **Color System**: Primary, Secondary, Neutral, Semantic Colors (Error, Success 등) 정의 및 팔레트 생성.
*   **Typography**: Font Family, Scale, Line-height, Letter-spacing 설정.
*   **Spacing**: 4px/8px 그리드 기반의 간격 시스템.
*   **기타 필수 요소**:
    *   Border Radius
    *   Shadows (Elevation)
    *   Grid System
    *   Breakpoints
    *   Animation/Transition
    *   Iconography

### 4.2. Atomic Component Builder (컴포넌트)
계층적 의존성을 가진 컴포넌트 생성 시스템을 제공합니다.
*   **Atoms**: 기본 컴포넌트 (Button, Input, Checkbox, Badge 등) 생성 및 커스터마이징. foundation 토큰을 바인딩.
*   **Molecules**: Atom을 조합하여 생성 (예: Search Bar = Input + Button). Atom 변경 시 자동 반영.
*   **Organisms (Phase 2 예정이나 기본 구조는 지원)**: Molecule들을 조합하여 복잡한 UI 구성.
*   **Component Variants**: 상태(Hover, Active, Disabled) 및 크기(Small, Medium, Large)별 스타일 정의.

### 4.3. Export System (출력)
개발자와 디자이너를 위한 다양한 형식을 지원합니다.
*   **Design Tokens (Source Reference)**: `tokens.json` (Style Dictionary 호환).
*   **CSS System (Recommended)**: CSS Variables(`:root`) + Utility Classes.
*   **React Components**: Typescript 기반, CSS Variables를 사용하는 경량 컴포넌트.
*   **Documentation Site**: Storybook과 유사한 스펙 문서 및 프리뷰 사이트 정적 생성.

### 4.4. Integration (Figma)
*   **Figma Export**: Atomic에서 정의한 스타일과 컴포넌트를 Figma 파일/Library로 생성 (Plugin 또는 API 활용).

## 5. 사용자 경험 (UX/UI)
**하이브리드 인터페이스 (Hybrid Style)**
*   **Left (Navigation)**: Foundation > Atoms > Molecules > Organisms 계층 트리.
*   **Center (Canvas)**: 실시간 프리뷰 영역. 드래그 앤 드롭 및 시각적 확인.
*   **Right (Properties)**: 선택한 요소의 상세 속성(토큰 매핑) 편집 패널.

## 6. 협업 기능 (Collaboration)
*   **MVP**: 싱글 유저 모드 (개인 작업 후 Export).
*   **Future (Phase 2)**: 팀 워크스페이스, 실시간 동시 편집, 댓글, 버전 관리.

## 7. 기술 전략 (Technical Strategy)
*   **Frontend**: React, TypeScript, Vite
*   **State Management**: Zustand or Jotai (복잡한 의존성 관리를 위해)
*   **Builder Engine**: CSS-in-JS (Emotion or Styled-components) to CSS Variables conversion logic.

## 8. 로드맵 (Roadmap)
1.  **Phase 1 (MVP)**: Foundation & Atoms 빌더, CSS/React Export 구현.
2.  **Phase 2**: Molecules/Organisms 자동 조합 시스템 고도화.
3.  **Phase 3**: Figma 양방향 동기화 및 팀 협업 기능 추가.
