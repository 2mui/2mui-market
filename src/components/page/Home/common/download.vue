<template>
  <div class="download">
    <div class="main_content">
      <div v-for="(item, index) in dataList" :key="index" class="card">
        <img :src="item.cover ? item.cover : images" alt="" />
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
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      dataList: [],
      categoriesId: window.$store.state.categoriesId,
      images: require("@/assets/img/default.jpg"),
    };
  },
  methods: {
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

