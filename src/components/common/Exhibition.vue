<template>
  <div class="exhibition">
    <el-dialog
      class="detalis"
      id="exhibition"
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      top="0"
      width="1180px"
    >
      <span class="warp" ref="warp">
        <div class="warp_top">
          <span>{{ detailsData.title }}</span>
          <div>
            <span
              class="tag"
              v-for="(item, index) in detailsData.filetype"
              :key="index"
              >{{ item }}</span
            >
          </div>
        </div>
        <div
          class="warpVideo"
          v-if="
            categoriesId.filter((e) => {
              return e.id == detailsData.category_id;
            })[0].name == '动效'
          "
        >
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          >
          </video-player>
        </div>
        <div class="warpImg" v-else>
          <img :src="detailsData.detail" alt="" srcset="" />
          <div class="loading"></div>
        </div>
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
              <!-- <div class="mould">
                <div class="mould_warp">
                  <div class="mould_btn">
                    <div
                      class="mould_btn_list"
                      @click="handleItemDowload(item.url, item.id)"
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
              </div> -->
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
                <!-- <div class="card_footer_right">
                  <li>
                    <i class="iconfont iconhuaban1fuben11"></i>
                    {{ item.downloads_count }}
                  </li>
                  <li>
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
        </div>
      </span>
      <span class="sidebar">
        <div class="sidebar_buttom">
          <div class="close">
            <div tabindex="1" @click="handleClose">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="list">
            <div
              @click.stop="handleCollection(detailsData.id, detailsData.likes)"
            >
              <i
                v-if="detailsData.likes.length"
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
            <div @click="lower" tabindex="1">
              <i class="iconfont iconhuaban1fuben41"></i>
            </div>
            <p>下一个</p>
          </div>
          <div class="list">
            <div @click="upper" tabindex="1">
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
import { videoPlayer } from "vue-video-player";
import "video.js/dist/video-js.css";
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
    isItem: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  components: {
    videoPlayer,
  },
  data() {
    return {
      dialogVisible: true,
      dataList: [],
      images: require("@/assets/img/default.jpg"),
      categoriesId: window.$store.state.categoriesId,
      isVideo: true,
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4", // 类型
            src: "", // url地址
          },
        ],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true, // 是否显示全屏按钮
        },
      },
    };
  },
  watch: {
    dialogVisible(val) {
      this.$parent.isDetails = val;
    },
    userInfo(val) {
      this.handleCurrentLikes(this.detailsData.id, val.id);
    },
  },
  computed: {
    userInfo() {
      return window.$store.state.userInfo;
    },
    folder() {
      return window.$store.state.folder;
    },
  },
  methods: {
    handleVideo() {
      if (this.isVideo) {
        this.$refs.dialogVideo.play();
        this.isVideo = false;
      } else {
        this.$refs.dialogVideo.pause();
        this.isVideo = true;
      }
    },
    // 下一个
    lower() {
      this.$nextTick(() => {
        document.getElementById("exhibition").scrollTop = 0;
      });
      this.$parent.lower();
    },
    // 上一个
    upper() {
      this.$nextTick(() => {
        document.getElementById("exhibition").scrollTop = 0;
      });
      this.$parent.upper();
    },
    handleClose() {
      this.$parent.isDetails = false;
    },
    // 推荐详情
    handleDetails(item, index) {
      this.$parent.detailsData = item;
      this.$nextTick(() => {
        document.getElementById("exhibition").scrollTop = 0;
      });
    },
    // 收藏
    handleCollection(id, collection, index) {
      console.log(index);
      var index = this.$parent.listIndex;
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
              this.$set(this.$parent.dataList[index], "likes", []);
              this.$set(this.detailsData, "likes", []);
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
          this.$set(this.$parent.dataList[index], "likes", [0]);
          this.$set(this.detailsData, "likes", [0]);
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
          if (this.isItem) {
            this.$set(
              this.$parent.dataList[index].item,
              "likes_count",
              response.data.update_items_by_pk.likes_count
            );
          } else {
            this.$set(
              this.$parent.dataList[index],
              "likes_count",
              response.data.update_items_by_pk.likes_count
            );
          }
        })
        .catch((err) => {});
    },
    // 下载
    handleDowload(url) {
      // 判断是否登录的操作
      if (Object.keys(this.userInfo).length) {
        window.open(url);
        this.handleAddCound(this.detailsData.id);
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
    handleItemDowload(url, id) {
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
                filetype
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          this.dataList = data.data.items.slice(0, 6);
          for (let i in this.dataList) {
            this.$set(this.dataList[i], "likes", []);
          }
          if (Object.keys(this.userInfo).length) {
            this.handleQueryLike(
              this.detailsData.category_id,
              this.userInfo.id
            );
          }
        });
    },
    // 收藏查询
    handleQueryLike(id, user_id) {
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
          this.dataList = data.data.items.slice(0, 6);
        });
    },
    //当前是否收藏判断
    handleCurrentLikes(id, user_id) {
      this.$apollo
        .query({
          query: gql`
            {
              likes(where: {item_id: {_eq: ${id}}, user_id: {_eq: ${user_id}}}) {
                id
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          if (data.data.likes.length) {
            this.$set(this.detailsData, "likes", [0]);
          } else {
            this.$set(this.detailsData, "likes", []);
          }
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
    this.playerOptions.sources[0].src = this.detailsData.detail;
    this.playerOptions.poster = this.detailsData.cover;
    // this.folder = window.$store.state.folder;
    // this.userInfo = window.$store.state.userInfo;
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
@keyframes load-effect {
  0% {
    box-shadow: 0 -3em 0 0.2em #fff94b, 2em -2em 0 0 #fff94b,
      3em 0 0 -0.5em #fff94b, 2em 2em 0 -0.5em #fff94b, 0 3em 0 -0.5em #fff94b,
      -2em 2em 0 -0.5em #fff94b, -3em 0 0 -0.5em #fff94b, -2em -2em 0 0 #fff94b;
  }
  12% {
    box-shadow: 0 -3em 0 0 #fff94b, 2em -2em 0 0.2em #fff94b, 3em 0 0 0 #fff94b,
      2em 2em 0 -0.5em #fff94b, 0 3em 0 -0.5em #fff94b,
      -2em 2em 0 -0.5em #fff94b, -3em 0 0 -0.5em #fff94b,
      -2em -2em 0 -0.5em #fff94b;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em #fff94b, 2em -2em 0 0 #fff94b,
      3em 0 0 0.2em #fff94b, 2em 2em 0 0 #fff94b, 0 3em 0 -0.5em #fff94b,
      -2em 2em 0 -0.5em #fff94b, -3em 0 0 -0.5em #fff94b,
      -2em -2em 0 -0.5em #fff94b;
  }
  37% {
    box-shadow: 0 -3em 0 -0.5em #fff94b, 2em -2em 0 -0.5em #fff94b,
      3em 0 0 0 #fff94b, 2em 2em 0 0.2em #fff94b, 0 3em 0 0 #fff94b,
      -2em 2em 0 -0.5em #fff94b, -3em 0 0 -0.5em #fff94b,
      -2em -2em 0 -0.5em #fff94b;
  }
  50% {
    box-shadow: 0 -3em 0 -0.5em #fff94b, 2em -2em 0 -0.5em #fff94b,
      3em 0 0 -0.5em #fff94b, 2em 2em 0 0 #fff94b, 0 3em 0 0.2em #fff94b,
      -2em 2em 0 0 #fff94b, -3em 0 0 -0.5em #fff94b, -2em -2em 0 -0.5em #fff94b;
  }
  62% {
    box-shadow: 0 -3em 0 -0.5em #fff94b, 2em -2em 0 -0.5em #fff94b,
      3em 0 0 -0.5em #fff94b, 2em 2em 0 -0.5em #fff94b, 0 3em 0 0 #fff94b,
      -2em 2em 0 0.2em #fff94b, -3em 0 0 0 #fff94b, -2em -2em 0 -0.5em #fff94b;
  }
  75% {
    box-shadow: 0 -3em 0 -0.5em #fff94b, 2em -2em 0 -0.5em #fff94b,
      3em 0 0 -0.5em #fff94b, 2em 2em 0 -0.5em #fff94b, 0 3em 0 -0.5em #fff94b,
      -2em 2em 0 0 #fff94b, -3em 0 0 0.2em #fff94b, -2em -2em 0 0 #fff94b;
  }
  87% {
    box-shadow: 0 -3em 0 0 #fff94b, 2em -2em 0 -0.5em #fff94b,
      3em 0 0 -0.5em #fff94b, 2em 2em 0 -0.5em #fff94b, 0 3em 0 -0.5em #fff94b,
      -2em 2em 0 0 #fff94b, -3em 0 0 0 #fff94b, -2em -2em 0 0.2em #fff94b;
  }
  100% {
    box-shadow: 0 -3em 0 0.2em #fff94b, 2em -2em 0 0 #fff94b,
      3em 0 0 -0.5em #fff94b, 2em 2em 0 -0.5em #fff94b, 0 3em 0 -0.5em #fff94b,
      -2em 2em 0 -0.5em #fff94b, -3em 0 0 -0.5em #fff94b, -2em -2em 0 0 #fff94b;
  }
}
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
            .warpImg {
              width: 100%;
              min-height: 600px;
              position: relative;
              img {
                width: 100%;
              }
              .loading {
                font-size: 20px;
                width: 1em;
                height: 1em;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateY(-50%);
                z-index: -1;
                border-radius: 50%;
                text-indent: -9999em;
                animation: load-effect 1s infinite linear;
              }
            }
            .warp_top {
              width: 100%;
              height: 100px;
              line-height: 100px;
              font-size: 24px;
              font-weight: bold;
              color: #ffffff;
              display: flex;
              align-items: center;
              .tag {
                font-size: 14px;
                color: #ffffff;
                padding: 2px 8px;
                border: 1px solid #ffffff;
                border-radius: 20px;
                margin-right: 10px;
              }
              .tag:nth-child(1) {
                display: none;
              }
              .tag:nth-child(2) {
                margin-left: 28px;
              }
            }
            .warp_footer {
              > p {
                padding: 30px 0 20px 0;
                font-size: 20px;
                font-weight: 400;
                color: #ffffff;
              }
              .main_content {
                width: 100%;
                padding: 0;
                box-sizing: border-box;
                .card {
                  cursor: pointer;
                  width: 32%;
                  padding: 0 10px;
                  padding: 0;
                  margin: 0 6px;
                  margin-bottom: 50px;
                  box-sizing: border-box;
                  float: left;
                  overflow: inherit !important;
                  > .img {
                    padding: 0 7.5px;
                    padding: 0;
                    box-sizing: border-box;
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
                  .mould {
                    width: 100%;
                    height: 195px;
                    padding: 0 17.5px;
                    box-sizing: border-box;
                    position: absolute;
                    left: 0;
                    top: 0;
                    .mould_btn {
                      width: 200px;
                    }
                  }
                  .card_footer {
                    height: 50px;
                    padding: 0 7.5px;
                    font-size: 14px;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .card_footer_left {
                      width: 100%;
                      span:first-child {
                        // background: #d3d3d3;
                        border: 1px solid #707070;
                        font-size: 14px;
                        color: white;
                        padding: 2px 10px;
                        box-sizing: border-box;
                        border-radius: 20px;
                        margin-right: 10px;
                      }
                      span:nth-child(2) {
                        font-size: 16px;
                        display: inline-block;
                        width: 50%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
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
                  background: white;
                  transition: all 0.5s;
                  transform: scale(1.05, 1.05);
                  img {
                    transition: all 1s;
                    border-radius: 14px 14px 0 0;
                    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
                  }
                  .card_footer {
                    border-radius: 0 0 14px 14px;
                    // background: white;
                    .card_footer_left {
                      color: #333333;
                      span:first-child {
                        color: #333333;
                      }
                    }
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
            height: 100vh;
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
                  border-radius: 50%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  i {
                    font-size: 24px;
                    color: #ffffff;
                    font-weight: bold;
                  }
                }
                div:hover {
                  background: rgba(255, 249, 75, 0.4);
                }
                div:focus {
                  background: #e9e327;
                  outline: none;
                  i {
                    color: black;
                  }
                }
              }
              .list {
                color: white;
                margin-bottom: 25px;
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
                    color: #000000;
                    font-size: 30px;
                  }
                  .iconhuaban1fuben10 {
                    color: red;
                  }
                }
                div:hover {
                  background: #fff94b;
                }
                div:focus {
                  background: #e9e327;
                  outline: none;
                }
                p {
                  text-align: center;
                  margin-top: 10px;
                  font-size: 16px;
                }
              }
              .list:nth-child(2) {
                margin-top: 140px;
              }
              .list:nth-child(4) {
                margin-top: 80px;
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
