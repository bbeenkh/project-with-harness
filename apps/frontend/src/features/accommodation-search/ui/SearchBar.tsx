interface Props {
  value: string
  onChange: (value: string) => void
}

/**
 * # SearchBar
 * ---
 * - 간단설명: 홈 화면 여행지 검색 입력창 (검색 아이콘 내장, 디자인 시스템 스타일)
 * - 제약사항: onChange는 string 값 직접 전달
 * ---
 * @param value - 현재 검색어
 * @param onChange - 검색어 변경 콜백 (string)
 * @example
 * <SearchBar value={keyword} onChange={setKeyword} />
 */
export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-outline">search</span>
      </div>
      <input
        type="text"
        placeholder="여행지를 검색하세요"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container outline-none transition-all font-inter text-body-md text-surface-on shadow-sm"
      />
    </div>
  )
}
