<template>
  <div>
    <div class="container">
      <div class="handle-box">

        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addYearList">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="年份名称" align="center"></el-table-column>
        <el-table-column prop="startdate" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="enddate" label="结束时间" align="center"></el-table-column>
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
    <el-dialog center :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="年份名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入年份名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="开始时间：" prop="startdate">
          <el-date-picker v-model="form.startdate" value-format="yyyy-MM-dd" class="handle-input" type="date"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="enddate">
          <el-date-picker v-model="form.enddate" value-format="yyyy-MM-dd" class="handle-input" type="date"
            placeholder="请选择结束时间">
          </el-date-picker>

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
        state: "all",
        tableData: [],
        editVisible: false,
        title: "",
        form: {},
        rules: {
          state: [{ required: true, message: "请选择状态", trigger: "blur" }],
          cyName: [{ required: true, message: "请输入年份", trigger: "blur" }],
        },


      };
    },
    created() {
      this.getYearList();
    },
    methods: {
      // 获取藏品年份
      getYearList() {
        this.$post("/market/getYearList", {
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
        this.title = "添加拍卖会年份"
      },
      //触发编辑按钮
      editYearList(row) {
        this.editVisible = true;
        this.isAdd = false;
        this.title = "编辑拍卖会年份信息"
        this.form = row;
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.editVisible = false;
            if (this.isAdd) {
              this.$post("/market/insertYearList", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getYearList()
                }
              })
            } else {
              this.$post("/market/updateYearList", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getYearList()
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
        this.getYearList();
      },
      handleSizeChange(val) {
        this.PageSize = val;
        this.getYearList();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 200px;
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