<template>
  <div class="download">
    <div class="main_content">
      <div v-for="(item, index) in dataList" :key="index" class="card">
        <div class="img" @click="handleDetails(item.item, index)">
          <img :src="item.item.cover ? item.item.cover : images" alt="" />
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
          this.dataList = data.data.download_histories;
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
          this.dataList = data.data.download_histories;
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
      padding: 0 7.5px;
      margin-bottom: 50px;
      border-radius: 14px;
      box-sizing: border-box;
      float: left;
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
    }
  }
  .main_content::after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>

