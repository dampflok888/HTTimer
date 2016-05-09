/*
hutitimer.js - main timer file
written by Frederik Hutfleß
*/

uwrs=[],
colors=[],
uwrholders=[],
uwrs["barrel"]=11.636,
uwrholders["barrel"]="Frederik Hutfle&szlig;",
uwrs["ghost"]=33.25,
uwrholders["ghost"]="Sebastian Haefner",
colors["W"]="#FFFFFF",
colors["R"]="#FF0000",
colors["O"]="#FFA500",
colors["S"]="#000000",
colors["G"]="#FFFF00",
colors["U"]="#FF00FF",
colors["B"]="#0000FF",
colors["A"]="#A0A0A0";
triggers=[[["R","U","R'","U'"],"sexy"],[["R'","F","R","F'"],"sledge"]];

rotationReducer={
	keys:[["x y x'","z"],["x' y x","z'"],["y x y'","z'"],["y x' y'","z"]],
	reduce:function(rots){
		rots=rots.toLowerCase();
		for(var i=0;i<rotationReducer.keys.length;i++){
			if(rotationReducer.keys[i][0]==rots){
				rots=rotationReducer.keys[i][1];
			}
		}
		return rots;
	}
}

if(navigator.userAgent.toLowerCase().search(/(iphone|ipad|opera mini|fennec|palm|blackberry|android|symbian|series60)/)>-1){
  mobil=true;
}
else{
  mobil=false;
}

