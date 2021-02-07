<template>
  <div class="optCollection">
    <el-dialog
      class="indexMould"
      :visible.sync="dialogOptCollection"
      :show-close="false"
      width="540px"
    >
      <span slot="title">收藏到文件夹</span>
      <div class="addwarp">
        <ul class="add">
          <li
            :class="index == activeName ? 'active' : ''"
            @click="handleAdd(item.id, index)"
            v-for="(item, index) in dataList"
            :key="index"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="addFolder" @click="addCollection">
          <i class="el-icon-plus"></i><span>新建文件夹</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div @click="handleInsertLikes">确定</div>
        <div @click="handleOptCollection">取消</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bus from "../../../common/bus";
import gql from "graphql-tag";
// 收藏到文件夹
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
export default {
  data() {
    return {
      title: "",
      dataList: [],
      activeName: -1,
      userInfo: {},
    };
  },
  props: {
    dialogOptCollection: {
      type: Boolean,
      default: true,
    },
    itemId: {
      type: Number,
      default: null,
    },
  },
  methods: {
    addCollection() {
      this.$parent.dialogCollection = true;
    },
    handleOptCollection() {
      this.$parent.dialogOptCollection = false;
    },
    handleAdd(id, index) {
      this.activeName = index;
      this.folderId = id;
    },
    handleInsertLikes() {
      this.$apollo
        .mutate({
          // 更新的语句
          mutation: getLikeGql,
          // 实参列表
          variables: {
            folder_id: this.folderId,
            item_id: this.itemId,
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
          this.$parent.dialogOptCollection = false;
        })
        .catch((err) => {
          this.$message({
            message: "错了哦！收藏失败",
            type: "error",
          });
        });
    },
    handleGetData(id) {
      this.$apollo
        .query({
          query: gql`
            {
              folders(
                where: {user_id: {_eq: "${id}"}}
              ) {
                name
                id
              }
            }
          `,
          fetchPolicy: "no-cache",
        })
        .then((data) => {
          //   this.total = data.data.items_aggregate.aggregate.count;
          //   this.totalPage = Math.ceil(this.total / this.limit);
          this.dataList = data.data.folders;
        });
    },
  },
  created() {
    this.userInfo = window.$store.state.userInfo;
    this.handleGetData(this.userInfo.id);
    Bus.$on("setFolder", (val) => {
      if (val) {
        this.handleGetData(this.userInfo.id);
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.optCollection {
  /deep/ {
    .indexMould {
      border-radius: 14px;
      .el-dialog__header {
        text-align: center;
        padding: 20px 20px 20px;
        position: relative;
        span {
          font-size: 24px;
          font-weight: 400;
          color: #333333;
          position: relative;
          z-index: 1;
        }
        span::after {
          content: "";
          width: 100%;
          height: 25px;
          background: #fff94b;
          position: absolute;
          left: 50%;
          bottom: -9px;
          z-index: -1;
          transform: translateX(-50%);
        }
      }
      .el-dialog__header::after {
        content: "";
        width: 80%;
        height: 1px;
        background: #d3d3d3;
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
      .el-dialog__body {
        font-size: 18px;
        display: flex;
        justify-content: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            margin-right: 20px;
          }
        }
        .edit {
          width: 400px;
          label {
            width: 50px;
            font-size: 18px;
            color: #999999;
          }
          .el-input.is-active .el-input__inner,
          .el-input__inner:focus {
            border-color: #dbdbdb;
          }
        }
        .add {
          width: 440px;
          border-radius: 5px;
          border: 1px solid #dbdbdb;
          li {
            cursor: pointer;
            line-height: 40px;
            padding: 0 20px;
            box-sizing: border-box;
            border-bottom: 1px solid #dbdbdb;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .active {
            background: #f0f0f0;
          }
          li:last-child {
            border-bottom: none;
          }
        }
        .addFolder {
          cursor: pointer;
          width: 440px;
          height: 40px;
          margin-top: 20px;
          border-radius: 40px;
          background: #fff94b;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          color: #000000;
          i {
            font-weight: bold;
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
</style>

