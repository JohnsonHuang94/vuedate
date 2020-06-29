import vueDate from './vueDate.vue'

vueDate.install = function(Vue){
	Vue.component(vueDate.name, vueDate)
}

export default vueDate
