// 提交数据验证
const formValidate = function(data) {
  let errorMesg = [] //存储错误信息
  // 空格检验
  if (data.formValue.stringValue && /^[ ]*$/.test(data.formValue.stringValue)) {
    errorMesg.push({
      name: data.componentAttr.tag,
      errorMesg: '内容不能全为空格！'
    })
    return errorMesg
  }
  switch (data.componentType) {
    case 'TEXTBOX': {
      if (data.formValue.stringValue.length) {
        if (data.componentAttr.inputModle.inputType === 'NUMBERS') {
          // 数字校验
          errorMesg = numberValidate(data, errorMesg)
          errorMesg = rangeValueValidate(data, errorMesg)
        } else {
          // 字符长度校验
          errorMesg = rangeLengthValidate(data, errorMesg)
        }
      }
      break
    }
  }
  return errorMesg
}
// 数字校验
const numberValidate = function(data, errorMesg) {
  if (!new RegExp(/^(-?\d+)(\.\d+)?$/).test(data.formValue.stringValue)) {
    errorMesg.push({
      name: data.componentAttr.tag,
      errorMesg: '输入内容格式错误, 请输入数字！'
    })
  }
  return errorMesg
}
// 数据范围校验
const rangeValueValidate = function(data, errorMesg) {
  const stringValue = Number(data.formValue.stringValue)
  const minLengthTextBox = parseInt(data.componentAttr.minLengthTextBox)
  const maxLengthTextBox = parseInt(data.componentAttr.maxLengthTextBox)
  if (data.componentAttr.minLengthTextBox && stringValue < minLengthTextBox) {
    errorMesg.push({
      name: data.componentAttr.tag,
      errorMesg: `输入值不小于 ${minLengthTextBox}`
    })
  }
  if (data.componentAttr.maxLengthTextBox && stringValue > maxLengthTextBox) {
    errorMesg.push({
      name: data.componentAttr.tag,
      errorMesg: `输入值小于等于 ${maxLengthTextBox}`
    })
  }
  return errorMesg
}
// 字符长度校验
const rangeLengthValidate = function(data, errorMesg) {
  const valueLength = data.formValue.stringValue.length
  const minLengthTextBox = parseInt(data.componentAttr.minLengthTextBox)
  const maxLengthTextBox = parseInt(data.componentAttr.maxLengthTextBox)
  if (data.componentAttr.minLengthTextBox && valueLength < minLengthTextBox) {
    errorMesg.push({
      name: data.componentAttr.tag,
      errorMesg: `输入内容不小于${minLengthTextBox}字符`
    })
  }
  if (data.componentAttr.maxLengthTextBox && valueLength > maxLengthTextBox) {
    errorMesg.push({
      name: data.componentAttr.tag,
      errorMesg: `输入内容不超过${maxLengthTextBox}字符`
    })
  }
  return errorMesg
}
export default formValidate
