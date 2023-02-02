import { message } from "antd";
import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
    timeout: 1000 * 60,
    headers: {'Authorization': localStorage.getItem('token')}
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if(response.data.code === 401){
        message.error("登录失效")
        window.location.href = "/login"
        return
    }
    if(response.data.code !== 200){
        message.error(response.data.msg)
        return Promise.reject(response.data.msg);
    }
    return response.data?.data;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    message.error(error?.message)
    return Promise.reject(error);
});

export default instance