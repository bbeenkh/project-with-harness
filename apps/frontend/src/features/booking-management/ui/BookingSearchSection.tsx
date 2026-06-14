import Input from '../../../shared/ui/primitive/Input'
import Button from '../../../shared/ui/primitive/Button'

interface Props {
  inputValue: string
  onChange: (value: string) => void
  onSearch: () => void
  isLoading: boolean
}

/**
 * # BookingSearchSection
 * ---
 * - 간단설명: 예약 번호 입력 필드 + 조회 버튼으로 구성된 검색 영역
 * - 제약사항: inputValue가 비어있거나 isLoading이면 버튼 비활성화
 * ---
 * @param inputValue - 현재 입력값
 * @param onChange - 입력값 변경 콜백
 * @param onSearch - 조회 버튼 클릭 콜백
 * @param isLoading - 조회 중 여부
 * @example
 * <BookingSearchSection inputValue={v} onChange={setV} onSearch={search} isLoading={false} />
 */
export default function BookingSearchSection({ inputValue, onChange, onSearch, isLoading }: Props) {
  return (
    <section className="px-margin-mobile py-lg">
      <h1 className="font-plus-jakarta text-headline-lg-mobile text-surface-on mb-xs">
        나의 예약 확인
      </h1>
      <p className="font-inter text-body-sm text-surface-on-variant mb-md">
        예약 번호를 입력해 내역을 확인하세요
      </p>
      <div className="flex gap-sm">
        <Input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="V-1234-5678"
          onEnter={onSearch}
          styleClass={{ root: 'flex-1' }}
        />
        <Button
          variant="primary"
          onClick={onSearch}
          disabled={isLoading || !inputValue.trim()}
        >
          조회
        </Button>
      </div>
    </section>
  )
}
