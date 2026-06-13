import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Toast from './index'

describe('Toast 컴포넌트', () => {
  it('open=true일 때 메시지가 렌더링된다', () => {
    render(
      <Toast.Provider
        open={true}
        onOpenChange={() => {}}
        message="예약 완료!"
        styleClass={{
          root: 'bg-[#1B1C1C] text-white rounded-xl px-4 py-3',
          viewport: 'fixed bottom-4 right-4 flex flex-col gap-2 z-50',
        }}
      >
        <div />
      </Toast.Provider>
    )
    expect(screen.getByText('예약 완료!')).toBeInTheDocument()
  })

  it('success 스타일로 렌더링된다', () => {
    render(
      <Toast.Provider
        open={true}
        onOpenChange={() => {}}
        message="예약 성공"
        styleClass={{
          root: 'bg-[#006A62] text-white rounded-xl px-4 py-3',
          viewport: 'fixed bottom-4 right-4 flex flex-col gap-2 z-50',
        }}
      >
        <div />
      </Toast.Provider>
    )
    const toastEl = document.querySelector('[data-testid="toast-root"]')
    expect(toastEl).toHaveClass('bg-[#006A62]')
  })

  it('error 스타일로 렌더링된다', () => {
    render(
      <Toast.Provider
        open={true}
        onOpenChange={() => {}}
        message="오류 발생"
        styleClass={{
          root: 'bg-[#BA1A1A] text-white rounded-xl px-4 py-3',
          viewport: 'fixed bottom-4 right-4 flex flex-col gap-2 z-50',
        }}
      >
        <div />
      </Toast.Provider>
    )
    const toastEl = document.querySelector('[data-testid="toast-root"]')
    expect(toastEl).toHaveClass('bg-[#BA1A1A]')
  })

  it('open=false일 때 메시지가 렌더링되지 않는다', () => {
    render(
      <Toast.Provider
        open={false}
        onOpenChange={() => {}}
        message="숨겨진 메시지"
        styleClass={{ root: 'bg-[#1B1C1C]', viewport: 'fixed bottom-4' }}
      >
        <div />
      </Toast.Provider>
    )
    expect(screen.queryByText('숨겨진 메시지')).not.toBeInTheDocument()
  })
})
