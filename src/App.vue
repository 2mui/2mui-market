<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  watch: {
    $route(to, from) {
      console.log(to, from, "app");
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