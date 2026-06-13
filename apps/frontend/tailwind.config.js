/**
 * # Tailwind CSS 설정
 * ---
 * - 간단설명: Vibrant Horizon 디자인 시스템 토큰을 Tailwind CSS 커스텀 테마로 정의
 * - 제약사항 및 특이사항:
 *   - theme.extend 사용으로 Tailwind 기본값 유지
 *   - 컬러: Vibrant Horizon 전체 팔레트 (primary, secondary, tertiary, error, surface, outline, background)
 *   - 폰트: Plus Jakarta Sans (headline), Inter (body)
 *   - 스페이싱: 8px 그리드 (xs~2xl)
 *   - border-radius: sm 4px ~ xl 24px
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006a62',
          container: '#00a699',
          fixed: '#7af7e8',
          'fixed-dim': '#5bdacc',
          on: '#ffffff',
          'on-container': '#00332f',
          'on-fixed': '#00201d',
          'on-fixed-variant': '#005049',
          inverse: '#5bdacc',
        },
        secondary: {
          DEFAULT: '#b52330',
          container: '#ff5a5f',
          fixed: '#ffdad8',
          'fixed-dim': '#ffb3b0',
          on: '#ffffff',
          'on-container': '#60000e',
          'on-fixed': '#410007',
          'on-fixed-variant': '#92001b',
        },
        tertiary: {
          DEFAULT: '#006874',
          container: '#44a1ae',
          fixed: '#97f0ff',
          'fixed-dim': '#7ad4e2',
          on: '#ffffff',
          'on-container': '#003339',
          'on-fixed': '#001f24',
          'on-fixed-variant': '#004f57',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
          on: '#ffffff',
          'on-container': '#93000a',
        },
        surface: {
          DEFAULT: '#fbf9f8',
          dim: '#dbd9d9',
          bright: '#fbf9f8',
          'container-lowest': '#ffffff',
          'container-low': '#f5f3f3',
          container: '#f0eded',
          'container-high': '#eae8e7',
          'container-highest': '#e4e2e2',
          variant: '#e4e2e2',
          tint: '#006a62',
          on: '#1b1c1c',
          'on-variant': '#3c4947',
          inverse: '#303030',
          'inverse-on': '#f2f0f0',
        },
        outline: {
          DEFAULT: '#6c7a77',
          variant: '#bbc9c6',
        },
        background: {
          DEFAULT: '#fbf9f8',
          on: '#1b1c1c',
        },
      },
      fontFamily: {
        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['36px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'headline-lg-mobile': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1.2', fontWeight: '500' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        gutter: '16px',
        'margin-mobile': '20px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
