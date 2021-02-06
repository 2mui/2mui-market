<template>
  <div class="record">
    <div class="main_content">
      <div v-for="(item, index) in dataList" :key="index" class="card">
        <div class="img">
          <img :src="item.cover ? item.cover : images" alt="" />
        </div>
        <div class="mould">
          <div class="mould_warp">
            <div class="dle" @click.stop="handleDel(item.item.id)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </div>
        <div class="card_footer">
          <li class="card_footer_left">
            <span>{{ item.item.title }}</span
            ><span>{{ categoriesId.filter((item) => { return item.id == 2 })[0].name }}</span>
          </li>
          <div class="card_footer_right">
            <li>
              <img
                :src="require('@/assets/img/download.png')"
                alt=""
                srcset=""
              />
              {{ item.item.downloads_count }}
            </li>
            <li>
              <img
                :src="require('@/assets/img/collection.png')"
                alt=""
                srcset=""
              />
              {{ item.item.likes_count }}
            </li>
          </div>
        </div>
      </div>
    </div>
    <div class="record_footer" v-if="dataList.length">
      <div class="empty" @click="handleEmpty">清空浏览记录</div>
    </div>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" width="600px">
      <span slot="title">删除</span>
      <span>
        <img :src="require('@/assets/img/question.png')" alt="" srcset="" />
        确定删除此浏览记录？
      </span>
      <span slot="footer" class="dialog-footer">
        <div @click="submitDel">确定</div>
        <div @click="handleCancel">取消</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import gql from "graphql-tag";
var DelGql = gql`
  mutation deleteItem($item_id: bigint!, $user_id: bigint!) {
    delete_browse_histories(
      where: { item_id: { _eq: $item_id }, user_id: { _eq: $user_id } }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;
export default {
  data() {
    return {
      dialogVisible: false,
      dataList: [],
      item_id: "",
      userInfo: {},
      categoriesId: window.$store.state.categoriesId,
      images: require("@/assets/img/default.jpg"),
    };
  },
  methods: {
    handleNav(id) {
      this.className = id;
    },
    handleDel(id) {
      this.item_id = id;
      this.dialogVisible = true;
    },
    submitDel() {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: DelGql,
          // 实参列表
          variables: {
            item_id: this.item_id,
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
      this.dialogVisible = false;
    },
    handleGetData(id) {
      this.$apollo
        .query({
          query: gql`
            {
              browse_histories_aggregate {
                aggregate {
                  count
                }
              }
              browse_histories(
                where: {user_id: {_eq: "${id}"}}
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
          this.dataList = data.data.browse_histories;
        });
    },
    // 清空
    handleEmpty() {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: gql`
            mutation {
              delete_browse_histories(where: {}) {
                affected_rows
                returning {
                  id
                }
              }
            }
          `,
          // 实参列表
          variables: {},
        })
        .then((response) => {
          // 输出获取的数据集
          this.$message({
            message: "清除成功！",
            type: "success",
          });
          this.dialogVisible = false;
          this.handleGetData(this.userInfo.id);
        })
        .catch((err) => {
          // 捕获错误
          this.$message({
            message: "错了哦！清除失败",
            type: "error",
          });
        });
    },
  },
  mounted() {
    this.userInfo = window.$store.state.userInfo;
    this.handleGetData(this.userInfo.id);
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.record {
  width: 100%;
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
      > .img {
        width: 100%;
        height: 303px;
        border-radius: 14px;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
        transition: all 0.2s;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 14px;
        }
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
          .dle {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
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
        .card_footer_right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 16px;
            color: #333333;
            margin-left: 10px;
            img {
              width: 18px;
              height: 14px;
            }
          }
          li:first-child {
            margin-left: 0;
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
  .record_footer {
    margin-bottom: 90px;
    .empty {
      margin: 0 auto;
      cursor: pointer;
      width: 190px;
      height: 50px;
      border: 1px solid #000000;
      opacity: 1;
      border-radius: 114px;
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 50px;
      text-align: center;
      color: #000000;
    }
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
          width: 52px;
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
        text-align: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            margin-right: 20px;
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

