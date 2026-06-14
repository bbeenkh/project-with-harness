import { useNavigate } from 'react-router-dom'
import type { Accommodation } from '../../../entities/accommodation/types/accommodation'

interface Props {
  accommodation: Accommodation
}

/**
 * # AccommodationCard
 * ---
 * - 간단설명: 숙소 이미지, 이름, 위치, 평점, 편의시설 뱃지, 1박 가격을 표시하는 카드
 * - 제약사항: imageUrl 없으면 회색 placeholder, rating 없으면 별점 영역 미표시
 * ---
 * @param accommodation - 숙소 데이터
 * @example
 * <AccommodationCard accommodation={item} />
 */
export default function AccommodationCard({ accommodation }: Props) {
  const navigate = useNavigate()
  const badge = accommodation.amenities?.[0]

  return (
    <div
      className="bg-surface-container-lowest rounded-xl overflow-hidden card-shadow cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      onClick={() => navigate(`/accommodations/${accommodation.id}`)}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {accommodation.imageUrl ? (
          <img
            src={accommodation.imageUrl}
            alt={accommodation.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high" />
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
          <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>favorite</span>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="p-md">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-plus-jakarta text-headline-md text-surface-on">{accommodation.name}</h3>
          {accommodation.rating !== undefined && (
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="font-inter text-label-sm text-surface-on">{accommodation.rating}</span>
            </div>
          )}
        </div>
        <p className="font-inter text-body-sm text-surface-on-variant mb-4">{accommodation.location}</p>
        <div className="flex justify-between items-end">
          <div>
            {badge && (
              <span className="px-3 py-1 rounded bg-tertiary-fixed text-tertiary-on-fixed font-inter text-label-sm">
                {badge}
              </span>
            )}
            {!accommodation.available && (
              <span className="px-3 py-1 rounded bg-error-container text-error-on-container font-inter text-label-sm">
                예약 불가
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="font-inter text-label-sm text-outline block">1박당</span>
            <span className="font-plus-jakarta text-headline-md text-surface-on">
              {accommodation.pricePerNight.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
