import request from '@/utils/request'
import request_temp from '@/utils/request_temp'

export const getSpecificVenueData = (venue_id) => {
  return request_temp.get('api/venue/info', {
    params: {
      venue_id
    }
  })
}
