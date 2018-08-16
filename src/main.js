import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import Vuex from 'vuex'

import axios from './util/axios.js'
import router from './router/router.js'
import store from './vuex/store'

Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false
require('!style-loader!css-loader!less-loader!./assets/css/init.less');


global.$fn = {
  apiHost1:'/zgh/api/wallet/v1',//钱包模块
  apiHost2:'/zgh/api/sys/v1', //系统模块
  apiHost3:'/zgh/api/user/v1', //用户模块
  
  sign:'kjz16882018'
}
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})