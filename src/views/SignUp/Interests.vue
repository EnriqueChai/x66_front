<template>
  <div class="interestContainer">
    <h1>请选择你的兴趣领域</h1>
    <div class="main">
      <el-checkbox-group v-model="selectedInterests" class="checkbox-group">
        <el-checkbox v-for="(interest, index) in interests" :key="index" :label="interest.label">
          {{ interest.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <el-button type="primary" @click="confirm"> 确定 </el-button>
  </div>
</template>

<script>
import { interest } from '@/api/user'
export default {
  data() {
    return {
      selectedInterests: [],
      interests: [
        { label: 'Math - 数学' },
        { label: 'Biotechnology - 生物技术' },
        { label: 'Software Engineering - 软件工程' },
        { label: 'Environmental Science - 环境科学' },
        { label: 'Medicine - 医学' },
        { label: 'History - 历史学' },
        { label: 'Law - 法学' },
        { label: 'Robotics - 机器人技术' },
        { label: 'Artificial Neural Networks - 人工神经网络' },
        { label: 'Electrical Engineering - 电气工程' },
        { label: 'Civil Engineering - 土木工程' },
        { label: 'Education Technology - 教育技术' },
        { label: 'Psychology - 心理学' },
        { label: 'Finance - 金融' },
        { label: 'Astronomy - 天文学' },
        { label: 'Natural Language Processing - 自然语言处理' }
      ]
    }
  },
  computed: {
    selectedInterestsFiltered: {
      get() {
        return this.selectedInterests.map((item) =>
          item.split(' - ')[0].trim()
        );
      },
      set(values) {
        this.selectedInterests = this.interests
          .filter((interest) => values.includes(interest.label.split(' - ')[0].trim()))
          .map((interest) => interest.label);
      }
    }
  },
  methods: {
    confirm() {
      if (this.selectedInterests.length === 0) {
        alert("至少选择一项兴趣领域")
      } else {
        interest(this.$route.params.userName, this.selectedInterestsFiltered).then(response => {
          if (response === "Hobbies updated successfully") {
            this.$message({
              message: '兴趣选择成功！返回登录页面',
              type: 'success',
              duration: 1000,
              onClose: () => {
                this.$router.push('/login');
              }
            });
          } else if (response === "User not found") {
            this.$message({
              message: '用户不存在！跳转到注册页面',
              type: 'warning',
              duration: 1000,
              onClose: () => {
                this.$router.push('/signup');
              }
            });
          }
        }).catch(error => {
          if (error.response && error.response.data) {
            this.$message.error(error.response.data.message || '失败');
          } else {
            this.$message.error('失败');
          }
        });
      }
    }
  }
}
</script>

<style lang="scss">
.interestContainer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(#dff3f9, #ffffff, #ffffff);

  .main {
    justify-items: center;
    width: 1600px;
    height: 220px;
    background: rgb(255, 255, 255);
    border-radius: 15px;
    box-shadow: 0 0 10px 0 #a8a8a8;
    padding: 30px;
  }

  h1 {
    font-size: 50px;
    margin: 40px
  }

  .checkbox-group {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .el-checkbox {
    margin: 5px 0;
  }

  .el-checkbox__label {
    font-size: 20px;
  }

  .el-button--primary {
    margin-top: 50px;
    width: 120px;
    height: 60px;
    font-size: 20px;
  }
}
</style>