import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		wsClient: null,
		loginInfo: null,
		socketOpen: false,
		isLoginCallBack: false,
		city:"北京市",
		versionName :"",
		versionCode :"",
		userInfo:""
	},
	actions:{
		
	},
	mutations: {
		setClient(state, param) {
			// console.log(param)
			state.wsClient = param
		},
		setLoginInfo(state, param) {
			// console.log(param);
			state.loginInfo = param
		},
		loginOut(state) {
			state.loginInfo = null
		},
		changeSocketOpen(state, param) {
			state.socketOpen = param
		},
		changeLoginCallback(state, param) {
			state.isLoginCallBack = param
		},
		setVersionName(state,param){
			state.versionName = param
		},
		setVersionCode(state,param){
			state.versionCode = param
		},
		saveUserInfo(state,param){
			state.userInfo = param
		},
		clearUserInfo(state){
			state.userInfo = ""
		}
	},
	getters: { //对应方法 用来获取属性的状态
		getLoginCallBackState: state => state.isLoginCallBack,
		getVersionName:state =>state.versionName,
		getVersionCode:state =>state.versionCode,
	}
});

export default store;
