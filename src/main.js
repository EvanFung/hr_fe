import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { postRequest } from './utils/api.js';
import { postKeyValueRequest } from './utils/api.js';
import { putRequest } from './utils/api.js';
import { getRequest } from './utils/api.js';
import { deleteRequest } from './utils/api.js';

//global variable
Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false
Vue.use(ElementUI);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
