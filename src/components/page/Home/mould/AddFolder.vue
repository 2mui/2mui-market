<template>
  <div class="addFolder">
    <el-dialog
      class="indexMould"
      :visible.sync="dialogCollection"
      :show-close="false"
      width="540px"
    >
      <span slot="title">新建文件夹</span>
      <span class="edit">
        <el-input
          v-model="title"
          clearable
          placeholder="请输入文件夹名称"
        ></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <div>确定</div>
        <div @click="handleCancel">取消</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
    };
  },
  props: {
    dialogCollection: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleCancel() {
        this.$parent.dialogCollection = false;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.addFolder {
  /deep/ {
    .el-dialog {
      border-radius: 14px;
      .el-dialog__header {
        text-align: center;
        padding: 20px 20px 20px;
        position: relative;
        span {
          font-size: 24px;
          font-weight: 400;
          color: #333333;
          position: relative;
          z-index: 1;
        }
        span::after {
          content: "";
          width: 100%;
          height: 25px;
          background: #fff94b;
          position: absolute;
          left: 50%;
          bottom: -9px;
          z-index: -1;
          transform: translateX(-50%);
        }
      }
      .el-dialog__header::after {
        content: "";
        width: 80%;
        height: 1px;
        background: #d3d3d3;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
      .el-dialog__body {
        font-size: 18px;
        display: flex;
        justify-content: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            margin-right: 20px;
          }
        }
        .edit {
          width: 400px;
          label {
            width: 50px;
            font-size: 18px;
            color: #999999;
          }
          .el-input.is-active .el-input__inner,
          .el-input__inner:focus {
            border-color: #dbdbdb;
          }
        }
      }
      .el-dialog__footer {
        text-align: center;
        .dialog-footer {
          div {
            cursor: pointer;
            width: 144px;
            height: 50px;
            line-height: 50px;
            display: inline-block;
            background: #000000;
            border: 1px solid #000000;
            border-radius: 114px;
            margin-right: 20px;
            color: white;
            font-size: 18px;
          }
          div:last-child {
            background: white;
            color: #000000;
          }
        }
      }
    }
  }
}
</style>

