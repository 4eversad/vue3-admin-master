import {server, server1} from "@/utils/request";
/**
 * 获取验证码
 */
export const GetSms = (username, module) => {
  return server('/getSms/', 'post', { username, module })
}

/**
 * 获取用户角色
 */
export function getUserRole(data = {}) {
  return server(
    "token/userRole/", "post", { data }
    // data: data, 左边的data是变量名（key）后台接收的。右边的Data是接收的参数。如果两者都是同名的情况下，可以写成单一个即可（ES6的写法）
  )
}

/**
 * 退出
 */
export function Logout(data = {}) {
  return server("/logout/", "post", { data })
}

/**
 * 登录
 */
/* export function Login(data) {
  return server("/login/", "post", { data })
} */

/**
 * 使用json-server模拟数据登录
 */
export function Login(data) {
  return server1("/login", "get", { data })
}

/**
 * 注册
 */

/* export function Register(data) {
  return request("/register/", "post", { data })
} */
/**
 * json-server模拟注册
 */

export function Register(data) {
  return server1("/register", "get",)
}