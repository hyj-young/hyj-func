/*
 * HOC-arrayVerify
 * 数组参数验证高阶函数
 * @require func 需要修饰的函数
 * designer: heyunjiang
 * time: 2018.5.8
 */
const hocArrayVerify = (func)=>{
  return (data)=>{
    if(data&&!Array.isArray(data)) {
      console.error('param is not an array for '+ func.prototype.constructor.name +' method')
    } else {
      return func(data)
    }
  }
}

module.exports = {
	hocArrayVerify
}