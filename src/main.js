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
import store from './store'
import { initMenu } from './utils/menus.js';
import 'font-awesome/css/font-awesome.min.css'
//global variable
Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  console.log("to.path: " + to.path);
  console.log("from.path: " + from.path);
  if (to.path == '/') {
    next();
  } else {
    if (window.sessionStorage.getItem("user")) {
      console.log('initMenu')
      initMenu(router, store);
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
