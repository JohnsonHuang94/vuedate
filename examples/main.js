import Vue from 'vue'
import App from './App.vue'
import vueDate from '../packages/index'

Vue.config.productionTip = false

Vue.use(vueDate)

new Vue({
  render: h => h(App),
}).$mount('#app')
