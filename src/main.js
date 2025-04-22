import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'normalize.css/normalize.css' // 使用现代的CSS重置方式
import 'element-ui/lib/theme-chalk/index.css' // 引入ElementUI的CSS样式
import '@/styles/index.scss' // 引入全局css样式

import '@/icons' // 引入图标
// import '@/permission' // 引入权限控制

Vue.config.productionTip = false
Vue.use(ElementUI)

// 创建事件总线实例
Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
