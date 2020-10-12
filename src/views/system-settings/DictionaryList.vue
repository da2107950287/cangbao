<template>
  <div>

    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addDictionarys">新建
        </el-button>

      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
        @selection-change="handleSelectionChange">
        <el-table-column prop="orders" label="序号" align="center"></el-table-column>
        <el-table-column prop="dicName" label="名称" align="center"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
          :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="添加数据字典" center :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="类型：">
          <el-select v-model="form.dicType" placeholder="请选择类型" class="handle-select mr10">
            <el-option v-for="(item,index) in dictionaryList" :key="index" :label="item.dicName" :value="item.order">
            </el-option>
          </el-select>
        </el-form-item>
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
    name: 'basetable',
    data() {
      return {
        PageNumber: 1,
        PageSize: 10,
        tableData: [],
        dictionaryList: [
          { order: 1, dicName: '新闻' },
          { order: 2, dicName: '藏友圈' },
          { order: 3, dicName: '课程' }
        ],
        multipleSelection: [],
        delList: [],
        editVisible: false,
        pageTotal: 0,
        form: {},
        idx: -1,
        id: -1,
        rules: {
          dicType: [{ required: true, message: "请选择类型", trigger: "blur" }],
          dicName: [{ required: true, message: "请输入名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
        }
      };
    },
    watch: {
      $route(){
        this.dicType = this.$route.query.dicType
      }
    },
    created() {
      this.dicType = this.$route.query.dicType
      this.getData();
    },
    methods: {
      // 获取 easy-mock 的模拟数据
      getData() {
        this.$post("/other/getDictionary", {
          dicType: this.dicType,
          PageNumber: this.PageNumber,
          PageSize: this.PageSize
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.pageTotal = res.data.count;
          }
        })
      },

      addDictionarys() {
        this.editVisible = true;
      },
      // 删除操作
      handleDelete(index, row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.$message.success('删除成功');
            this.tableData.splice(index, 1);
          })
          .catch(() => { });
      },
      // 多选操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      delAllSelection() {
        const length = this.multipleSelection.length;
        let str = '';
        this.delList = this.delList.concat(this.multipleSelection);
        for (let i = 0; i < length; i++) {
          str += this.multipleSelection[i].name + ' ';
        }
        this.$message.error(`删除了${str}`);
        this.multipleSelection = [];
      },
      // 编辑操作
      handleEdit(index, row) {
        this.idx = index;
        this.form = row;
        this.editVisible = true;
      },
      // 保存编辑
      saveEdit() {
        this.editVisible = false;
        this.$refs.form.validate(valid => {
          this.$post("/other/insertDictionary", this.form).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg)
            }
          })

        })
      },
      // 分页导航
      handlePageChange(val) {
        this.$set(this.query, 'PageNumber', val);
        this.getData();
      }
    }
  };
</script>

<style scoped>
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

  .table {
    /* width: 100%; */
    font-size: 14px;
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
</style>