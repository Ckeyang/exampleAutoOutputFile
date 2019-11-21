拖拽控件 封装
基于sortabledjs 封装
参数两个  v-model , props
v-model 为 数组
props 为 数组
如下:
ruleProps: [
        {
          key: "ruleType",
          label: "规则类型",
          formatter: row => {
            return this.ruleTypes
              .map(item => {
                if (item.key === row.ruleType) {
                  return item.value;
                }
              })
              .join("");
          }
        },
        { key: "name", label: "规则名称" },
        { key: "description", label: "规则描述" }
      ]