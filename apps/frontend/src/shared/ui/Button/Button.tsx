import type { ReactNode } from 'react'

/**
 * # ButtonProps
 * - variant = 'primary' | 'secondary'
 */
export interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

/**
 * # Button
 * ---
 * - 간단설명: 기본 버튼 컴포넌트
 * ---
 * @param children - 버튼 내부 텍스트
 * @param onClick - 클릭 핸들러
 * @param variant - 버튼 스타일 변형 (primary | secondary)
 * ---
 * @example
 * <Button variant="primary" onClick={() => {}}>확인</Button>
 */
export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  const base = 'px-4 py-2 rounded font-medium transition-colors'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  }
  return (
    <button className={`${base} ${variants[variant]}`} onClick={onClick}>
      {children}
    </button>
  )
}
