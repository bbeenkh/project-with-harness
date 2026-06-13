import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Modal from './index'

describe('Modal 컴포넌트', () => {
  it('open=true일 때 children이 렌더링된다', () => {
    render(
      <Modal open onOpenChange={vi.fn()}>
        <Modal.Body>모달 내용</Modal.Body>
      </Modal>
    )
    expect(screen.getByText('모달 내용')).toBeInTheDocument()
  })

  it('open=false일 때 children이 렌더링되지 않는다', () => {
    render(
      <Modal open={false} onOpenChange={vi.fn()}>
        <Modal.Body>모달 내용</Modal.Body>
      </Modal>
    )
    expect(screen.queryByText('모달 내용')).not.toBeInTheDocument()
  })

  it('Modal.Title이 렌더링된다', () => {
    render(
      <Modal open onOpenChange={vi.fn()}>
        <Modal.Header>
          <Modal.Title>날짜 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>내용</Modal.Body>
      </Modal>
    )
    expect(screen.getByText('날짜 선택')).toBeInTheDocument()
  })

  it('콘텐츠에 Vibrant Horizon rounded-t-3xl 스타일이 적용된다', () => {
    render(
      <Modal open onOpenChange={vi.fn()}>
        <Modal.Body>내용</Modal.Body>
      </Modal>
    )
    // Radix Portal은 body에 렌더링됨
    const content = document.querySelector('[data-slot="modal-content"]')
    expect(content).not.toBeNull()
    expect(content).toHaveClass('rounded-t-3xl')
  })
})
