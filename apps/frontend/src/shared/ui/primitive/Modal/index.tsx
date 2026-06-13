import React, { useRef, useCallback, Suspense } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { twMerge } from 'tailwind-merge';
import { ErrorBoundary } from 'react-error-boundary';
import type { FallbackProps } from 'react-error-boundary';

export interface IModalProps extends React.ComponentProps<typeof Dialog.Root> {
  triggerUI?: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
  overlayClassName?: string;
  /** overlay z-index (CSS 우선순위 문제로 인해 style로 직접 적용) */
  overlayZIndex?: number;
  /**
   * 모달 사이즈
   * md: width: 600px
   * lg: width: 900px
   * xl: width: 1200px
   */
  size?: 'md' | 'lg' | 'xl';
  /** true 시 외부(overlay) 클릭으로 모달이 닫히지 않음 */
  preventOutsideClose?: boolean;
}

/**
 * # Modal UI
 * ---
 * - 간단설명: Radix Dialog 기반 모달 컴포넌트
 * - `triggerUI`로 트리거 요소를 주입하거나, `open`/`onOpenChange`로 제어 모드로 사용
 * - 중첩 Dialog 내부 이벤트에 의한 의도치 않은 닫힘을 `userCloseIntentRef`로 방지
 * - `preventOutsideClose=true` 시 overlay 클릭, Escape 키로 닫히지 않음
 * ---
 * @param triggerUI 트리거로 사용할 ReactNode (생략 시 비제어 모드)
 * @param size 모달 너비 `'md'`(600px) | `'lg'`(900px) | `'xl'`(1200px), 기본값 `'md'`
 * @param hideCloseButton true 시 우상단 닫기 버튼 숨김
 * @param overlayClassName overlay에 추가할 className
 * @param overlayZIndex overlay/content z-index (inline style로 적용)
 * @param preventOutsideClose true 시 외부 클릭·Escape로 닫히지 않음, 기본값 `false`
 * @example
 * <Modal triggerUI={<Button>열기</Button>} size="lg">
 *   <Modal.Header>
 *     <Modal.Title>제목</Modal.Title>
 *   </Modal.Header>
 *   <Modal.Body>본문</Modal.Body>
 *   <Modal.Footer>
 *     <Button>닫기</Button>
 *   </Modal.Footer>
 * </Modal>
 */
export default function Modal({
  children,
  triggerUI,
  className,
  hideCloseButton,
  overlayClassName,
  overlayZIndex,
  size = 'md',
  preventOutsideClose = false,
  ...props
}: IModalProps) {
  /**
   * 사용자가 직접 닫기를 시도했는지 추적
   * - overlay 클릭, X 버튼 클릭, Escape 키 시에만 true
   * - 중첩 Dialog 내부 이벤트로 인한 onOpenChange(false) 호출을 차단
   */
  const userCloseIntentRef = useRef(false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        if (!userCloseIntentRef.current) return;
        userCloseIntentRef.current = false;
      }
      props.onOpenChange?.(open);
    },
    [props.onOpenChange],
  );

  const markCloseIntent = useCallback(() => {
    userCloseIntentRef.current = true;
  }, []);

  return (
    <Dialog.Root {...props} onOpenChange={handleOpenChange}>
      {triggerUI && <Dialog.Trigger asChild>{triggerUI}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay
          className={twMerge('DialogOverlay', overlayClassName)}
          style={overlayZIndex ? { zIndex: overlayZIndex } : undefined}
          onPointerDown={preventOutsideClose ? undefined : markCloseIntent}
        />
        <Dialog.Content
          onEscapeKeyDown={preventOutsideClose ? undefined : markCloseIntent}
          onPointerDownOutside={(e) => {
            if (preventOutsideClose) {
              e.preventDefault();
            } else {
              markCloseIntent();
            }
          }}
          className={twMerge(
            'DialogContent relative flex flex-col gap-4 bg-white p-6',
            'sm:w-[96vw] sm:max-w-[96vw] sm:h-[96vh] sm:max-h-[96vh] sm:p-4 sm:rounded-lg',
            size === 'md' && 'w-[37.5rem] max-w-[37.5rem]',
            size === 'lg' && 'w-[56.25rem] max-w-[56.25rem]',
            size === 'xl' && 'w-[75rem] max-w-[80rem]',
            className,
          )}
          style={overlayZIndex ? { zIndex: overlayZIndex } : undefined}
        >
          {!hideCloseButton && <CloseButton onPointerDown={markCloseIntent} />}
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense>{children}</Suspense>
          </ErrorBoundary>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CloseButton({ onPointerDown }: { onPointerDown?: () => void }) {
  return (
    <Dialog.Close
      className="absolute right-6 top-6 hover:opacity-70"
      onPointerDown={onPointerDown}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </Dialog.Close>
  );
}

function Header({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge('flex flex-col items-start justify-start gap-2', className)}>
      {children}
    </div>
  );
}

function Footer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge('flex items-center justify-end gap-2 bg-white w-full pt-2', className)}>
      {children}
    </div>
  );
}

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={twMerge(
        'scrollbar-hide flex w-full flex-1 flex-col items-start justify-start gap-2 self-stretch overflow-y-scroll p-px',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Dialog.Title className={twMerge('text-xl font-bold text-primary', className)}>
      {children}
    </Dialog.Title>
  );
}

function Description({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Dialog.Description className={twMerge('text-sm font-normal text-secondary', className)}>
      {children}
    </Dialog.Description>
  );
}

function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-6">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <p className="text-center text-xl text-gray-600">실행 도중 문제가 발생하였습니다</p>
      {resetErrorBoundary && (
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-80"
        >
          재실행
        </button>
      )}
    </div>
  );
}

Modal.Header = Header;
Modal.Footer = Footer;
Modal.Title = Title;
Modal.Body = Body;
Modal.Description = Description;
Modal.ErrorFallback = ErrorFallback;
