import React from 'react';

export interface StyleClass {
  root?: string;
}

const Box = ({ styleClass }: { styleClass?: StyleClass }) => {
  return <div className={`animate-pulse bg-[#E4E2E2] rounded-lg ${styleClass?.root ?? ''}`} />;
};

const Circle = ({ styleClass }: { styleClass?: StyleClass }) => {
  return <div className={`animate-pulse bg-[#E4E2E2] rounded-full ${styleClass?.root ?? ''}`} />;
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
 * # Skeleton
 * ---
 * - 간단설명: 데이터 로딩 중 콘텐츠 위치를 표시하는 플레이스홀더
 * - 제약사항: styleClass.root로 추가 클래스 주입 가능
 * ---
 * @example
 * <Skeleton.Box styleClass={{ root: 'w-full h-[120px]' }} />
 * <Skeleton.Circle styleClass={{ root: 'w-12 h-12' }} />
 */
const Skeleton = { Box, Circle, Container };

export default Skeleton;
