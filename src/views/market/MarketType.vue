<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addTypelist">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
        <el-table-column prop="name" label="类别名称" align="center"></el-table-column>
        <el-table-column prop="orders" label="类型排序" align="center"></el-table-column>
        
        <el-table-column label="操作" width="400" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editTypelist(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog center :title="title" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="类型名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入类型名称" class="handle-input mr10"></el-input>
        </el-form-item>
        <el-form-item label="类型排序：" prop="orders">
          <el-input v-model="form.orders" placeholder="请输入类型排序" class="handle-input mr10"></el-input>
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
        state:"all",
        tableData: [],  
        editVisible: false,
        title: "",
        form: {},
        rules: {
          name: [{ required: true, message: "请选择类型名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入类型排序", trigger: "blur" }],
        },
        //状态选项
        stateList: [
          { id: "1", name: "上架" },
          { id: "2", name: "下架" },
        ],
        
      };
    },
    created() {
      this.getTypelist();
    },
    methods: {
      // 获取藏品年份
      getTypelist() {
        this.$post("/market/getTypelist", {}).then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
          }
        })
      },
  
      //触发新建按钮
      addTypelist() {
        this.editVisible = true;
        this.form={}
        this.isAdd = true;
        this.title = "添加报告类型"
      },
      //触发编辑按钮
      editTypelist(row) {
        this.editVisible = true;
        this.isAdd = false;
        this.title = "编辑报告类型信息"
        this.form = row;
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
        this.editVisible = false;
            if (this.isAdd) {
              this.$post("/market/insertTypelist", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getTypelist()
                }
              })
            } else {
              this.$post("/market/updateTypelist", this.form).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.msg)
                  this.getTypelist()
                }
              })
            }
          }
        })
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