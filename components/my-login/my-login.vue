<template>
	<view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<!-- <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button> -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	import {
		computed
	} from 'vue'
	export default {
		name: "my-login",
		computed: {
			// ...mapState('user', ['query']),
			...mapState('user', ['redirectInfo']),
		},
		data() {
			return {

			};
		},
		methods: {
			...mapMutations('user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			getUserInfo(e) {
				// uni.getUserProfile({
				// 	desc: 'Wexin', // 这个参数是必须的
				// 	success: res => {
				// 		console.log("用户信息", res.userInfo)
				// 	}
				// })
				// console.log(e);
				// 判断是否获取用户信息成功
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
				// 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
				// 3. 将用户的基本信息存储到 vuex 中
				const userInfo = e.detail.userInfo
				userInfo.city = 'Shijiazhuang'
				userInfo.country = "China"
				userInfo.language = "zh_CN"
				userInfo.gender = 1
				userInfo.nickName = "Long"
				userInfo.province = "Hebei"
				this.updateUserInfo(e.detail.userInfo)
				this.getToken(e.detail)
			},
			async getToken(info) {
				const loginResponse = await new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin', //使用微信登录
						success: function(res) {
							// 判断是否 uni.login() 调用失败
							if (res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
							resolve(res);
						},
					});
				})
				// 准备参数对象
				const query = {
					code: loginResponse.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				const {
					data: loginResult
				} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				const token =
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"

				// if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				uni.$showMsg('登录成功')

				// 2. 更新 vuex 中的 token
				this.updateToken(token)
				// this.updateToken(loginResult.message.token)

				// 判断 vuex 中的 redirectInfo 是否为 null
				// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
				this.navigateBack()
			},
			// 返回登录之前的页面
			navigateBack() {
				// redirectInfo 不为 null，并且导航方式为 switchTab
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					// 调用小程序提供的 uni.switchTab() API 进行页面的导航
					uni.switchTab({
						// 要导航到的页面地址
						url: this.redirectInfo.from,
						// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		// 按钮下方提示消息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>