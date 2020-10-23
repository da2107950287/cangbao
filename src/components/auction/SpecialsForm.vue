<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="140px">
    <h2>专场基本信息</h2>
    
    <el-form-item label="拍卖会专场状态：">
      <el-select v-model="form.status" placeholder="请选择拍卖会专场状态" class="handle-input mr10">
        <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拍卖会专场名称：" prop="name">
      <el-input v-model="form.name" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会专场排序：" prop="orders">
      <el-input v-model="form.orders" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会拍品量：" prop="total">
      <el-input v-model="form.total" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会专场封面：" prop="coverPic">
      <label for="inputId" icon="el-icon-plus">
        <img v-if="form.coverPic" :src="form.coverPic" class="img" />
        <img v-else src="~assets/img/headportrait.png" class="img" alt="">
        <input style="display: none" id="inputId" ref="input" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
      </label>
    </el-form-item>
    <el-form-item label="拍卖会简单描述：" class="" prop="extraInfo">
      <el-table :data="form.extraInfo" border style="width: 1000px">
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.type"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="delExtraInfo(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addExtraInfo()">添加</el-button>
    </el-form-item>
    <el-form-item label="拍卖会详细描述：" class="" prop="detailExtraInfo">
      <el-table :data="form.detailExtraInfo" border style="width: 1000px">
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.type"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.label"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.text"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="delDetailExtraInfo(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addDetailExtraInfo()">添加</el-button>
    </el-form-item>


    <el-form-item>
      <el-button @click="$router.push('/auction')">返回</el-button>
      <el-button type="primary" @click="saveEdit">确 定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      companyList: {
        type: Array,
        default() {
          return []
        }
      },
      stateList: {
        type: Array,
        default() {
          return []
        }
      },
    },
    data() {
      return {
        rules: {}
      }
    },
    methods: {
      addDetailExtraInfo() {
        var newLine = { type: "", label: "", text: "" };
        this.form.detailExtraInfo.push(newLine)
      },
      delDetailExtraInfo(index, row) {
        this.form.detailExtraInfo.splice(index, 1)
      },
      addExtraInfo() {
        var newLine = { type: "", label: "", text: "" };
        this.form.extraInfo.push(newLine)
      },
      delExtraInfo(index, row) {
        this.form.extraInfo.splice(index, 1)
      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.coverPic = res.data;
          }
        });
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.form.sessionCode=this.$route.query.sessionCode;
            if (this.$route.query.specialCode) {
              this.$post("/market/updateSpecials", this.form).then(res => {
                if (res.code == 200) {
                  // this.$router.push("/auction")
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/insertSpecials", this.form).then(res => {
                if (res.code == 200) {
                  // this.$router.push("/auction")
                  this.$message.success(res.msg)
                }
              })
            }

          }
        })
      },

    }
  }
</script>
<style scoped>
  .handle-input {
    width: 400px;
    display: inline-block;
  }

  .img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .el-form h2 {

    font-weight: 400;
    font-size: 18px;
    padding: 5px 0 15px;
  }
</style>