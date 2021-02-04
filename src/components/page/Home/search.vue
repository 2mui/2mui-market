<template>
  <div class="search">
    <div class="main">
      <div class="main_content">
        <div
          v-for="(item, index) in dataList"
          :key="index"
          @click="handleDetails(item)"
          class="card"
        >
          <div class="img">
            <img :src="item.cover" alt="" />
          </div>
          <div class="mould">
            <div class="mould_warp">
              <div class="edit">
                <img
                  @click.stop="handleCollection"
                  :src="require('@/assets/img/collection.png')"
                  alt=""
                  srcset=""
                />
                <img
                  @click.stop="optCollection"
                  :src="require('@/assets/img/dropdown_bottom.png')"
                  alt=""
                />
              </div>
              <div class="folder" @click.stop="addCollection">
                <i class="el-icon-folder-add"></i>
              </div>
            </div>
          </div>
          <div class="card_footer">
            <li class="card_footer_left">
              <span>{{ item.title }}</span
              ><span>{{ "APP" }}</span>
            </li>
            <div class="card_footer_right">
              <li>
                <img
                  :src="require('@/assets/img/download.png')"
                  alt=""
                  srcset=""
                />
                {{ item.downloads_count }}
              </li>
              <li>
                <img
                  :src="require('@/assets/img/collection.png')"
                  alt=""
                  srcset=""
                />
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
    <AddFolder :dialogCollection="dialogCollection" />
    <!-- 收藏到文件夹 -->
    <OptCollection :dialogOptCollection="dialogOptCollection" />
  </div>
</template>

<script>
import Footer from "../../common/Footer";
import Exhibition from "../../common/Exhibition";
import AddFolder from "./mould/AddFolder";
import OptCollection from "./mould/OptCollection";
import gql from "graphql-tag";
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

      colorConfirm: "#F5F5F5",
      //分页
      limit: 20,
      offset: 0,
      page: 1,
      total: null,
      totalPage: null,
      //搜索条件
      category: "",
      searchTitle: "",

      dataList: [],
    };
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
    handleCollection() {},
    optCollection() {
      this.dialogOptCollection = true;
    },
    addCollection() {
      this.dialogCollection = true;
    },
    // 详情
    handleDetails(item) {
      this.detailsData = item;
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

