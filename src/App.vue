<template>
  <div id="app">
    <Login v-if="loginShow" />
    <Register v-if="registerShow" />
    <router-view></router-view>
  </div>
</template>
<script>
import Login from "./components/common/Login";
import Register from "./components/common/Register";
export default {
  components: {
    Login,
    Register,
  },
  data() {
    return {
      navActive: 0,
      loginShow: false,
      registerShow: false
    };
  },
  watch: {
    $route(to, from) {
      if (to.fullPath == "/index") {
        this.navActive = 0;
      } else {
        if (to.query.id == undefined || to.path == "/search") {
          this.navActive = -1;
        } else {
          this.navActive = Number(to.query.id);
        }
      }
      window.$store.commit("setNavActive", this.navActive);
    },
  },
  methods: {
    showLogin(show) {
      this.loginShow = show;
    },
    showRegister(show) {
      this.registerShow = show;
    },
  },
};
</script>
<style>
.el-input--small .el-input__inner {
  height: 50px !important;
}
.el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
.el-form-item--small .el-form-item__label {
  font-size: 16px !important;
  color: #000000;
}
</style>