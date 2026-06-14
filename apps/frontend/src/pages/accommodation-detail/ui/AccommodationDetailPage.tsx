import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccommodation } from '../../../entities/accommodation'
import type { Booking } from '../../../entities/booking'
import { BookingForm, BookingConfirmation } from '../../../features/booking'
import { Modal, Skeleton } from '../../../shared/ui/primitive'
import HeroImage from './HeroImage'
import AmenitiesList from './AmenitiesList'
import MapPlaceholder from './MapPlaceholder'
import BookingBottomBar from './BookingBottomBar'

/**
 * # AccommodationDetailPage
 * ---
 * - 간단설명: 숙소 상세 정보(이미지, 평점, 리뷰, 기본정보, 편의시설, 지도) + 하단 고정 예약 바 + 예약 모달
 * ---
 * @example
 * <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
 */
export default function AccommodationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: accommodation, isLoading, isError } = useAccommodation(id ? Number(id) : undefined)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)

  if (isLoading) {
    return (
      <div className="pb-24">
        <Skeleton.Box styleClass={{ root: 'w-full aspect-[4/3]' }} />
        <div className="px-margin-mobile pt-4 flex flex-col gap-3">
          <Skeleton.Box styleClass={{ root: 'h-7 w-2/3' }} />
          <Skeleton.Box styleClass={{ root: 'h-4 w-1/3' }} />
          <Skeleton.Box styleClass={{ root: 'h-4 w-full' }} />
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

  return (
    <>
      <main className="pb-24">
        {/* 히어로 이미지 */}
        <HeroImage imageUrl={accommodation.imageUrl} name={accommodation.name} />

        {/* 본문 */}
        <div className="px-margin-mobile py-6 flex flex-col gap-6">
          {/* 제목 + 평점 + 슈퍼호스트 */}
          <div>
            <div className="flex justify-between items-start mb-1">
              <h1 className="font-plus-jakarta text-headline-lg-mobile text-surface-on flex-1 pr-3">
                {accommodation.name}
              </h1>
              {accommodation.rating !== undefined && (
                <div className="flex items-center gap-1 bg-primary-container px-2 py-1 rounded-full shrink-0">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-inter text-label-sm text-primary font-bold">{accommodation.rating}</span>
                </div>
              )}
            </div>

            {/* 위치 */}
            <p className="font-inter text-body-sm text-surface-on-variant mb-2">
              <span aria-hidden="true">📍 </span>
              <span>{accommodation.location}</span>
            </p>

            {/* 리뷰 수 + 슈퍼호스트 뱃지 */}
            <div className="flex items-center gap-2 flex-wrap">
              {accommodation.reviewCount !== undefined && (
                <span className="font-inter text-label-sm text-surface-on-variant">
                  리뷰 {accommodation.reviewCount}개
                </span>
              )}
              {accommodation.isSuperhost && (
                <>
                  {accommodation.reviewCount !== undefined && (
                    <span className="text-outline-variant">·</span>
                  )}
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-secondary"
                      style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <span className="font-inter text-label-sm text-secondary font-medium">슈퍼호스트</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 기본 정보 칩 */}
          {(accommodation.maxGuests || accommodation.bedrooms || accommodation.beds || accommodation.bathrooms) && (
            <>
              <div className="h-px bg-outline-variant" />
              <div className="flex gap-2 flex-wrap">
                {accommodation.maxGuests && (
                  <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>group</span>
                    <span className="font-inter text-label-sm text-surface-on">최대 {accommodation.maxGuests}명</span>
                  </div>
                )}
                {accommodation.bedrooms && (
                  <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>bedroom_parent</span>
                    <span className="font-inter text-label-sm text-surface-on">침실 {accommodation.bedrooms}</span>
                  </div>
                )}
                {accommodation.beds && (
                  <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>bed</span>
                    <span className="font-inter text-label-sm text-surface-on">베드 {accommodation.beds}</span>
                  </div>
                )}
                {accommodation.bathrooms && (
                  <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>bathroom</span>
                    <span className="font-inter text-label-sm text-surface-on">욕실 {accommodation.bathrooms}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="h-px bg-outline-variant" />

          {/* 숙소 소개 */}
          <section>
            <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-3">숙소 소개</h2>
            <p className="font-inter text-body-md text-surface-on-variant leading-relaxed">
              {accommodation.description ?? (
                <>
                  {accommodation.name}은(는) {accommodation.location}에 위치한 숙소입니다.
                  {accommodation.amenities && accommodation.amenities.length > 0 &&
                    ` ${accommodation.amenities.join(', ')} 등 다양한 편의시설을 제공합니다.`
                  }
                </>
              )}
            </p>
          </section>

          {/* 편의시설 */}
          {accommodation.amenities && accommodation.amenities.length > 0 && (
            <>
              <div className="h-px bg-outline-variant" />
              <section>
                <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-4">편의시설</h2>
                <AmenitiesList amenities={accommodation.amenities} />
              </section>
            </>
          )}

          {/* 지도 */}
          <div className="h-px bg-outline-variant" />
          <section>
            <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-4">위치</h2>
            <MapPlaceholder location={accommodation.location} />
          </section>

          {/* 신뢰 뱃지 */}
          <div className="h-px bg-outline-variant" />
          <section className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-primary shrink-0"
                style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
              >
                verified_user
              </span>
              <div>
                <p className="font-inter text-body-sm font-semibold text-surface-on">100% 검증된 숙소</p>
                <p className="font-inter text-label-sm text-surface-on-variant">모든 숙소는 입주 전 품질 검사를 통과했습니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-primary shrink-0"
                style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
              >
                support_agent
              </span>
              <div>
                <p className="font-inter text-body-sm font-semibold text-surface-on">24시간 고객 지원</p>
                <p className="font-inter text-label-sm text-surface-on-variant">언제든지 도움이 필요하시면 연락하세요.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 하단 고정 예약 바 */}
      <BookingBottomBar
        pricePerNight={accommodation.pricePerNight}
        onBookingClick={() => setBookingModalOpen(true)}
      />

      {/* 예약 모달 */}
      <Modal
        open={bookingModalOpen}
        onOpenChange={(open) => {
          setBookingModalOpen(open)
          if (!open) setConfirmedBooking(null)
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {confirmedBooking ? '예약 완료' : '예약 신청'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmedBooking ? (
            <BookingConfirmation
              booking={confirmedBooking}
              onClose={() => {
                setBookingModalOpen(false)
                setConfirmedBooking(null)
              }}
            />
          ) : (
            <BookingForm
              accommodationId={accommodation.id}
              pricePerNight={accommodation.pricePerNight}
              onSuccess={(booking) => setConfirmedBooking(booking)}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
