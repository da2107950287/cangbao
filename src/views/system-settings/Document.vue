<template>
  <div class="container">
    <div v-if="!$route.query.id">
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column type="index" width="200" label="序号" align="center"></el-table-column>
        <el-table-column prop="name" label="文档类型" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="view(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹出框 -->
    <div v-else-if="$route.query.id">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文档内容：">
          <UEditor ref="ueditor"></UEditor>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.push('/document')">返 回</el-button>
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
        type: "",
        tableData: [],
        form: {
        
        },
        rules: {
          content: [{ required: true, message: "请输入文档内容", trigger: "blur" }],
        },
        tableData: [
          { id: 'A', name: '用户协议' },
          { id: 'B', name: '隐私协议' },
          { id: 'C', name: '关于我们' }
        ],
      };
    },
    watch: {
      $route(to, from) {
        this.getAgreement()
      }
    },
    mounted(){
      this.getAgreement()
    },
    methods: {
      view(index, row) {
        this.$router.push({ path: "/document", query: { id: row.id } })
      },
      //获取协议
      getAgreement() {
        if (this.$route.query.id) {
          this.$post("/other/getAgreement", { type: this.$route.query.id }).then(res => {
            if (res.code==200) {
            
              this.form = res.data;
              this.$refs.ueditor.setUEContent(this.form.content)
              
            }
          })
        }
      },
      // 保存编辑
      saveEdit() {
        this.form.content = this.$refs.ueditor.getUEContent();
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$post("/other/setAgreement", this.form).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.$router.push("/document")
              }
            })
          }
        })
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