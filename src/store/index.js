import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 路由高亮小点显示
    navActive: null,
    userInfo: {
      "id": 1,
      "login": "哒哒哒",
      "mobile_phone": null,
      "name": null,
      "nickname": null,
      "occupation": null,
      "qq": null,
      "remember_created_at": null,
      "reset_password_sent_at": null,
      "reset_password_token": null,
      "last_name": null,
      "last_login_location": null,
      "last_login_at": null,
      "gender": null,
      "first_name": null,
      "email": "1028643774@qq.com",
      "city": null,
      "cid": null,
      "avatar": null,
      "admin": false
    },
    categoriesId: JSON.parse(localStorage.getItem("CategoriesIdStore"))
  },
  getters: {
    navActive: (state)=>{
      return state.navActive
    }
  },
  mutations: {
    setNavActive(state,data){
      state.navActive = data;
    },
    setUserInfo(state, data) {
      state.userInfo = data;
    },
    setCategoriesId(state, data) {
      localStorage.setItem('CategoriesIdStore', JSON.stringify(data))
      state.categoriesId = data;
    },
  },
  actions: {

  },
  modules: {}
});
