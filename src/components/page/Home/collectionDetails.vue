<template>
  <div class="collectionDetails">
    <div class="banner">
      <div class="banner_mask">
        <div class="banner_avatar">
          <img :src="require('@/assets/img/girl.jpg')" alt="" />
          <ul>
            <li>{{ userInfo.login }}</li>
            <li>ID {{ userInfo.id }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main_title">
        <div>
          <span>{{ folderList.name }}</span>
          <span>{{ count }}个收藏</span>
        </div>
        <div>
          <div class="edit" @click.stop="handleEdit()">
            <i class="el-icon-edit"></i>
          </div>
          <div class="dle" @click.stop="handleDel()">
            <i class="el-icon-delete"></i>
          </div>
        </div>
      </div>
      <div class="main_content">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          @click="handleDetails(item.item, index)"
          class="card"
        >
          <div class="img">
            <img :src="item.item.cover ? item.item.cover : images" alt="" />
          </div>
          <div class="mould">
            <div class="mould_warp">
              <div
                class="collection"
                @click.stop="handleCollection(item.item.id)"
              >
                <img
                  :src="require('@/assets/img/collection_active2.png')"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="card_footer">
            <li class="card_footer_left">
              <span>{{ item.item.title }}</span
              ><span>{{
                categoriesId.filter((e) => {
                  return e.id == item.item.category_id;
                })[0].name
              }}</span>
              <p>{{ item.item.title }}</p>
            </li>
          </div>
        </div>
      </div>
      <div class="main_footer">
        <div class="main_footer_warp">
          <el-button
            :class="isStart == page ? 'active' : ''"
            :disabled="isStart == page ? true : false"
            @click="homePage"
            >首页</el-button
          >
          <el-button
            :class="isStart == page ? 'active' : ''"
            :disabled="isStart == page ? true : false"
            @click="previousPage"
            >上一页</el-button
          >
          <el-pagination
            background
            layout="pager"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="limit"
            :total="total"
          >
          </el-pagination>
          <el-button
            :class="page == totalPage ? 'active' : ''"
            :disabled="page == totalPage ? true : false"
            @click="nextPage"
            >下一页</el-button
          >
          <el-button
            :class="page == totalPage ? 'active' : ''"
            :disabled="page == totalPage ? true : false"
            @click="lastPage"
            >尾页</el-button
          >
        </div>
      </div>
    </div>
    <Footer :colorConfirm="colorConfirm" />
    <Exhibition :detailsData="detailsData" :isItem="isItem" v-if="isDetails" />
    <el-dialog
      class="collection-dialog"
      :visible.sync="dialogEdit"
      :show-close="false"
      width="600px"
    >
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
    <el-dialog
      class="collection-dialog"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="600px"
    >
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
  </div>
</template>

<script>
import Footer from "../../common/Footer";
import Exhibition from "../../common/Exhibition";
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
// 取消收藏
var deleteLikesGql = gql`
  mutation delete_likes($item_id: bigint!, $user_id: bigint!) {
    delete_likes(
      where: { user_id: { _eq: $user_id }, item_id: { _eq: $item_id } }
    ) {
      affected_rows
    }
  }
`;

export default {
  components: {
    Footer,
    Exhibition,
  },
  data() {
    return {
      isStart: 1,
      userInfo: {},
      images: require("@/assets/img/default.jpg"),
      categoriesId: window.$store.state.categoriesId,
      dialogEdit: false,
      dialogVisible: false,
      isDetails: false,
      isItem: true,
      detailsData: {},
      listIndex: null,
      colorConfirm: "#F5F5F5",
      title: "",
      id: "",
      dataList: [],
      folderList: [],
      count: null,

      //分页
      limit: 20,
      offset: 0,
      page: 1,
      total: null,
      totalPage: null,
    };
  },
  methods: {
    // 取消收藏
    handleCollection(id) {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: deleteLikesGql,
          // 实参列表
          variables: {
            item_id: id,
            user_id: this.userInfo.id,
          },
        })
        .then((response) => {
          // 输出获取的数据集
          this.$message({
            message: "取消收藏！",
            type: "success",
          });
          this.handleGetData(
            this.limit,
            this.offset,
            this.id,
            this.userInfo.id
          );
        })
        .catch((err) => {});
    },
    handleEdit() {
      this.dialogEdit = true;
      this.title = this.folderList.name;
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
          this.handleFolderdetails(this.id, this.userInfo.id);
          this.dialogEdit = false;
        })
        .catch((err) => {
          // 捕获错误
          this.$message({
            message: "错了哦！编辑失败",
            type: "error",
          });
        });
    },
    handleDel() {
      this.dialogVisible = true;
    },
    submitDel() {
      if (!this.dataList.length) {
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
            this.$router.go(-1);
            this.dialogVisible = false;
          })
          .catch((err) => {
            // 捕获错误
            this.$message({
              message: "错了哦！删除失败",
              type: "error",
            });
          });
      } else {
        this.$message({
          message: "错了哦！有收藏不能删除",
          type: "error",
        });
      }
    },
    handleCancel() {
      this.dialogEdit = false;
      this.dialogVisible = false;
    },
    // 上一个
    upper() {
      this.listIndex--;
      if (this.listIndex < 0) {
        this.$message("没有更多了");
        this.listIndex = 0;
      } else {
        this.handleDetails(this.dataList[this.listIndex].item, this.listIndex);
      }
    },
    // 下一个
    lower() {
      this.listIndex++;
      if (this.listIndex >= this.dataList.length) {
        this.$message("没有更多了");
        this.listIndex = this.dataList.length - 1;
      } else {
        this.handleDetails(this.dataList[this.listIndex].item, this.listIndex);
      }
    },
    // 详情
    handleDetails(item, index) {
      (this.listIndex = index), (this.detailsData = item);
      this.isDetails = true;
    },
    // 点击页码分页
    handleCurrentChange(val) {
      this.page = val;
      this.offset = this.limit * (val - 1);
      this.handleGetData(this.limit, this.offset, this.id, this.userInfo.id);
    },
    // 首页
    homePage() {
      this.page = 1;
      this.offset = 0;
      this.handleGetData(this.limit, this.offset, this.id, this.userInfo.id);
    },
    // 尾页
    lastPage() {
      this.page = this.totalPage;
      this.offset = this.limit * (this.page - 1);
      this.handleGetData(this.limit, this.offset, this.id, this.userInfo.id);
    },
    // 上一页
    previousPage() {
      if (this.page > 1) {
        this.page--;
        this.offset = this.limit * (this.page - 1);
        this.handleGetData(this.limit, this.offset, this.id, this.userInfo.id);
      }
    },
    // 下一页
    nextPage() {
      if (this.page < this.totalPage) {
        this.page++;
        this.offset = this.limit * (this.page - 1);
        this.handleGetData(this.limit, this.offset, this.id, this.userInfo.id);
      }
    },
    handleFolderdetails(id, userId) {
      this.$apollo
        .query({
          query: gql`
            {
              folders(
                where: {id: {_eq: "${id}"}, user_id: {_eq: "${userId}"}}
              ) {
                id
                name
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.folderList = data.data.folders[0];
        });
    },
    handleGetData(limit, offset, id, userId) {
      this.$apollo
        .query({
          query: gql`
            {
              likes_aggregate {
                aggregate {
                  count
                }
              }
              likes(
                limit: ${limit}, 
                offset: ${offset}, 
                where: {folder_id: {_eq: "${id}"}, user_id: {_eq: "${userId}"}}
              ) {
                  item{
                    cover
                    category_id
                    browses_count
                    created_at
                    description
                    detail
                    downloads_count
                    draft
                    featured
                    filesize
                    id
                    industry_id
                    likes_count
                    title
                    updated_at
                    url
                    filetype
                  }
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.total = data.data.likes_aggregate.aggregate.count;
          this.totalPage = Math.ceil(this.total / this.limit);
          this.dataList = data.data.likes;
          for (let i in this.dataList) {
            this.$set(this.dataList[i].item, "likes", [0]);
          }
        });
    },
    // 文件夹文件数量
    handleLikeCount(id) {
      this.$apollo
        .query({
          query: gql`
            {
              likes_aggregate(
                where: {folder_id: {_eq: "${id}"}}
              ) {
                aggregate {
                  count
                }
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.count = data.data.likes_aggregate.aggregate.count;
        });
    },
  },
  created() {
    this.id = this.$route.query.id;
    this.userInfo = window.$store.state.userInfo;
    this.handleFolderdetails(this.id, this.userInfo.id);
    this.handleGetData(this.limit, this.offset, this.id, this.userInfo.id);
    this.handleLikeCount(this.id);
  },
};
</script>
<style lang="scss" scoped>
.collectionDetails {
  width: 100%;
  .banner {
    width: 100%;
    height: 140px;
    background: url("../../../assets/img/backdrop.png") no-repeat center;
    background-size: cover;
    margin-bottom: 72px;
    .banner_mask {
      width: 100%;
      height: 100%;
      background: url("../../../assets/img/mask.png") no-repeat center;
      background-size: cover;
      position: relative;
      .banner_avatar {
        width: 264px;
        height: 134px;
        position: absolute;
        top: 70px;
        left: 94px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        img {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          border: 4px solid #ffffff;
          margin-right: 18px;
        }
        ul {
          li:first-child {
            font-size: 28px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #333333;
            opacity: 1;
            margin-bottom: 24px;
          }
          li:last-child {
            font-size: 16px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #666666;
            opacity: 1;
          }
        }
      }
    }
  }
  .main {
    margin: 0 auto;
    max-width: 1760px;
    min-width: 1200px;
    .main_title {
      text-align: center;
      div:first-child {
        span:nth-child(1) {
          font-size: 30px;
          font-weight: bold;
          color: #333333;
          margin-right: 62px;
          position: relative;
        }
        span:nth-child(1)::after {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #000000;
          position: absolute;
          right: -31px;
          top: 50%;
          transform: translateY(-50%);
        }
        span:nth-child(2) {
          font-size: 30px;
          font-weight: 400;
          color: #333333;
        }
      }
      > div:last-child {
        display: flex;
        justify-content: center;
        padding: 30px 0 80px 0;
        div {
          cursor: pointer;
          width: 39px;
          height: 39px;
          border: 1px solid #000000;
          background: #000000;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 40px;
          margin-right: 20px;
        }
        div:last-child {
          margin-right: 0;
          background: white;
          color: black;
        }
      }
    }
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
        > img {
          width: 100%;
          height: 315px;
          border-radius: 14px;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
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
              display: flex;
              justify-content: center;
              align-items: center;
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
            span:last-child {
              background: #d3d3d3;
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
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        }
        .mould {
          display: block;
        }
      }
    }
    .main_content::after {
      content: "";
      display: block;
      clear: both;
    }
    .main_footer {
      margin-bottom: 50px;
      display: flex;
      justify-content: center;
      .main_footer_warp {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        /deep/ {
          .el-button:focus,
          .el-button:hover {
            background: #fff94b;
            border-color: #fff94b;
            color: #333333;
          }
          .active {
            color: #999999;
          }
          .active:focus,
          .active:hover {
            background: white;
            border-color: #ebeef5;
            color: #999999;
          }
          .el-button--small,
          .el-button--small.is-round {
            height: 40px;
            padding: 2px 15px;
          }
          .el-pager li {
            width: 38px;
            height: 38px;
            line-height: 38px;
            color: #333333;
          }
          .el-pagination.is-background .el-pager li:not(.disabled).active {
            background: #fff94b;
            border: none;
          }
          .el-pagination.is-background .el-pager li:not(.disabled):hover {
            background: #fff94b;
            color: #333333;
          }
          .el-pagination.is-background .btn-next,
          .el-pagination.is-background .btn-prev,
          .el-pagination.is-background .el-pager li {
            background: white;
            border: 1px solid #c3c3c3;
          }
        }
      }
    }
  }
  .collection-dialog {
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
}
</style>

