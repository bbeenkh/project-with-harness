import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccommodation } from '../../../entities/accommodation'
import type { Booking } from '../../../entities/booking'
import { BookingForm, BookingConfirmation } from '../../../features/booking'
import Modal from '../../../shared/ui/primitive/Modal'
import { Skeleton } from '../../../shared/ui/primitive'
import HeroImage from './HeroImage'
import AmenitiesList from './AmenitiesList'
import MapPlaceholder from './MapPlaceholder'
import BookingBottomBar from './BookingBottomBar'

/**
 * # AccommodationDetailPage
 * ---
 * - 간단설명: 숙소 상세 정보(이미지, 평점, 편의시설, 지도) + 하단 고정 예약 바 + 예약 모달
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
          {/* 제목 + 평점 */}
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
            <p className="font-inter text-body-sm text-surface-on-variant">📍 {accommodation.location}</p>
          </div>

          <div className="h-px bg-outline-variant" />

          {/* 숙소 소개 */}
          <section>
            <h2 className="font-plus-jakarta text-headline-md text-surface-on mb-3">숙소 소개</h2>
            <p className="font-inter text-body-md text-surface-on-variant leading-relaxed">
              {accommodation.name}은(는) {accommodation.location}에 위치한 숙소입니다.
              {accommodation.amenities && accommodation.amenities.length > 0 &&
                ` ${accommodation.amenities.join(', ')} 등 다양한 편의시설을 제공합니다.`
              }
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
        </div>
      </main>

      {/* 하단 고정 예약 바 */}
      <BookingBottomBar
        pricePerNight={accommodation.pricePerNight}
        onBookingClick={() => setBookingModalOpen(true)}
      />

      {/* 예약 모달 */}
      <Modal open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
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
