<template>
    <div>
        <el-form :rules="rules" :model="loginForm" class="login-container" ref="loginForm">
            <h3 class="login-title">System login</h3>
            <el-form-item label="username" prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off"
                    placeholder="Please enter username"></el-input>
            </el-form-item>
            <el-form-item label="password" prop="password">
                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                    placeholder="Please enter password" @keydown.enter.native="submitLogin"></el-input>
            </el-form-item>
            <el-checkbox class="login-remember" v-model="checked"></el-checkbox>
            <el-button type="primary" style="width:100%;" @click="submitLogin">
                Login
            </el-button>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'Login',
    data() {
        return {
            rules: {
                username: [
                    { required: true, message: 'Please input username', trigger: 'blur' },
                    // { min: 3, max: 10, message: 'username must be between 3 and 10 characters', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: 'Please input password', trigger: 'blur' },
                    // { min: 6, max: 10, message: 'password must be between 6 and 10 characters', trigger: 'blur' }
                ]
            },
            loginForm: {
                username: 'admin',
                password: '123'
            },
            checked: true
        }
    },
    methods: {
        submitLogin() {
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
                        if (resp) {
                            window.sessionStorage.setItem('user', JSON.stringify(resp));
                            let path = this.$route.query.redirect;
                            this.$router.replace((path == '/' || path == undefined) ? '/home' : path);
                        }
                    });
                } else {
                    this.$message.error('Please input username and password')
                    return false
                }
            })
        }
    }
}
</script>
<style>
.login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.login-title {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
}

.login-remember {
    text-align: left;
    margin: 0px 0px 15px 0px;
}
</style>