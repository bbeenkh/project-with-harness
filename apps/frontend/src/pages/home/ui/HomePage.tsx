import { useAccommodations } from '../../../entities/accommodation'
import { useSearchState } from '../../../features/accommodation-search/model/useSearchState'
import SearchBar from '../../../features/accommodation-search/ui/SearchBar'
import PopularCityChips from '../../../features/accommodation-search/ui/PopularCityChips'
import AccommodationList from './AccommodationList'

/**
 * # HomePage
 * ---
 * - 간단설명: 여행지 검색창 + 인기 도시 칩 + 추천 숙소 목록으로 구성된 홈 화면
 * ---
 * @example
 * <HomePage />
 */
export default function HomePage() {
  const { keyword, setKeyword, location, toggleLocation } = useSearchState()
  const { data, isLoading, isError } = useAccommodations({
    keyword: keyword || undefined,
    location,
  })

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <SearchBar value={keyword} onChange={setKeyword} />
      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-2">인기 여행지</h2>
        <PopularCityChips selectedLocation={location} onSelect={toggleLocation} />
      </section>
      <section>
        <h2 className="text-sm font-semibold text-gray-500 mb-2">추천 숙소</h2>
        <AccommodationList data={data} isLoading={isLoading} isError={isError} />
      </section>
    </main>
  )
}
