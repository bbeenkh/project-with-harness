import Input from '../../../shared/ui/primitive/Input'

interface Props {
  value: string
  onChange: (value: string) => void
}

/**
 * # SearchBar
 * ---
 * - 간단설명: 홈 화면 여행지 검색 입력창
 * - 제약사항: Input primitive 래핑, onChange는 string 값 직접 전달
 * ---
 * @param value - 현재 검색어
 * @param onChange - 검색어 변경 콜백 (string)
 * @example
 * <SearchBar value={keyword} onChange={setKeyword} />
 */
export default function SearchBar({ value, onChange }: Props) {
  return (
    <Input
      placeholder="여행지를 검색하세요"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
