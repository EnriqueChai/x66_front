import request from '@/utils/request'

export const getModel = (id) => {
  return request.get('book/getModelMap')
}