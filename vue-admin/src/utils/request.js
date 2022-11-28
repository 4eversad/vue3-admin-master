import axios from 'axios'
import { ElMessage } from "element-plus";
const BASEURL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API : process.env.VUE_APP_API;
console.log(BASEURL);

import store from '../store'

const instance = axios.create({
  baseURL: BASEURL,
  timeout: 15000
})
const instance1 = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 3000
})

// 拦截器
// 请求拦截
instance.interceptors.request.use(config => {
  console.log(config);
  
  //内容
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截
instance.interceptors.response.use(res => {
  //内容
  const data = res.data;
  if (data.resCode !== 0) {
    ElMessage({
      message: data.message,
      type: 'error'
    })
    return Promise.reject(data)
  } else {
    return data;
  }

}, err => {
  return Promise.reject(err)
})

// 请求拦截
instance1.interceptors.request.use(config => {
  //内容
  const token = store.state.app.token
  if(token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})
instance1.interceptors.response.use(res => {
  return res.data[0]
}, err => {
  console.log(err);
  
})

export function server(url, method, submitData) {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })

}
export function server1(url, method, submitData) {
  return instance1({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })

}