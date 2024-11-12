<template>
  <div class="login-container">
    <div class="form">
      <h1>科技文献分析推荐系统</h1>
      <el-card shadow="never" class="login-card">
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <div class="phone">
            <el-form-item prop="userName" class="phoneItem">
              <el-input v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </div>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="login" style="width: 100%;" type="primary"> 登录 </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  data() {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],

        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.form.validate((isOK) => {
        if (isOK) {
          const { userName, password } = this.loginForm;
          login(userName, password).then(response => {
            console.log(response)
            if (response === "Invalid username or password") {
              this.$message.error('用户名或密码错误');
            } else {
              this.$message({
                message: '登录成功！',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.$store.commit('recomPaper/setPaper', response)
                  this.$router.push('/recommend')
                }
              });
            }
          }).catch(error => {
            if (error.response && error.response.data) {
              this.$message.error(error.response.data.message || '登录请求失败');
            } else {
              this.$message.error('登录请求失败');
            }
          });
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: rgba(38, 72, 176) url(../../assets/111.jpg) no-repeat center / cover;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgb(255, 255, 255);
    border-radius: 15px;
    width: 500px;
    height: 400px;

    .phone {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .phoneItem {
        flex: 1;
      }
    }

    .verify {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .verifyItem {
        flex: 1;
      }
    }

    .el-card {
      padding: 0;
      width: 450px;
    }

    h1 {
      padding-left: 20px;
      font-size: 30px;
    }

    .el-input {
      // width: 350px;
      height: 44px;

      .el-input__inner {
        background: #f4f5fb;
      }
    }

    .el-checkbox {
      color: #606266;
    }
  }
}
</style>