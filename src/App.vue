<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navActive: 0,
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