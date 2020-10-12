<template>
  <div class="container">
    <!-- <div class="handle-box">
      <el-select v-model="type" placeholder="请选择文档类型" class="handle-select mr10">
        <el-option v-for="(item,index) in agreementList" :key="index" :label="item.name" :value="item.type">
        </el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getData">搜索
      </el-button>
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addDictionarys">新建
      </el-button>
    </div> -->
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
      <el-table-column prop="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="文档类型" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹出框 -->
    <el-dialog title="修改文档" center :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">

        <el-form-item label="名称：">
          <el-input v-model="form.dicName" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="form.orders" class="handle-input"></el-input>
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
        type: 'A',
        tableData: [],
        form: {},
        editVisible: false,
        rules: {
          dicType: [{ required: true, message: "请选择类型", trigger: "blur" }],
          dicName: [{ required: true, message: "请输入名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
        },
        tableData: [
          { index: 1, type: 'A', name: '用户协议' },
          { index: 2, type: 'B', name: '隐私协议' },
          { index: 3, type: 'C', name: '关于我们' }
        ],
      };
    },
   
    methods: {
      handleEdit(index, row) {
        this.editVisible=true;
        this.$post("/other/getAgreement", { type: this.type }).then(res => {
          if (res.code) {

          }
        })
      },
      addDictionarys() {
        this.editVisible = true;
        this.isAdd = 1;
        this.title = "添加数据字典";
      },
      // 保存编辑
      saveEdit() {
        this.editVisible = false;
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.isAdd == 1) {
              this.$post("/other/insertDictionary", this.form).then(res => {
                if (res.code == 200) {
                  this.getData()
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/other/updateDictionary", this.form).then(res => {
                if (res.code == 200) {
                  this.getData()
                  this.$message.success(res.msg)
                }
              })
            }

          }

        })
      },
      updateDictionary(index, row) {
        this.editVisible = true;
        this.title = "编辑数据字典";
        this.isAdd = 0;
        this.form = row;
      },
      // 删除操作
      deleteDictionary(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/other/deleteDictionary", {
            dicId: row.dicId
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.tableData.splice(index, 1);
            }
          })
        }).catch(() => { });
      },
      // 分页导航
      handlePageChange(val) {
        this.PageNumber = val;
        this.getData();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 300px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 10px;
  }

  .table {
    width: 100%;
    font-size: 14px;
  }
</style>