import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 路由高亮小点显示
    navActive: null,
    userInfo: JSON.parse(localStorage.getItem("userInfoStore")) || {},
    categoriesId: JSON.parse(localStorage.getItem("CategoriesIdStore")),
    folder: JSON.parse(localStorage.getItem("folderStore")) || []
  },
  getters: {
    navActive: (state) => {
      return state.navActive
    }
  },
  mutations: {
    setNavActive(state, data) {
      state.navActive = data;
    },
    setUserInfo(state, data) {
      localStorage.setItem('userInfoStore', JSON.stringify(data))
      state.userInfo = data;
    },
    setCategoriesId(state, data) {
      localStorage.setItem('CategoriesIdStore', JSON.stringify(data))
      state.categoriesId = data;
    },
    // 收藏夹
    setFolder(state, data) {
      localStorage.setItem('folderStore', JSON.stringify(data))
      state.folder = data;
    },
  },
  actions: {

  },
  modules: {}
});
