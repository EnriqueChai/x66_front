import request_temp from '@/utils/request_temp'

export const getFieldInfo = (field_name) => {
  return request_temp.get('api/field/info', {
    params: {
      field_name
    }
  })
}