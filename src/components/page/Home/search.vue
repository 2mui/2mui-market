<template>
  <div class="search">
    <div class="main">
      <div class="main_content">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          @click="handleDetails(item, index)"
          class="card"
        >
          <div class="img">
            <img :src="item.cover ? item.cover : images" alt="" />
          </div>
          <div class="mould">
            <div class="mould_warp">
              <div class="edit">
                <i
                  @click.stop="
                    handleCollection(item.id, item.collection, index)
                  "
                  class="iconfont iconhuaban1fuben9"
                ></i>
                <i
                  @click.stop="optCollection(item.id, index)"
                  class="iconfont iconhuaban1fuben15"
                ></i>
              </div>
              <div class="folder" @click.stop="addCollection">
                <i class="iconfont iconhuaban1fuben61"></i>
              </div>
            </div>
          </div>
          <div class="card_footer">
            <li class="card_footer_left">
              <span>{{ item.title }}</span
              ><span>{{
                categoriesId.filter((e) => {
                  return e.id == item.category_id;
                })[0].name
              }}</span>
            </li>
            <div class="card_footer_right">
              <li>
                <i class="iconfont iconhuaban1fuben11"></i>
                {{ item.downloads_count }}
              </li>
              <li>
                <i
                  v-if="item.collection"
                  class="iconfont iconhuaban1fuben10"
                ></i>
                <i v-else class="iconfont iconhuaban1fuben9"></i>
                {{ item.likes_count }}
              </li>
            </div>
          </div>
        </div>
      </div>
      <div class="main_footer">
        <div class="main_footer_warp">
          <el-button @click="homePage">首页</el-button>
          <el-button @click="previousPage">上一页</el-button>
          <el-pagination
            background
            layout="pager"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="limit"
            :total="total"
          >
          </el-pagination>
          <el-button @click="nextPage">下一页</el-button>
          <el-button @click="lastPage">尾页</el-button>
        </div>
      </div>
    </div>
    <Footer :colorConfirm="colorConfirm" />
    <!-- 详情 -->
    <Exhibition :detailsData="detailsData" v-if="isDetails" />
    <!-- 新增文件夹 -->
    <AddFolder v-if="dialogCollection" />
    <!-- 收藏到文件夹 -->
    <OptCollection
      :itemId="itemId"
      :likeIndex="likeIndex"
      v-if="dialogOptCollection"
    />
  </div>
</template>

<script>
import Bus from "../../common/bus";
import Footer from "../../common/Footer";
import Exhibition from "../../common/Exhibition";
import AddFolder from "./mould/AddFolder";
import OptCollection from "./mould/OptCollection";
import gql from "graphql-tag";
var getLikeGql = gql`
  mutation insert_like(
    $item_id: bigint!
    $folder_id: bigint!
    $user_id: bigint!
    $updated_at: timestamp!
    $created_at: timestamp!
  ) {
    insert_likes(
      objects: {
        user_id: $user_id
        folder_id: $folder_id
        item_id: $item_id
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
// 收藏次数添加
var updateLikeGql = gql`
  mutation update_likes($likes_count: Int!, $id: bigint!) {
    update_items_by_pk(
      _inc: { likes_count: $likes_count }
      pk_columns: { id: $id }
    ) {
      likes_count
    }
  }
