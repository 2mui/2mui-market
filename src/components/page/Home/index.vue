<template>
  <div class="home">
    <el-carousel trigger="click" height="480px">
      <el-carousel-item v-for="(item, index) in bannerList" :key="index">
        <img :src="item.image" :alt="item.alt" />
      </el-carousel-item>
    </el-carousel>
    <!-- <div class="banner">
      <img :src="require('@/assets/img/banner.jpg')" alt="" />
    </div> -->
    <div class="main">
      <div class="main_title">
        <ul>
          <li
            @click="handleNav(item.id)"
            v-for="(item, index) in navList"
            :class="className == item.id ? 'active' : ''"
            :key="index"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
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
            <!-- <div class="mould_warp">
              <div class="edit">
                <i
                  @click.stop="handleCollection(item.id, item.likes, index)"
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
            </div> -->
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
                categoriesId.length
                  ? categoriesId.filter((e) => {
                      return e.id == item.category_id;
                    })[0].name
                  : ""
              }}</span>
              <span>{{ item.title }}</span>
              <p>{{ item.title }}</p>
            </li>
            <!-- <div class="card_footer_right">
              <li>
                <i class="iconfont iconhuaban1fuben11"></i>
                {{ item.downloads_count }}
              </li>
              <li
                @click.stop="
                  item.likes.length
                    ? handleCollection(item.id, item.likes, index)
                    : optCollection(item.id, index)
                "
              >
                <i
                  v-if="item.likes.length"
                  class="iconfont iconhuaban1fuben10"
                ></i>
                <i v-else class="iconfont iconhuaban1fuben9"></i>
                {{ item.likes_count }}
              </li>
            </div> -->
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
    <div class="partners_warp">
      <div class="partners">
        <div class="partners_title">
          <li>合作伙伴</li>
        </div>
        <div class="partners_content">
          <div class="card" v-for="(item, index) in partnerList" :key="index">
            <div class="card_list">
              <a :href="item.url" target="_blank" class="img">
                <img class="img" :src="item.image" alt="" />
              </a>
            </div>
          </div>
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
import { VclFacebook, VclInstagram } from "vue-content-loading";
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
  name: "home",
  components: {
    Footer,
    Exhibition,
    AddFolder,
    OptCollection,
    VclFacebook,
    VclInstagram,
  },
  data() {
    return {
      isStart: 1,
      dialogCollection: false,
      dialogOptCollection: false,
      isDetails: false,
      detailsData: {},
      listIndex: null,
      colorConfirm: "#ffffff",
      className: 0,
      //分页
      limit: 20,
      offset: 0,
      page: 1,
      total: null,
      totalPage: null,

      itemId: null,
      likeIndex: null,
      order: "{ likes_count: desc }",
      navList: [
        {
          id: 0,
          title: "热门",
        },
        {
          id: 1,
          title: "最新",
        },
      ],
      dataList: [],
      images: require("@/assets/img/default.jpg"),
      categoriesId: window.$store.state.categoriesId,
      partnerList: [],
      bannerList: [],
    };
  },
  watch: {
    userInfo(val) {
      this.handleGetData(this.limit, this.offset, this.order);
    },
    page(val) {
      console.log(val, this.totalPage);
    },
  },
  computed: {
    userInfo() {
      return window.$store.state.userInfo;
    },
    folder() {
      return window.$store.state.folder;
    },
    cookieUser() {
      return this.$cookies.get("u");
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
    // tab切换
    handleNav(id) {
      this.className = id;
      if (id) {
        this.order = "{ created_at: desc }";
      } else {
        this.order = "{ likes_count: desc }";
      }
      this.page = 1;
      this.offset = 0;
      this.handleGetData(this.limit, this.offset, this.order);
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
      this.handleGetData(this.limit, this.offset, this.order);
    },
    // 首页
    homePage() {
      this.page = 1;
      this.offset = 0;
      this.handleGetData(this.limit, this.offset, this.order);
    },
    // 尾页
    lastPage() {
      this.page = this.totalPage;
      this.offset = this.limit * (this.page - 1);
      this.handleGetData(this.limit, this.offset, this.order);
    },
    // 上一页
    previousPage() {
      if (this.page > 1) {
        this.page--;
        this.offset = this.limit * (this.page - 1);
        this.handleGetData(this.limit, this.offset, this.order);
      }
    },
    // 下一页
    nextPage() {
      if (this.page < this.totalPage) {
        this.page++;
        this.offset = this.limit * (this.page - 1);
        this.handleGetData(this.limit, this.offset, this.order);
      }
    },
    // 页面数据
    handleGetData(limit, offset, order) {
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
                limit: ${limit}, 
                offset: ${offset}, 
                order_by: ${order},
                where: {draft: {_eq: false}}
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
              this.order,
              this.userInfo.id
            );
          }
        });
    },
    // 收藏查询
    handleQueryLike(limit, offset, order, user_id) {
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
                limit: ${limit}, 
                offset: ${offset}, 
                order_by: ${order},
                where: {draft: {_eq: false}}
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
    // handleJudgeLike(item_id, user_id, index) {
    //   this.$apollo
    //     .query({
    //       query: gql`
    //         {
    //           likes(
    //             where: {item_id: {_eq: "${item_id}"},user_id: {_eq: "${user_id}"}}
    //           ) {
    //             id
    //           }
    //         }
    //       `,
    //       fetchPolicy: "no-cache",
    //     })
    //     .then((data) => {
    //       this.$set(
    //         this.dataList[index],
    //         "collection",
    //         data.data.likes.length ? true : false
    //       );
    //     });
    // },
    // handlePartners() {
    //   this.$apollo
    //     .query({
    //       query: gql`
    //         {
    //           partners {
    //             url
    //             updated_at
    //             position
    //             name
    //             image
    //             id
    //             created_at
    //           }
    //         }
    //       `,
    //       fetchPolicy: "no-cache",
    //     })
    //     .then((data) => {
    //       this.partnerList = data.data.partners;
    //     });
    // },
    // 用户id获取用户信息
    handleUserInfo(id) {
      this.$apollo
        .query({
          query: gql`
            {
              users(where: {id: {_eq: "${id}"}}) {
                id
                avatar
                cid
                city
                created_at
                email
                encrypted_password
                first_name
                gender
                last_login_at
                last_login_location
                last_name
                login
                mobile_phone
                name
                nickname
                occupation
                qq
                remember_created_at
                reset_password_sent_at
                reset_password_token
                updated_at
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          window.$store.commit("setUserInfo", data.data.users[0]);
        });
    },
    // 合作伙伴和banenr
    handleGttBanner() {
      this.$apollo
        .query({
          query: gql`
            {
              banners(where: { position: { _gt: 0 } }) {
                image
                alt
              }
              partners {
                url
                updated_at
                position
                name
                image
                id
                created_at
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.bannerList = data.data.banners;
          this.partnerList = data.data.partners;
        });
    },
  },
  created() {
    this.handleGetData(this.limit, this.offset, this.order);
    // this.handlePartners();
    this.handleGttBanner();

    // 判断用户是否扫码登陆
    if (this.cookieUser != null) {
      this.handleUserInfo(this.cookieUser);
    }
  },
};
</script>


<style lang="scss" scoped>
.home {
  width: 100%;
  img {
    width: 100%;
  }
  .main {
    margin: 0 auto;
    max-width: 1760px;
    min-width: 1200px;
    .main_title {
      height: 174px;
      display: flex;
      align-items: center;
      justify-content: center;
      ul {
        display: flex;
        li {
          cursor: pointer;
          border-radius: 44px;
          line-height: 44px;
          padding: 0 29px;
          box-sizing: border-box;
          font-size: 20px;
          font-weight: 400;
          color: #333333;
          margin-right: 73px;
        }
        li:last-child {
          margin-right: 0;
        }
        li:hover {
          background: #fcf89f;
        }
        .active {
          background: #fff94b;
          position: relative;
        }
        .active::after {
          content: "";
          width: 41px;
          height: 4px;
          border-radius: 15px;
          background: #333333;
          position: absolute;
          top: 70px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    .main_content {
      .card:hover {
        .img {
          transition: all 1s;
          transform: scale(1.05, 1.05);
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
  .partners_warp {
    width: 100%;
    background: #f5f5f5;
    .partners {
      margin: 0 auto;
      max-width: 1760px;
      min-width: 1200px;
      .partners_title {
        height: 174px;
        display: flex;
        align-items: center;
        justify-content: center;
        li {
          font-size: 30px;
          font-weight: 400;
          color: #333333;
          position: relative;
        }
        li::after {
          content: "";
          width: 121px;
          height: 2px;
          background: #333333;
          opacity: 1;
          position: absolute;
          top: 56px;
          left: 0;
        }
      }
      .partners_content {
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        .card {
          width: 25%;
          padding: 0 10px;
          margin-bottom: 50px;
          box-sizing: border-box;
          float: left;
          .card_list {
            height: 140px;
            background: #ffffff;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.07);
            opacity: 0.8;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            .img {
              width: 160px;
              height: 70px;
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
              transition: all 0.2s;
              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
        }
      }
      .partners_content::after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }
}
</style>
