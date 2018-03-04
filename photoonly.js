// Self-reply plugin for Janetter
// by Ryosuke839 (@Ryosuke839)
// Put this file to %ProgramFiles%\Janetter2\Theme\Common\js\plugins\ and restart Jantter to install
// (Replace %ProgramFiles% with %ProgramFiles(x86)% for 64-bit windows)

(function($, jn)
{
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	jn.pluginInfo['jp-ddo-hotmist-photoonly'] =
	{
		'name' :
		{
			'ja' : '写真のみツイートプラグイン',
			'en' : 'Photo only tweet plugin'
		},
		'author' :
		{
			'en' : '@Ryosuke839'
		},
		"version" : '1.0',
		'file' : 'selfreply.js',
		'language' : ['de', 'en', 'es', 'ja', 'ko', 'pt', 'ru', 'zh-CN'],
		"last_update" : "2017/09/26",
		'update_timezone' : '9',
		'jnVersion' : '4.4.0.0',
		'description' : {
			'ja' : '画像をツイートするとき，本文が空でも送信できるようにします．',
		}
	};
	if (jn.tweeteditor)
	{
		var func_orig = jn.tweeteditor.prototype.checkTweet;
		jn.tweeteditor.prototype.checkTweet = function(textarea, input, delay)
		{
			func_orig.apply(this, arguments);
			var self = this;
			if(!textarea)
				textarea = $('#tweet-edit-container > .expanded textarea');
			delay = delay || 0;
			//負荷低減のため非同期実行
			if (this._tweetCountTimer2)
			{
				clearTimeout(this._tweetCountTimer2);
				this._tweetCountTimer2 = null;
			}
			this._tweetCountTimer2 = setTimeout(function()
			{
				if ($('#tweet-edit-container .tweet-button').hasClass('disabled') && self._photos.length > 0 && jn.conf.image_upload_service == 'Twitter Photo')
					$('#tweet-edit-container .tweet-button').removeClass('disabled');
				
				self._tweetCountTimer2 = null;
			}, delay);
		};
	}
	
	if (jn)
	{
		jn.postTweet = function(options){
			if(!options.juid || !options.text && !('photo1' in options))
				return false;
			
			options.timeout = 30000;
			var photos = [];
			for(var i=1; i<=4; i++){
				if(options['photo'+i]){
					photos.push(options['photo'+i].toString());
					options.timeout += 15000;
				}
			}
			options.action = 'statuses_update';
			options.data = 
				{
					juid: options.juid,
					in_reply_to_status_id: options.replyid,
					status: options.text,
					photos: photos
				};
			delete options.juid;
			delete options.replyid;
			delete options.text;
			delete options.photo1;
			delete options.photo2;
			delete options.photo3;
			delete options.photo4;
			jn.websocket.send(options, 1);
		};
	}

})(jQuery, janet);
