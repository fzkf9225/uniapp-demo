<template>
	<view class="flex flex-direction">
		<text class="margin-lr margin-top-lg text-sm auto-color">原密码</text>
		<input class="solid-bottom margin-lr margin-top-sm text-sm auto-color" v-model="oldPw" placeholder="请输入原密码" maxlength="16" placeholder-style="color:#999999;"
		 password="true" />

		<text class="margin-lr margin-top-lg text-sm auto-color">新密码</text>
		<input class="solid-bottom margin-lr margin-top-sm text-sm auto-color" v-model="newPw" placeholder="请输入新密码" maxlength="16" placeholder-style="color:#999999;"
		 password="true" />

		<text class="margin-lr margin-top-lg text-sm auto-color">确认新密码</text>
		<input class="solid-bottom margin-lr margin-top-sm text-sm auto-color" v-model="newPwAgain" placeholder="请再次输入新密码" maxlength="16" placeholder-style="color:#999999;"
		 password="true" />
		 
		<view class="padding flex flex-direction">
			<button @click="modifySubmit" class="cu-btn bg-theme margin-tb-lg lg round">确认</button>
		</view>
	</view>
</template>

<script>
	import {
		encrypt,
		showToast,
		isLoginSuccess,
		exit,
	} from '../../common/common.js';
	import validate from '../../common/fshjie-formvalidate/ys-validate.js';
	import {
		postModifyPassword
	} from '../../common/ApiServiceHelper.js'
	let modifyPasswordRules = [{
			name: 'oldPw',
			type: 'required',
			errmsg: '请输入原密码'
		},
		{
			name: 'newPw',
			type: 'required',
			errmsg: '请输入新密码'
		},
		{
			name: 'newPw',
			type: 'pwd',
			errmsg: '新密码须是6～16位字符'
		},
		{
			name: 'newPwAgain',
			type: 'required',
			errmsg: '请再次输入新密码'
		},
		{
			name: 'newPwAgain',
			type: 'eq',
			eqName: 'newPw',
			required: true,
			errmsg: '两次输入密码不一致'
		},
		{
			name: 'oldPw',
			type: 'isEquals',
			eqName: 'newPw',
			required: true,
			errmsg: '新密码不能与旧密码相同'
		}
	];
	export default {
		data() {
			return {
				modifyPasswordBean: {
					oldPassword: "",
					newPassword: ""
				},
				oldPw: "",
				newPw: "",
				newPwAgain: ""
			}
		},
		onShow() {
			let that = this;
			isLoginSuccess(this.$store.state).then(() => {
				uni.navigateBack({
					delta: 1
				});
			}).catch(() => {});
		},
		methods: {
			modifySubmit() {
				let valLoginRes = validate.validate(this, modifyPasswordRules);
				if (!valLoginRes.isOk) {
					showToast(valLoginRes.errmsg);
					return;
				}
				let jsencrypt = new this.$jsencrypt();
				this.modifyPasswordBean.oldPassword = encrypt(jsencrypt, this.oldPw);
				this.modifyPasswordBean.newPassword = encrypt(jsencrypt, this.newPw);

				postModifyPassword(this.modifyPasswordBean).then(res => {
					showToast("密码修改成功，请重新登录！");
					exit();
					uni.navigateTo({
						url: "../user/login"
					});
				}).catch(res => {
					console.log(res);
				});

			}
		}
	}
</script>

<style>
</style>
