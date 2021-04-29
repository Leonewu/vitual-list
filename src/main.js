import Vue from "vue";
import App from "./App.vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import XiaoUI from 'xiao-ui'
// console.log(XiaoUI)
// Vue.use(XiaoUI)
// import { button } from 'xiao-ui'
// import 'xiao-ui/lib/style/button.css'
// console.log(button)
// Vue.component('xiao-button', button)
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  render: h => h(App)
}).$mount("#app");
