import React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { twMerge } from 'tailwind-merge';

interface Props extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  className?: string;
}

/**
 * # Separator UI
 * ---
 * - Radix UI `@radix-ui/react-separator` 기반 구분선 컴포넌트
 * - 접근성: `role="separator"` / `role="none"` 자동 처리 (`decorative` prop)
 * - `orientation`: `'horizontal'`(기본) / `'vertical'`
 * - `decorative`: `true`이면 스크린리더가 무시 (기본값: `true`)
 * - 기본 스타일 없음 — 모든 스타일은 `className`으로 주입
 * ---
 * @param orientation - `'horizontal'` | `'vertical'` (기본값: `'horizontal'`)
 * @param decorative - 장식용 여부, `false`이면 스크린리더가 읽음 (기본값: `true`)
 * @param className - 추가 Tailwind 클래스
 * ---
 * @example
 * // 수평 구분선
 * <Separator className="border-t border-gray-200 my-4" />
 *
 * // 수직 구분선
 * <Separator orientation="vertical" className="border-l border-gray-200 mx-2 h-4" />
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
        'border-gray-200',
        className,
      )}
      {...props}
    />
  );
});

export default Separator;
