import React from 'react';
import { twMerge } from 'tailwind-merge';

interface StyleClass {
  root?: string;
  input?: string;
  icon?: string;
  prefix?: string;
  suffix?: string;
}

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onEnter?: () => void;
  styleClass?: StyleClass;
}

/**
 * # Input UI
 * ---
 * - `prefix`: input 좌측에 렌더링할 ReactNode (아이콘, 텍스트 등)
 * - `suffix`: input 우측에 렌더링할 ReactNode (단위, 버튼 등)
 * - `onEnter`: Enter 키 입력 시 호출되는 콜백
 * - 기본 스타일 없음 — 모든 스타일은 `styleClass`로 주입
 * ---
 * @param prefix input 좌측에 렌더링할 ReactNode
 * @param suffix input 우측에 렌더링할 ReactNode
 * @param onEnter Enter 키 입력 시 호출되는 콜백
 * @param styleClass 커스텀 스타일 클래스 객체
 * - `styleClass.root`: 래퍼 div 클래스
 * - `styleClass.input`: input 요소 클래스
 * - `styleClass.icon`: 아이콘 래퍼 클래스
 * - `styleClass.prefix`: prefix 래퍼 클래스
 * - `styleClass.suffix`: suffix 래퍼 클래스
 * @example
 * // 기본 스타일(relative, absolute 배치)이 적용되며, styleClass로 확장 가능
 * <Input
 *   prefix={<SearchIcon />}
 *   suffix={<span>원</span>}
 *   placeholder="금액 입력"
 *   styleClass={{
 *     root: 'border rounded h-10',   // relative flex items-center에 병합
 *     input: 'pl-8 pr-8',            // w-full outline-none에 병합
 *     prefix: 'text-gray-400',       // absolute 기본값에 병합
 *     suffix: 'text-gray-500',       // absolute 기본값에 병합
 *   }}
 * />
 */
function Input({ prefix, suffix, onEnter, styleClass, ...props }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className={twMerge('relative flex items-center', styleClass?.root)}>
      {prefix && (
        <div className={twMerge('absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none', styleClass?.prefix)}>
          {prefix}
        </div>
      )}
      <input
        className={twMerge('w-full outline-none', styleClass?.input)}
        onKeyDown={handleKeyDown}
        {...props}
      />
      {suffix && (
        <div className={twMerge('absolute right-2 top-1/2 -translate-y-1/2', styleClass?.suffix)}>
          {suffix}
        </div>
      )}
    </div>
  );
}

export default Input;
