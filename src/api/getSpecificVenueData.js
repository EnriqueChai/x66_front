import request from '@/utils/request'

// 获取作者信息
// 真实请求函数，目前无法使用
// export const getSpecificVenueData = (venue_name) => {
//   return request.get('venue/getSpecificVenueData', {
//     params: {
//       venue_name
//     }
//   })
// }

// 临时请求函数，用于测试，调用函数模拟请求最终返回@/tmp/specific_venue_tmp_data.json
export const getSpecificVenueData = (venue_name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(require('@/tmp/specific_venue_tmp_data.json'))
    }, 1000)
  })
}