`;
export default {
  components: {
    Footer,
    Exhibition,
    AddFolder,
    OptCollection,
  },
  metaInfo() {
    return {
      title: "素材",
      id: "",
      meta: [
        { name: "keywords", content: "this.description" },
        { name: "description", content: "this.description" },
      ],
    };
  },
  data() {
    return {
      dialogCollection: false,
      dialogOptCollection: false,
      isDetails: false,
      detailsData: {},
      listIndex: null,

      categoriesId: window.$store.state.categoriesId,
      colorConfirm: "#F5F5F5",
      //分页
      limit: 20,
      offset: 0,
      page: 1,
      total: null,
      totalPage: null,
      itemId: null,
      likeIndex: null,
      //搜索条件
      category: "",
      searchTitle: "",

      dataList: [],
      images: require("@/assets/img/default.jpg"),
    };
  },
  computed: {
    userInfo() {
      return window.$store.state.userInfo;
    },
    folder() {
      return window.$store.state.folder;
    },
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.query.id == 0) {
          this.category = "";
        } else {
          this.category = "category_id: {_eq: " + this.$route.query.id + "}";
        }
        if (this.$route.query.searchVal == "") {
          this.searchTitle = "%%";
        } else {
          this.searchTitle = "%" + this.$route.query.searchVal + "%";
        }
        this.getDataList(
          this.limit,
          this.offset,
          this.category,
          this.searchTitle
        );
      },
      deep: true,
    },
  },
  methods: {
    // 收藏到默认第一个
    handleCollection(id, collection, index) {
      if (Object.keys(this.userInfo).length) {
        if (!collection) {
          // 收藏判断是否存在文件夹
          if (this.folder.length) {
            this.handleFristFolder(id, index);
          }
          this.handleAddfolder(id,index);
        } else {
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
              this.handleUpdateLike(-1, id, index);
              this.$set(this.dataList[index], "collection", false);
            })
            .catch((err) => {});
        }
      } else {
        this.$root.$children[0].showLogin(true);
      }
    },
    // 收藏到第一个文件夹
    handleFristFolder(id, index) {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: getLikeGql,
          // 实参列表
          variables: {
            item_id: id,
            folder_id: this.folder[0].id,
            user_id: this.userInfo.id,
            created_at: "now",
            updated_at: "now",
          },
        })
        .then((response) => {
          // 输出获取的数据集
          this.$message({
            message: "收藏成功！",
            type: "success",
          });
          this.handleUpdateLike(1, id, index);
          this.$set(this.dataList[index], "collection", true);
        })
        .catch((err) => {
          // this.$message({
          //   message: "错了哦！收藏失败",
          //   type: "error",
          // });
        });
    },
    // 新增文件夹
    handleAddfolder(id, index) {
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
        .then((response) => {
          this.handleGetFolder(id, index);
        })
        .catch((err) => {});
    },
    // 查询所有文件夹
    handleGetFolder(id, index) {
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
          this.handleFristFolder(id, index);
        });
    },
    //收藏次数添加
    handleUpdateLike(count, id, index) {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: updateLikeGql,
          // 实参列表
          variables: {
            likes_count: count,
            id: id,
          },
        })
        .then((response) => {
          this.$set(this.dataList[index], "likes_count", response.data.update_items_by_pk.likes_count);
        })
        .catch((err) => {});
    },
    // 收藏选择文件夹
    optCollection(id, index) {
      if (Object.keys(this.userInfo).length) {
        this.itemId = id;
        this.likeIndex = index;
        this.dialogOptCollection = true;
      } else {
        this.$root.$children[0].showLogin(true);
      }
    },
    // 新增收藏
    addCollection() {
      if (Object.keys(this.userInfo).length) {
        this.dialogCollection = true;
      } else {
        this.$root.$children[0].showLogin(true);
      }
    },
    // 上一个
    upper() {
      this.listIndex--;
      if (this.listIndex < 0) {
        this.$message("没有更多了");
        this.listIndex = 0;
      } else {
        this.handleDetails(this.dataList[this.listIndex], this.listIndex);
      }
    },
    // 下一个
    lower() {
      this.listIndex++;
      if (this.listIndex >= this.dataList.length) {
        this.$message("没有更多了");
        this.listIndex = this.dataList.length - 1;
      } else {
        this.handleDetails(this.dataList[this.listIndex], this.listIndex);
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
      this.getDataList(
        this.limit,
        this.offset,
        this.category,
        this.searchTitle
      );
    },
    // 首页
    homePage() {
      this.page = 1;
      this.offset = 0;
      this.getDataList(
        this.limit,
        this.offset,
        this.category,
        this.searchTitle
      );
    },
    // 尾页
    lastPage() {
      this.page = this.totalPage;
      this.offset = this.limit * (this.page - 1);
      this.getDataList(
        this.limit,
        this.offset,
        this.category,
        this.searchTitle
      );
    },
    // 上一页
    previousPage() {
      if (this.page > 1) {
        this.page--;
        this.offset = this.limit * (this.page - 1);
        this.getDataList(
          this.limit,
          this.offset,
          this.category,
          this.searchTitle
        );
      }
    },
    // 下一页
    nextPage() {
      if (this.page < this.totalPage) {
        this.page++;
        this.offset = this.limit * (this.page - 1);
        this.getDataList(
          this.limit,
          this.offset,
          this.category,
          this.searchTitle
        );
      }
    },
    // 页面数据
    getDataList(limit, offset, category, title) {
      this.$apollo
        .query({
          query: gql`
            {
              items_aggregate {
                aggregate {
                  count
                }
              }
              items(
                where: {
                  draft: { _eq: false }
                  _or: { ${category}, title: {_like: "${title}"} }
                }, limit: ${limit}, offset: ${offset}
              ) {
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
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.total = data.data.items_aggregate.aggregate.count;
          this.totalPage = Math.ceil(this.total / this.limit);
          this.dataList = data.data.items;
          // 判断是否登录执行收藏查询
          if (Object.keys(this.userInfo).length) {
            for (let i in this.dataList) {
              this.handleJudgeLike(this.dataList[i].id, this.userInfo.id, i);
            }
          }
        });
    },
    // 收藏查询
    handleJudgeLike(item_id, user_id, index) {
      this.$apollo
        .query({
          query: gql`
            {
              likes(
                where: {item_id: {_eq: "${item_id}"},user_id: {_eq: "${user_id}"}}
              ) {
                id
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.$set(
            this.dataList[index],
            "collection",
            data.data.likes.length ? true : false
          );
        });
    },
  },
  created() {
    if (this.$route.query.id == 0) {
      this.category = "";
    } else {
      this.category = "category_id: {_eq: " + this.$route.query.id + "}";
    }
    if (this.$route.query.searchVal == "") {
      this.searchTitle = "%%";
    } else {
      this.searchTitle = "%" + this.$route.query.searchVal + "%";
    }
    this.getDataList(this.limit, this.offset, this.category, this.searchTitle);
    // 文件夹收藏操作
    Bus.$on("collectionSuccess", (val) => {
      this.$set(this.dataList[val], "collection", true);
    });
  },
};
</script>
<style lang="scss" scoped>
.search {
  width: 100%;
  img {
    width: 100%;
  }
  .main {
    margin: 0 auto;
    margin-top: 50px;
    max-width: 1740px;
    min-width: 1200px;
    .main_search {
      padding: 50px 20px;
      box-sizing: border-box;
      .search_list {
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .label {
          font-size: 16px;
          font-weight: 400;
          color: #666666;
          margin-right: 60px;
        }
        /deep/ {
          .el-radio-group {
            .el-radio-button .el-radio-button__inner {
              border-radius: 100px;
            }
            .el-radio-button__orig-radio:checked + .el-radio-button__inner {
              background: #fff94b;
              color: #333333;
              border-color: #fff94b;
              box-shadow: none;
            }
            .el-radio-button__inner {
              border: none;
            }
            .el-radio-button__inner:hover {
              color: #333333;
            }
            .el-radio-button--small .el-radio-button__inner {
              padding: 14px 33px;
              font-size: 16px;
              font-weight: 400;
              color: #333333;
            }
          }
        }
      }
      .search_list:last-child {
        margin-bottom: 0;
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
            div:first-child {
              width: 80px;
              height: 40px;
              padding: 0 15px;
              box-sizing: border-box;
              border-radius: 40px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              img:nth-child(1) {
                width: 18px;
                height: 14px;
              }
              img:nth-child(2) {
                width: 12px;
                height: 8px;
                padding: 5px;
              }
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
}
</style>

