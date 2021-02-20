<template>
  <div class="home">
    <div class="banner">
      <img :src="require('@/assets/img/banner.jpg')" alt="" />
    </div>
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
                <!-- <img
                  @click.stop="optCollection(item.id, index)"
                  :src="require('@/assets/img/dropdown_bottom.png')"
                  alt=""
                /> -->
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
                <!-- <img
                  :src="require('@/assets/img/download.png')"
                  alt=""
                  srcset=""
                /> -->
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

export default {
  name: "home",
  components: {
    Footer,
    Exhibition,
    AddFolder,
    OptCollection,
  },
  data() {
    return {
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
    };
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
    // 收藏到默认第一个
    handleCollection(id, collection, index) {
      if (Object.keys(this.userInfo).length) {
        if (!collection) {
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
    // 合作伙伴
    handlePartners() {
      this.$apollo
        .query({
          query: gql`
            {
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
          this.partnerList = data.data.partners;
        });
    },
    // 用户id获取用户信息
    handleUserInfo(id) {
      this.$apollo
        .query({
          query: gql`
            {
              users(where: {id: {_eq: "${id}"}}) {
                id
                admin
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
  },
  created() {
    this.handleGetData(this.limit, this.offset, this.order);
    this.handlePartners();
    // 文件夹收藏操作
    Bus.$on("collectionSuccess", (val) => {
      this.$set(this.dataList[val], "collection", true);
    });

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
    max-width: 1740px;
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
          .el-button:nth-child(1) {
            color: #999999;
          }
          .el-button:nth-child(2) {
            color: #999999;
          }
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
  .partners_warp {
    width: 100%;
    background: #f5f5f5;
    .partners {
      margin: 0 auto;
      max-width: 1740px;
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
