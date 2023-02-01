import Vue from 'vue'
import App from './App'
import store from './store'
import JSEncrypt from 'jsencrypt'

//自定义导航栏插件
import cuCustom from './colorui/components/cu-custom.vue';

//自定义下拉加载,上拉刷新插件
import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
Vue.component('mescroll-body', MescrollBody);
Vue.component('mescroll-uni', MescrollUni);

Vue.config.productionTip = false;
Vue.prototype.$jsencrypt = JSEncrypt;
App.mpType = 'app';
Vue.prototype.$store=store;

const app = new Vue({
	store,
    ...App
})
app.$mount()