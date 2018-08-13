/*
 * 针对友云设的功能函数
 * designer：何运江
 * start at: 2018.3.8
 */

const toString = Object.prototype.toString
const _isFunction = (obj) => {
	return toString.call(obj) === '[object Function]'
}
const _deepEq = (a, b, aStack, bStack) => {
	var className = toString.call(a);
    if (className !== toString.call(b)) return false;

    switch (className) {
        case '[object RegExp]':
        case '[object String]':
            return '' + a === '' + b;
        case '[object Number]':
            if (+a !== +a) return +b !== +b;
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
        // 过滤掉两个函数的情况
        if (typeof a != 'object' || typeof b != 'object') return false;

        var aCtor = a.constructor,
            bCtor = b.constructor;
        // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
        if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }

    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    
    // 检查是否有循环引用的部分
    while (length--) {
        if (aStack[length] === a) {
            return bStack[length] === b;
        }
    }

    aStack.push(a);
    bStack.push(b);

    // 数组判断
    if (areArrays) {

        length = a.length;
        if (length !== b.length) return false;

        while (length--) {
            if (!objectEquals(a[length], b[length], aStack, bStack)) return false;
        }
    }
    // 对象判断
    else {

        var keys = Object.keys(a),
            key;
        length = keys.length;

        if (Object.keys(b).length !== length) return false;
        while (length--) {

            key = keys[length];
            if (!(b.hasOwnProperty(key) && objectEquals(a[key], b[key], aStack, bStack))) return false;
        }
    }

    aStack.pop();
    bStack.pop();
    return true;
}
// 日期格式规范 1->01, 2->02, 10->10, 12->12
const dateDayFormat = (number) => {
	number = +number;
	return number<10?0+''+number:''+number
}

/*
 * 1. 对象数组按日期降序排序
 * 实现功能：传入对象数组，对象相同年月组成集合数组，每个集合数组内部按照日、时分秒排序
 * @requires array 需要排序的对象数组
 * @requires timeName example--'distributeTime' format--'2017-3-5 12:15:32' 需要排序的字段名称
 * @return {object,objectKeys} 返回排序后的数组对象及排好序的key，这里的每一个对象值为一个数组，包含的是相同年月的对象集合
 * @return falseObject 传入不合规则参数，返回falseObject
 */
const objectInArraySort = (...rest)=>{
	//参数检测
	if(rest.length !== 2){return {errorMessage: '参数个数不对'}}
	if(!Array.isArray(rest[0])){return {errorMessage: '第一个参数须传入数组'}}
	if(typeof(rest[1])!=='string'){return {errorMessage: '第二个参数须传入字符串'}}

	const {array, timeName} = {array:rest[0], timeName:rest[1]}
	let object = {}, objectKeys = [], falseObject = {errorMessage: '您传入的参数有误'}
	//构造相同年月时间集合
	array.forEach(item=>{
		try{
			let nowMonth = item[timeName].split('-')[1],nowYear = item[timeName].split('-')[0]
			if(typeof(object[nowYear+'.'+nowMonth]) == 'undefined'){
				object[nowYear+'.'+nowMonth] = []
			}
			object[nowYear+'.'+nowMonth].push(item)
		}catch(e){
			falseObject.e = e
			falseObject.errorMessage = '参数格式问题'
			return falseObject
		}
	})
	//年月排序
	objectKeys = Object.keys(object)
	objectKeys.sort((a,b)=>{
		let value = 1, aArr = a.split('.'), bArr = b.split('.')
		if(+aArr[0]<+bArr[0]){
			value = 1
		}else if(+aArr[0]>+bArr[0]){
			value = -1
		}else{
	        //年相同
	        if(+aArr[1]<+bArr[1]){
	        	value = 1
	        }else{
	        	value = -1
	        }
	    }
	    return value
	})
	//日、时、分、秒排序
	for(let item in object){
		try {
			object[item].sort((a,b)=>{
				let date1 = new Date(), date2 = new Date()
				date1.setDate(a[timeName].split('-')[2].split(' ')[0])
				date2.setDate(b[timeName].split('-')[2].split(' ')[0])
				if(a[timeName].split(' ').length>1){
					date1.setHours(a[timeName].split(' ')[1].split(':')[0])
					date1.setMinutes(a[timeName].split(' ')[1].split(':')[1])
					date1.setSeconds(a[timeName].split(' ')[1].split(':')[2])
					date2.setHours(b[timeName].split(' ')[1].split(':')[0])
					date2.setMinutes(b[timeName].split(' ')[1].split(':')[1])
					date2.setSeconds(b[timeName].split(' ')[1].split(':')[2])
				}
				return date1>date2?-1:1
			})
		}catch(e){
			falseObject.e = e
			falseObject.errorMessage = '参数格式问题'
			return falseObject
		}
	}

	return {
		object,
		objectKeys
	}
}

