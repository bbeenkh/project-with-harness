import { useAccommodations } from '../../../entities/accommodation'
import { useSearchState } from '../../../features/accommodation-search/model/useSearchState'
import SearchBar from '../../../features/accommodation-search/ui/SearchBar'
import PopularCityChips from '../../../features/accommodation-search/ui/PopularCityChips'
import AccommodationList from './AccommodationList'

/**
 * # HomePage
 * ---
 * - 간단설명: 고정 헤더 + 검색창 + 인기 도시 칩 + 추천 숙소 그리드 + 하단 네비게이션으로 구성된 홈 화면
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
    <>
      {/* 고정 헤더 */}
      <header className="fixed top-0 w-full z-50 bg-surface shadow-sm flex justify-between items-center px-margin-mobile h-16">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>
            travel_explore
          </span>
          <span className="font-plus-jakarta text-headline-lg-mobile text-primary">Voyage</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary-container" />
      </header>

      {/* 메인 컨텐츠 */}
      <main className="pt-20 pb-24 max-w-[1200px] mx-auto px-margin-mobile">
        {/* 히어로 검색 */}
        <section className="mt-8 mb-xl">
          <h1 className="font-plus-jakarta text-headline-lg-mobile text-surface-on mb-6">
            어디로 떠나시나요?
          </h1>
          <SearchBar value={keyword} onChange={setKeyword} />
        </section>

        {/* 인기 여행지 */}
        <section className="mb-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-plus-jakarta text-headline-md text-surface-on">인기 여행지</h2>
            <button className="font-inter text-label-md text-primary hover:underline">전체보기</button>
          </div>
          <PopularCityChips selectedLocation={location} onSelect={toggleLocation} />
        </section>

        {/* 추천 숙소 */}
        <section>
          <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-6">추천 숙소</h2>
          <AccommodationList data={data} isLoading={isLoading} isError={isError} />
        </section>
      </main>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface border-t border-outline-variant">
        <div className="flex justify-around items-center h-16 max-w-[1200px] mx-auto px-margin-mobile">
          <button className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              home
            </span>
            <span className="font-inter text-label-sm">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-surface-on-variant">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="font-inter text-label-sm">내 예약</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-surface-on-variant">
            <span className="material-symbols-outlined">person</span>
            <span className="font-inter text-label-sm">프로필</span>
          </button>
        </div>
      </nav>
    </>
  )
}
