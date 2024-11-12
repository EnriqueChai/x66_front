<template>
  <div class="sign-container">
    <div class="form">
      <h1>科技文献分析推荐系统</h1>
      <el-card shadow="never" class="login-card">
        <el-form ref="form" :model="signForm" :rules="signRules">
          <div class="phone">
            <el-form-item prop="userName" class="phoneItem">
              <el-input v-model="signForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </div>

          <el-form-item prop="password">
            <el-input v-model="signForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item prop="password2">
            <el-input v-model="signForm.password2" show-password placeholder="请再次输入密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="signup" style="width: 100%;" type="primary"> 注册 </el-button>
          </el-form-item>

          <el-form-item>
            <a @click="goToLogin">已有账号？点击登录</a>
          </el-form-item>

        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { signUp } from '@/api/user'

export default {
  data() {
    return {
      signForm: {
        userName: '',
        password: '',
        password2: '',
      },
      signRules: {
        userName: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],

        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],

        password2: [{
          required: true,
          message: '重复密码不能为空',
          trigger: 'blur'
        }, {
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === this.signForm.password) {
              callback()
            } else {
              callback(new Error('密码不一致'))
            }
          }
        }]
      }
    }
  },
  methods: {
    signup() {
      this.$refs.form.validate((isOK) => {
        if (isOK) {
          const { userName, password, password2 } = this.signForm;
          signUp(userName, password).then(response => {
            if (response === userName) {
              this.$message({
                message: '注册成功！',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.$router.push({
                    name: 'interests',
                    params: { userName }
                  });
                }
              });
            } else if (response === "User already exists") {
              this.$message({
                message: '用户已存在！跳转到登录页面',
                type: 'warning',
                duration: 1000,
                onClose: () => {
                  this.$router.push('/login');
                }
              });
            }
          }).catch(error => {
            if (error.response && error.response.data) {
              this.$message.error(error.response.data.message || '注册请求失败');
            } else {
              this.$message.error('注册请求失败');
            }
          });
        }
      })
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
.sign-container {
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
    height: 600px;

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