import vueDate from './vueDate/index'

const components = [
	vueDate
]

const install = function (Vue) {
	if(install.installed) return
	install.installed = true
	components.map(component => {
		Vue.component(component.name, component)
	})
}

if(typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	install,
	...components
}
