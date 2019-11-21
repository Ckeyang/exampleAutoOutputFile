### 解析规则tool使用介绍

    提供方法有：
    init(rule); //初始化 （可以不用）
    parsing(obj, rule = ''); //解析 如果没有初始化 需要传入rule
    getFlagById();//根据fieldId 获取 此字段的flag 综合flag 传入root
    getRootFlag(); // 综合flag
    getGroupFlag(); //全部分组的flag 数组
    
    数据模型比较重要的两个：
    obj的数据模型为：{fieldId:value} 例如 {12421351235:'80'}
    rule的数据模型为：[
            {
            expressions: [
                {
                expressionType: 'COMPONENT',
                identifier: 'string',
                leftSide: 'string',
                nextExpression: {
                    connectionType: 'AND',
                    identifier: 'string'
                },
                operator: 'string',
                previousExpression: {
                    connectionType: 'AND',
                    identifier: 'string'
                },
                rightSide: 'string'
                }
            ],
            identifier: 'string',
            nextGroup: {
                connectionType: 'AND',
                identifier: 'string'
            },
            previousGroup: {
                connectionType: 'AND',
                identifier: 'string'
            }
            }
        ]

  目前测试版

