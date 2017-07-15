var Utils = {
    /* ajax的封装*/
    ajax: function(opts) {
      ServletActionContext.getResponse().setHeader("Access-Control-Allow-Origin", "*");
      var xmlHttp = new XMLHttpRequest();
      var str = '';
      for (k in opts.data) {
        str += k + '=' + opts.data[k] + '&';
      }
      str = str.substr(0, str.length - 1);

      if (opts.type.toLowerCase() === 'get') {
        xmlHttp.open('GET', opts.url + '?' + str, true);
        xmlHttp.send();
      }
      if (opts.type.toLowerCase() === 'post') {
        xmlHttp.open('POST', opts.url, true);
        xmlHttp.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        xmlHttp.send(str);
      }
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
          var responsetext = JSON.parse(xmlHttp.responseText);
          opts.success(responsetext);
        }
        if (xmlHttp.readyState === 4 && xmlHttp.status === 404) {
          opts.error();
        }
      }
    },
    /* class操作的封装 */
    hasClass: function(el, cls) {
      var reg = new RegExp('\\b' + cls + '\\b', 'g');
      return reg.test(el.className);
    },
    addClass: function(el, cls) {
      if (!hasClass(el, cls)) {
        el.className += " " + cls;
      }
    },
    removeClass: function(el, cls) {
      var reg = new RegExp('\\b' + cls + '\\b', 'g'),
        tmp = el.className.replace(reg, '').replace(/\s{2,}/g, ' '); //把两个以上的空格替换为一个空格
        el.className = trim(tmp);
    },

    /*去除字符串两边的空白*/
    trim: function(str) {
      return str.replace(/^\s+|\s+$/g, "");
    },

    /* 判断邮箱、手机号、用户名、密码等 */
    isEmail: function(str) {
      var exp = /^[A-Za-z0-9][\w\.\-]+@[A-Za-z0-9][\w\-]+[A-Za-z0-9]\.[A-Za-z]{2,}$/;
      return exp.test(str);
    },
    isPhoneNum: function(str) {
      var exp = /^1\d{10}$/;
      return exp.test(str);
    },
    isValidUsername: function(str) { //长度6-20个字符，只能包括字母、数字、下划线
      var exp = /^\w{6,20}$/; //可以以数字下划线开头
      return exp.test(str);
    },
    isValidPassword: function(str) { //长度6-20个字符，包括大写字母、小写字母、数字、下划线至少两种
      if (str.length < 6 || str.length > 20) {
        return false;
      }
      //如果包含上述四种以外的字符，false
      if (/[^A-Za-z_0-9]/.test(str)) {
        return false;
      }

      //如果全为大写、小写、下划线、数字, false
      // if( /(^[a-z]+$)|(^[A-Z]+$)|(^_+$)|(^\d+$)/g.test(str) ){
      //     return false;
      // }
      if (/(^[A-Z]{6,20}$)|(^[a-z]{6,20}$)|(^\d{6,20}$)|(^_{6,20}$)/g.test(str)) {
        return false;
      }
      return true;
    },

    /* 获取随机数 */
    getRandom: function(min, max) {
      return (Math.floor((max - min + 1) * Math.random() + min));
    },

    /* 时间日期操作 */
    countDown: function(char) {
      var intv = (Date.parse(char) - Date.now()); // 倒计时 countDown('2016-01-08')
      var a = 1000 * 60 * 60 * 24;
      var day = Math.floor(intv / a);
      var hours = Math.floor((intv - day * a) / a * 24);
      var minute = Math.floor((intv - day * a - hours * a / 24) / a * 24 * 60);
      var second = Math.floor((intv - day * a - hours * a / 24 - minute * a / 24 / 60) / a * 24 * 60 * 60);
      return '倒计时' + day + '天' + hours + '小时' + minute + '分' + second + '秒';
    },
    //getChsDate('2016-11-11') //"二零一六年一一月一一日"
    getChsDate:function(timeStr){
      var obj={'0':'零','1':'一','2':'二','3':'三','4':'四','5':'五','6':'六','7':'七','8':'八','9':'九'},
          count=0;
      for(var i =0;i<timeStr.length;i++){
        if(timeStr[i]==='-'){
          if(count==0){
            timeStr=timeStr.replace(timeStr[i],'年');
          }else{
            timeStr=timeStr.replace(timeStr[i],'月');
          }
          count++;
          continue;
        }
          timeStr=timeStr.replace(timeStr[i],obj[timeStr[i]]);
      }
      timeStr=timeStr+'日';
      return timeStr
    }
    CNDateString: function(date) {
      var newArray = str.split('-'); //把数字日期改成中文日期  CNDateString('2016-01-08')
      newArray[0] = newArray[0] + '年';
      newArray[1] = newArray[1] + '月';
      newArray[2] = newArray[2] + '日';
      var cn = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var s = [];

      for (var i = 0; i < newArray.length; i++) {
        if (i !== 0 && newArray[i][0] === '0') {     //去掉01-08前的0
          newArray[i] = newArray[i].replace('0', '');
        }
        for (var j = 0; j < newArray[i].length; j++) {
          if (cn[newArray[i][j]]) {
            s.push(cn[newArray[i][j]]);
          } else {
            s.push(newArray[i][j]);
            break;
          }
        }
      }
      return s.join('');
    },
    /* 获取n天前日期 */
    getLastNDays: function(n) {
      var d = new Date(Date.now() - n * 24 * 60 * 60 * 1000); //获取n天前的日期
      return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
    },

    /* 对象深拷贝
     *newobj不受obj影响
    */
    objCopy: function(obj) {
      var newobj = {};
      for (var i in obj) {
        if (typeof obj[i] === 'object')
          newobj[i] = objCopy(obj[i]);
        else {
          newobj[i] = obj[i];
        }
      }
      return newobj;
    },
    /**参数说明：
     * 根据长度截取先使用字符串，超长部分追加…
     * str 对象字符串
     * len 目标字节长度
     * 返回值： 处理结果字符串
    */
    cutString: function(str, len) {
      //length属性读出来的汉字长度为1
      if (str.length * 2 <= len) {
        return str;
      }
      var strlen = 0;
      var s = "";
      for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
          strlen = strlen + 2;
          if (strlen >= len) {
            return s.substring(0, s.length - 1) + "...";
          }
        } else {
          strlen = strlen + 1;
          if (strlen >= len) {
            return s.substring(0, s.length - 2) + "...";
          }
        }
      }
      return s;
    }
     /*
      * 获取URL的参数
      * */
   getQueryStringRegExp:function(name) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&^#]*)(\\s|&|$|#)", "i");
        if (reg.test(location.href)) {
                return unescape(RegExp.$2.replace(/\+/g, " "));
        }
        return "";
    };
    /*
     *四舍五入两位
     *2.98765.toFixed(2)//'2.99',toFixed左边不能为整数，会报错
     **/
     function limit2(num){
        if(!(num*10%10)){
          return num+'.00';
        }else{
          return Math.round(num*100)/100;
        }
     }
     /*
      *获取从min到max之间的随机数，包括min不包括max
      */
    function randomMin(min, max) {
      console.log(Math.random() * (max - min) + min)
    }
    /*
      *获取从min到max之间的随机数，包括min包括max
      */
    function randomMax(min, max) {
      console.log(Math.floor(Math.random * (max - min + 1)) + min)
    }
    /*
     *获取一个随机数组，数组中元素为长度为len，最小值为min，最大值为max(包括)的随机数
     */
    function randomArray(min,max,len){
      var arr =[];
      for(var i=0;i<arr.length;i++){
        arr.push(Math.floor(Math.random * (max - min + 1)) + min)
      }
    }
     /*用 splice 实现 push、pop、shift、unshift方法*/
     function popSplice(arr){
      return arr.splice(arr.length-1,1)[0]
      }
    }
    function pushSplice(arr,num){
      arr.splice(arr.length,0,num);
      return arr.length
    }
    function shiftSplice(arr){
      return arr.splice(0,1)[0]
    }
    function unshiftSplice(arr,num){
      arr.splice(0,0,num);
      return arr.length
    }
    /* var arr = [ "test", 2, 1.5, false ]
     * find(arr, "test") // 0
     */
    var arr = [ "test", 2, 1.5, false ];
    find:function(arr,str){
      for (var i=0;i<arr.length;i++){
        if(arr[i]===str){
          return i;
        }
      }
      return -1;
    }
    /*filterNumeric
     * arr = ["a", 1, "b", 2];
     * newarr = filterNumeric(arr); // [1,2]
     */
    var arr = ["a", 1, "b", 2];
    filterNumeric:function(arr){
      var after=arr.filter(function(val){
        return typeof val ==='number'
      })
     return after;
    }
    filterNumeric:function(arr){
      for(var i=0;i<arr.length;i++){
        if(typeof arr[i]==='string'){
          arr.splice(i,1);
          i--;
        }
      }
      return arr;
    }
    addClassName:function (obj,str){
      var classNameArr=obj.className.split(' ');
      var isRepeat=classNameArr.some(function(val){
      return(val==str)
      })
      if(!isRepeat){
      classNameArr.push(str);
      obj.className=classNameArr.join(' ');
      }
      return obj;
    }
    //或者
    addClassName:function (obj,str){
      var classNameArr=obj.className.split(' ');
      var unRepeat=classNameArr.every(function(val){
      return(val!=str)
      })
      if(unRepeat){
      classNameArr.push(str);
      obj.className=classNameArr.join(' ');
      }
      return obj;
    }
    //或者
    addClassName:function (obj,str){
      var classNameArr=obj.className.split(' ');
      for(var i =0;i<classNameArr.length;i++){
        if(str===classNameArr[i]){
          return obj;
        }
      }
      classNameArr.push(str);
      obj.className=classNameArr.join(' ');
      return obj
   }
    removeClassName:function (obj,str){
      var classNameArr=obj.className.split(' ');
      for(var i=0;i<classNameArr.length;i++){
        if(classNameArr[i]===str){
          classNameArr.splice(i,1);
          obj.className=classNameArr.join(' ');
          return obj;
        }
      }
    }
    /* 事件绑定的封装 */
    index: function(e, node) { // children No. 判断子元素序列
      for (var i = 0; i < node.children.length; i++) {
        if (e.target === node.children[i]) {
          return i + 1;
        }
      };
    },
    bind: function(elem, type, handler) {
      if (elem.addEventListener) {
        elem.addEventListener(type, handler, false);
      } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, handler);
      } else {
        elem["on" + type] = handler;
      }
    },
    unbind: function(elem, type, handler) {
      if (elem.removeEventListener) {
        elem.removeEventListener(type, handler, false);
      } else if (elem.detachEvent) {
        elem.detachEvent("on" + type, handler);
      } else {
        elem["on" + type] = null;
      }
    },

   //大师手笔,闭包
    addEvent:function (node, type, handler) {
      if (!node) return false;
      if (node.addEventListener) {
        node.addEventListener(type, handler, false);
        return true;
      }
      else if (node.attachEvent) {
        node['e' + type + handler] = handler;
        node[type + handler] = function() {
          node['e' + type + handler](window.event);
        };
        node.attachEvent('on' + type, node[type + handler]);
        return true;
      }
      return false;
    },
    removeEvent:function (node, type, handler) {
      if (!node) return false;
      if (node.removeEventListener) {
        node.removeEventListener(type, handler, false);
        return true;
      }
      else if (node.detachEvent) {
        node.detachEvent('on' + type, node[type + handler]);
        node[type + handler] = null;
      }
      return false;
    },
    getEvent: function(event) {
      return event ? event : window.event;
    },
    getTarget: function(event) {
      return event.target || event.srcElement;
    },
    preventDefault: function(event) {
      if (event, preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
    },
    stopPropagation: function(event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
    },

  }