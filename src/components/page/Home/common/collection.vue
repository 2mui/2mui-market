<template>
  <div class="collection">
    <div class="main_content">
      <div
        @click="handleDetails(item.id)"
        v-for="(item, index) in dataList"
        :key="index"
        class="card"
      >
        <div class="img imgWarp">
          <div class="imgList" v-for="(item, index) in item.likes" :key="index">
            <img :src="item.item.cover" alt="" />
          </div>
          <div class="imgList"></div>
          <div class="imgList"></div>
          <div class="imgList"></div>
          <!-- <img class="img" :src="images" alt="" /> -->
        </div>
        <div class="mould">
          <div class="mould_warp">
            <div class="edit" @click.stop="handleEdit(item.id, item.name)">
              <i class="iconfont iconhuaban1fuben81"></i>
            </div>
            <div class="dle" @click.stop="handleDel(item.id)">
              <i class="iconfont iconhuaban1fuben14"></i>
            </div>
          </div>
        </div>
        <div class="card_footer">
          <li class="card_footer_left">
            <span>{{ item.name }}</span
            ><span>{{ item.likes_aggregate.aggregate.count }}</span>
          </li>
        </div>
      </div>
      <div class="card addFolder" @click="handleAddFolder">
        <div class="img">
          <div>
            <img
              :src="require('@/assets/img/add_folder.png')"
              alt=""
              srcset=""
            />
            <p>新建文件夹</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogEdit" :show-close="false" width="600px">
      <span slot="title">编辑收藏夹名称</span>
      <span class="edit">
        <label>标题</label>
        <el-input v-model="title" clearable></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <div @click="submitEdit">确定</div>
        <div @click="handleCancel">取消</div>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" width="600px">
      <span slot="title">删除</span>
      <span>
        <img :src="require('@/assets/img/question.png')" alt="" srcset="" />
        确定删除此文件夹？
      </span>
      <span slot="footer" class="dialog-footer">
        <div @click="submitDel">确定</div>
        <div @click="handleCancel">取消</div>
      </span>
    </el-dialog>
    <!-- 新增文件夹 -->
    <AddFolder v-if="dialogCollection" />
  </div>
</template>

<script>
import AddFolder from "../mould/AddFolder";
import gql from "graphql-tag";
var DelGql = gql`
  mutation deleteFolders($id: bigint!, $user_id: bigint!) {
    delete_folders(where: { id: { _eq: $id }, user_id: { _eq: $user_id } }) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
var EditGql = gql`
  mutation editFolders($id: bigint!, $user_id: bigint!, $name: String!) {
    update_folders(
      where: { id: { _eq: $id }, user_id: { _eq: $user_id } }
      _set: { name: $name }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
export default {
  components: {
    AddFolder,
  },
  data() {
    return {
      dialogCollection: false,
      dialogEdit: false,
      dialogVisible: false,
      title: "",
      images: require("@/assets/img/index.jpg"),
      dataList: [],
      id: "",
      userInfo: {},
    };
  },
  methods: {
    handleNav(id) {
      this.className = id;
    },
    handleEdit(id, name) {
      this.dialogEdit = true;
      this.id = id;
      this.title = name;
    },
    submitEdit() {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: EditGql,
          // 实参列表
          variables: {
            id: this.id,
            user_id: this.userInfo.id,
            name: this.title,
          },
        })
        .then((response) => {
          // 输出获取的数据集
          this.$message({
            message: "编辑成功！",
            type: "success",
          });
          this.dialogEdit = false;
          this.handleGetData(this.userInfo.id);
          this.title = "";
        })
        .catch((err) => {
          // 捕获错误
          this.$message({
            message: "错了哦！编辑失败",
            type: "error",
          });
        });
    },
    handleDel(id) {
      this.id = id;
      this.dialogVisible = true;
    },
    submitDel() {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: DelGql,
          // 实参列表
          variables: {
            id: this.id,
            user_id: this.userInfo.id,
          },
        })
        .then((response) => {
          // 输出获取的数据集
          this.$message({
            message: "删除成功！",
            type: "success",
          });
          this.dialogVisible = false;
          this.handleGetData(this.userInfo.id);
        })
        .catch((err) => {
          // 捕获错误
          this.$message({
            message: "错了哦！删除失败",
            type: "error",
          });
        });
    },
    handleCancel() {
      this.dialogEdit = false;
      this.dialogVisible = false;
    },
    handleDetails(id) {
      this.$router.push({
        path: "/collection_details",
        query: { id: id },
      });
    },
    // 获取已有的文件夹
    handleGetData(id) {
      this.$apollo
        .query({
          query: gql`
            {
              folders(
                where: {user_id: {_eq: "${id}"}}
              ) {
                name
                id
                likes {
                  item {
                    cover
                  }
                }
                likes_aggregate {
                  aggregate {
                    count
                  }
                }
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          //   this.total = data.data.items_aggregate.aggregate.count;
          //   this.totalPage = Math.ceil(this.total / this.limit);
          this.dataList = data.data.folders;
          window.$store.commit("setFolder", data.data.folders);
        });
    },
    handleAddFolder() {
      this.dialogCollection = true;
    },
  },
  created() {
    this.userInfo = window.$store.state.userInfo;
    this.handleGetData(this.userInfo.id);
  },
};
</script>
<style lang="scss" scoped>
.collection {
  width: 100%;
  .main_content {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
    .card {
      cursor: pointer;
      width: 25%;
      padding: 0 7.5px;
      margin-bottom: 50px;
      box-sizing: border-box;
      float: left;
      position: relative;
      .imgWarp {
        width: 100%;
        height: 315px;
        border-radius: 14px;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
        transition: all 0.2s;
        overflow: hidden;
        background: #f5f5f5;
        .imgList {
          width: 50%;
          height: 50%;
          float: left;
          overflow: hidden;
          img {
            border-radius: 0;
            object-fit: cover;
          }
        }
      }
      .mould {
        display: none;
        width: 100%;
        height: 97px;
        padding: 0 7.5px;
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        .mould_warp {
          width: 100%;
          height: 97px;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(128, 128, 128, 0) 100%
          );
          opacity: 1;
          border-radius: 14px;
          padding: 20px 0 0 20px;
          box-sizing: border-box;
          display: flex;
          div {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            margin-right: 20px;
          }
          div:last-child {
            margin-right: 0;
          }
        }
      }
      .card_footer {
        height: 50px;
        font-size: 18px;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .card_footer_left {
          width: 100%;
          display: flex;
          justify-content: space-between;
          span:last-child {
            background: #000000;
            opacity: 0.5;
            font-size: 16px;
            color: white;
            padding: 4px 14px;
            box-sizing: border-box;
            border-radius: 20px;
          }
        }
      }
    }
    .card:hover {
      > img {
        transition: all 1s;
        // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
      }
      .mould {
        display: block;
      }
    }
    .addFolder {
      cursor: pointer;
      width: 25%;
      background: #ffffff;
      border: 1px dashed #000000;
      opacity: 1;
      border-radius: 14px;
      padding: 0 7.5px;
      margin-bottom: 50px;
      box-sizing: border-box;
      float: left;
      position: relative;
      .img {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 90px;
          height: 75px;
          border-radius: initial;
          box-shadow: none;
        }
        p {
          font-size: 20px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 41px;
          color: #333333;
        }
      }
    }
  }
  .main_content::after {
    content: "";
    display: block;
    clear: both;
  }
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
          div:hover {
            background: #535353;
            border-color: #535353;
            color: white;
          }
        }
      }
    }
  }
}
</style>

