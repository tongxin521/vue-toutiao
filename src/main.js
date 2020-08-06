import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入vuex
import store from './store/index.js'
// 导入全局样式
import './style/index.less'
// 导入 vant 组件
import Vant from 'vant'
// 导入 vant 全局样式
import 'vant/lib/index.css'
// 监听手机设备尺寸 自动设置根节点字体大小
import 'amfe-flexible'
// 导入 axios
import axios from 'axios'
// 导入 dayjs
import dayjs from 'dayjs'
// 加载语言配置
import 'dayjs/locale/zh-cn'
// 加载 RelativeTime
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入 jsonBig 处理大数字问题
import jsonBig from 'json-bigint'
dayjs.extend(relativeTime)

// 定义全局使用
dayjs.locale('zh-cn')
dayjs().format()
// 注册 vant 为全局组件
Vue.use(Vant)
// axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// axios.defaults.transformRequest = [
//   function(data) {
//     try {
//       // 如果转换成功则返回转换的数据结果
//       return JSON.stringify(data)
//     } catch (err) {
//       // 如果转换失败，则包装为统一数据格式并返回
//       return {
//         data
//       }
//     }
//   }
// ]

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 接口基础路径

  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [
    function(data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data)
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return {
          data
        }
      }
    }
  ]
})

// 添加请求拦截器
request.interceptors.request.use(
  function(config) {
    const { user } = store.state
    if (!user) {
      return config
    }
    // 在发送请求之前做些什么
    config.headers.Authorization = `Bearer ${user.token}`
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  // 响应成功进入第1个函数
  // 该函数的参数是响应对象
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  // 响应失败进入第2个函数，该函数的参数是错误对象
  async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 如果响应码是 401 ，则请求获取新的 token
    // 响应拦截器中的 error 就是那个响应的错误对象
    console.dir(error)
    if (error.response && error.response.status === 401) {
      // 校验是否有 refresh_token
      const user = store.state.user
      if (!user || !user.refresh_token) {
        router.push('/login')

        // 代码不要往后执行了
        return
      }
      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 如果获取成功，则把新的 token 更新到容器中
        console.log('刷新 token  成功', res)
        store.commit('setUser', {
          token: res.data.data.token, // 最新获取的可用 token
          refresh_token: user.refresh_token // 还是原来的 refresh_token
        })
        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 request 的请求结果继续返回给发请求的具体位置
        return request(error.config)
      } catch (err) {
        // 如果获取失败，直接跳转 登录页
        console.log('请求刷线 token 失败', err)
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)
Vue.prototype.$http = request

Vue.config.productionTip = false

// 注册过滤器
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
