const bot = BotManager.getCurrentBot();

/**
 * (string) msg.content: 메시지의 내용
 * (string) msg.room: 메시지를 받은 방 이름
 * (User) msg.author: 메시지 전송자
 * (string) msg.author.name: 메시지 전송자 이름
 * (Image) msg.author.avatar: 메시지 전송자 프로필 사진
 * (string) msg.author.avatar.getBase64()
 * (boolean) msg.isGroupChat: 단체/오픈채팅 여부
 * (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
 * (string) msg.packageName: 메시지를 받은 메신저의 패키지명
 * (void) msg.reply(string): 답장하기
 */


//var data = {};
var dataFile = "data.json";
function onMessage(msg) {
	bot.markAsRead(msg.room);
	if(msg.room != "DBD" && msg.room != "동규")
	{
		return;
	}
	if(msg.content.startsWith(".봇"))
	{
		msg.reply('안뇽!');
	}
	else if(msg.content.startsWith(".셋"))
	{
		key = msg.content.split(' ')[1];
		value = msg.content.replace('.셋 '+key+' ', '');
		obj = Database.readObject(dataFile);
		obj[key] = value;
		Database.writeObject(dataFile, obj);
		msg.reply(key + ' 입력완료!');
	}
	else if(msg.content.startsWith(".키삭제"))
	{
		key = msg.content.split(' ')[1];
		obj = Database.readObject(dataFile);
		if(obj[key] == undefined)
		{
			msg.reply("Key Error!");
		}
		else
		{
			delete obj[key];
			Database.writeObject(dataFile, obj);
			msg.reply(key + ' 삭제완료!');
		}
	}
	else if(msg.content.startsWith(".국주"))
	{
		key = msg.content.split(' ')[1];
		var resp = org.jsoup.Jsoup.connect('https://search.naver.com/search.naver?query='+key+'%20주가').get();
		name = resp.select("div.spt_tlt h3 a span.stk_nm").text();
		price = resp.select("div.spt_tlt h3 a span.spt_con strong").text();
		variance = resp.select("div.spt_tlt h3 a span.spt_con em");

		if(variance[1] == undefined)
		{
			v = variance.text().split(" ")[0];
			variance = variance.text().split(" ")[1];
			if(variance[1] == '-') v = '-'+v;
			else v = '+'+v;
			msg.reply(name + " : " + price + " " + "(" + v + ", " + variance.substring(1, variance.length-1) + ")");
		}
		else
		{
			v = variance[0].text();
			variance = variance[1].text();
			if(variance[1] == '-') v = '-'+v;
			else v = '+'+v;
			msg.reply(name + " : " + price +"원" + " " + "(" + v + "원, "+ variance.substring(1, variance.length-1) + ")");
		}
	}
	else if(msg.content.startsWith(".미주"))
	{
		key = msg.content.split(' ')[1];
		var resp = org.jsoup.Jsoup.connect('https://search.naver.com/search.naver?query='+key+'%20주가').get();
		name = resp.select("div.spt_tlt h3 a span.stk_nm").text();
		price = resp.select("div.spt_tlt h3 a span.spt_con strong").text();
		variance = resp.select("div.spt_tlt h3 a span.spt_con em");

		if(variance[1] == undefined)
		{
			v = variance.text().split(" ")[0];
			variance = variance.text().split(" ")[1];
			if(variance[1] == '-') v = '-'+v;
			else v = '+'+v;
			msg.reply(name + " : " + price + " " + "(" + v + ", " + variance.substring(1, variance.length-1) + ")");
		}
		else
		{
			v = variance[0].text();
			variance = variance[1].text();
			if(variance[1] != '-')
			{
				v = '+'+v;
				variance = variance.substring(1, variance.length-1);
				variance = '+' + variance;
			}
			else
			{
				variance = variance.substring(1, variance.length-1);
			}
			msg.reply(name + " : " + price +"$" + " " + "(" + v + "$, "+ variance + ")");
		}
	}
	else if(msg.content.startsWith(".코인"))
	{
		key = msg.content.split(' ')[1];
		var resp = org.jsoup.Jsoup.connect('https://search.daum.net/search?q='+key).get();
		name = resp.select("div.tit_graph").text();
		price = resp.select("div.graph_rate em")[0].text();
		variance = resp.select("div.graph_rate em")[1].text();
		v = variance.split("(")[0];
		variance = variance.split("(")[1];
		variance = variance.substring(0, variance.length-1);
		if(variance[0] == '-') v = '-'+v;
		else v = '+'+v;
		msg.reply(name.split(" ")[0] + " ("+name.split(" ")[1] + ")" + " : " + price + " " + "(" + v +"원, "+variance + ")");
	}
	else if(msg.content.startsWith(".네이버"))
	{
		key = msg.content.replace(".네이버 ","");
		msg.reply("https://m.search.naver.com/search.naver?query="+key.replace(/ /gi, "%20"));
	}
	else if(msg.content.startsWith(".키리스트"))
	{
		obj = Database.readObject(dataFile);
		var ret = '';
		var keys = Object.keys(obj).forEach(function(key) {
			ret = ret + key + ", ";
		});
		if(ret == '')
		{
			msg.reply("비어있음!");
		}
		else
		{
			msg.reply(ret);
		}
	}
	else if(msg.content.startsWith(".올리스트"))
	{
		obj = Database.readObject(dataFile);
		msg.reply(JSON.stringify(obj, null, "\t"));
	}
	else if(msg.content.startsWith(".랜덤"))
	{
		num = msg.content.split(' ')[1];
		num *= 1;
		ran = Math.floor(Math.random() * (num)) + 1;
		msg.reply(ran+"");
	}
	else if(msg.content.startsWith("."))
	{
		if(!(msg.content.replace(/[~!?@#$%^&*().,]/gi, '')==''))
		{
			key = msg.content.substring(1, msg.content.length);
			obj = Database.readObject(dataFile);
			if(obj[key] == undefined)
			{
				msg.reply('Key Error!');
			}
			else
			{
				msg.reply(obj[key]);
			}
		}
	}

}
bot.addListener(Event.MESSAGE, onMessage);

/**
 * (string) msg.content: 메시지의 내용
 * (string) msg.room: 메시지를 받은 방 이름
 * (User) msg.author: 메시지 전송자
 * (string) msg.author.name: 메시지 전송자 이름
 * (Image) msg.author.avatar: 메시지 전송자 프로필 사진
 * (string) msg.author.avatar.getBase64()
 * (boolean) msg.isDebugRoom: 디버그룸에서 받은 메시지일 시 true
 * (boolean) msg.isGroupChat: 단체/오픈채팅 여부
 * (string) msg.packageName: 메시지를 받은 메신저의 패키지명
 * (void) msg.reply(string): 답장하기
 * (string) msg.command: 명령어 이름
 * (Array) msg.args: 명령어 인자 배열
 */
function onCommand(msg) {

}
bot.setCommandPrefix("@"); //@로 시작하는 메시지를 command로 판단
bot.addListener(Event.COMMAND, onCommand);


function onCreate(savedInstanceState, activity) {
	var textView = new android.widget.TextView(activity);
	textView.setText("Hello, World!");
	textView.setTextColor(android.graphics.Color.DKGRAY);
	activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}

function onRestart(activity) {}

function onDestroy(activity) {}

function onBackPressed(activity) {}

bot.addListener(Event.Activity.CREATE, onCreate);
bot.addListener(Event.Activity.START, onStart);
bot.addListener(Event.Activity.RESUME, onResume);
bot.addListener(Event.Activity.PAUSE, onPause);
bot.addListener(Event.Activity.STOP, onStop);
bot.addListener(Event.Activity.RESTART, onRestart);
bot.addListener(Event.Activity.DESTROY, onDestroy);
bot.addListener(Event.Activity.BACK_PRESSED, onBackPressed);
