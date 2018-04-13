## 关于

功能函数

`npm install hyj-func --save`

## 功能

1. 对象数组按日期降序排序

使用方式

```javascript
/*
 * 实现功能：传入对象数组，对象相同年月组成集合数组，每个集合数组内部按照日、时分秒排序
 * @requires array 需要排序的对象数组
 * @requires timeName example--'distributeTime' format--'2017-3-5 12:15:32' 需要排序的字段名称
 * @return {object,objectKeys} 返回排序后的数组对象及排好序的key，这里的每一个对象值为一个数组，包含的是相同年月的对象集合
 * @return falseObject 传入不合规则参数，返回falseObject
 */

import { objectInArraySort } from hyj-func

objectInArraySort(arr,'time')
```

2. url 参数截取

使用方式

```javascript
/*
 * 实现功能：传入url，返回GET参数
 * @requires url 原始url
 * @return {} 返回参数对象集合
 */

import { urlGetParamsForObject } from hyj-func

urlGetParamsForObject(url)
```

3. 文件下载

使用方式

```javascript
/*
 * 实现功能：传入url，文件下载
 * @requires url 原始url
 */

import { downloadFileForUrl } from hyj-func

downloadFileForUrl(url)
```

4. 对象判等

使用方式

```javascript
/*
 * 实现功能：传入2个对象，判断是否key-value相同
 * @requires a, b
 * 注意: 忽略NAN、undefined
 * from: https://github.com/mqyqingfeng/Blog/issues/41
 */

import { objectEquals } from hyj-func

objectEquals(obj1, obj2)
```

5. 日期区间获取

使用方式

```javascript
/*
 * 获取起始时间
 * 实现功能：传入字符串，返回时间区间
 * @require type latestWeek latestMonth latestThreeMonthes lastYear lastThreeYears
 * @return obj startTime endTime
 * @example {startTime: '2018.4.6', endTime: '2018.4.13'}
 * on: 2018.4.13
 */

import { getTimeSection } from hyj-func

getTimeSection('latestWeek')
```
