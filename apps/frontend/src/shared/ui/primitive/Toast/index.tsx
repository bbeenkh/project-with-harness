import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';

interface StyleClass {
  root?: string;
  viewport?: string;
}

interface ProviderProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  styleClass?: StyleClass;
}

/**
 * # Toast
 * ---
 * - 간단설명: 예약 성공/실패 등 짧은 알림을 화면에 표시
 * - 제약사항: Toast.Provider로 앱 루트를 감싸야 사용 가능. styleClass.root로 success/error 스타일 구분
 * ---
 * @param children 앱 콘텐츠
 * @param open 토스트 열림 여부
 * @param onOpenChange 상태 변경 콜백
 * @param message 표시할 메시지
 * @param styleClass 커스텀 스타일 클래스 객체
 * - `styleClass.root` - 기본: bg-[#1B1C1C] text-white rounded-xl px-4 py-3
 * - `styleClass.viewport` - Toast.Viewport에 적용할 클래스
 * ---
 * @example
 * <Toast.Provider open={isOpen} onOpenChange={setIsOpen} message="예약 완료!" styleClass={{ root: 'bg-[#006A62] text-white rounded-xl px-4 py-3', viewport: 'fixed bottom-4 right-4 flex flex-col gap-2 z-50' }}>
 *   <App />
 * </Toast.Provider>
 */
function Provider({ children, open, onOpenChange, message, styleClass }: ProviderProps) {
  return (
    <ToastPrimitive.Provider>
      {children}
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        className={styleClass?.root}
        data-testid="toast-root"
      >
        <ToastPrimitive.Description>{message}</ToastPrimitive.Description>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className={styleClass?.viewport} />
    </ToastPrimitive.Provider>
  );
}

/**
 * # Toast UI
 * ---
 * - 간단설명: Radix UI Toast 기반 복합 컴포넌트
 * - `Toast.Provider`: 토스트 상태를 외부에서 제어하는 Provider
 */
const Toast = { Provider };

export default Toast;
