window.onbeforeunload=function(){
	return "There may be unsaved times. Click Menu->Export before you go away!";
}

var helpbtns,helpbtnslength;
helpbtns=document.getElementsByClassName("helpmsg");
helpbtnslength=helpbtns.length;
for(let i=0;i<helpbtnslength;++i){
	helpbtns[i].onmouseover=function(){
		this.innerHTML=this.attributes.title.value;
	};
	helpbtns[i].onmouseout=function(){
		this.innerHTML="&nbsp;?&nbsp;";
	};
	helpbtns[i].innerHTML="&nbsp;?&nbsp;";
}

if(document.addEventListener){
	document.getElementById("sessions-mobile").addEventListener('click',function(){show('sessions');});
	document.getElementById("menu-icon-mobile").addEventListener('click',function(){show('menu');});
	document.getElementById("mobiletype").addEventListener('click',function(){show('scrambler');});
	document.getElementByClass("scrambleop").addEventListener('click',function(){show('scrambler');});
	document.getElementById("mobilenext").addEventListener('click',displayScramble);
	document.getElementByClass("next").addEventListener('click',displayScramble);
}else if(document.attachEvent){
	document.getElementById("sessions-mobile").attachEvent('onclick',function(){show('sessions');});
	document.getElementById("menu-icon-mobile").attachEvent('onclick',function(){show('menu');});
	document.getElementById("mobiletype").attachEvent('onclick',function(){show('scrambler');});
	document.getElementByClass("scrambleop").attachEvent('onclick',function(){show('scrambler');});
	document.getElementById("mobilenext").attachEvent('onclick',displayScramble);
	document.getElementByClass("next").attachEvent('onclick',displayScramble);
}else{
	alert("Your browser doesn't support attaching eventhandlers in JavaScript. The timer is unusable. You may want to wait, until a solution with setAttribute() is available.");
}

eval(localStorage.HTexport||"");
displayScramble();
displayScrambler();
drawTool();
createSession();
displayTimes();
displaySessions();