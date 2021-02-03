import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 路由高亮小点显示
    navActive: null,
  },
  getters: {
    navActive: (state)=>{
      return state.navActive
    }
  },
  mutations: {
    setNavActive(state,data){
      state.navActive = data;
    }
  },
  actions: {

  },
  modules: {}
});
