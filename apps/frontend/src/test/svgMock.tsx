import React from 'react'

/**
 * SVG SVGR 모듈 mock
 * - vitest 환경에서 *.svg?react import를 대체하는 mock 컴포넌트
 */
const SvgMock = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} {...props} />
)

export default SvgMock
export { SvgMock as ReactComponent }
