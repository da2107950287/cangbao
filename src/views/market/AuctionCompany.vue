<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <span>排序：</span>
        <el-select v-model="orders" placeholder="请选择排序" class="handle-search mr10">
          <el-option label="全部" value="all"></el-option>
          <el-option label="推荐" value="rec"></el-option>

        </el-select>
        <span>拍卖公司名称：</span>
        <el-input v-model="simpleName" placeholder="请输入关键字" clearable class="handle-search mr10"></el-input>

        <el-button type="primary" class="handle-del mr10" @click="getOrganList">搜索</el-button>

        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addYearList">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="simpleName" label="拍卖公司名称" align="center"></el-table-column>
        <el-table-column prop="orders" label="排序" align="center"></el-table-column>
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editYearList(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <div class="pagination">
          <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
            :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event)"
            @size-change="handleSizeChange($event)"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog center :title="title" :visible.sync="editVisible" width="40%">
      <el-form ref="form" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="拍卖公司名称：" prop="simpleName">
          <el-input v-model="form.simpleName" placeholder="请输入拍卖公司名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="orders">
          <el-select v-model="form.orders" placeholder="请选择排序" class="handle-select mr10">
            <el-option v-for="(item,index) in arr" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        orders: "all",
        simpleName: "",
        title: "",
        tableData: [],
        editVisible: false,
        arr: ['rec', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        form: {},
        rules: {
          simpleName: [{ required: true, message: "请输入拍卖公司名称", trigger: "blur" }],
          orders: [{ required: true, message: "请选择排序", trigger: "blur" }],
        },
      };
    },
    created() {
      this.getOrganList();
    },
    methods: {
      // 获取藏品年份
      getOrganList() {
        this.$post("/market/getOrganList", {
          orders: this.orders,
          simpleName: this.simpleName,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },

      //触发新建按钮
      addYearList() {
        this.editVisible = true;
        this.form = {}
        this.isAdd = true;
        this.title = "添加拍卖公司"
      },
      //触发编辑按钮
      editYearList(row) {
        this.editVisible = true;
        this.isAdd = false;
        this.title = "编辑拍卖公司信息"
        this.form = row;
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.editVisible = false;
            if (this.isAdd) {
              this.$post("/market/insertOrganList", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getOrganList()
                }
              })
            } else {
              this.$post("/market/updateOrganList", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getOrganList()
                }
              })
            }
          }
        })
      },
      // 分页导航
      handlePageChange(val) {
        console.log(val)
        this.PageNumber = val;
        this.getOrganList();
      },
      handleSizeChange(val) {
        this.PageSize = val;
        this.getOrganList();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-search {
    width: 300px;
  }

  .handle-select {
    width: 400px;
  }

  .handle-input {
    width: 400px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
  }

  .personal-icon {
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%
    }
  }
</style>