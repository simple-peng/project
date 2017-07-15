define(function(require, exports, module) {
	'use strict';
	
	/**
	* 模拟页面跳转
	* @param url: 跳转地址
	*		 target: 跳转方式_self, _blank等
	*/
	function imitateLink(url, target) {
		var shareTempa = $('#shareTempa');
		if (!shareTempa.length) {
			$('body').append('<a href="javascript:void(0)" id="shareTempa"></a>');
			shareTempa = $('#shareTempa');
		}
		
		shareTempa.attr({href: url, target: target ? target : '_blank'});

		
		if (navigator.appVersion.match(/\bMSIE\b/)) {
			shareTempa[0].click(); 
		} else {
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent('click', true, true);
			shareTempa[0].dispatchEvent(evt);
		}
	}

	function getQueryStringRegExp(name) {
	    var reg = new RegExp("(^|\\?|&)" + name + "=([^&^#]*)(\\s|&|$|#)", "i");
	    if (reg.test(location.href)) {
	        return unescape(RegExp.$2.replace(/\+/g, " "));
	    }
	    return "";
	}

	/**
	*	获取双显绑定忽略数组
	*	@参数 data: 输入数据
	*		  arr: 数组	
	*
	*/
	function getSkipArray(data, arr) {
		var _arr = [],
			x;
		if (arr.length) {
			for (x in data) {
				if (arr.indexOf(x) === -1) {
					_arr.push(x);
				}
			}
		} else {
			for (x in data) {
				_arr.push(x);				
			}
		}
		
		return _arr;
	}


	/**
	* 获取字符长度，中文与圆角为2字节
	* @param str: 字符
	*	
	* @return 返回字符长度
	*/
	function strLength(str) {
	    return str.replace(/[^\x00-\xff]/g, '**').length;
	}

	/**
	* 获取字符长度，中英文适用
	* @param str: 字符
	* @param len: 截取长度
	*	
	* @return 返回字符长度
	*/
	function subString(str,len) {
		var str_length = 0;
		var str_len = 0;
		str_cut = new String();
		str_len = str.length;
		for (var i = 0; i < str_len; i++) {
			a = str.charAt(i);
			str_length++;
			if (escape(a).length > 4) {
				//中文字符的长度经编码之后大于4
				str_length++;
			}
			str_cut = str_cut.concat(a);
			if (str_length >= len) {
				str_cut = str_cut.concat("...");
				return str_cut;
			}
		}
		//如果给定字符串小于指定长度，则返回源字符串；
		if (str_length < len) {
			return str;
		}

	}

	function getPath() {
		return $('#path').val();
	}

	/**
	* 根据毫秒数转换成 yyyy-mm-dd日期格式
	* @param b: 毫秒数	
	*		 seg: 分隔符， 默认'-'
	* @return 返回yyyy-mm-dd日期格式
	*/
	function secondsToDate(b, seg, flag){
		seg = seg ? seg : '-';
		var c = new Date();
		c.setTime(b);//转成时间型

		//拆解格式
		var y = c.getFullYear();
		var m = c.getMonth()+1;//0-11代表月份,0是一月
		var mstr = m.toString();
		if(mstr.length < 2){//不足两位加零
			mstr = '0' + mstr;
		}
		var d = c.getDate();
		var dstr = d.toString();//不足两位加零

		if(dstr.length < 2){
			dstr = '0' + dstr;
		}

		if (flag) {
			var hour = c.getHours(),
				min = c.getMinutes(),
				sec = c.getSeconds();

			hour = hour < 10 ? ('0' + hour) : hour;
			min = min < 10 ? ('0' + min) : min;
			sec = sec < 10 ? ('0' + sec) : sec;

			return y + seg + mstr + seg + dstr + ' ' + hour + ':' + min + ':' + sec;
		} else {
			return y + seg + mstr + seg + dstr;			
		}
	}	

	/**
	* 根据毫秒数转换成 yyyy-mm-dd日期格式
	* @param b: 毫秒数	
	*		 seg: 分隔符， 默认'-'
	* @return 返回yyyy-mm-dd日期格式
	*/
	function secondsToTime(b){		
		var c = new Date();
		c.setTime(b);//转成时间型

		var hour = c.getHours(),
			min = c.getMinutes();
			hour = hour < 10 ? ('0' + hour) : hour;
			min = min < 10 ? ('0' + min) : min;
		return hour + ':' + min;
	}

	//按比例缩放图片
	function getSize(maxWidth,maxHeight,objImg){
		if (!maxWidth || !maxHeight) {
			return;
		}
		var hRatio, wRatio,
			ratio = 1,
			w = objImg.width,
			h = objImg.height;
		wRatio = maxWidth / w;
		hRatio = maxHeight / h;
		if (maxWidth ===0 && maxHeight === 0){
			ratio = 1;
		}else if (maxWidth === 0){//
			if (hRatio < 1) Ratio = hRatio;
		}else if (maxHeight === 0){
			if (wRatio < 1) Ratio = wRatio;
		}else if (wRatio < 1 || hRatio < 1){
			ratio = (wRatio <= hRatio ? wRatio : hRatio);
		}
		if (ratio < 1){
			w = w * ratio;
			h = h * ratio;
		}
		return {height: h, width: w}
	}

	//把购物车id字符串"id1:id2:id3..."格式化成id数组返回
	function getCartList(str) {
		str = $.trim(str);
		if(str === '') {
			return [];
		}
		return str.split(':');
	}
	
	//获取图片url前缀
	function getSrc(s, i) {
		function getImgCdnRoor(i) {
			var mb_img_cdn_root = ['http://img1.template.cache.wps.cn/wps/cdnwps/', 'http://img1.template.cache.wps.cn/wps/cdnwps/'];
			if (i !== undefined) {
				return mb_img_cdn_root[i % 2];
			} else {
				return mb_img_cdn_root[Math.round(Math.random(10))];
			}
		}

		return getImgCdnRoor(i) + s;
	}

	function log(msg) {				
		$('#debug').show().text(function(i, t) {
			return t + '\n\r' + msg;
		});
	}

	/**
	*	信息收集需要将将?,&,=转换，转换格式如下
	*	?=** &=* ==$
	*/
	function replaceUrl(url) {
		return url.replace(/\?/g, '**').replace(/\&/g, '*').replace(/\=/g, '$')
	}

	return {
		imitateLink: imitateLink,
		getQueryStringRegExp: getQueryStringRegExp,
		getSkipArray: getSkipArray,
		strLength: strLength,
		getPath: getPath,
		secondsToDate: secondsToDate,
		secondsToTime: secondsToTime,
		getSize: getSize,
		getCartList: getCartList,
		getSrc: getSrc,
		replaceUrl: replaceUrl,
		log: log,
		subString: subString
	};
});
