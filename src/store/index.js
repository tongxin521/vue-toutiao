import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from './storage.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('token')
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      setItem('token', data)
    }
  },
  actions: {},
  modules: {}
})
