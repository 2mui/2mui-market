<template>
  <div class="search">
    <div class="main">
      <div class="main_content">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          class="card"
          @click="handleDetails(item, index)"
        >
          <div class="img">
            <img :src="item.cover ? item.cover : images" alt="" />
          </div>
          <div class="mould">
            <div class="mould_warp">
              <div class="mould_btn">
                <div
                  class="mould_btn_list"
                  @click.stop="handleDowload(item.url, item.id)"
                >
                  <div>
                    <i class="iconfont iconhuaban1fuben11"></i>
                  </div>
                  <p>{{ item.downloads_count }}次下载</p>
                </div>
                <div
                  class="mould_btn_list"
                  @click.stop="
                    item.likes.length
                      ? handleCollection(item.id, item.likes, index)
                      : optCollection(item.id, index)
                  "
                >
                  <div>
                    <i
                      v-if="item.likes.length"
                      class="iconfont iconhuaban1fuben10"
                    ></i>
                    <i v-else class="iconfont iconhuaban1fuben9"></i>
                  </div>
                  <p>{{ item.likes_count }}次收藏</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card_footer">
            <li class="card_footer_left">
              <span>{{
                categoriesId.filter((e) => {
                  return e.id == item.category_id;
                })[0].name
              }}</span>
              <span>{{ item.title }}</span>
              <p>{{ item.title }}</p>
            </li>
          </div>
        </div>
      </div>
      <div class="main_empty" v-if="!dataList.length">
        <div class="empty_content">
          <div class="img"></div>
          <p>没有搜索到相关内容</p>
        </div>
      </div>
      <div v-else class="main_footer">
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
            :class="totalPage ? (page == totalPage ? 'active' : '') : 'active'"
            :disabled="totalPage ? (page == totalPage ? true : false) : true"
            @click="nextPage"
            >下一页</el-button
          >
          <el-button
            :class="totalPage ? (page == totalPage ? 'active' : '') : 'active'"
            :disabled="totalPage ? (page == totalPage ? true : false) : true"
            @click="lastPage"
            >尾页</el-button
          >
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
// 新增下载记录
var insertDownloadHistoriesGql = gql`
  mutation insert_download_histories(
    $item_id: bigint!
    $user_id: bigint!
    $updated_at: timestamp!
    $created_at: timestamp!
  ) {
    insert_download_histories(
      objects: {
        user_id: $user_id
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
// 下载次数
var AddCoundGql = gql`
  mutation increase_downloads_count($id: bigint!) {
    update_items_by_pk(_inc: { downloads_count: 1 }, pk_columns: { id: $id }) {
      downloads_count
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
      title: "网页设计素材模板-素材下载-二木素材网",
      meta: [
        {
          name: "keywords",
          content: "网页设计,app设计,banner,插画,图标,3d,ae,设计",
        },
        {
          name: "description",
          content: "网页设计素材模板-素材下载-二木素材网",
        },
      ],
    };
  },
  data() {
    return {
      isStart: 1,
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
      gotop: false,
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
    page(val) {
      this.toTop();
    },
  },
  methods: {
    // 下载
    handleDowload(url, id) {
      // 判断是否登录的操作
      if (Object.keys(this.userInfo).length) {
        window.open(url);
        this.handleAddCound(id);
        this.$apollo
          .mutate({
            // 更新的语句
            mutation: insertDownloadHistoriesGql,
            // 实参列表
            variables: {
              item_id: id,
              user_id: this.userInfo.id,
              created_at: "now",
              updated_at: "now",
            },
          })
          .then((response) => {
            // 输出获取的数据集
          })
          .catch((err) => {});
      } else {
        this.$root.$children[0].showLogin(true);
      }
    },
    // 下载次数加一
    handleAddCound(id) {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: AddCoundGql,
          // 实参列表
          variables: {
            id: id,
          },
        })
        .then((response) => {
          // 输出获取的数据集
        })
        .catch((err) => {});
    },
    // 收藏到默认第一个
    handleCollection(id, collection, index) {
      if (Object.keys(this.userInfo).length) {
        if (!collection.length) {
          // 收藏判断是否存在文件夹
          if (this.folder.length) {
            this.handleFristFolder(id, index);
          }
          this.handleAddfolder(id, index);
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
              this.$set(this.dataList[index], "likes", []);
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
          this.$set(this.dataList[index], "likes", [0]);
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
          this.$set(
            this.dataList[index],
            "likes_count",
            response.data.update_items_by_pk.likes_count
          );
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
              items_aggregate(where: {_or: { ${category}, title: {_like: "${title}"} }}) {
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
                filetype
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.total = data.data.items_aggregate.aggregate.count;
          this.totalPage = Math.ceil(this.total / this.limit);
          this.dataList = data.data.items;
          for (let i in this.dataList) {
            this.$set(this.dataList[i], "likes", []);
          }
          // 判断是否登录执行收藏查询
          if (Object.keys(this.userInfo).length) {
            this.handleQueryLike(
              this.limit,
              this.offset,
              this.category,
              this.searchTitle,
              this.userInfo.id
            );
          }
        });
    },
    // 收藏查询
    handleQueryLike(limit, offset, category, title, user_id) {
      this.$apollo
        .query({
          query: gql`
            {
              items_aggregate(where: {_or: { ${category}, title: {_like: "${title}"} }}) {
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
                filetype
                likes(where: {user_id: {_eq: "${user_id}"}}) {
                  id
                }
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.total = data.data.items_aggregate.aggregate.count;
          this.totalPage = Math.ceil(this.total / this.limit);
          this.dataList = data.data.items;
        });
    },
    handleScroll() {
      let scrolltop =
        document.documentElement.scrollTop || document.body.scrollTop;
      scrolltop > 30 ? (this.gotop = true) : (this.gotop = false);
    },
    toTop() {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50;
        if (top <= 0) {
          clearInterval(timeTop);
        }
      }, 10);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, true);
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
    max-width: 1760px;
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
        padding: 0 7.5px;
        margin-bottom: 50px;
        box-sizing: border-box;
        float: left;
        position: relative;
        > .img {
          width: 100%;
          height: 315px;
          border-radius: 14px;
          box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
          transition: all 1s;
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
          height: 315px;
          padding: 0 10px;
          box-sizing: border-box;
          position: absolute;
          left: 0;
          top: 0;
          .mould_warp {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 14px 14px 0 0;
            display: flex;
            justify-content: center;
            position: relative;
            .mould_btn {
              width: 200px;
              height: 112px;
              display: flex;
              justify-content: space-between;
              position: absolute;
              bottom: 0;
              .mould_btn_list {
                div:hover {
                  background: #fff94b;
                }
                div:focus {
                  background: #e9e327;
                  outline: none;
                }
                div {
                  cursor: pointer;
                  width: 70px;
                  height: 70px;
                  background: white;
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  i {
                    font-size: 26px;
                  }
                }
                p {
                  margin-top: 11px;
                  text-align: center;
                  font-size: 12px;
                  font-weight: 400;
                  line-height: 20px;
                  color: #ffffff;
                }
              }
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
}
</style>

