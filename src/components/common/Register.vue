<template>
  <div class="box">
    <el-dialog
      class="indexMould"
      :visible.sync="dialogCollection"
      :close-on-click-modal="false"
      :before-close="handleClose"
      top="5%"
      width="1040px"
    >
      <div class="warp">
        <div class="register">
          <div class="register_left"></div>
          <div class="register_right">
            <div class="right_title">
              <span>新用户注册</span>
            </div>
            <div class="login_form">
              <el-form
                :label-position="labelPosition"
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="用户名" prop="login">
                  <el-input
                    v-model="ruleForm.login"
                    placeholder="账号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="ruleForm.email"
                    placeholder="邮箱"
                  ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="encrypted_password">
                  <el-input
                    v-model="ruleForm.encrypted_password"
                    type="password"
                    placeholder="密码"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class="submit" @click="submitForm('ruleForm')"
                    >创建账户</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gql from "graphql-tag";
var insertFoldersGql = gql`
  mutation insertFolders(
    $name: String!
    $user_id: bigint!
    $updated_at: timestamp!
    $created_at: timestamp!
  ) {
    insert_folders(
      objects: {
        name: $name
        user_id: $user_id
        updated_at: $updated_at
        created_at: $created_at
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
var MutationRegisterGql = gql`
  mutation register(
    $login: String!
    $encrypted_password: String!
    $email: String!
    $created_at: timestamp!
    $updated_at: timestamp!
  ) {
    insert_users(
      objects: {
        login: $login
        encrypted_password: $encrypted_password
        email: $email
        created_at: $created_at
        updated_at: $updated_at
      }
    ) {
      returning {
        admin
        avatar
        cid
        city
        created_at
        email
        encrypted_password
        first_name
        gender
        id
        login
        mobile_phone
        name
        nickname
        occupation
        qq
      }
    }
  }
`;
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    return {
      dialogCollection: true,
      labelPosition: "top",
      ruleForm: {
        login: "",
        encrypted_password: "",
        email: "",
        created_at: "now",
        updated_at: "now",
      },
      rules: {
        login: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        encrypted_password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
      },
    };
  },
  computed: {
    userInfo() {
      return window.$store.state.userInfo;
    },
  },
  methods: {
    // 注册提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let password = this.$md5(this.ruleForm.encrypted_password);
          this.$apollo
            .mutate({
              // 更新的语句
              mutation: MutationRegisterGql,
              // 实参列表
              variables: {
                login: this.ruleForm.login,
                encrypted_password: password,
                email: this.ruleForm.email,
                created_at: this.ruleForm.created_at,
                updated_at: this.ruleForm.updated_at,
              },
            })
            .then((response) => {
              // 输出获取的数据集
              this.$message({
                message: "恭喜你，注册成功！",
                type: "success",
              });
              window.$store.commit(
                "setUserInfo",
                response.data.insert_users.returning[0]
              );
              this.$root.$children[0].showRegister(false);
              // 注册成功新建一个默认文件夹
              // this.handleAddfolder();
              // // 获取所有文件夹
              // this.handleGetFolder();
            })
            .catch((err) => {
              // 捕获错误
              this.$message({
                message: "错了哦！邮箱已存在",
                type: "error",
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增文件夹
    handleAddfolder() {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: insertFoldersGql,
          // 实参列表
          variables: {
            user_id: this.userInfo.id,
            name: "默认文件夹",
            created_at: "now",
            updated_at: "now",
          },
        })
        .then((response) => {})
        .catch((err) => {});
    },
    // 查询所有文件夹
    handleGetFolder() {
      this.$apollo
        .query({
          query: gql`
            {
              folders(
                where: {user_id: {_eq: "${this.userInfo.id}"}}
              ) {
                name
                id
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          window.$store.commit("setFolder", data.data.folders);
        });
    },
    handleClose() {
      this.$root.$children[0].showRegister(false);
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.box {
  /deep/ {
    .el-dialog {
      border-radius: 14px;
      .el-dialog__header {
        padding: 0;
        .el-dialog__headerbtn {
          color: #333333;
          z-index: 9;
        }
        .el-dialog__headerbtn:focus .el-dialog__close,
        .el-dialog__headerbtn:hover .el-dialog__close {
          color: #333333;
        }
      }
      .el-dialog__body {
        padding: 0;
        .warp {
          height: 760px;
          .register {
            width: 100%;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: #fff;
            overflow: hidden;
            //   width: 100vw;
            //   height: 100vh;
            //   background: #fff;
            .register_left {
              width: 478px;
              height: 100%;
              background: url("../../assets/img/login.png") no-repeat center;
              background-size: cover;
            }
            .register_right {
              font-family: Source Han Sans CN;
              width: 400px;
              height: 600px;
              position: absolute;
              left: 560px;
              top: 50%;
              transform: translateY(-50%);
              .right_title {
                text-align: center;
                span {
                  font-size: 20px;
                  font-weight: bold;
                  line-height: 34px;
                  color: #000000;
                  opacity: 1;
                }
                margin-bottom: 41px;
              }
              .right_title:before {
                content: "";
                width: 140px;
                height: 1px;
                background: #d3d3d3;
                margin: 16px 0;
                float: left;
              }
              .right_title:after {
                content: "";
                width: 140px;
                height: 1px;
                background: #d3d3d3;
                margin: 16px 0;
                float: right;
              }

              .submit {
                width: 100%;
                height: 50px;
                background: #fff94b;
                border: none;
                border-radius: 80px;
                font-size: 18px;
                margin-top: 30px;
                line-height: 36px;
                color: #000000;
              }
              .submit:hover {
                background: #e9e327;
              }
            }
            .el-input__inner {
              font-size: 16px;
              color: #999999;
            }
            .el-input.is-active .el-input__inner,
            .el-input__inner:focus {
              border-color: #000000;
              color: #333333;
            }
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

