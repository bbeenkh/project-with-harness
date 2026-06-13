import { useMemo } from 'react';
import { twJoin } from 'tailwind-merge';
import SpinnerIcon from '../../assets/icons/spinner.svg?react';

interface IProps {
  size?: 'xs' | 'sm' | 'lg' | 'xl';
  className?: string;
}

/**
 * # Spinner
 * ---
 * - 간단설명: 로딩 인디케이터 SVG 스피너
 * - 제약사항: SVGR 설정 필요 (vite-plugin-svgr), spinner.svg 파일 존재 필요
 * ---
 * @param size - 스피너 크기 (xs | sm | lg | xl), 기본값 lg
 * @param className - 추가 Tailwind 클래스
 * ---
 * @example
 * <Spinner size="lg" />
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
          'animate-spin text-[#006A62]',
          sizeClassName,
          className,
        )}
      />
    </div>
  );
}
