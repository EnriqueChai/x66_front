import request from '@/utils/request'
import request_temp from '@/utils/request_temp'

export const getVenue = (venue_name) => {
  return request_temp.get('api/venue/search', {
    params: { venue_name }
  })
}