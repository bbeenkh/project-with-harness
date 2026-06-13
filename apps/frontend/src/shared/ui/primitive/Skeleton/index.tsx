import React from 'react';

export interface StyleClass {
  root?: string;
}

const Box = ({ styleClass }: { styleClass?: StyleClass }) => {
  return <div className={styleClass?.root} />;
};

const Circle = ({ styleClass }: { styleClass?: StyleClass }) => {
  return <div className={styleClass?.root} />;
};

const Container = ({
  children,
  styleClass,
}: {
  children: React.ReactNode;
  styleClass?: StyleClass;
}) => {
  return <div className={styleClass?.root}>{children}</div>;
};

/**
 * # Skeleton UI
 * ---
 * - 로딩 중 콘텐츠 자리를 채우는 스켈레톤 컴포넌트 (Compound Component 패턴)
 * - `Skeleton.Box`: 사각형 스켈레톤
 * - `Skeleton.Circle`: 원형 스켈레톤
 * - `Skeleton.Container`: 스켈레톤 래퍼 컨테이너
 * - 기본 스타일 없음 — 모든 스타일은 `styleClass`로 주입
 * ---
 * @example
 * <Skeleton.Container styleClass={{ root: 'flex flex-col gap-2 p-4' }}>
 *   <Skeleton.Circle styleClass={{ root: 'w-12 h-12 rounded-full bg-gray-200 animate-pulse' }} />
 *   <Skeleton.Box styleClass={{ root: 'w-full h-4 rounded bg-gray-200 animate-pulse' }} />
 * </Skeleton.Container>
 */
const Skeleton = { Box, Circle, Container };

export default Skeleton;
