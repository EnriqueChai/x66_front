import request from '@/utils/request'

export const getRecomPaper = (id) => {
  return request.get('paper/dailyRec')
}