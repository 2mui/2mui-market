<template>
  <div class="exhibition">
    <el-dialog
      class="detalis"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      top="0"
      width="1180px"
    >
      <span class="warp">
        <div class="warp_top">
          <span>{{ detailsData.title }}</span>
        </div>
        <img :src="detailsData.detail" alt="" srcset="" />
        <!-- <img :src="require('@/assets/img/details.png')" alt="" srcset=""> -->
        <div class="warp_footer" v-if="isShow">
          <p>相关推荐</p>
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
        </div>
      </span>
      <span class="sidebar">
        <div class="sidebar_buttom">
          <div class="close">
            <div>
              <i class="el-icon-close" @click="handleClose"></i>
            </div>
          </div>
          <div class="list">
            <div
              @click.stop="
                handleCollection(detailsData.id, detailsData.collection)
              "
            >
              <i
                v-if="detailsData.collection"
                class="iconfont iconhuaban1fuben10"
              ></i>
              <i v-else class="iconfont iconhuaban1fuben9"></i>
            </div>
            <p>{{ detailsData.likes_count }}人收藏</p>
          </div>
          <div class="list">
            <div @click="handleDowload(detailsData.url)">
              <i class="iconfont iconhuaban1fuben11"></i>
            </div>
            <p>{{ detailsData.downloads_count }}人下载</p>
          </div>
          <div class="list">
            <div @click="lower">
              <i class="iconfont iconhuaban1fuben41"></i>
            </div>
            <p>下一个</p>
          </div>
          <div class="list">
            <div @click="upper">
              <i class="iconfont iconhuaban1fuben51"></i>
            </div>
            <p>上一个</p>
          </div>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import gql from "graphql-tag";
