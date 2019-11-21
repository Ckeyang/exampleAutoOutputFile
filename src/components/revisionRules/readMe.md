## 物质和公式的修约规则

## 参数
  @params { value }  通过v-model绑定
  @params { size }  按钮尺寸
  @params { btnTilte }  按钮文案
  @params { hasRuleBtnTilte }  有规则时的按钮文案

## 结构
{
  ruleType: 'NONE',
  conditions:{
    integerBit : 2, // 整数位
    decimalBit : 2 // 小数位
  },
  scientificResultDecimalBit : 2 , //科学计数法保留小数位数
  ordinaryResultDecimalBit : 2 // 不满足条件保留小数位数
}

## result  点击保存按钮，将最新规则传递给绑定值，点击取消则保留原始规则