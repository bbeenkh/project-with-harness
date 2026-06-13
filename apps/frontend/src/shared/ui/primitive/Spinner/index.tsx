import React, { useMemo } from 'react';
import { twJoin } from 'tailwind-merge';
import SpinnerIcon from '@/assets/svgs/spinner-icon.svg?react';

interface IProps {
  size?: 'xs' | 'sm' | 'lg' | 'xl';
  className?: string;
}

/**
 * # Spinner UI
 * ---
 * - SVG 아이콘 기반 로딩 스피너 컴포넌트 (`animate-spin`)
 * - 부모 요소를 꽉 채우는 flex 컨테이너 내에서 중앙 정렬로 표시된다
 * ---
 * @param size - 스피너 크기 (기본값: `'lg'`)
 * - `'xs'`: 16×16px
 * - `'sm'`: 20×20px
 * - `'lg'`: 24×24px
 * - `'xl'`: 32×32px
 * @param className - SpinnerIcon SVG에 추가할 Tailwind 클래스
 * @example
 * <Spinner size="sm" />
 * <Spinner size="xl" className="fill-blue-500" />
 */
export default function Spinner({ size = 'lg', className }: IProps) {
  /** 사이즈에 따른 css */
  const sizeClassName = useMemo(() => {
    switch (size) {
      case 'xs':
        return 'w-4 h-4';
      case 'sm':
        return 'w-5 h-5';
      case 'lg':
        return 'w-6 h-6';
      case 'xl':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  }, [size]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <SpinnerIcon
        className={twJoin(
          'text-gray-200 animate-spin fill-black',
          sizeClassName,
          className,
        )}
      />
    </div>
  );
}
