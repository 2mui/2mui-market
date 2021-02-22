<template>
  <div class="download">
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
        <div class="card_footer">
          <li class="card_footer_left">
            <span>{{ item.item.title }}</span
            ><span>{{
              categoriesId.filter((e) => {
                return e.id == item.item.category_id;
              })[0].name
            }}</span>
          </li>
          <div class="card_footer_right">
            <li>
              <i class="iconfont iconhuaban1fuben11"></i>
              {{ item.item.downloads_count }}
            </li>
            <li>
              <i
                v-if="item.item.collection"
                class="iconfont iconhuaban1fuben10"
              ></i>
              <i v-else class="iconfont iconhuaban1fuben9"></i>
              {{ item.item.likes_count }}
            </li>
          </div>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <Exhibition :detailsData="detailsData" :isItem="isItem" v-if="isDetails" />
  </div>
</template>

<script>
import Exhibition from "../../../common/Exhibition";
import gql from "graphql-tag";
export default {
  components: {
    Exhibition,
  },
  data() {
    return {
      isDetails: false,
      isItem: true,
      detailsData: {},
      listIndex: null,
      dataList: [],
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
    handleGetData(id) {
      this.$apollo
        .query({
          query: gql`
            {
              download_histories_aggregate {
                aggregate {
                  count
                }
              }
              download_histories(
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
          this.dataList = data.data.download_histories;
          for (let i in this.dataList) {
            this.handleJudgeLike(this.dataList[i].item.id, this.userInfo.id, i);
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
            this.dataList[index].item,
            "collection",
            data.data.likes.length ? true : false
          );
        });
    },
  },
  created() {
    this.userInfo = window.$store.state.userInfo;
    this.handleGetData(this.userInfo.id);
  },
};
</script>
<style lang="scss" scoped>
.download {
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
      .img {
        width: 100%;
        height: 303px;
        border-radius: 14px;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
        transition: all 0.2s;
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
</style>

