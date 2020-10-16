<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="圈子名称：">
      <div class="fcolor">{{form.cirName}}</div>
    </el-form-item>
    <el-form-item label="发布者：">
      <div class="fcolor">{{form.nickname}}</div>
    </el-form-item>
    
    
    <el-form-item label="发布内容：">
      <div class="fcolor" v-html="form.content"></div>

    </el-form-item>
    <el-form-item label="发布时间：" prop="state">
      <div class="fcolor">{{form.dyTime}}</div>
    </el-form-item>
    <el-form-item label="发布者头像：" prop="cirUrl" class="personal-icon">
     <el-image :src="form.headportrait"></el-image>
    </el-form-item>
    <el-form-item label="圈子封面：" prop="cirCover" class="personal-icon">
      <video v-if="form.dyType==1" :src="form.picture" controls
      style="width: 200px;height: 100px;"></video>
    <el-image v-else-if="form.dyType==2" :src="form.picture" style="width: 200px;height: 100px;">
    </el-image>
    </el-form-item>
    <el-form-item>
      <el-button @click="goback">返 回</el-button>
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
    
    },
    data() {
      return {
       
      }
    },
    methods: {
    
      goback() {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .handle-select {
    width: 300px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .fcolor{
    color: #606266;
  }
</style>