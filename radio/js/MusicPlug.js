function MusicPlug($ct){
    this.appendPlugHtml();
    this.init($ct);
    this.vol = 1.0;//默认音量为1.0
    this.lyricBtn.status=false;//默认歌词关闭
    this.playStatus=true;//默认显示播放按钮
    this.voff=false//默认不显示静音按钮
    this.firstPlay=true;//默认是第一次播放
    this.box.showScreen=true;//默认显示主界面
    this.bind();
    this.loadAndPlace();
    this.getSong();
    this.drag(this.logo);
    this.drag(this.box);
}
MusicPlug.prototype={
    appendPlugHtml:function(){
        var plugHtml='';
        plugHtml+='<div id="radio">'
        +'<div class="music-logo">'
        +'<span class="icon icon-music"></span>'
        +'</div>'
        +'<div class="music-box">'
        +'<div class="cover aside">'
        +'<div class="header">'
        +'<span class="icon icon-music"></span>'
        +'</div>'
        +'<div id="channels"></div>'
        +'</div>'
        +'<ul class="radioInfo aside hide">'
        +'<li><h3>Your Personal Radio</h3></li>'
        +'<li><p>当前版本：V1.0</p></li>'
        +'<li><p>By 简单点</p></li>'
        +'</ul>'
        +'<div class="music-ct">'
        +'<div class="header">'
        +'<div class="wrap clearfix">'
        +'<span class="icon icon-music"></span>'
        +'<span class="icon icon-info-circled-alt"></span>'
        +'</div>'
        +'</div>'
        +'<div class="main">'
        +'<div class="song-name"></div>'
        +'<div class="play-control">'
        +'<span class="icon icon-play-circle2 play">'
        +'<iframe id="frame" src="../nullrefer.html" frameborder="0"></iframe>'
        +'</span>'
        +'</div>'
        +'<div class="lyric-space hide"></div>'
        +'</div>'
        +'<div class="footer clearfix">'
        +'<span class="icon icon-fast-fw-outline"></span>'
        +'<div class="progress-wrap">'
        +'<div class="progressBar">'
        +'<div class="progress"></div>'
        +'</div>'
        +'</div>'
        +'<span class="icon icon-volume voff"></span>'
        +'<div class="volumeBar">'
        +'<div class="volume"></div>'
        +'</div>'
        +'<span class="icon icon-toggle-off switch"></span>'
        +'</div>'
        +'</div>'
        +'</div>'
        +'</div>'
      $('body').append(plugHtml);  
    },
    init:function($ct){
      this.aside=$ct.find('.cover');
      this.iconMusic=$ct.find('.music-ct .icon-music');
      this.iconInfo=$ct.find('.icon-info-circled-alt');
      this.infoRadio=$ct.find('.radioInfo');
      this.logo=$ct.find('.music-logo .icon-music');
      this.playBtn=$ct.find('.play');
      this.nextBtn=$ct.find('.icon-fast-fw-outline');
      this.iconVolume=$ct.find('.icon-volume');
      this.volume=$ct.find('.volume');
      this.volumeBar=$ct.find('.volumeBar');
      this.offVoice=$ct.find('.voff');
      this.progress=$ct.find('.progress');
      this.progressBar=$ct.find('.progressBar');
      this.iconlyric=$ct.find('.icon-toggle-off');
      this.channelList=$ct.find('#channels');
      this.box=$ct.find('.music-box');
      this.musicCt=$ct.find('.music-ct');
      // this.myAuto = $ct.find('#myaudio');
      this.myAuto = $ct.find('#frame').contents().find('#myaudio');
      this.lyricBtn=$ct.find('.icon-toggle-off');
      this.lyricSpa=$ct.find('.lyric-space');
      this.songName=$ct.find('.song-name');
      this.playBtn=$ct.find('.play');
  },
  bind:function(){
      var _this=this,
      clock,
      lyClock;
      _this.iconInfo.on('mouseenter',function(){
        _this.infoRadio.removeClass('hide');
    });
      _this.iconInfo.on('mouseleave',function(){
        _this.infoRadio.addClass('hide');
    });
      _this.logo.on('click',function(){
        if(_this.box.showScreen){
          _this.box.hide('300');
          _this.box.showScreen=false;
      }else{
          _this.box.show('300');
          _this.box.showScreen=true;
      }
  });
      _this.playBtn.on('click',function(){
        if(_this.firstPlay){   //第一次播放
          _this.play();
          _this.firstPlay=false;
      }
      _this.switchPlayBtn();
  });
      _this.nextBtn.on('click',function(){
        _this.playNext();
    });
      _this.iconMusic.on('mouseenter',function(){
        _this.showAside();
    });
      _this.aside.on('mouseleave',function(){
         _this.hideAside();
     });
      _this.channelList.on('click','li',function(){
        _this.getSong();
        _this.hideAside();
    });
      _this.volumeBar.on('mousedown', function(e) {  //静音与音量控制交互控制
         _this.vControl(e);
         if(_this.vol&&_this.voff){
            _this.switchVoiBtn();
        }else if(_this.vol===0&&_this.voff===false){
            _this.switchVoiBtn();
        }
    });
      _this.offVoice.click(function() {
       _this.vOffAndOn();  //声音开关
       _this.switchVoiBtn();//按钮开关
   });
      _this.progressBar.on('mousedown', function(e) {
         _this.progressControl(e);
     });
      _this.lyricBtn.on('click',function(){
        _this.switchAndShowLy();
    });
      _this.myAuto.on('play',function(){
        clock=setInterval(function(){
          _this.progressAuto();
      },1000);
    });
      _this.myAuto.on('pause',function(){
        clock=clearInterval(clock);
    });
      _this.myAuto.on('ended',function(){
        clock=clearInterval(clock);
    });
  },
    loadAndPlace:function(){               //下载频道列表，dom摆放频道列表
      var _this=this;
      $.get('http://api.jirengu.com/fm/getChannels.php')
      .done(function(channelInfo){
        console.log(channelInfo);
        _this.channelsName=$.parseJSON(channelInfo).channels;
        _this.isChannelListLoaded=true;
        console.log(_this.channelsName);
        _this.placeAside();
    });
  },
    placeAside:function(){               //dom摆放频道列表
      console.log(this.channelsName);
      var tpl='<ul id="music-aside">';
      for (var i = 0; i < this.channelsName.length; i++) {
        tpl+='<li>'+this.channelsName[i].name+' MHz</li>';
    }
    tpl+='</ul>';
    var $nodes=$(tpl);
    this.channelList.append($nodes);
},
    getSong:function(channel){        //获取歌曲，歌词，摆放歌词
      var _this=this;
      $.get('http://api.jirengu.com/fm/getSong.php',{channel: channel})
      .done(function(song){
        console.log(song);
        _this.songUrl=$.parseJSON(song).song[0].url,
        _this.title=$.parseJSON(song).song[0].title,
        _this.bgImg=$.parseJSON(song).song[0].picture,
        _this.ssid=$.parseJSON(song).song[0].ssid,
        _this.sid=$.parseJSON(song).song[0].sid;
        _this.setSongUrl();
        _this.setBg();
        _this.setTitle();
        _this.loadAndPlaceLyric();
        if(!_this.firstPlay){   //点下一曲播放
         _this.play();
     }
 });
  },
  setSongUrl:function(){
      this.myAuto.attr('src', this.songUrl);
  },
  setBg:function(){
      this.musicCt.css({
        backgroundImage:'-webkit-linear-gradient(left top, rgba(255,0,0,0.5), rgba(0,255,255,0.5)),url('+this.bgImg+')',
        backgroundImage:'-moz-linear-gradient(bottom right, rgba(255,0,0,0.5), rgba(0,255,255,0.5)),url('+this.bgImg+')',
        backgroundImage:'linear-gradient(to bottom right, rgba(255,0,0,0.5) , rgba(0,255,255,0.5)),url('+this.bgImg+')'
    });
  },
  setTitle:function(){
      this.songName[0].innerText=this.title;
  },
  showPauseBtn:function(){
      this.playBtn.removeClass('icon-play-circle2');
      this.playBtn.addClass('icon-pause-outline');
  },
  showPlayBtn:function(){
      this.playBtn.removeClass('icon-pause-outline');
      this.playBtn.addClass('icon-play-circle2');
  },
  play:function(){
      this.myAuto[0].play();
  },
    pause:function(){        //暂停
      this.myAuto[0].pause();
  },
    switchPlayBtn:function(){                     // 播放/暂停切换  播放键/暂停键切换
      if(this.playStatus){
       // this.play();
       this.showPauseBtn();
       this.playStatus=false;
   }else{
      this.pause();
      this.showPlayBtn();
      this.playStatus=true;
  }
},
    playNext:function(){     //下一曲
      this.getSong();
      this.playStatus=true;
      this.switchPlayBtn();
  },
    showAside:function(){             //显示频道侧边栏
      this.musicCt.addClass('blur');
      this.aside.show('fast');
  },
    hideAside:function(){              //隐藏频道侧边栏
      this.musicCt.removeClass('blur');
      this.aside.hide('fast');
  },
    vControl:function(e){                   //声音控制
      var position = e.pageX - this.volume.offset().left;
      var percentage = position / this.volume.width();
      this.volumeBar.css('width', percentage*100);
      this.myAuto[0].volume = percentage;
      this.vol = percentage;
  },
    vOffAndOn:function(){                     //静音切换
      if(this.myAuto[0].volume){
        this.myAuto[0].volume = 0;
    }else{
        this.myAuto[0].volume =this.vol;
    }
},
    switchVoiBtn:function(){                    //静音键切换
      if(!this.voff){//开
        this.offVoice.removeClass('icon-volume');
        this.offVoice.addClass('icon-volume-off');
        this.voff=true;
    }else{
        this.offVoice.addClass('icon-volume');
        this.offVoice.removeClass('icon-volume-off');
        this.voff=false;
    }
},
  switchAndShowLy:function(){                        //歌词开关，歌词显示
    var _this=this;
        if(!_this.lyricBtn.status){//歌词按钮打开 显示歌词
          _this.lyricBtn.removeClass('icon-toggle-off');
          _this.lyricBtn.addClass('icon-toggle-on');
          _this.lyricBtn.status=true;
          // _this.lyricSpa.removeClass('hide');
          lyClock=setInterval(function(){
            _this.showLyric();
        },1000);
        }else{  //歌词按钮关闭 关闭歌词显示
           _this.lyricBtn.addClass('icon-toggle-off');
           _this.lyricBtn.removeClass('icon-toggle-on');
           _this.lyricBtn.status=false;
           _this.lyricSpa.addClass('hide');
           lyClock=clearInterval(lyClock);
       }
   },
     progressControl:function(e){                         //控制播放进度
      var position = e.pageX - this.progress.offset().left;
      var percentage = position / this.progress.width();
      this.progressBar.css('width', percentage*this.progress.width());
      this.myAuto[0].currentTime = percentage*this.myAuto[0].duration;
  },
    progressAuto:function(){                              //播放进度自动
      var curTime=this.myAuto[0].currentTime;
      var percentage =curTime/this.myAuto[0].duration;
      this.progressBar.css('width', percentage*this.progress.width());
  },
    loadAndPlaceLyric:function(){                                //歌词下载，摆放歌词
      var _this=this;
      $.post('http://api.jirengu.com/fm/getLyric.php',{ssid: _this.ssid, sid:_this.sid})
      .done(function(lyric){
        console.log(lyric);
        if(($.parseJSON(lyric).lyric===' ')){
          console.log("____________接口返回lyric为空____________");
      }else{
       _this.lyric=$.parseJSON(lyric).lyric;
       _this.separLyric();
       _this.placeLyric();
   }
});
  },
    separLyric:function(){                               //歌词时间分割
      var lyricArr=this.lyric.split('\n'),
      reg=/\[\d*\:\d*((\.|\:)\d*)*\]/g,
      tFlag=0;
      console.log(lyricArr);
      this.lTime=[];//存储时间
      this.lData=[];//存储歌词，索引为时间
      for(i in lyricArr){
        console.log("____________start__________"+i);
        this.ltime=lyricArr[i].match(reg);
        console.log(this.ltime);
        if(!this.ltime) continue;
        lyricText=lyricArr[i].replace(reg,'');
        lyricText=lyricText.replace(/\[offset:.+\]/g,'');

        for(j in this.ltime){
          min= Number(String(this.ltime[j].match(/\[\d*/i)).slice(1));
          sec=Number(String(this.ltime[j].match(/:\d*/i)).slice(1));
          var msStr=this.ltime[j].replace(/\[\d*/i,'').replace(/:\d*/i,'');
          ms=Number(msStr.match(/((\.|\:)\d*)*/g)[0].slice(1));
          t=(min*60+sec)*1000+ms;
        if(t!==tFlag){      //去掉lTime中相同的t
          this.lTime.push(t);
          tFlag=t;
      }
      this.lData[t]=lyricText;
  }
}
    this.lTime.sort(function(a,b){   //从小到大排序
      console.log(a,b);
      return a-b;
  });
},
  placeLyric:function(){                                //dom摆放歌词
    this.lyricSpa.get(0).innerHTML='';
    var tpl='';
    for(var i=1; i< this.lTime.length;i++){
      tpl+='<div id='+this.lTime[i]+'>'+this.lData[this.lTime[i]]+'</div>';
      console.log(tpl);
  }
  var $nodes=$(tpl);
  this.lyricSpa.append($nodes);
},
  showLyric:function(){                                  //显示歌词
    if(!this.lTime) return;
    var curTime=this.myAuto[0].currentTime*1000;
    for(var i=0;i<this.lTime.length;i++){
      if(curTime>=this.lTime[i]&&curTime<=this.lTime[i+1]){
        $('#'+this.lTime[i]).css({color: '#f00',display:'block'});
        this.lyricSpa.removeClass('hide');
    }else{
        $('#'+this.lTime[i]).css({display:'none'});
    }
}
},
  drag:function($ele){                                   //拖动
    $ele.on('mousedown',function(e){
      var evtY=e.pageY-$(this).offset().top;
      var evtX=e.pageX-$(this).offset().left;
      $ele.addClass('draggable').data('evtPos', {x:evtX,y:evtY});
  }).on('mouseup',function(){
      $ele.removeClass('draggable').data('evtPos');
  });
  $('body').on('mousemove',function(e){
      $('.draggable').length&&$('.draggable').offset({
        top:e.pageY-$('.draggable').data('evtPos').y,
        left:e.pageX-$('.draggable').data('evtPos').x
    });
  });
}
};
var musicPlug=new MusicPlug($('#radio'));
