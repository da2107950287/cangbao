<template>
 <div class="container">
   
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="课程类型：">
      <el-select v-model="form.couType" placeholder="请选择类型" class="handle-select mr10">
        <el-option v-for="(item,index) in dictionarysList" :key="index" :label="item.dicName" :value="item.dicId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="课程名称：">
      <el-input v-model="form.couName" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="课程作者：">
      <el-input v-model="form.author" class="handle-input"></el-input>
    </el-form-item>
    <el-form-item label="课程状态：">
      <el-select v-model="form.state" placeholder="请选择类型" class="handle-select mr10">
        <el-option v-for="(item,index) in statesList" :key="index" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="课程封面：" prop="cover" class="personal-icon">
      <label for="inputId" icon="el-icon-plus">
        <img v-if="form.cover" :src="form.cover" />
        <img v-else src="~assets/img/headportrait.png" alt="">
        <input style="display: none" id="inputId" ref="input" type="file"
          accept="image/gif, image/jpeg, image/jpg, image/png, image/svg" @change="handleFileChange" />
      </label>
    </el-form-item>
    <el-form-item label="课程介绍：" prop="intro">
      <editor-bar :value="form.intro" v-model="form.intro"></editor-bar>
    </el-form-item>
    <el-form-item >
      <el-button @click="editVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveEdit">确 定</el-button>
 
    </el-form-item>
    </el-form>
 </div>
</template>
<script>
  export default{
    data(){
      return{
        form:{},
        rules:{},
        statesList: [
          { id: "all", name: "全部" },
          { id: 1, name: "上架" },
          { id: 2, name: "下架" }
        ],
        dictionarysList:[]
      }
    },
    methods:{
      saveEdit(){

      },
      handleFileChange(){

      }
    }
  }
</script>
<style scoped>
  .handle-select{
    width: 300px;
  }
  .handle-input{
    width: 300px;
  }
</style>