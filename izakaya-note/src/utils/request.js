import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: '/', // api 的 base_url
  timeout: 10000 // 请求超时时间
})

// request拦截器
request.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json'
  return config
}, error => {
    Promise.reject(error)
  }
)

// response 拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)
export default request
