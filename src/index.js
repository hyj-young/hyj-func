/*
 * 针对友云设的功能函数
 * designer：何运江
 * start at: 2018.3.8
 */
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
 * 3. url 需要下载文件的url
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
module.exports = {
	objectInArraySort,
	urlGetParamsForObject,
	downloadFileForUrl
}
