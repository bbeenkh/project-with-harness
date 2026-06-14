/**
 * # BookingInfoNote
 * ---
 * - 간단설명: 무료 취소 규정 및 환불 정책 안내 카드
 * ---
 * @example
 * <BookingInfoNote />
 */
export default function BookingInfoNote() {
  return (
    <div className="mx-margin-mobile mt-md p-md bg-surface-container-low rounded-xl flex gap-sm">
      <span
        className="material-symbols-outlined text-primary"
        style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}
      >
        verified_user
      </span>
      <div>
        <p className="font-inter text-label-md text-surface-on mb-xs">무료 취소 안내</p>
        <p className="font-inter text-body-sm text-surface-on-variant leading-relaxed">
          체크인 7일 전까지 무료 취소가 가능합니다. 이후 취소 시 환불 정책에 따라 위약금이 발생할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
