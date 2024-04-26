import {createStore} from 'vuex'
import cart from './cart.js'
import user from './user.js'

const store = createStore({
	modules: {
		cart,
		user,
	}
})

export default store