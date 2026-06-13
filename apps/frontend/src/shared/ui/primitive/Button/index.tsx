import type { ButtonHTMLAttributes } from 'react'

/**
 * # ButtonVariant
 * - primary = 메인 액션 버튼 (스카이블루)
 * - action = 긴급/예약 버튼 (코랄)
 * - ghost = 보조 버튼 (투명 배경)
 */
export type ButtonVariant = 'primary' | 'action' | 'ghost'

/**
 * # Button
 * ---
 * - 간단설명: Vibrant Horizon 디자인 시스템 기반 버튼 컴포넌트
 * - 제약사항: variant 미지정 시 primary 적용
 * ---
 * @param children - 버튼 내부 콘텐츠
 * @param variant - 버튼 스타일 (primary | action | ghost)
 * @param onClick - 클릭 핸들러
 * ---
 * @example
 * <Button variant="action" onClick={handleBook}>지금 예약</Button>
 */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base =
    'px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed'
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-[#00A699] text-white hover:bg-[#006A62]',
    action: 'bg-[#FF5A5F] text-white hover:opacity-90',
    ghost: 'border border-[#00A699] text-[#00A699] bg-transparent hover:bg-[#E0F4F2]',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
