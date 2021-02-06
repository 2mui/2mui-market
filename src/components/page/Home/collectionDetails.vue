<template>
  <div class="collectionDetails">
    <div class="banner">
      <div class="banner_mask">
        <div class="banner_avatar">
          <img :src="require('@/assets/img/girl.jpg')" alt="" />
          <ul>
            <li>王晓喵</li>
            <li>ID 625789000</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main_title">
        <div>
          <span>APP界面</span>
          <span>50个收藏</span>
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
          @click="handleDetails()"
          class="card"
        >
          <div class="img">
            <img :src="item.item.cover ? item.item.cover : images" alt="" />
          </div>
          <div class="mould">
            <div class="mould_warp">
              <div class="collection" @click.stop="handleCollection()">
                <img
                  :src="require('@/assets/img/collection_active.png')"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="card_footer">
            <li class="card_footer_left">
              <span>{{ item.item.title }}</span
              ><span>{{
                categoriesId.filter((item) => {
                  return item.id == 2;
                })[0].name
              }}</span>
            </li>
          </div>
        </div>
      </div>
      <div class="main_footer">
        <div class="main_footer_warp">
          <el-button>首页</el-button>
          <el-button>上一页</el-button>
          <el-pagination background layout="pager" :page-size="10" :total="50">
          </el-pagination>
          <el-button>下一页</el-button>
          <el-button>尾页</el-button>
        </div>
      </div>
    </div>
    <Footer :colorConfirm="colorConfirm" />
    <Exhibition v-if="isDetails" />
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
        <div>确定</div>
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
        <div>确定</div>
        <div @click="handleCancel">取消</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Footer from "../../common/Footer";
import Exhibition from "../../common/Exhibition";
import gql from "graphql-tag";

export default {
  components: {
    Footer,
    Exhibition,
  },
  data() {
    return {
      userInfo: {},
      images: require("@/assets/img/default.jpg"),
      categoriesId: window.$store.state.categoriesId,
      dialogEdit: false,
      dialogVisible: false,
      isDetails: false,
      colorConfirm: "#F5F5F5",
      title: "",
      id: "",
      dataList: [],
    };
  },
  methods: {
    handleCollection() {},
    handleEdit() {
      this.dialogEdit = true;
    },
    handleDel() {
      this.dialogVisible = true;
    },
    handleCancel() {
      this.dialogEdit = false;
      this.dialogVisible = false;
    },
    handleDetails() {
      this.isDetails = true;
    },
    handleGetData(id, suerId) {
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
                where: {folder_id: {_eq: "${id}"}, user_id: {_eq: "${suerId}"}}
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
                  }
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          //   this.total = data.data.items_aggregate.aggregate.count;
          //   this.totalPage = Math.ceil(this.total / this.limit);
          this.dataList = data.data.likes;
        });
    },
  },
  created() {
    this.id = this.$route.query.id;
    this.userInfo = window.$store.state.userInfo;
    this.handleGetData(this.id, this.userInfo.id);
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
    max-width: 1740px;
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
        padding: 0 10px;
        margin-bottom: 50px;
        box-sizing: border-box;
        float: left;
        position: relative;
        > img {
          width: 100%;
          height: 303px;
          border-radius: 14px;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }
        .mould {
          display: none;
          width: 100%;
          height: 97px;
          padding: 0 10px;
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

