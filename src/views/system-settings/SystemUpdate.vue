<template>
  <div class="container">
    <div class="handle-box">
      <span>消息状态：</span>
      <el-select v-model="state" placeholder="请选择类型" class="handle-select mr10">
        <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" class="handle-del mr10" @click="getAppversion">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="addAppversion">新建</el-button>
    </div>
    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
      <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
      <el-table-column prop="andVersion" label="安卓版本号" align="center"></el-table-column>
      <el-table-column prop="andContent" label="更新描述" align="center"></el-table-column>
      <el-table-column prop="iosVersion" label="IOS版本号" align="center"></el-table-column>
      <el-table-column prop="iosContent" label="更新描述" align="center"></el-table-column>
      <el-table-column label="是否强制更新" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.forceUpdate==1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="updatetime" label="更新时间" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">上架</span>
          <span v-else>下架</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateAppversionState(scope.row)">
            <span v-if="scope.row.state==1">下架</span>
            <span v-else>上架</span>
          </el-button>
          <el-button type="primary" size="mini" @click="updateAppversion(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹出框 -->
    <el-dialog :title="title" center :visible.sync="editVisible" width="650px">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="Android版本号：" prop="andVersion">
          <el-input v-model="form.andVersion" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="Android更新内容：" prop="andContent">
          <el-input type="textarea" v-model="form.andContent" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="Android更新地址：" prop="andUrl">
          <el-input v-model="form.andUrl" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="IOS版本号：" prop="iosVersion">
          <el-input v-model="form.iosVersion" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="IOS更新内容：" prop="iosContent">
          <el-input type="textarea" v-model="form.iosContent	" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="IOS更新地址：" prop="iosUrl">
          <el-input v-model="form.iosUrl" class="handle-input"></el-input>
        </el-form-item>
        <el-form-item label="是否强制更新：" prop="forceUpdate">
          <el-radio v-model="form.forceUpdate" label="1">是</el-radio>
          <el-radio v-model="form.forceUpdate" label="2">否</el-radio>
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
        tableData: [],
        form: {},
        editVisible: false,
        isAdd: 0,
        title: '',
        rules: {
          form: {},
          andVersion: [{ required: true, message: "请输入Android版本号", trigger: "blur" }],
          andContent: [{ required: true, message: "请选择Android更新内容", trigger: "blur" }],
          andUrl: [{ required: true, message: "请输入Android更新地址", trigger: "blur" }],
          iosVersion: [{ required: true, message: "请输入IOS版本号", trigger: "blur" }],
          iosContent: [{ required: true, message: "请选择IOS更新内容", trigger: "blur" }],
          iosUrl: [{ required: true, message: "请输入IOS更新地址", trigger: "blur" }],
          forceUpdate: [{ required: true, message: "请选择选择是否强制更新", trigger: 'change' }],
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
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          })
        }
      }
    },
    created() {
      this.getAppversion()
    },
    methods: {

      //获取数据
      getAppversion() {
        this.$post("/other/getAppversion", {
          state: this.state
        }).then(res => {
          if (res.code == 200) {
            this.tableData = res.data;
          }
        })
      },
      //触发新建按钮
      addAppversion() {
        this.editVisible = true;
        this.isAdd = true;
        this.title = "添加版本号";
        this.form = {
          forceUpdate: "1"
        }

      },
      //触发编辑按钮
      updateAppversion(row) {
        console.log(row)
        this.editVisible = true;
        this.title = "编辑版本号";
        this.isAdd = false;
        this.form = row;
      },
      //修改状态
      updateAppversionState(row) {
        let state = row.state ^ 3
        this.$post("/other/updateAppversionState", {
          id: row.id,
          state
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(res.msg);
            this.getAppversion()
          }
        })
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.editVisible = false;
            if (this.isAdd) {
              this.$post("/other/insertAppversion", this.form).then(res => {
                if (res.code == 200) {
                  this.getAppversion()
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/other/updateAppversion", this.form).then(res => {
                if (res.code == 200) {
                  this.getAppversion()
                  this.$message.success(res.msg)
                }
              })
            }
          } else {
            return false;
          }
        })
      },
    },
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
</style>