<template>
  <div class="container">
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
      <el-table-column type="index" width="200" label="序号" align="center"></el-table-column>
      <el-table-column prop="name" label="文档类型" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑弹出框 -->
    <el-dialog title="修改文档" center :visible.sync="editVisible" width="800">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="内容：">
          <editor-bar :value="form.content" v-model="form.content"></editor-bar>
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
  import EditorBar from "@/components/wangeditor/WangEditor.vue";

  export default {
    data() {
      return {
        type: 'A',
        tableData: [],
        form: {},
        editVisible: false,
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

    methods: {
      handleEdit(index, row) {
        this.editVisible = true;
        this.$post("/other/getAgreement", { type: row.id }).then(res => {
          if (res.code) {
            this.form = res.data;
          }
        })
      },
      // 保存编辑
      saveEdit() {
        this.editVisible = false;
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$post("/other/setAgreement",this.form).then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg)
              }
            })
          }
        })
      },
      updateDictionary(index, row) {
        this.editVisible = true;
        this.title = "编辑数据字典";
        this.isAdd = 0;
        this.form = row;
      },

    },
    components: {
      EditorBar
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