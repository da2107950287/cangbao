<template>
  <div class="container">
   <div v-if="!$route.query.isAdd">
    <div class="handle-box">
      <span>状态：</span>
      <el-select v-model="state" placeholder="请选择类型" class="handle-search mr10">
        <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getMessage">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addMsg">新建</el-button>
    </div>
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
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
          <el-button type="primary" size="mini" @click="updateSystemMsg(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="total,sizes, prev, pager, next,jumper" :current-page="PageNumber"
        :page-size="PageSize" :total="pageTotal" @current-change="handlePageChange($event)"
        @size-change="handleSizeChange($event)"></el-pagination>
    </div>
   </div>
    <!-- 编辑弹出框 -->
    <div v-if="$route.query.isAdd">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题：">
          <el-input v-model="form.msgTitle" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="form.describes" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <UEditor ref="ueditor"></UEditor>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.push('/systemMsg')">返 回</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import UEditor from '@/components/ueditor.vue'


  export default {
    data() {
      return {
        state: "all",
        PageNumber: 1,
        PageSize: 10,
        pageTotal: 0,
        tableData: [],
        form: {},
        rules: {
          title: [{ required: true, message: "请选择标题", trigger: "blur" }],
          describes: [{ required: true, message: "请输入描述", trigger: "blur" }],
          content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        },
        statesList: [
          { id: "all", name: "全部" },
          { id: 1, name: "上架" },
          { id: 2, name: "下架" }
        ],
      };
    },
    watch: {
      $route(to, from) {
      this.getMessageInfo()
    }
    },
    mounted() {
      this.getMessage();
      this.getMessageInfo()
    },
    methods: {
      //获取数据
      getMessage() {
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
      addMsg() {
        this.$router.push({path:"/systemMsg",query:{isAdd:true}})
      
      },
      //修改状态
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
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getMessage()
          }
        })
      },
      // 保存编辑
      saveEdit() {
        this.form.content = this.$refs.ueditor.getUEContent();

        this.$refs.form.validate(valid => {
          if (valid) {
            this.editVisible = false;
            if (this.isAdd) {
              this.$post("/other/insertMessage", this.form).then(res => {
                if (res.code == 200) {
                  
                  this.$message.success(res.msg);
                  this.$router.push("/systemMsg")
                }
              })
            } else {
              this.$post("/other/updateMessage", this.form).then(res => {
                if (res.code == 200) {
                  
                  this.$message.success(res.msg)
                  this.$router.push("/systemMsg")

                }
              })
            }
          }
        })
      },
      updateSystemMsg(row) {
       this.$router.push({path:"/systemMsg",query:{msgId:row.msgId,isAdd:false}})
      },
      getMessageInfo() {
        if (this.$route.query.msgId) {
          this.$post("/other/showMessage", {
            msgId: this.$route.query.msgId
          }).then(res => {
            if (res.code == 200) {
              this.form = res.data;
              this.$refs.ueditor.setUEContent(res.data.content)
            }
          })
        }
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
        })
      },
      // 分页导航
      handlePageChange(val) {
        this.PageNumber = val;
        this.getMessage();
      },
      handleSizeChange(val, type) {
        this.PageSize = val;
        this.getMessage()
      },
    },
    components: {
      UEditor
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
</style>