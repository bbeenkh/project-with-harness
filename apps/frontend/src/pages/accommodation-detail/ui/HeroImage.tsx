import { useNavigate } from 'react-router-dom'

interface Props {
  imageUrl?: string
  name: string
}

/**
 * # HeroImage
 * ---
 * - 간단설명: 숙소 히어로 이미지 + 오버레이 헤더(뒤로가기·공유·찜)
 * - 제약사항: imageUrl 없으면 회색 placeholder
 * ---
 * @param imageUrl - 이미지 URL (optional)
 * @param name - 숙소명 (alt 텍스트)
 * @example
 * <HeroImage imageUrl="https://..." name="제주 풀빌라" />
 */
export default function HeroImage({ imageUrl, name }: Props) {
  const navigate = useNavigate()

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-surface-container-high" />
      )}
      {/* 오버레이 헤더 */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 pt-12 pb-4 bg-gradient-to-b from-black/30 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
          aria-label="뒤로가기"
        >
          <span className="material-symbols-outlined text-surface-on" style={{ fontSize: '20px' }}>arrow_back</span>
        </button>
        <div className="flex gap-2">
          <button
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
            aria-label="공유"
          >
            <span className="material-symbols-outlined text-surface-on" style={{ fontSize: '20px' }}>share</span>
          </button>
          <button
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
            aria-label="찜하기"
          >
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>favorite</span>
          </button>
        </div>
      </div>
    </div>
  )
}
