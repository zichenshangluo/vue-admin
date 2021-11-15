import axios from "axios";
import { Message } from "element-ui";
/**
 * 定义拦截器
 */
//创建axios，赋给变量service
//手把手撸码前端API，地址是http://www.web-jshtml.cn/productapi

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";
const service = axios.create({
  baseURL: BASEURL, //http://localhost:8080/api/  == http://www.web-jshtml.cn/productapi
  timeout: 15000, //超时
});

//添加请求拦截器   请求接口前，做一些数据处理
service.interceptors.request.use(
  function (config) {
    //在发送请求之前做些什么
    //后台需要前端这边传相关的参数（在请求头添加参数）
    return config;
  },
  function (error) {
    //对请求错误做些什么
    return Promise.reject(error);
  }
);
//添加响应拦截器   请求接口，返回数据进行拦截
service.interceptors.response.use(
  function (response) {
    //对响应数据做点什么
    let data = response.data;
    if (data.resCode !== 0) {
      Message.error(data.message);
      return Promise.reject(data);
    } else {
      return response;
      //return Promise.resolve(data);
    }
  },
  function (error) {
    //对响应错误做点什么
    return Promise.reject(error);
  }
);

export default service;
