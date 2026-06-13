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
 * # Input
 * ---
 * - 간단설명: 검색바 및 예약 폼에 사용하는 텍스트 입력 필드
 * - 제약사항: 포커스 시 #00A699 테두리 표시, 기본 상태는 테두리 없음
 * - `prefix`: input 좌측에 렌더링할 ReactNode (아이콘, 텍스트 등)
 * - `suffix`: input 우측에 렌더링할 ReactNode (단위, 버튼 등)
 * - `onEnter`: Enter 키 입력 시 호출되는 콜백
 * ---
 * @param placeholder - 플레이스홀더 텍스트
 * @param prefix - input 좌측에 렌더링할 ReactNode
 * @param suffix - input 우측에 렌더링할 ReactNode
 * @param onEnter - Enter 키 입력 시 호출되는 콜백
 * @param styleClass - 커스텀 스타일 클래스 객체 (기본 Vibrant Horizon 스타일에 병합됨)
 * - `styleClass.root`: 래퍼 div 클래스
 * - `styleClass.input`: input 요소 클래스
 * - `styleClass.icon`: 아이콘 래퍼 클래스
 * - `styleClass.prefix`: prefix 래퍼 클래스
 * - `styleClass.suffix`: suffix 래퍼 클래스
 * ---
 * @example
 * <Input placeholder="여행지를 검색하세요" onEnter={handleSearch} />
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
        className={twMerge(
          'w-full outline-none bg-[#F7F7F7] border border-transparent rounded-xl px-4 py-2 text-[#1B1C1C] text-sm focus:border-[#00A699] transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          styleClass?.input
        )}
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
