import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import httpPlugin from '@/assets/js/http'

import './assets/css/style.css'
Vue.use(ElementUI)
// 加载 httpPlugin 插件（封装自 axios）
// 我们在该插件中为 Vue 原型对象扩展了一个成员 $http
// 然后我们就可以在任何组件通过使用 this.$http 来发起请求了
Vue.use(httpPlugin)

Vue.config.productionTip = false

// 我们可以为vue.prototype添加成员
// 所有的组件都是vue的实例

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
