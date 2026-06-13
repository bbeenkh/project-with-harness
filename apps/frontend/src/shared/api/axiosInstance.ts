import axios from 'axios'

/**
 * # axiosInstance
 * ---
 * - 간단설명: 백엔드 API 기본 URL이 설정된 axios 인스턴스
 * - 제약사항: baseURL은 http://localhost:3000 (개발 환경)
 * ---
 * @example
 * const { data } = await axiosInstance.get('/accommodations')
 */
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
})

export default axiosInstance
