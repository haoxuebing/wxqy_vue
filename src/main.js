// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import App from './App';
import store from './store/score';
import  VueResource  from 'vue-resource';
import axios from "axios";
import $ from 'zepto';
import weui from 'weui';

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.prototype.$ajax=axios;
const routes = [{
    path: '/Score',
    component: () => import('./components/Score')
}, {
    path: '/ScoreItem',
    component: () => import('./components/ScoreItem')
}, {
    path: '/StudentScore',
    component: () => import('./components/StudentScore')
}, {
    path: '/ScoreDetail',
    component: () => import('./components/ScoreDetail')
},{
    path:'/StudentList',
    component:()=>import('./components/StudentList')
},{
    path:'/Search',
    component:() => import('./components/Search')
}];

const router = new VueRouter({
    //mode: 'history',
    routes
});

FastClick.attach(document.body)

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    router,
    store,
    $,
    weui,
    render: h => h(App)
}).$mount('#app-box');