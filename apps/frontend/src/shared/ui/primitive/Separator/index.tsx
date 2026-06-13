import React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { twMerge } from 'tailwind-merge';

interface Props extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  className?: string;
}

/**
 * # Separator
 * ---
 * - 간단설명: 콘텐츠 구역을 나누는 수평/수직 구분선
 * - 제약사항: decorative=true(기본)이면 스크린리더가 무시
 * ---
 * @param orientation - 방향 (horizontal | vertical), 기본값 horizontal
 * @param className - 추가 Tailwind 클래스
 * ---
 * @example
 * <Separator orientation="horizontal" />
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  Props
>(function Separator({ className, orientation = 'horizontal', decorative = true, ...props }, ref) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={twMerge(
        orientation === 'horizontal' ? 'w-full border-t' : 'h-full border-l',
        'border-[#BBC9C6]',
        className,
      )}
      {...props}
    />
  );
});

export default Separator;
