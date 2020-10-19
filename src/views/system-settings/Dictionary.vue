<template>
  <div class="container">
    <div class="handle-box">
      <span>所属类型：</span>
      <el-select v-model="dicType" placeholder="请选择类型" class="handle-select mr10">
        <el-option label="全部" value=""></el-option>
        <el-option v-for="(item,index) in dictionaryList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getDictionary">搜索
      </el-button>
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addDictionarys">新建
      </el-button>
    </div>
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
      <el-table-column prop="dicName" label="名称" align="center"></el-table-column>
      <el-table-column prop="orders" label="排序" align="center"></el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateDictionary(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" class="red" @click="deleteDictionary(scope.row)">删除
          </el-button>
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
    <!-- 编辑弹出框 -->
    <el-dialog :title="title" center :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="类型：">
          <el-select v-model="form.dicType" placeholder="请选择类型" class="handle-select mr10">
            <el-option v-for="(item,index) in dictionaryList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
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
        dicType: "1",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {

        },
        editVisible: false,
        isAdd: 0,
        title: '',
        rules: {
          dicType: [{ required: true, message: "请选择类型", trigger: "blur" }],
          dicName: [{ required: true, message: "请输入名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
        },
        dictionaryList: [
          { id: "1", name: '新闻' },
          { id: "2", name: '藏友圈' },
          { id: "3", name: '课程' }
        ],
      };
    },
    watch: {
      editVisible() {
        if (!this.editVisible) {
          this.form = {}
        }
      }
    },
    created() {
      this.getDictionary()
    },
    methods: {
      //获取数据
      getDictionary() {
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
        this.isAdd = 1;
        this.title = "添加数据字典";
      },
      // 保存编辑
      saveEdit() {
        this.editVisible = false;
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.isAdd == 1) {
              this.form.dicType=this.dicType
              this.$post("/other/insertDictionary", this.form).then(res => {
                if (res.code == 200) {
                  this.getDictionary()
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/other/updateDictionary", this.form).then(res => {
                if (res.code == 200) {
                  this.getDictionary()
                  this.$message.success(res.msg)
                }
              })
            }

          }

        })
      },
      updateDictionary(row) {
        this.editVisible = true;
        this.title = "编辑数据字典";
        this.isAdd = 0;
        this.form = row;
      },
      // 删除操作
      deleteDictionary(row) {
        // 二次确认删除
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$post("/other/deleteDictionary", {
            dicId: row.dicId
          }).then(res => {
            if (res.code == 200) {
              this.$message.success(res.msg);
            this.getDictionary()
            }
          })
        })
      },
      // 分页导航
      handlePageChange(val) {
        console.log(val)
        this.PageNumber = val;
        this.getDictionary();
      },
      handleSizeChange(val){
        this.PageSize = val;
        this.getDictionary();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .text {
    color: #6a6a6a;

  }

  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 200px;
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