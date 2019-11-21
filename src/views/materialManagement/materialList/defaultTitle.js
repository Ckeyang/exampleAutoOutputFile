let defaultTitle = [
  {
    key: 'category',
    value: '物质类别'
  },
  {
    key: 'name',
    value: '物质名称'
  },
  {
    key: 'casNo',
    value: 'CasNo'
  },
  {
    key: 'formula',
    value: '分子式'
  },
  {
    key: 'remark',
    value: '备注'
  }
];

let getTitle = function(obj) {
  // let keys = Object.keys(obj);
  // let curTitle = defaultTitle.map((e) => {
  //   if (keys.indexOf(e.key) >= 0) {
  //     return e;
  //   }
  // });
  return defaultTitle;
};

export { getTitle };