if(mobil&&!isMobile){
	window.location.href="mobiletimer.html";
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function checkBrowserName(name){
	var agent = navigator.userAgent.toLowerCase();  
	if (agent.indexOf(name.toLowerCase())>-1) {  
		return true;  
	}  
	return false;  
}  

var cube=generatealgjscube(alg_jison),
rshtml="<small><span style='color:red;float:right;' title='Random state'><i>RS</i>&nbsp;</span></small>";

timer={
	config:{
		results:[],
		aktualisierungsrate:17
	},
	running:false,
	zeit:0,
	scramble:"",
	penalty:"",
	type:"3x3",
	timingMode:1,
	blockTime:2000,
	blockTimeReturn:3000,
	sessions:[],
	currentSession:0,
	defaultScrambler:"3x3",
	colorScheme:["R","W","U","G","B","O"],
	relayCommand:"2x2 2x2bld",
	version:"2.1.7",
	customAvg:3,
	tool:0,
	precision:true,
	relayWarn:true,
	scrambleTypes:["1x1","2x2","3x3","4x4","5x5","5x5","5x5","pyra","mega","square-1","skewb","clock",
						"2x2opt","2x2bld","3x3bld","3x3co","3x3hco","3x3ru","3x3ruf","3x3rul","3x3lse",
						"1x2x2","1x2x3","3x3x2","3x3x4","3x3x5","2x2x3",
						"barrel","ghost",
						"heli","helij","curvy","curvyj","curvyp","curvypj","curvypfj","mixup3x3","mixup4x4","mpyra","giga","pyracrystal","sq224","dreidellim","square-2",
						"relay"],
	scrambleNames:["1x1x1",rshtml+"2x2x2","3x3x3","4x4x4","5x5x5","6x6x6","7x7x7",rshtml+"Pyraminx","Megaminx",rshtml+"Square-1","Skewb","Clock",
						"2x2x2 Optimal/kurz","2x2x2 Blind","3x3x3 Blind","3x3x3 Center Orientation","3x3x3 half center orientation","3x3x3 &lt;RU&gt;","3x3x3 &lt;RUF&gt;","3x3x3 &lt;RUL&gt;","3x3x3 LSE",
						"1x2x2","1x2x3","3x3x2","3x3x4","3x3x5","2x2x3",
						"Barrel Cube","Ghost Cube",
						"Helicopter Cube","Jumbled Helicopter Cube","Curvy Copter","Jumbled Curvy Copter","Curvy Copter Plus","Jumbled Curvy Copter Plus","Fully Jumbled Curvy Copter Plus","Mixup 3x3","Mixup 4x4","Master Pyraminx","Gigaminx","Pyraminx Crystal","Square 2x2x4","Dreidel LimCube","Square-2",
						"Relays"]
}

function start(){
	if(!timer.running){
		timer.running=true;
		timer.zeit=+new Date();
		setTimeout(time,2);
	}
}

function time(){
	if(timer.running){
		document.getElementById("display").innerHTML=format((+new Date())-timer.zeit);
		setTimeout(time,timer.aktualisierungsrate);
	}
}

function displayScramble(){
	var Tscramble=getScrambles(timer.type,1),
		text=""+Tscramble+"<div style='float:right;' onclick='javascript:displayScramble();'><small>next</small></div>";
	document.getElementById("scramble").innerHTML=text;
	timer.scramble=Tscramble;
	drawTool();
}

function stop(){
	time();
	zeit=(+new Date()-timer.zeit);

	timer.running=false;
	var result={
		zeit:zeit-.2,
		scramble:document.getElementById("scramble").innerHTML,
		penalty:timer.penalty,
		datum:+new Date(),
		kommentar:""
	};
	timer.config.results.push(result);
	displayScramble();
	ziel.check(0,timer.type,zeit)
	timer.zeit=timer.scramble=timer.penalty=0;
	displayTimes();
	drawTool();
	document.getElementById("time_liste").scrollBy(250,250);
}

function deletetime(id){
	timer.config.results.splice(id,1);
	displayTimes();
	drawTool();
}

function format(z){
	var diff=timer.zeit,b,c,d,e;
	if(z){
		diff=z;
	}
	var tag = Math.floor(diff / (1000*60*60*24));
	diff = diff % (1000*60*60*24);
	var std = Math.floor(diff / (1000*60*60));
	diff = diff % (1000*60*60);
	var min = Math.floor(diff / (1000*60));
	diff = diff % (1000*60);
	var sec = Math.floor(diff / 1000);
	var mSec = diff % 1000;
	if(!timer.precision)mSec=mSec%10*10;
	mSec=Math.round(mSec);
	var add="";
	if(mSec%10==0){
		add="0";
	}
	if(mSec%100==0){
		add="0";
	}
	if(mSec%1000==0&&timer.precision){
		add="0";
	}
	if(isNaN(mSec)){
		return "DNF";
	}
	if(tag!=0){
		return tag + ":" + std + ":" + min + ":" + sec + "." + mSec + add;
	}else{
		if(std!=0){
			return std + ":" + min + ":" + sec + "." + mSec + add;
		}else{
			if(min!=0){
				return min + ":" + sec + "." + mSec + add;
			}else{
				return sec + "." + mSec + add;
			}
		}
	}
}

function displayTimes(){
	document.getElementById("time_list").innerHTML="";
	var i,text="";
	for(i=0;i<timer.config.results.length;i++){
		zeit=timer.config.results[i].zeit,
		scramble=timer.config.results[i].scramble,
		penalty=timer.config.results[i].penalty;
		if(penalty!="DNF"){
			text+=(i+1)+".: "+format(zeit);
			if(penalty=="+2"){
				text+="+";
			}
			if(penalty=="+4"){
				text+="++";
			}
		}else{
			text+=(i+1)+".: DNF";
		}
		text+="<div style='float:right;'>";
	
		text+="<button onclick='javascript: deletetime("+i+");'>X</button>";
		if(penalty==""){
			text+="<button onclick='javascript: givePenalty("+i+",\"+2\");'>+2</button>";
			text+="<button onclick='javascript: givePenalty("+i+",\"+4\");'>+4</button>";
			text+="<button onclick='javascript: givePenalty("+i+",\"DNF\");'>DNF</button>";
		}
		if(penalty=="+2"){
			text+="<button onclick='javascript: givePenalty("+i+",\"+2\");'>+2</button>";
			text+="<button onclick='javascript: givePenalty("+i+",\"-2\");'>-2</button>";
		}else if(penalty=="DNF"){
			text+="<button onclick='javascript: givePenalty("+i+",\"-DNF\");'>-DNF</button>";
		}else if(penalty=="+4"){
			text+="<button onclick='javascript: givePenalty("+i+",\"-2\");'>-2</button>";
			text+="<button onclick='javascript: givePenalty("+i+",\"-4\");'>-4</button>";
		}
		text+="</div><br>";
	
	}
	document.getElementById("time_list").innerHTML+=text;
}

document.onkeyup = function(event) {
	var actionBox = document.getElementById('action');
	if ((event.keyCode==86||event.keyCode==32||event.keyCode==66||event.keyCode==78) && timer.timingMode===0){
		event.cancelBubble = true;
		event.returnValue = false;
		checkKeyAction();
	}
	if (event.keyCode==32&&timer.timingMode===1){
		event.cancelBubble = true;
		event.returnValue = false;
		checkKeyAction();
	}
	if (event.keyCode==17&&timer.timingMode===2){
		event.cancelBubble = true;
		event.returnValue = false;
		checkKeyAction();
	}
	if (event.keyCode==79&&!(timer.config.disableKeysRunning&&timer.running)){//O
		showOptions();
	}
	if (event.keyCode==69&&!(timer.config.disableKeysRunning&&timer.running)){//E
		exportCode();
	}
	if (event.keyCode==73&&!(timer.config.disableKeysRunning&&timer.running)){//I
		//timer.importCode();
	}
	if (event.keyCode==88&&!(timer.config.disableKeysRunning&&timer.running)){//X
		timer.exportCode(1);
	}
	if (event.keyCode==78&&!(timer.config.disableKeysRunning&&timer.running)){//N //Conflict with timingMode 1
		//createSession();
	}
	if (event.keyCode==83&&!(timer.config.disableKeysRunning&&timer.running)){//S
		timer.saveSession(timer.config.currentSession);
	}
	return event.returnValue;
}

function checkKeyAction(){
	if(timer.running){
		stop();
	}else{
		if(!timer.block){
			start();
			timer.block=true;
			setTimeout(function(){timer.block=false},timer.blockTime);
		}else{
			document.getElementById("time_list").innerHTML="Timer blockiert! Warten sie "+timer.blockTime/1000+" Sekunden. <button onclick='javascript:displayTimes();'>"+language.back+" (Auto in "+timer.blockTimeReturn/1000+" Sekunden)</button>";
			setTimeout(timeListDisplay,timer.blockTimeReturn);
		}
	}
}

function avg(times){//aox
	var min=+Infinity,
	max=-Infinity,
	i,minindex,maxindex,sum=0;
	for(var j=0;j<times.length;j++){
		if(times[j].zeit<min){
			min=times[j].zeit;
			minindex=j;
		}
		if(times[j].zeit>max){
			max=times[j].zeit;
			maxindex=j;
		}
	}

	for(i=0;i<times.length;i++){
		if(i!==minindex&&i!==maxindex){
			sum+=times[i].zeit;
		}
	}

	return sum/(times.length-2);
}

function average(times){//mox
	var i,sum=0;

	for(i=0;i<times.length;i++){
		sum+=times[i].zeit;	
	}

	return sum/(times.length);
}

function minMaxTime(times){
	var min=+Infinity,j,minindex,max=-Infinity,maxindex;
	for(var j=0;j<times.length;j++){
		if(times[j].zeit<min){
			min=times[j].zeit;
			minindex=j;
		}
		if(times[j].zeit>max){
			max=times[j].zeit;
			maxindex=j;
		}
	}
	return {minindex:minindex,min:min,maxindex:maxindex,max:max};
}

function bestaox(times,x){
	if(times.length<x){
		return "DNF";
	}
	if(times.length==x){
		return Math.round(avg(times));
	}
	var i,j,arr=[],min=+Infinity,minavg;
	for(i=0;i<times.length-x;i++){
		arr=[];
		for(j=0;j<x;j++){
			arr.push(times[i+j]);
		}
		minavg=avg(arr);
		if(minavg<min){
			min=minavg;
		}
	}
	return Math.round(min);
}

function toolTimes(){
	var
		globalAverage=format(average(timer.config.results)),
		best=format(minMaxTime(timer.config.results).min),
		worst=format(minMaxTime(timer.config.results).max),
		bestao5=format(bestaox(timer.config.results,5)),
		uwr,fake;
	if(best<uwrs[timer.type])uwr=true;
	if(best<0.3)fake=true;
	p=language.globalAverage+": " + globalAverage + "<br>"+language.best+": " + best;
	if(uwr&&!fake){
		p+=" <b>UWR!</b>";
	}
	if(fake&&!uwr){
		p+=" <b>FAKE! :(</b>";
	}
	if(fake&&uwr){
		p+=" <b>FAKED UWR! :(</b>";
	}
	p+="<br>"+language.worst+": " + worst + "<br>"+language.best+" Ao5: " + bestao5 + "";
	ziel.check(1,timer.type,bestao5);
	if(timer.config.results.length>11){
		p+="<br>"+language.best+" Ao12: "+format(bestaox(timer.config.results,12));
		if(timer.config.results.length>49){
			p+="<br>"+language.best+" Ao50: "+format(bestaox(timer.config.results,50));
		}
	}
	if(timer.config.results.length>timer.customAvg-1){
		p+="<br>"+language.best+" Ao"+timer.customAvg+": "+format(bestaox(timer.config.results,timer.customAvg));
	}
	return p+"<br><button class='btn-lg' onclick='generateExport();'>Export</button>";
}

function toolTimeDistribution(){
	return true;
}

function toolDrawScramble(){
	var type=timer.type,scramble=timer.scramble,msg=false;
	switch(type){
		case "2x2":case "2x2sh":case "2x2opt":case "2x24":case "2x2bld":msg=generateCube(executeAlg(timer.scramble,SOLVED_POCKET_CUBE(),2));break;
		case "3x3":case "3x3bld":case "3x3co":case "3x3hco":case "3x3ru":case "3x3ruf":case "lse":case "barrel":     break;
		case "skewb":     break;
		case "pyra":     break;
		default:msg="Scrambles malen ist f&uuml;r diesen Typen leider nicht verf&uuml;gbar.";break;
	}
	if(msg)return msg;
}

function toolTimeRatio(){
	var
		globalAverage=format(average(timer.config.results)),
		best=format(minMaxTime(timer.config.results).min),
		worst=format(minMaxTime(timer.config.results).max),
		bestao5=format(bestaox(timer.config.results,5)),text="<table>";
	text+="<tr><td><b>A</b></td><td><b>zu B</b></td><td><b>Verh&auml;ltnis</b></td></tr>";
	text+="<tr><td>Best</td><td>Worst</td><td>"+Math.floor(best/worst*100)/100+"</td></tr>";
	text+="<tr><td>Single</td><td>Ao5</td><td>"+Math.floor(best/bestao5*100)/100+"</td></tr>";
	if(timer.config.results.length>11){
		text+="<tr><td>Single</td><td>Ao12</td><td>"+Math.floor(best/format(bestaox(timer.config.results,12))*100)/100;+"</td></tr>";
		text+="<tr><td>Ao5</td><td>Ao12</td><td>"+Math.floor(bestao5/format(bestaox(timer.config.results,12))*100)/100;+"</td></tr>";
		if(timer.config.results.length>49){
			text+="<tr><td>Single</td><td>Ao50</td><td>"+Math.floor(best/format(bestaox(timer.config.results,50))*100)/100;+"</td></tr>";
			text+="<tr><td>Ao5</td><td>Ao50</td><td>"+Math.floor(bestao5/format(bestaox(timer.config.results,50))*100)/100;+"</td></tr>";
			text+="<tr><td>Single</td><td>Ao12</td><td>"+Math.floor(format(bestaox(timer.config.results,12))/format(bestaox(timer.config.results,50))*100)/100;+"</td></tr>";
		}
	}
	if(timer.config.results.length>timer.customAvg-1){
		text+="<tr><td>Single</td><td>Ao"+timer.customAvg+"</td><td>"+Math.floor(best/format(bestaox(timer.config.results,timer.customAvg))*100)/100;+"</td></tr>";
	}
	return text;
}

function toolTimeHistory(){
	$("#summ").html("<canvas id='pbcanvas' width='200' height='150'></canvas>");
	var canvas = document.getElementById('pbcanvas'),
	ctx = canvas.getContext('2d'),
	height=150,
	width=200;
	ctx.moveTo(0,height-1);
	ctx.lineTo(width,height-1);
	ctx.stroke();
	ctx.font = "10px Arial";
	
	times=JSON.parse(JSON.stringify(timer.config.results));
	var min=0,j,max=minMaxTime(timer.config.results).max,time;
	for(var j=0;j<times.length;j++){
		time=times[j].zeit;
		ctx.moveTo((j/times.length)*width,height+min-1);
		ctx.lineTo((j/times.length)*width,height-((time/max)*height)+1);
	}
	ctx.stroke();
}

function drawTool(){
	var a=false;
	switch(timer.tool){
		case 0:a=toolTimes();break;
		case 1:a=toolTimeDistribution();break;
		case 2:a=toolDrawScramble();break;
		case 3:a=toolTimeRatio();break;
		case 4:a=toolTimeHistory();break;
	}
	if(a){
		document.getElementById("summ").innerHTML=a;
	}
}

function givePenalty(id,penalty){
	if(timer.config.results[id].penalty==""&&penalty=="+2"){
		timer.config.results[id].penalty="+2";
		timer.config.results[id].zeit+=2000;
	}
	else if(timer.config.results[id].penalty==""&&penalty=="+4"){
		timer.config.results[id].penalty="+4";
		timer.config.results[id].zeit+=4000;
	}
	else if(timer.config.results[id].penalty=="+2"&&penalty=="+2"){
		timer.config.results[id].penalty="+4";
		timer.config.results[id].zeit+=2000;
	}
	else if(timer.config.results[id].penalty=="+2"&&penalty=="-2"){
		timer.config.results[id].penalty="";
		timer.config.results[id].zeit-=2000;
	}
	else if(timer.config.results[id].penalty=="+4"&&penalty=="-2"){
		timer.config.results[id].penalty="+2";
		timer.config.results[id].zeit-=2000;
	}
	else if(timer.config.results[id].penalty=="+4"&&penalty=="-4"){
		timer.config.results[id].penalty="";
		timer.config.results[id].zeit-=4000;
	}
	else if(penalty=="DNF"){
		timer.config.results[id].penalty="DNF";
	}
	else if(timer.config.results[id].penalty=="DNF"&&penalty=="-DNF"){
		timer.config.results[id].penalty="";
	}
	else{
		timer.config.results[id].penalty="";
	}

	displayTimes();
	drawTool();
}

function switchSession(id){
	timer.sessions[timer.currentSession].results=JSON.parse(JSON.stringify(timer.config.results));
	timer.currentSession=id;
	timer.type=timer.sessions[timer.currentSession].scrambler;
	timer.config.results=JSON.parse(JSON.stringify(timer.sessions[timer.currentSession].results));
	displayTimes();
	displaySessions();
	displayScramble();
}

function deleteSession(id){
	if(confirm("Session wirklich resetten?")&&confirm("Alle Ihre Zeiten aus der Session werden gelöscht. Ganz sicher?")){
		timer.sessions[id].results=[];
	}
	displaySessions();
}

function createSession(){
	session={
		scrambler:timer.defaultScrambler,
		results:[],
	}
	timer.sessions.push(session);
	displaySessions();
}

function displaySessions(){
	for(var i=0,text="<h4>Sessions</h4>";i<timer.sessions.length;i++){
		text+="<button onclick='javascript:switchSession("+i+")'>"+i+"</button>";
		if((i+1)%20==0)text+="<br>";
	}
	text+="<button onclick='createSession()'>+</button>";
	text+="<button onclick='deleteSession(timer.currentSession)'>-</button>";
	document.getElementById("sessions").innerHTML=text;
	displayScrambler();
}

function switchScrambler(typ){
	timer.sessions[timer.currentSession].scrambler=timer.type=typ;
	displayScramble();
}

function displayScrambler(a){
	var text="",i,
	optionbreaks=[1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	optiontexts=["WCA",0,0,0,0,0,0,0,0,0,0,"Special NxNxN",0,0,0,0,0,0,0,0,0,"Cuboids",0,0,0,0,0,"Shapemods",0,"Sonstige",0,0,0,0,0,0,0,0,0,0,0,0,0,0,"Relays"]
	;
	for(i=0;i<timer.scrambleTypes.length;i++){
		if(optionbreaks[i]==1)text+="</div><button class='accordion'>"+optiontexts[i]+"</button><div class='panel'>";
		text+="<div class='scrambler-div' onclick='switchScrambler(\""+timer.scrambleTypes[i]+"\")'>"+timer.scrambleNames[i]+"</div>";
	}
	$("#session").html(text+"<div class='scrambler-div'>Auswahl in Men&uuml;/Optionen/Sonstiges/Relays</div>");
	if(a)$(a).html(text);
}

function generateExport(){
	var
		globalAverage=format(average(timer.config.results)),
		best=format(minMaxTime(timer.config.results).min),
		worst=format(minMaxTime(timer.config.results).max),
		bestao5=format(bestaox(timer.config.results,5)),


	p="<h2>Export</h2>"+language.globalAverage+": " + globalAverage + "<br>"+language.best+"e: " + best + "<br>"+language.worst+": " + worst + "<br>"+language.best+" Ao5: " + bestao5 + "<br>";
	if(timer.config.results.length>11){
		p+="<br>"+language.best+" Ao12: "+format(bestaox(timer.config.results,12));
		if(timer.config.results.length>49){
			p+="<br>"+language.best+" Ao50: "+format(bestaox(timer.config.results,50));
		}
	}
	if(timer.config.results.length>timer.customAvg-1){
		p+="<br>"+language.best+" Ao"+timer.customAvg+": "+format(bestaox(timer.config.results,timer.customAvg));
	}

	
	for(i=0;i<timer.config.results.length;i++){
		i++;
		p+="<br>"+i+".: ";
		i--;
		p+=format(timer.config.results[i].zeit)+" "+timer.config.results[i].scramble+"<br>";
	}
	d = new Date();
	d=d.toDateString();
	i=Math.round((i/256)+.5);
	p+="<br><br>Export wurde am "+d+" in "+i+"ms generiert.";
	p+="<br><button onclick='hide(\"export\");'>"+language.back+"</button>";
	show('export');
	document.getElementById('export').innerHTML=p;

	displayTimes();
	drawTool();
}

function exportCode(){
	var code="timer="+JSON.stringify(timer,null,1)+";algsets.sets="+JSON.stringify(algsets.sets,null,1)+"<button onclick='hideExportCode()'>OK</button>";
	document.getElementById("scrambleImage").innerHTML=code;
	return code;
}

function hideExportCode(){
	document.getElementById("scrambleImage").innerHTML="";
}

function importCode(){
	var a=timer.version||false;
	eval(prompt(language.entercode));
	displayTimes();
	displaySessions();
	var b=timer.version||false;
	if(b!=a){
		alert ("Der Export wurde mit Version "+a+" erstellt. Diese Version ist veraltet. Die fehlenden Variablen wurden ergänzt. Manche Scramblertypen können verändert sein. Der nächste Export wird Dateien der aktuellen Version generieren; diese sind meistens rückwärtskompatibel.");
	}
}

ziel={
	ziele:[[0,0,0,0,0,0]],
	done:[],
	doneAvg:[],
	display:function(){
		while(ziel.ziele.length<timer.sessions.length){
			ziel.ziele.push([0,0,0,0,0,0]);
		}
		var text="<h2>"+language.goals+"</h2>";
		for(var i=0;i<timer.sessions.length;i++){
			text+="<button class='btn-option' onclick='javascript:switchSession("+i+");ziel.display();'>"+i+"</button>";
		}
		text+="<span class=\"helpmsg\" onmouseover=\"$(this).html('W&auml;hlen Sie die Session aus, f&uuml;r die Sie die Ziele setzen m&ouml;chten.');\" onmouseout=\"$(this).html('&nbsp;?&nbsp;')\">&nbsp;?&nbsp;</span><br>";
		show('ziele');
		var
		globalAverage=format(average(timer.config.results)),
		best=format(minMaxTime(timer.config.results).min),
		worst=format(minMaxTime(timer.config.results).max),
		bestao5=format(bestaox(timer.config.results,5)),
		besto12=format(bestaox(timer.config.results,12)),
		bestao50=format(bestaox(timer.config.results,50)),
		bestocustom=format(bestaox(timer.config.results,timer.customAvg));
		if(typeof ziel.ziele[timer.currentSession]=="undefined")ziel.ziele[timer.currentSession]=[0,0,0,0,0,0];
		
		text+="<br>Single:"+ziel.format(ziel.ziele[timer.currentSession][0],best)+"&nbsp;<button onclick='ziel.ziele[timer.currentSession][0]++;ziel.display();'>+</button><button onclick='ziel.ziele[timer.currentSession][0]--;ziel.display();'>-</button>"
		+"<br>Ao5:"+ziel.format(ziel.ziele[timer.currentSession][1],bestao5)+"&nbsp;<button onclick='ziel.ziele[timer.currentSession][1]++;ziel.display();'>+</button><button onclick='ziel.ziele[timer.currentSession][1]--;ziel.display();'>-</button>"
		+"<br>Ao12:"+ziel.format(ziel.ziele[timer.currentSession][2],besto12)+"&nbsp;<button onclick='ziel.ziele[timer.currentSession][2]++;ziel.display();'>+</button><button onclick='ziel.ziele[timer.currentSession][2]--;ziel.display();'>-</button>"
		+"<br>Ao50:"+ziel.format(ziel.ziele[timer.currentSession][3],bestao50)+"&nbsp;<button onclick='ziel.ziele[timer.currentSession][3]++;ziel.display();'>+</button><button onclick='ziel.ziele[timer.currentSession][3]--;ziel.display();'>-</button>"
		+"<br>Custom Aox:"+ziel.format(ziel.ziele[timer.currentSession][4],bestocustom)+"&nbsp;<button onclick='ziel.ziele[timer.currentSession][4]++;ziel.display();'>+</button><button onclick='ziel.ziele[timer.currentSession][4]--;ziel.display();'>-</button>"
		+"<br>";
		text+="<div onclick='hide(\"ziele\")'>"+language.back+"</div>";
		text+=ziel.vergleich();
		$("#ziele").html(text);
	},
	format:function(ziel,current){
		var color="red";
		if(ziel/current>1){
			color="green";
		}
		return "<span style='background-color:"+color+"'>"+Math.round(ziel/current*100)+"% ("+language.goal+": "+ziel+" "+language.seconds+")</span>";
	},
	check:function(singleAverage,event,time){
		var times=timer.config.results;
	},
	vergleich:function(){
		var
		globalAverage=format(average(timer.config.results)),
		best=minMaxTime(timer.config.results).min,
		bestao5=bestaox(timer.config.results,5)
		bestao12=bestaox(timer.config.results,12),
		bestao12=bestaox(timer.config.results,12),
		bestao50=bestaox(timer.config.results,50),
		bestocustom=bestaox(timer.config.results,timer.customAvg),
		currentValues=[best,bestao5,bestao12,bestao50,bestocustom];
		text="Aktueller Single/Ao5/Ao12/Ao50/AoCustom Rankvergleich:<table>",
		maxtime=minMaxTime(timer.config.results).min*1.1;
		startvalues=[maxtime,maxtime*1.1,maxtime*1.2*1.1,maxtime*1.3*1.2*1.1,maxtime*1.4*1.3*1.2*1.1,maxtime*1.4*1.3*1.2*1.1*1.5],
		currentValue=0;
		for(var j=0;j<5;j++){
			text+="<tr>";
			currentValue=startvalues[j];
			for(var i=0;i<20;i++){
				text+="<td>";
				for(var k=0;k<i;k++)currentValue*=.97;
				if(currentValue>currentValues[j])text+="<span style='background-color:green'>"+Math.round(currentValue)/1000+"</span></td>";
				if(currentValue<currentValues[j])text+="<span style='background-color:red'>"+Math.round(currentValue)/1000+"</span></td>";
				if(currentValue==currentValues[j])text+="<span style='background-color:yellow'>"+Math.round(currentValue)/1000+"</span></td>";
			}
			text+="</tr>";
		}
		return text+"</table";
	}
}

algsets={
	sets:[],
	setnames:[],
	registeredSets:{"PLL":[" 	x (R' U R') D2(R U' R') D2 R2 "," 	x' (R U' R) D2 (R' U R) D2 R2 ","R U' R U R U R U' R' U' R2","R2 U R U R' U' (R' U') (R' U R')","M2 U M2 U2 M2 U M2 ","R U R' U' R' F R2 U' R' U' R U R' F'"," 	R U R' F' R U R' U' R' F R2 U' R' U'","F R U' R' U' R U R' F' R U R' U' R' F R F'"," 	R' U2 R U2 R' F R U R' U' R' F' R2 U'"," 	L U2' L' U2' L F' L' U' L U L F L2' U","R' U R' d' R' F' R2 U' R' U R' F R F","R' U2 R' d' R' F' R2 U' R' U R' F R U' F"," 	R U R' y' R2 u' R U' R' U R' u R2","R' U' R y R2 u R' U R U' R u' R2"," 	R2 u' R U' R U R' u R2 y R U' R'"," 	R2 u R' U R' U' R u' R2 y' R' U R"," 	M2 U M2 U M' U2 M2 U2 M' U2","R' U L' U2 R U' R' U2 R L U'","x' (R U' R') D (R U R') D' (R U R') D (R U' R') D' ","(R' U L') U2 (R U' L) (R' U L') U2 (R U' L) U'","(L U' R) U2 (L' U R') (L U' R) U2 (L' U R') U"]},
	display:function(){
		show('algSets');
		text="<h2>Algorithmen</h2>";
		text+="Es sind "+algsets.sets.length+" Sets eingetragen.<br><button onclick='javascript:algsets.addSet()'>+</button><br>";
		for(var i=0;i<algsets.sets.length;i++){
			text+=algsets.setnames[i]+":<button onclick='javascript:algsets.addAlg("+i+")'>+</button><br>";
			for(var j=0;j<algsets.sets[i].length;j++){
				text+=(j+1)+".: "+algsets.formatAlg(algsets.sets[i][j])+"<button onclick='javascript:algsets.sets["+i+"]["+j+"]=algsets.turnAlg(algsets.sets["+i+"]["+j+"]);algsets.display();'>Invert</button><button onclick='javascript:algsets.sets["+i+"]["+j+"]=algsets.mirrorM(algsets.sets["+i+"]["+j+"]);algsets.display();'>Mirror M</button><button onclick='javascript:algsets.sets["+i+"]["+j+"]=algsets.mirrorS(algsets.sets["+i+"]["+j+"]);algsets.display();'>Mirror S</button><button onclick='javascript:algsets.sets["+i+"]["+j+"]=algsets.simplify(algsets.sets["+i+"]["+j+"]);algsets.display();'>Simplify</button><button onclick='javascript:algsets.sets["+i+"]["+j+"]=algsets.viewExecution(algsets.sets["+i+"]["+j+"]);'>View Execution</button><button onclick='javascript:algsets.edit("+i+","+j+");'>Edit</button><br>";
			}
		}
		text+="<br><div onclick='hide(\"algSets\")'>"+language.back+"</div>";
		$("#algSets").html(text);
	},
	addSet:function(){
		var a=prompt("Geben Sie Ihren AlgSetNamen hier ein.");
		algsets.setnames.push(a);
		if(typeof algsets.registeredSets[a.toUpperCase()]!=="undefined"){
			if(confirm("Das AlgSet ist schon definiert. Möchten Sie Ihre eigene Definition schreiben (OK) oder die vorgefertigte Verwenden (Abbrechen)?")){
				algsets.sets[algsets.sets.length]=algsets.registeredSets[a.toUpperCase()];
			}else{
				algsets.sets[algsets.sets.length]=[];
			}
		}else{
			algsets.sets[algsets.sets.length]=[];
		}
		algsets.display();
	},
	addAlg:function(setid){
		algsets.sets[setid].push(prompt("Geben Sie Ihren Algorithmus hier ein."));
		algsets.display();
	},
	formatAlg:function(alg){
		return alg;
	},
	turnAlg:function(alg){
		return cube.cube.invert(alg);
	},
	mirrorS:function(alg){
		return cube.cube.mirrorAcrossS(alg);
	},
	mirrorM:function(alg){
		return cube.cube.mirrorAcrossM(alg);
	},
	simplify:function(alg){
		return cube.cube.simplify(alg);
	},
	viewExecution:function(alg){
		$("#algSets").html('<iframe src="https://alg.cubing.net/?alg='+cube.cube.simplify(alg)+'&setup='+cube.cube.invert(alg)+'&view=fullscreen" width="800" height="550"></iframe><div onclick="algsets.display()">'+language.back+'</div>');
		return alg;
	},
	edit:function(i,j){
		algsets.sets[i][j]=prompt("Geben Sie den neuen Algorithmus hier ein.",algsets.sets[i][j]);
		algsets.display();
	}
}

var relayNumbers=[];

function displayRelayOption(){
	var text="<button onclick='relayNumbers[1]=relayNumbers[5]=relayNumbers[16]=1;displayRelayOption();'>2x2-4x4</button><br><button onclick='relayNumbers[1]=relayNumbers[5]=relayNumbers[16]=relayNumbers[17]=1;displayRelayOption();'>2x2-5x5</button><br><br>";
	for(var i=0;i<timer.scrambleTypes.length;i++){
		if(typeof relayNumbers[i]=="undefined")relayNumbers[i]=0;
		text+=(i+1)+".: "+timer.scrambleNames[i]+"&nbsp;&nbsp;";
		if(relayNumbers[i]<256){
			text+="<button onclick='relayNumbers["+i+"]++;displayRelayOption();'>+</button>"
		}else{
			if(timer.relayWarn)text+=language.relayWarnText;
		}
		text+="&nbsp;"+relayNumbers[i]+"&nbsp;";
		if(relayNumbers[i]>0){
			text+="<button onclick='relayNumbers["+i+"]--;displayRelayOption();'>-</button>";
		}
		text+="<br>";
	}
	document.getElementById("relays").innerHTML=text+"<br><button onclick='generateRelayCode();hide(\"relays\");'>Finish</button>";
}

function generateRelayCode(){
	timer.relayCommand="";
	var i,j;
	for(i=0;i<relayNumbers.length;i++){
		if(relayNumbers[i]>0){
			for(j=0;j<relayNumbers[i];j++){
				timer.relayCommand+=timer.scrambleTypes[i]+" ";
			}
		}
	}
}

function importCstimer(code){
	timer={
		running:false,
		zeit:0,
		penalty:'',
		type:"",
		timingMode:1,
		blockTime:1000,
		blockTimeReturn:3000,
		currentSession:0,
		relayCommand:'2x2 2x2bld',
		version:'2.1.7',
		customAvg:3,
		relayWarn:true,
		sessions:[],
		config:{
			aktualisierungsrate:17,
			results:[]
		}
	};
	eval("cstimer="+code);
	eval("csproperties="+cstimer.properties);
	timer.type=csproperties.scrType;
	for(var i=1;i<csproperties.sessionN;i++){
		timer.sessions[i]={"scrambler":csproperties.scrType,"results":[]};
		for(var j=0,obj;j<eval("cstimer.session"+i).length;i++){
			obj={"zeit":eval("cstimer.session"+i)[j][0][1],"scramble":eval("cstimer.session"+i)[j][1],"penalty":'',"datum":0}
			timer.sessions[i].results.push(obj);
		}
	}
}

musik={
	server:{
		load:function(){
			var src=prompt("Geben Sie hier die URL ein.");
			var type=false;
			src3=src.split(".");
			src2=src3[src3.length-1];
			switch(src2){
				case "mp3":
				type="audio/mpeg";
				break;
				case "ogg":
				type="audio/ogg";
				break;
				case "wav":
				type="audio/wav";
				break;
			}
			if(type){
				$("#musik0").html($("#musik0").html()+"<audio controls autoplay loop><source src='"+src+"' type='"+type+"'/></audio>");
			}else{
				$("#musik0").html($("#musik0").html()+"Nicht unterst&uuml;tzter Dateityp!");
			}
		}
	},
	youtube:{
		load:function(){
			var id=prompt("Youtubevideoid hier eingeben:");
			$("#musik1").html($("#musik1").html()+'<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/'+id+'?autoplay=1&fs=0&disablekb=1&loop=1&autohide=0" frameborder="0"/>');
		},
		loadlist:function(){
			var id=prompt("Youtubevideoid hier eingeben:");
			var list=prompt("Youtubevideolistenid hier eingeben:");
			$("#musik2").html($("#musik2").html()+'<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/'+id+'?autoplay=1&fs=0&disablekb=1&loop=1&autohide=0&list='+list+'" frameborder="0"/>');
		}
	}
}

function showOptions(){
	show("options");
}

function hideOptions(){
	document.getElementById("options").style.visibility="hidden";
}

function show(id){
	document.getElementById(id).style.visibility="visible";
}

function hide(id){
	document.getElementById(id).style.visibility="hidden";
}

{var mozilla=document.getElementById&&!document.all,ie=document.all,contextisvisible=0;function iebody(){return document.compatMode&&"BackCompat"!=document.compatMode?document.documentElement:document.body}
function displaymenu(a){el=document.getElementById("context_menu");contextisvisible=1;if(mozilla)return el.style.left=pageXOffset+a.clientX+"px",el.style.top=pageYOffset+a.clientY+"px",el.style.visibility="visible",a.preventDefault(),!1;if(ie)return el.style.left=iebody().scrollLeft+event.clientX,el.style.top=iebody().scrollTop+event.clientY,el.style.visibility="visible",!1}function hidemenu(){"undefined"!=typeof el&&contextisvisible&&(el.style.visibility="hidden",contextisvisible=0)}
mozilla?(document.addEventListener("contextmenu",displaymenu,!0),document.addEventListener("click",hidemenu,!0)):ie&&(document.attachEvent("oncontextmenu",displaymenu),document.attachEvent("onclick",hidemenu));}