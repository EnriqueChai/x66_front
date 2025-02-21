import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://39.106.34.142:8080/',
  timeout: 1000000
})

// const currentBaseURL = window.location.origin
// const instance = axios.create({
//   baseURL: currentBaseURL, 
//   timeout: 1000000
// })

instance.interceptors.request.use(function(config) {
  return config
}, function(error) {
  return Promise.reject(error)
})


instance.interceptors.response.use(function(response) {
  const res = response.data
  return res
}, function(error) {
  return Promise.reject(error)
})

export default instance
