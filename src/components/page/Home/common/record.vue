<template>
  <div class="record">
    <div class="main_content">
      <div v-for="(item, index) in dataList" :key="index" class="card">
        <div class="img" @click="handleDetails(item.item, index)">
          <img :src="item.item.cover ? item.item.cover : images" alt="" />
        </div>
        <div class="mould">
          <div class="mould_warp">
            <div class="dle" @click.stop="handleDel(item.item.id)">
              <i class="iconfont iconhuaban1fuben14"></i>
            </div>
          </div>
        </div>
        <div class="card_footer">
          <li class="card_footer_left">
            <span>{{
              categoriesId.filter((e) => {
                return e.id == item.item.category_id;
              })[0].name
            }}</span>
            <span>{{ item.item.title }}</span>
            <p>{{ item.item.title }}</p>
          </li>
          <!-- <div class="card_footer_right">
            <li>
              <i class="iconfont iconhuaban1fuben11"></i>
              {{ item.item.downloads_count }}
            </li>
            <li>
              <i
                v-if="item.item.likes.length"
                class="iconfont iconhuaban1fuben10"
              ></i>
              <i v-else class="iconfont iconhuaban1fuben9"></i>
              {{ item.item.likes_count }}
            </li>
          </div> -->
        </div>
      </div>
    </div>
    <div class="record_footer" v-if="dataList.length">
      <div class="empty" @click="handleEmpty">清空浏览记录</div>
    </div>
    <el-dialog
      class="del-dialog"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="600px"
    >
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
    <!-- 详情 -->
    <Exhibition :detailsData="detailsData" :isItem="isItem" v-if="isDetails" />
  </div>
</template>

<script>
import Exhibition from "../../../common/Exhibition";
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
  components: {
    Exhibition,
  },
  data() {
    return {
      dialogVisible: false,
      isDetails: false,
      isItem: true,
      detailsData: {},
      listIndex: null,
      dataList: [],
      item_id: "",
      userInfo: {},
      categoriesId: window.$store.state.categoriesId,
      images: require("@/assets/img/default.jpg"),
    };
  },
  methods: {
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
                  filetype
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
          for (let i in this.dataList) {
            this.$set(this.dataList[i].item, "likes", []);
          }
          this.handleQueryLike(this.userInfo.id);
        });
    },
    // 收藏查询
    handleQueryLike(id) {
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
                  filetype
                  likes(where: {user_id: {_eq: "${id}"}}) {
                    id
                  }
                }
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
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
      padding: 0 7.5px;
      margin-bottom: 50px;
      border-radius: 14px;
      box-sizing: border-box;
      float: left;
      position: relative;
      overflow: hidden;
      > .img {
        width: 100%;
        height: 315px;
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
          .dle {
            width: 40px;
            height: 40px;
            padding: 0;
            display: flex;
            justify-content: center;
            background: white;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
          }
        }
      }
      .card_footer {
        height: 73px;
        font-size: 18px;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .card_footer_left {
          cursor: default;
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
          span:first-child {
            // background: #d3d3d3;
            border: 1px solid #707070;
            font-size: 14px;
            color: #333333;
            padding: 4px 14px;
            box-sizing: border-box;
            border-radius: 20px;
            margin-right: 10px;
          }
          span:nth-child(2) {
            display: inline-block;
            font-size: 18px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p {
            background: white;
            display: none;
            padding: 2px 5px;
            position: absolute;
            top: 30px;
            font-size: 12px;
            color: #666666;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
              0 0 6px rgba(0, 0, 0, 0.04);
          }
        }
        .card_footer_left:hover {
          p {
            display: block;
          }
        }
        .card_footer_right {
          display: flex;
          align-items: center;
          justify-content: space-between;
          li {
            display: flex;
            align-items: baseline;
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
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
      .img {
        transition: all 1s;
        transform: scale(1.05, 1.05);
        img {
          border-radius: 14px 14px 0 0;
        }
      }
      > img {
        transition: all 1s;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
      }
      .mould {
        transform: scale(1.05, 1.05);
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
    .empty:hover {
      background: #535353;
      border-color: #535353;
      color: white;
    }
  }
  /deep/ {
    .del-dialog {
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

