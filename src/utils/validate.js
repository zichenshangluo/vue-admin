/**
 * 验证规则文件
 */

/**
 *过滤特殊字符
 */
export function stripscript(str) {
  console.log(str);
  var pattern = new RegExp(
    "[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（） &;—|{}【】‘；：”“\"'。，、？]"
  );
  var rs = "";
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, "");
  }
  return rs;
}

/**
 * 验证密码
 */
export function validatePwd(value) {
  //定义密码的正则
  let reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/;
  return reg.test(value);
}
/**
 * 验证邮箱
 */
export function validateEmail(value) {
  //定义邮箱的正则
  let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
  return reg.test(value);
}
/**
 * 验证验证码 6-20位的字母+数字
 */
export function validateCod(value) {
  //定义验证码的正则
  let reg = /^[a-z0-9]{6}$/;
  return reg.test(value);
}
