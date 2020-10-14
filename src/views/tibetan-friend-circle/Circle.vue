<template>
  <div class="container">
    <div class="handle-box">
     <span>新闻公司：</span> <el-input v-model="newsName" class="handle-search mr10"></el-input>
      <span>藏友圈名称：</span><el-input v-model="newsTitle" class="handle-search mr10"></el-input>
      <span>状态：</span><el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
        <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getData">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addDictionarys">新建</el-button>
    </div>
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
      <el-table-column type="index" label="序号"  width="100" align="center"></el-table-column>
      <el-table-column prop="msgTitle" label="标题" align="center"></el-table-column>
      <el-table-column prop="describes" label="描述" align="center"></el-table-column>
      <el-table-column prop="msgTime" label="发布时间" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">上架</span>
          <span v-else>下架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateMessageState(scope.row)">
            <span v-if="scope.row.state==1">下架</span>
            <span v-else>上架</span>
          </el-button>

          <el-button type="primary" size="mini" @click="updateDictionary(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next" :current-page="PageNumber" :page-size="PageSize"
        :total="pageTotal" @current-change="handlePageChange"></el-pagination>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="title" center :visible.sync="editVisible" width="30%">
      <el-form-item label="标题：">
        <el-input v-model="form.msgTitle" class="handle-input"></el-input>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input v-model="form.describes" class="handle-input"></el-input>
      </el-form-item>
      <el-form-item label="内容：">
        <el-input v-model="form.content" class="handle-input"></el-input>
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
        state: "all",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {},
        editVisible: false,
        isAdd: 0,
        title: '',
        rules: {
          dicType: [{ required: true, message: "请选择类型", trigger: "blur" }],
          dicName: [{ required: true, message: "请输入名称", trigger: "blur" }],
          orders: [{ required: true, message: "请输入排序", trigger: "blur" }],
        },
        statesList: [
          { id: "all", name: "全部" },
          { id: 1, name: "上架" },
          { id: 2, name: "下架" }
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
      this.getData()
    },
    methods: {
      //获取数据
      getData() {
        this.$post("/other/getMessage", {
          state: this.state,
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
      updateMessageState(row) {
        let state;
        if (row.state == 1) {
          state = 2
        } else {
          state = 1
        }
        this.$post("/other/updateMessageState", {
          msgId: row.msgId,
          state
        }).then(res=>{
          if(res.code==200){
            this.$message.success(res.msg);
            this.getData()
          }
        })
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
.handle-search{
  width: 200px;
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