// 新增浏览记录
var insertBrowseHistoriesGql = gql`
  mutation insert_browse_histories(
    $item_id: bigint!
    $user_id: bigint!
    $updated_at: timestamp!
    $created_at: timestamp!
  ) {
    insert_browse_histories(
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
// 收藏
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
  props: {
    detailsData: {
      type: Object,
      default() {
        return {};
      },
    },
    isShow: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      dialogVisible: true,
      dataList: [],
      userInfo: {},
      images: require("@/assets/img/default.jpg"),
      categoriesId: window.$store.state.categoriesId,
    };
  },
  computed: {
    folder() {
      return window.$store.state.folder;
    }
  },
  methods: {
    // 下一个
    lower() {
      this.$parent.lower();
    },
    // 上一个
    upper() {
      this.$parent.upper();
    },
    handleClose() {
      this.$parent.isDetails = false;
    },
    // 推荐详情
    handleDetails(item, index) {
      this.$parent.detailsData = item;
    },
    // 收藏
    handleCollection(id, collection) {
      var index = this.$parent.listIndex;
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
              this.$set(this.$parent.dataList[index], "collection", false);
              this.$set(this.detailsData, "collection", false);
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
          this.$set(this.$parent.dataList[index], "collection", true);
          this.$set(this.detailsData, "collection", true);
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
    // 下载
    handleDowload(url) {
      // 判断是否登录的操作
      if (Object.keys(this.userInfo).length) {
        window.open(url);
        this.handleAddCound();
        this.$apollo
          .mutate({
            // 更新的语句
            mutation: insertDownloadHistoriesGql,
            // 实参列表
            variables: {
              item_id: this.detailsData.id,
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
    handleAddCound() {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: AddCoundGql,
          // 实参列表
          variables: {
            id: this.detailsData.id,
          },
        })
        .then((response) => {
          // 输出获取的数据集
        })
        .catch((err) => {});
    },
    // 推荐数据
    getDataList(id) {
      this.$apollo
        .query({
          query: gql`
            {
              items(
                where: {
                  draft: { _eq: false }, category_id: {_eq: "${id}"}
                }
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
          this.dataList = data.data.items.slice(0, 6);
          for (let i in this.dataList) {
            this.handleJudgeLike(this.dataList[i].id, this.userInfo.id, i);
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
    // 登录用户默认添加浏览记录
    getInsertBrowseHistories() {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: insertBrowseHistoriesGql,
          // 实参列表
          variables: {
            item_id: this.detailsData.id,
            user_id: this.userInfo.id,
            created_at: "now",
            updated_at: "now",
          },
        })
        .then((response) => {
          // 输出获取的数据集
        })
        .catch((err) => {});
    },
  },
  created() {
    // this.folder = window.$store.state.folder;
    this.userInfo = window.$store.state.userInfo;
    // 登录之后添加浏览记录
    if (Object.keys(this.userInfo).length) {
      this.getInsertBrowseHistories();
    }
    if (this.isShow) {
      this.getDataList(this.detailsData.category_id);
    }
  },
};
</script>
<style lang="scss" scoped>
.exhibition {
  /deep/ {
    .detalis {
      .el-dialog {
        border-radius: 0;
        background: none;
        box-shadow: none;
        .el-dialog__header {
          padding: 0;
        }
        .el-dialog__body {
          width: 100%;
          padding: 0;
          display: flex;
          .warp {
            width: 1000px;
            img {
              width: 100%;
            }
            .warp_top {
              width: 100%;
              height: 100px;
              line-height: 100px;
              font-size: 24px;
              font-weight: bold;
              color: #ffffff;
            }
            .warp_footer {
              p {
                padding: 30px 0 20px 0;
                font-size: 20px;
                font-weight: 400;
                color: #ffffff;
              }
              .main_content {
                width: 100%;
                box-sizing: border-box;
                .card {
                  cursor: pointer;
                  width: 33%;
                  padding: 0 10px;
                  margin-bottom: 50px;
                  box-sizing: border-box;
                  float: left;
                  > .img {
                    width: 100%;
                    height: 200px;
                    border-radius: 14px;
                    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
                    transition: all 0.2s;
                    img {
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 14px;
                      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
                      transition: all 0.2s;
                    }
                  }
                  .card_footer {
                    height: 50px;
                    font-size: 14px;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .card_footer_left {
                      width: 70%;
                      span:last-child {
                        background: #707070;
                        font-size: 12px;
                        color: white;
                        padding: 4px 14px;
                        box-sizing: border-box;
                        border-radius: 20px;
                      }
                    }
                    .card_footer_right {
                      width: 30%;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      li {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-size: 14px;
                        color: #ffffff;
                        margin-left: 10px;
                        img {
                          width: 18px;
                          height: 14px;
                          margin-right: 0;
                        }
                      }
                      li:first-child {
                        margin-left: 0;
                      }
                    }
                  }
                }
                .card:hover {
                  img {
                    transition: all 1s;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                  }
                }
              }
              .main_content::after {
                content: "";
                display: block;
                clear: both;
              }
            }
          }
          .sidebar {
            width: 200px;
            .sidebar_close {
              cursor: pointer;
              width: 100%;
              height: 100px;
              line-height: 100px;
              text-align: center;
              font-size: 24px;
              color: #ffffff;
            }
            .sidebar_buttom {
              height: 768px;
              padding-left: 47px;
              box-sizing: border-box;
              position: fixed;
              .close {
                margin-bottom: 50px;
                div {
                  cursor: pointer;
                  width: 76px;
                  height: 76px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  i {
                    font-size: 24px;
                    color: #ffffff;
                    font-weight: bold;
                  }
                }
              }
              .list {
                color: white;
                margin-bottom: 50px;
                div {
                  cursor: pointer;
                  width: 76px;
                  height: 76px;
                  border-radius: 50%;
                  background: white;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  img {
                    width: 30px;
                  }
                  i {
                    color: #666666;
                    font-size: 30px;
                  }
                  .iconhuaban1fuben10 {
                    color: red;
                  }
                }
                p {
                  text-align: center;
                  margin-top: 10px;
                  font-size: 16px;
                }
              }
              .list:nth-child(2) {
                margin-top: 150px;
              }
              .list:nth-child(4) {
                margin-top: 100px;
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
}
</style>
