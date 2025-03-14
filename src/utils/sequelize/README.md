1.在使用sequelize findAll等函数返回的是模型实例,数据存放在dataValue属性中,如果需要返回原始数据,可以查询时设置raw为true

```js
raw: true
```
但是这样设置会导致数据是原始数据，没有模型处理后的字段，如：

```
getterMethods
createdAt
updatedAt
都不会生效
```

2.或者取值时使用data.get({plain: true})或者data.toJson()，推荐下面两种方式

```js
rows.map(row => row.get({plain: true}))
rows.map(row => row.toJson())
```