/*
 * 2. url 尾部参数获取
 * 实现功能：传入url，返回GET参数
 * @requires url 原始url
 * @return {} 返回参数对象集合
 */
const urlGetParamsForObject = (url) => {
	if (typeof(url) !== 'string' || url.indexOf('?') === -1) {
		return {}
	}
	const obj = {}
	url.split('?')[1].split('&').forEach(item => {
		obj[item.split('=')[0]] = item.split('=')[1]
	})
	return obj
}

/*
 * 3. 文件下载
 * 实现功能：传入url，实现文件下载
 * @requires url 原始url
 */
const downloadFileForUrl = (url) => {
	if (typeof(url) !== 'string') {
		return ;
	}
	if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)&&document.body.clientWidth < 769){
		window.location.href = url
	}
	let tempLink = document.createElement('a');
	tempLink.style.display = 'none';
	tempLink.href = url;
	tempLink.setAttribute('download', '');
	if (typeof tempLink.download === 'undefined') {
		tempLink.setAttribute('target', '_blank');
	}
	document.body.appendChild(tempLink);
	tempLink.click();
	document.body.removeChild(tempLink);
}

/*
 * 4. 对象判等
 * 实现功能：传入2个对象，判断是否key-value相同
 * @requires a, b
 * 注意: 忽略NAN、undefined
 * from: https://github.com/mqyqingfeng/Blog/issues/41
 * on: 2018.4.3
 */
const objectEquals = (a, b, aStack, bStack) => {
	if (a === b) return a !== 0 || 1 / a === 1 / b;// === 结果为 true 的区别出 +0 和 -0
	if (a == null || b == null) return false;// typeof null 的结果为 object
	if (a !== a) return b !== b;// 判断 NaN
	var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return _deepEq(a, b, aStack, bStack);
}

/*
 * 5. 获取起始时间
 * @require type latestWeek latestMonth latestThreeMonthes lastYear lastThreeYears
 * @return obj startTime endTime
 * @example {startTime: '2018-04-6', endTime: '2018-04-13'}
 * on: 2018.4.13
 */
const getTimeSection = (type) => {
	const obj = {}
	const change = {
		0: '01',
		1: '02',
		2: '03',
		3: '04',
		4: '05',
		5: '06',
		6: '07',
		7: '08',
		8: '09',
		9: '10',
		10: '11',
		11: '12',
	}
	let startTime = new Date(), now = new Date()
	if (typeof(type) !== 'string') {return obj}
	switch(type) {
		case 'latestWeek': startTime.setDate(startTime.getDate()-7);break;
		case 'latestMonth': startTime.setMonth(startTime.getMonth()-1);break;
		case 'latestThreeMonthes': startTime.setMonth(startTime.getMonth()-3);break;
		case 'lastYear': startTime.setYear(startTime.getFullYear()-1);break;
		case 'lastThreeYears': startTime.setYear(startTime.getFullYear()-3);break;
	}
	return {
		startTime: startTime.getFullYear() + '-' + change[startTime.getMonth()] + '-'  + dateDayFormat(startTime.getDate()),
		endTime: now.getFullYear() + '-' + change[now.getMonth()] + '-'  + dateDayFormat(now.getDate())
	}
}

/*
 * 6. react数据去重
 * 去掉具有相同key的重复值
 * @require arr
 * @return arrPre 已经去重的数组
 * on: 2018.5.9
 */
const arrayDuplicateRemoval = (arr) => {
	let existKey = [], arrPreSet = []
	try {
		arr.forEach(item=>{
			if(existKey.indexOf(item.key) === -1) {
				arrPreSet.push(item)
				existKey.push(item.key)
			}
		})
	} catch(e) {
		console.error(e)
	}
	return arrPreSet
}

import {hocArrayVerify} from './hoc'

module.exports = {
	objectInArraySort,
	urlGetParamsForObject,
	downloadFileForUrl,
	objectEquals,
	getTimeSection,
	hocArrayVerify,
	arrayDuplicateRemoval: hocArrayVerify(arrayDuplicateRemoval)
}
