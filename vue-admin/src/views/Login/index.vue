<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          :class="{ current: index === currentIndex }"
          v-for="(item, index) in menuTab"
          :key="item.id"
          @click="toggleMenu(index)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!--表单 start-->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="default"
      >
        <el-form-item
          prop="username"
          class="item-from"
        >
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="password"
          class="item-from"
        >
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="passwords"
          class="item-from"
          v-show="model === 'register'"
        >
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="code"
          class="item-from"
        >
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <!-- 发送验证码 -->
            <el-col :span="9">
              <el-button
                type="success"
                class="block code"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{ codeButtonStatus.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm()"
            class="login-btn block"
            :disabled="loginButtonStatus"
          >{{ model === "login" ? "登录" : "注册" }}</el-button>
        </el-form-item>
      </el-form>
      <!-- <button @click="remove()">按钮</button> -->
    </div>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  watch,
  getCurrentInstance,
  nextTick,
} from "vue";

import {
  stripscript,
  validatePass,
  validateEmail,
  validateVCode,
} from "../../utils/validate";
import { GetSms, Register, Login } from "@/api/login";
import { ElMessage } from "element-plus";
import sha1 from "js-sha1";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  setup(props, { refs, root }) {
    // ******************************声明变量部分******************************
    const isActive = ref(false);
    const loginForm = ref(null);
    const currentIndex = ref(0);
    const router = useRouter();
    const store = useStore();
    const { ctx } = getCurrentInstance();
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" },
    ]);
    const toggleMenu = (index) => {
      currentIndex.value = index;
      model.value = menuTab[index].type;
      loginForm.value.resetFields();
      clearCountDown();
    };
    onMounted(() => {
      // console.log(ctx.$refs);
    });

    // 模块值
    const model = ref("login");
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true);
    // 验证码按钮状态
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码",
    });
    let timer = ref(null);

    // 倒计时

    const countDown = (time) => {
      codeButtonStatus.text = `已发送(${time})`;
      if (timer.value) {
        clearInterval(timer.value);
      }
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          codeButtonStatus.status = false;
          codeButtonStatus.text = `再次获取`;
        } else {
          codeButtonStatus.text = `已发送(${time})`;
        }
      }, 1000);
    };
    // 登录函数
    const login = () => {
      console.log(111);
      store.dispatch("app/login").then((res) => {
        console.log(res);
        
        if (res.resCode == 0) {
          router.push("/console");
        }
        
        // const {username, token} = res.data
        const token = res.data.token;
        const username = res.data.username;
        store.commit("app/SET_TOKEN", token);
        store.commit("app/SET_USERNAME", username);
        console.log(res);
        console.log(store.state.app);
      });

      console.log("login");
    };
    // 注册函数
    const register = () => {
      /*   let data = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code,
      }; */
      Register()
        .then((res) => {
          console.log(res);
          // 注册成功后要切换到登录页面
          toggleMenu(menuTab.findIndex((item) => item.type === "login"));
          ElMessage({
            message: `${res.message} 请登录`,
            type: "success",
          });
        })
        .catch((err) => Promise.reject(err));
      console.log("register");
    };
    // 表单绑定数据
    let ruleForm = reactive({
      username: "410293095@qq.com",
      password: "wo123456789",
      passwords: "wo123456789",
      code: "akdjfd",
    });

    // *******************************验证表单部分*************************************
    // 验证用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱用户名"));
      } else if (!validateEmail(value)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback(); //true
      }
    };
    // 验证密码
    let validatePassword = (rule, value, callback) => {
      // 过滤后的数据
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    let validatePasswords = (rule, value, callback) => {
      // 如果模块值为login, 直接通过
      if (model.value === "login") {
        callback();
      } else {
        // 过滤后的数据
        if (value === null) {
          callback(new Error("请再次输入密码"));
        } else if (value != ruleForm.password) {
          callback(new Error("重复密码不正确"));
        } else {
          ruleForm.passwords = stripscript(value);
          value = ruleForm.passwords;
          callback();
        }
      }
    };

    // 验证验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (!validateVCode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    // 获取验证码函数
    const getSms = () => {
      console.log(validateEmail(ruleForm.username));

      if (!ruleForm.username) {
        ElMessage({
          message: "用户名不能为空!",
          type: "warning",
        });
        return false;
      } else if (!validateEmail(ruleForm.username)) {
        ElMessage({
          message: "用户名格式错误!",
          type: "error",
        });
        return false;
      } else {
        let requestData = { username: ruleForm.username, module: model.value };
        codeButtonStatus.status = true;
        GetSms(requestData)
          .then((res) => {
            ElMessage({
              message: res.message.slice(0, 6),
              type: "success",
            });
            console.log(res);

            // 启用登录或注册按钮
            loginButtonStatus.value = false;
            countDown(4);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    // 提交表单
    const submitForm = () => {
      // 校验element-plus的表单
      loginForm.value.validate((valid) => {
        if (valid) {
          console.log("校验成功");
          model.value === "login" ? login() : register();
        } else {
          console.log("校验失败");
          return false;
        }
        // 如果这里打印验证成功后又打印验证失败,可能是因为发请求的地方出了问题, 或者Promise没写new等
      });
    };

    // 清除倒计时方法
    const clearCountDown = () => {
      codeButtonStatus.status = false;
      codeButtonStatus.text = "获取验证码";
      if (timer.value) {
        clearInterval(timer.value);
        console.log("执行了清除倒计时");
      }
    };
    // 表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }],
    });
    const remove = () => {
      // localStorage.removeItem("vue-admin.app.token");
      // let result = localStorage.getItem("vue-admin");
      // result = JSON.parse(result);
      //  const app = result.app;
      // app.token = null;
      // console.log(result);
    };
    return {
      menuTab,
      isActive,
      toggleMenu,
      currentIndex,
      rules,
      model,
      loginButtonStatus,
      codeButtonStatus,
      ruleForm,
      timer,
      getSms,
      loginForm,
      submitForm,
      clearCountDown,
      remove,
    };
  },
};
</script>

<style lang="less" scoped>
.code {
  margin-left: 10px;
  padding: 10px 20px;
}
.input {
  box-sizing: border-box;
}
#login {
  height: 100vh;
  background-color: #344a5f;
  // overflow: hidden;
}
.el-row {
  align-items: flex-end;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    margin-bottom: 3px;
    font-size: 14px;
    color: #fff;
  }
  .item-from {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>