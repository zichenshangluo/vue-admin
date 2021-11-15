<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleMenu(item)"
        >
          {{ item.txt }}
        </li>
      </ul>
      <!--   表单   -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
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
          prop="password2"
          class="item-form"
          v-show="model === 'register'"
        >
          <label for="password2">重复密码</label>
          <el-input
            id="password2"
            type="password"
            v-model="ruleForm.password2"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input id="code" v-model.number="ruleForm.code"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButton.status"
                >{{ codeButton.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginButtonStatus"
            >{{ model === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import { ref, reactive, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validatePwd,
  validateEmail,
  validateCod,
} from "@/utils/validate";
export default {
  name: "login",
  //VUE3必须使用setup  这里面防止data数据、生命周期、自定义的函数等
  //setup(props, context)
  /**
   * context包含的内容:
   * attrs:(..)  == this.$attrs
   * emit:(..) == this.$emit
   * listeners:(..) == this.$listeners
   * parent:(..) == this.$parent
   * refs:(..) == this.$refs
   * root:(..) == this
   */
  setup(props, { refs, root }) {
    /***********************************************************************
     * 声明内部方法（即在setup中调用的方法）
     */
    //验证用户名（邮箱）
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (!validateEmail(value)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback(); //true
      }
    };
    //验证密码
    let validatePassword = (rule, value, callback) => {
      //过滤特殊字符，然后绑定到密码框中
      ruleForm.password = stripscript(value);
      value = ruleForm.password;

      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validatePwd(value)) {
        callback(new Error("密码为6至20位的数字+字母!"));
      } else {
        callback();
      }
    };
    //验证重复密码
    let validatePassword2 = (rule, value, callback) => {
      //如果是登录，则直接跳过
      if (model.value === "login") {
        callback();
      }

      //过滤特殊字符，然后绑定到密码框中
      ruleForm.password2 = stripscript(value);
      value = ruleForm.password2;

      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确!"));
      } else {
        callback();
      }
    };
    //验证验证码
    let validateCode = (rule, value, callback) => {
      console.log(11111);
      //过滤特殊字符，然后绑定到验证验框中
      ruleForm.code = stripscript(value);
      value = ruleForm.code;

      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (!validateCod(value)) {
        callback(new Error("验证码格式有误!"));
      } else {
        callback();
      }
    };

    /****************************************************************************
     * 声明data
     */
    // 定义登录、注册按钮   VUE3申明一个对象类型用rective，取值用menuTab
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" },
    ]);
    // 模块值   VUE3申明一个数据类型用ref，取值用model.value
    const model = ref("login");
    // 登录状态禁用状态
    const loginButtonStatus = ref(true);
    // 获取验证码按钮的对象
    const codeButton = reactive({
      status: false, // 按钮状态（是否可用）
      text: "获取验证码", // 按钮文字（"获取验证码"、“获取中”）
    });
    //倒计时
    const timer = ref(null);
    //表单数据
    const ruleForm = reactive({
      username: "",
      password: "",
      password2: "",
      code: "",
    });
    //校验数据对象
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      password2: [{ validator: validatePassword2, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }],
    });

    /***************************************************************************
     * 声明生命周期
     */
    //挂载完成时（生命周期其中一个）
    onMounted(() => {});

    /***************************************************************************
     * 声明函数
     */
    //切换登录/注册
    const toggleMenu = (data) => {
      menuTab.forEach((elem) => {
        elem.current = false;
      });
      //高光
      data.current = true;
      //修改模块值
      model.value = data.type;
      //重置表单
      resetFormData();
      //清除定时器
      clearCountDown();
    };
    //清除表单数据
    const resetFormData = () => {
      refs.loginForm.resetFields();
    };
    //更新按钮状态
    const updateButtonStatus = (config) =>{
      codeButton.status = config.status;
      codeButton.text = config.text;
    };
    //获取验证码
    const getSms = () => {
      //进行提示
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空！");
        return false;
      }
      if (!validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式有误，请重新输入！");
        return false;
      }
      //声明发送请求的参数对象
      let requestData = {
        username: ruleForm.username,
        module: model.value,
      };
      //修改获取验证码按钮状态
      updateButtonStatus({
        status: true,
        text: "获取中"
      });

      //请求接口  获取验证码
      GetSms(requestData)
        .then((response) => {
          let data = response.data;
          root.$message({
            message: data.message,
            type: "success",
          });
          //请求获取验证码成功后，启用登录或注册按钮
          loginButtonStatus.value = false;
          //调定时器，倒计时
          countDown(60);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    //倒计时
    const countDown = (number) => {
      //判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      /**
       * setTimeout 只执行一次
       * setInterval 不断的执行，需要条件才会停止
       */
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          //倒计时截止，清除定时器
          clearInterval(timer.value);
          updateButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          codeButton.text = `倒计时${time}秒`; //这是ES6的写法，传统es5写法：'倒计时'+time+'秒'
        }
      }, 1000);
    };
    //清除定时器
    const clearCountDown = () => {
      //还原验证码按钮默认状态
      updateButtonStatus({
        status: false,
        text: "获取验证码"
      });
      //清除倒计时
      clearInterval(timer.value);
    };
    //提交
    const submitForm = (formName) => {
      refs[formName].validate((valid) => {
        //表单验证通过
        if (valid) {
          model.value === "login" ? login() : register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    //登录
    const login = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password), //sha1加密
        code: ruleForm.code,
      };
      Login(requestData)
        .then((response) => {
          let data = response.data;
        })
        .catch((error) => {

        });
    };
    //注册
    const register = () => {
      let requestData = {
        username: ruleForm.username,
        password: sha1(ruleForm.password),
        code: ruleForm.code,
        model: model.value
      };

      Register(requestData).then(response => {
        let data = response.date;
        root.$Message({
          message: data.message,
          type: "success"
        });
        //提示注册成功后
        toggleMenu(menuTab[0]);
        clearCountDown();
      }).catch(error => {
        //注册失败时的操作
      });
    };

    /**
     * 将在外部引用的数据抛出去
     */
    return {
      menuTab,
      model,
      loginButtonStatus,
      codeButton,
      ruleForm,
      rules,
      toggleMenu,
      getSms,
      submitForm,
    };
  },
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
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
  .item-form {
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
