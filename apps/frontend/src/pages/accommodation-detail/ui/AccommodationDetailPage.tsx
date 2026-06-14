import { useParams } from 'react-router-dom'
import { useAccommodation } from '../../../entities/accommodation'
import { Skeleton } from '../../../shared/ui/primitive'
import HeroImage from './HeroImage'
import AmenitiesList from './AmenitiesList'
import MapPlaceholder from './MapPlaceholder'
import BookingBottomBar from './BookingBottomBar'

/**
 * # AccommodationDetailPage
 * ---
 * - 간단설명: 숙소 상세 정보 화면 — 슈퍼호스트/평점, 공간정보, 설명, 편의시설, 지도, 안심 예약 보장 + 하단 인라인 예약 폼
 * ---
 * @example
 * <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
 */
export default function AccommodationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: accommodation, isLoading, isError } = useAccommodation(id ? Number(id) : undefined)

  if (isLoading) {
    return (
      <div className="pb-96">
        <Skeleton.Box styleClass={{ root: 'w-full aspect-[4/3]' }} />
        <div className="px-margin-mobile pt-5 flex flex-col gap-3">
          <Skeleton.Box styleClass={{ root: 'h-5 w-1/3' }} />
          <Skeleton.Box styleClass={{ root: 'h-7 w-2/3' }} />
          <Skeleton.Box styleClass={{ root: 'h-4 w-1/2' }} />
          <Skeleton.Box styleClass={{ root: 'h-4 w-full mt-2' }} />
        </div>
      </div>
    )
  }

  if (isError || !accommodation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-inter text-body-md text-error">숙소를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const spaceInfo = [
    accommodation.maxGuests && `최대 인원 ${accommodation.maxGuests}명`,
    accommodation.bedrooms && `침실 ${accommodation.bedrooms}개`,
    accommodation.beds && `침대 ${accommodation.beds}개`,
    accommodation.bathrooms && `욕실 ${accommodation.bathrooms}개`,
  ].filter(Boolean).join(' · ')

  return (
    <>
      {/* pb-96으로 하단 예약 바(폼 포함) 높이 확보 */}
      <main className="pb-96">
        {/* 히어로 이미지 */}
        <HeroImage imageUrl={accommodation.imageUrl} name={accommodation.name} />

        <div className="px-margin-mobile pt-5 flex flex-col gap-5">

          {/* ── 슈퍼호스트 + 평점 ── */}
          <div className="flex justify-between items-center">
            {accommodation.isSuperhost ? (
              <span className="bg-primary-container text-primary-on-container font-inter text-label-sm font-semibold px-3 py-1 rounded-full">
                슈퍼호스트
              </span>
            ) : (
              <span />
            )}
            {accommodation.rating !== undefined && (
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-secondary"
                  style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-inter text-body-sm font-semibold text-surface-on">
                  {accommodation.rating}
                </span>
                {accommodation.reviewCount !== undefined && (
                  <span className="font-inter text-label-sm text-surface-on-variant">
                    (후기 {accommodation.reviewCount}개)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── 제목 + 위치 ── */}
          <div>
            <h1 className="font-plus-jakarta text-headline-lg-mobile text-surface-on mb-1">
              {accommodation.name}
            </h1>
            <p className="font-inter text-body-sm text-surface-on-variant">
              <span aria-hidden="true">📍 </span>
              <span>{accommodation.location}</span>
            </p>
          </div>

          <div className="h-px bg-outline-variant" />

          {/* ── 숙박 공간 전체 ── */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-1">
                숙박 공간 전체
              </h2>
              {spaceInfo && (
                <p className="font-inter text-body-sm text-surface-on-variant">{spaceInfo}</p>
              )}
            </div>
            {/* 호스트 아바타 플레이스홀더 */}
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center shrink-0 ml-4">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
              >
                person
              </span>
            </div>
          </div>

          <div className="h-px bg-outline-variant" />

          {/* ── 숙소 상세 설명 ── */}
          <section>
            <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-3">
              숙소 상세 설명
            </h2>
            <p className="font-inter text-body-md text-surface-on-variant leading-relaxed">
              {accommodation.description ??
                `${accommodation.name}은(는) ${accommodation.location}에 위치한 숙소입니다.`}
            </p>
          </section>

          {/* ── 제공되는 편의시설 ── */}
          {accommodation.amenities && accommodation.amenities.length > 0 && (
            <>
              <div className="h-px bg-outline-variant" />
              <section>
                <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-4">
                  제공되는 편의시설
                </h2>
                <AmenitiesList amenities={accommodation.amenities} />
              </section>
            </>
          )}

          <div className="h-px bg-outline-variant" />

          {/* ── 위치 (더미 지도) ── */}
          <section>
            <MapPlaceholder location={accommodation.location} />
          </section>

          <div className="h-px bg-outline-variant" />

          {/* ── 안심 예약 보장 ── */}
          <section className="bg-primary-container rounded-xl py-7 flex flex-col items-center gap-2">
            <span
              className="material-symbols-outlined text-primary-on-container"
              style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <p className="font-plus-jakarta text-body-md font-semibold text-primary-on-container">
              안심 예약 보장
            </p>
          </section>

        </div>
      </main>

      {/* ── 하단 고정 예약 바 (인라인 폼) ── */}
      <BookingBottomBar
        pricePerNight={accommodation.pricePerNight}
        accommodationId={accommodation.id}
      />
    </>
  )
}
