<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="120px">
    <h2>拍卖会基本信息</h2>
 
    <el-form-item label="拍卖会标题：" prop="name">
      <el-input v-model="form.name" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖公司名称：" prop="simpleName">
      <el-input v-model="form.simpleName" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖公司：" prop="organCode">
      <el-select v-model="form.organCode" filterable placeholder="请选择类型" class="handle-input mr10">
        <el-option v-for="(item,index) in companyList" :key="index" :label="item.simpleName" :value="item.organCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拍卖时间：" prop="auctionTime">
      <el-input v-model="form.auctionTime" placeholder="请输入" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会状态：">
      <el-select v-model="form.status" placeholder="请选择类型" class="handle-input mr10">
        <el-option v-for="(item,index) in stateList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="拍卖会排序：" prop="orders">
      <el-input v-model="form.orders" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="成交率：" prop="dealRate">
      <el-input v-model="form.dealRate" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="成交总额：" prop="dealTotal">
      <el-input v-model="form.dealTotal" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="拍卖会图片：" prop="picUrl">
      <label for="inputId" icon="el-icon-plus">
        <img v-if="form.picUrl" :src="form.picUrl" class="img" />
        <img v-else src="~assets/img/headportrait.png" class="img" alt="">
        <input style="display: none" id="inputId" ref="input" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
      </label>
    </el-form-item>
    <h2>其他描述信息</h2>
    <el-form-item label="变化类型：" class="" prop="detailExtraInfo">
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
            <el-button type="primary" size="mini" @click="delAuctionLine(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" @click="addAuctionLine()">添加</el-button>
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
      addAuctionLine() {
        var newLine = { type: "", label: "", text: "" };
        this.form.detailExtraInfo.push(newLine)
      },
      delAuctionLine(index, row) {
        this.form.detailExtraInfo.splice(index, 1)
      },
      //上传图片
      handleFileChange(e) {
        let file = e.target.files[0];
        let formdata = new FormData();
        formdata.append("file", file);
        this.$uploadPost("/upload/pictureOrVideo", formdata).then((res) => {
          if (res.code == 200) {
            this.form.picUrl = res.data;
          }
        });
      },
      // 保存编辑
      saveEdit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.$route.query.sessionCode) {
              this.$post("/market/updateAuction", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/auction")
                  this.$message.success(res.msg)
                }
              })
            } else {
              this.$post("/market/insertAuction", this.form).then(res => {
                if (res.code == 200) {
                  this.$router.push("/auction")
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