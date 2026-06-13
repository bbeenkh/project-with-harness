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
 * # Toast.Provider UI
 * ---
 * - 간단설명: Radix UI Toast 기반 알림 메시지 컴포넌트
 * - `open` / `onOpenChange` / `message` prop으로 외부에서 상태를 직접 제어한다
 * - `children` 하위에 Viewport가 렌더링되므로 앱 루트에서 감싸서 사용한다
 * - 기본 스타일 없음 — 모든 스타일은 `styleClass`로 주입
 * ---
 * @param children 앱 콘텐츠
 * @param open 토스트 열림 여부
 * @param onOpenChange 토스트 상태 변경 콜백 `(open: boolean) => void`
 * @param message 표시할 메시지 텍스트
 * @param styleClass 커스텀 스타일 클래스 객체
 * - `styleClass.root`: Toast.Root에 적용할 클래스
 * - `styleClass.viewport`: Toast.Viewport에 적용할 클래스
 * @example
 * <Toast.Provider
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   message={toastMessage}
 *   styleClass={{
 *     root: 'bg-gray-800 text-white px-4 py-2 rounded shadow-lg',
 *     viewport: 'fixed bottom-4 right-4 flex flex-col gap-2',
 *   }}
 * >
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
