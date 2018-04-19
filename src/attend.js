// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import $ from 'zepto';
import App from './App';
import store from './store/attend';
import { getRequest, postRequest} from "./lib/http";

Vue.use(VueRouter);
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;



const routes = [{
  path: '/list',
  component: () => import('./pages/attendList')
}, {
  path: '/year',
  component: () => import ('./pages/moreYear')
}, {
  path: '/history',
  component: () => import('./pages/attendListHistory')
}, {
  path: '/newAttend',
  component: () => import('./pages/newAttend')
}, {
  path: '/check_roster',
  component: () => import('./pages/check_roster')
}, {
  path: '/check_roster_random',
  component: () => import('./pages/check_roster_random')
  },{
  path: '/forStudent',
  component: () => import('./pages/forStudent')
}, {
  path: '/attendDetails',
  component: () => import('./pages/attendDetails')
}];

const router = new VueRouter({
  base:'/attend/',
  // mode: 'history',
  routes
});


Vue.prototype.router = router;

FastClick.attach(document.body)

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  store,
  $,
  render: h => h(App)
}).$mount('#app-box');