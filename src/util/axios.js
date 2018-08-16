import axios from 'axios';
import qs from 'qs';
import zgh from './utils.js';
import router from '../router/router.js'
import {Message } from 'element-ui'
import util from '../util/utils.js'
export default function fetch(options) {
    return new Promise((resolve, reject) => {
        const instance = axios.create({
           // baseURL: $fn.apiHost,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            timeout: 30 * 1000, // 30秒超时
            withCredentials: true //解决跨域session问题
        });

        instance.interceptors.request.use((options) => {
            if (window.sessionStorage.getItem('token')) {
                options.headers['Authorization'] = util.getStorage('session','token')
              }
            if (options.method === 'post') {
                options.data = qs.stringify(options.data);
            }
            return options;
        }, (error) => {
            return Promise.reject(error);
        });

        //返回状态判断(添加响应拦截器)
        instance.interceptors.response.use(
            res => {
                return res
            },
            err => {
                Message.error({
                    message: '网络不稳定，请重试'
                    })
                return console.log('错误信息:',err);
            }
        );

        instance(options)
            .then(res => {
                if(res.data.code == 500 && res.data.msg=='服务-service-sys:登录过期，请重新登录！'){
                    Message({
                        message: res.data.msg,
                        type: 'warning'
                    });
                    router.replace({path:"/"})
                    sessionStorage.clear('user');
                }
                if(res.data.code == 10001){
                    Message({
                        message: 'token已过期，请重新登录',
                        type: 'warning'
                    });
                    router.replace({path:"/"})
                    sessionStorage.clear('token');
                }
                 if (res.data.encryption) {
                     const result =  zgh.dataSecret(res.data.result)
                     res.data.result = JSON.parse(result)
                     resolve(res); //解密通道
                 } else {
                    resolve(res); //正常通道
                }
            })
            .catch(error => {
                console.info('请求异常，信息：', error);
                reject(error);
            });
    });
}