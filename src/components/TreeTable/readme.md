
## prop说明
#### *data*
  **必填**

  原始数据,要求是一个数组
  ```javascript
    [{
      key1: value1,
      key2: value2,
      children: [{
        key1: value1
      },
      {
        key1: value1
      }]
    },
    {
      key1: value1
    }]
  ```
  或者
 ```javascript
    {
      key1: value1,
      key2: value2,
      children: [{
        key1: value1
      },
      {
        key1: value1
      }]
    }
  ```
#### *props*
**配置字段**
{
  children:'children'
}

#### columns (可选)
  列属性,要求是一个数组

  1. label: 显示在表头的文字，同el-table-column 的label
  2. prop: 同el-table-column prop
  3. width: 每列的宽度，为一个数字(可选)
  
  ```javascript
  [{
    prop:string,
    label:string,
    width:number
  },{
    prop:string,
    label:string,
    width:number
  }]
  ```

#### expandAll
  是否默认全部展开，boolean值，默认为false
 需要自定义显示的时候使用， 同el-table-column 
 ## slot
 这是一个自定义列的插槽。
