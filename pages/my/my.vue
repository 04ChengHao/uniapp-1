<template>
	<view>
		<!-- 用户未登录时，显示登录组件 -->
		<my-login v-if="!token"></my-login>

		<!-- 用户登录后，显示用户信息组件 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import {
		tabbar
	} from '@/mixins/tabbar-badge.js'
	import {
		mapState
	} from 'vuex'
	export default {
		mixins: [tabbar],
		computed: {
			...mapState('user', ['token']),
		},
		data() {
			return {

			};
		},
		onLoad() {
			// console.log(this.token);
		}
	}
</script>

<style lang="scss">
page,
.my-container {
  height: 100%;
}
</style>