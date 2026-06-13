import React from 'react';
import { Slot } from '@radix-ui/react-slot';

interface StyleClass {
  root?: string;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  styleClass?: StyleClass;
  asChild?: boolean;
}

/**
 * # Button UI
 * ---
 * - `styleClass.root`: 버튼 루트 요소에 적용할 Tailwind 클래스
 * - `asChild`: true 시 children 컴포넌트가 button을 대체 (Radix Slot 패턴)
 * - `type`: 버튼 타입 (기본값 `'button'`)
 * - 기본 스타일 없음 — 모든 스타일은 `styleClass`로 주입
 * ---
 * @param children 버튼 내부 콘텐츠
 * @param type 버튼 타입 (기본값: `'button'`)
 * @param styleClass 커스텀 스타일 클래스 객체
 * @param asChild true 시 children 컴포넌트로 button 대체 (Radix Slot 패턴)
 * @example
 * // 기본 버튼
 * <Button styleClass={{ root: 'bg-primary text-white px-4 py-2 rounded' }}>확인</Button>
 *
 * // asChild: Link 컴포넌트를 버튼처럼 렌더
 * <Button asChild styleClass={{ root: 'text-blue-500 underline' }}>
 *   <Link href="/about">About</Link>
 * </Button>
 */
function Button({ children, type = 'button', styleClass, asChild = false, ...props }: Props) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp type={asChild ? undefined : type} className={styleClass?.root} {...props}>
      {children}
    </Comp>
  );
}

export default Button;
