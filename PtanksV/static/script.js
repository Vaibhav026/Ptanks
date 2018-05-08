var stage;

var grap=new createjs.Graphics();
		var attackBall;
var acc=false;
var view=-1;
var canvas;	//=document.getElementById("canvas");
var ctx;
var terr=[];
var xpeak;
var ypeak;
var tank1x=0;
var tank1y=0;
var tank2x=0;
var tank2y=0;//		ctx.clearRect(0, 0, this.canvas.width+1, this.canvas.height+1);

var soundID = "Tinkling";
var soundID2 = "Gun";

var scoreA=0;
var scoreB=0;

var socket = io();
socket.on('message', function(data) {
  // console.log(data,socket.id);
});
var modal;

function attackValue()
{
	document.getElementById("anglebar").innerHTML="Angle: "+ document.getElementById("angle").value;
}

function powerValue()
{
	document.getElementById("powerbar").innerHTML="Power: "+ document.getElementById("power").value;
}



function playSound () {
  createjs.Sound.play(soundID);
}

function playGun () {
  createjs.Sound.play(soundID2);
}

function loadSound () {
  createjs.Sound.registerSound("/static/bcg.mp3", soundID);
  createjs.Sound.registerSound("/static/bomb.mp3", soundID2);
}



function init()
{	
	loadSound();
	console.log("Init function completed");
	stage=new createjs.Stage("canvas");
		// ctx= document.getElementById("canvas").getContext("2d");
		// ctx.setTransform(1, 0, 0, 1, 0, 0);
	modal = document.getElementById('id01');
	attackBall= createjs.Shape();
	
	canvas=document.getElementById("canvas");
	// console.log(terr);

}


socket.on('Terrain',function(data){
		console.log("Terrain Response");
		terr=data.terrain;
		xpeak=data.x;
		ypeak=data.y;
		tank1x=data.t1x;
		tank1y=data.t1y;
		tank2x=data.t2x;
		tank2y=data.t2y;
		// console.log(terr);
	} );

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick",tick);

function loginView()
{
	var text = new createjs.Text("Pocket Tanks", "120px Script", "white");
	// document.getElementById("canvas").style.background="white";
 	text.x=(stage.canvas.width-640)/2;
 	text.y=250;
 	text.textBaseline = "alphabetic";
 	stage.addChild(text);
 	stage.update();
 	socket.emit("getTerrain",1);
 	// console.log("loginView");
}



function checkDatabase()
{   
	playSound();
	var id=document.getElementById("username").value;
	var pswd=document.getElementById("password").value;
	var up={username:id,password:pswd};
	socket.emit('login',up);
}

function starter()
{
	// ctx.clearRect(0, 0, this.canvas.width+1, this.canvas.height+1);
	grap=new createjs.Graphics();
	grap.beginStroke("red");
	grap.beginFill("Blue");
	document.getElementById("canvas").style.background="black";
	grap.drawRoundRect((stage.canvas.width-300)/2,(stage.canvas.height+50)/2,300,100,50);
	
	var s=new createjs.Shape(grap);
	s.name="Play Button";
	grap.endFill();
	stage.addChild(s);
	grap.beginStroke("black");
	grap.beginFill("red");
	grap.drawCircle(100,380,30);
	
	var s2=new createjs.Shape(grap);
	s2.name="Option Button";
	grap.endFill();
	stage.addChild(s2);
	grap.beginStroke("black");
	grap.beginFill("red");
	grap.drawCircle(900,380,30);
	
	var s1=new createjs.Shape(grap);
	s1.name="About Button";
	grap.endFill();
	stage.addChild(s1);
	
	var text = new createjs.Text("Pocket Tanks", "60px Script", "white");
 	text.x=(stage.canvas.width-310)/2;
 	// text.y=180;
 	text.textBaseline = "alphabetic";
 	stage.addChild(text);
 	createjs.Tween.get(text).to({y:180}, 2000, createjs.Ease.linear).to({y:150}, 500, createjs.Ease.linear).to({y:180}, 800, createjs.Ease.linear);
 	text = new createjs.Text("Play", "35px Script", "black");
 	text.x=(stage.canvas.width-60)/2;
 	text.y=(stage.canvas.height+150)/2;
 	text.textBaseline = "alphabetic";
 	stage.addChild(text);
	
	s.addEventListener('click', function (e) {
	// console.log(e.target + ' was double clicked!');
	view=1;
	grap.clear();
	// if(view==1)
			

	// stage.clear();
	// terrain();
});
	
// 	s1.addEventListener('dblclick', function (e) {
// 	console.log(e.target + ' was double clicked!');
// 	view=2;
// });
	
// 	s2.addEventListener('dblclick', function (e) {
// 	console.log(e.target + ' was double clicked!');
// 	view=3;
// });
	
}
createjs.MotionGuidePlugin.install();
var xcoor=[];
var ycoor=[];
var attackC=[];
// var xpeak;
// var ypeak;
// var peakindex;
// var tank1index=0;
// var tank2index=0;

var slope1=0;
function tanks()
{
	// console.log(tank1x+"T1x"+tank1y+"T1y"+tank2x+"T2x"+tank2y+"T2y");
	var tgraph=new createjs.Graphics();
	tgraph.beginStroke("red");
	tgraph.beginFill("red");
	tgraph.drawRoundRect(tank1x-10,tank1y-25,25,15,5);
	var tank=new createjs.Shape(tgraph);
	// tank.regX=tank1x+12.5;
	// tank.regY=tank1y+7.5;
	slope1=(terr[tank1x+10]-terr[tank1x-10])/20.0;
	slope1=Math.floor(Math.atan(slope1)*180/3.14);
	// tank.rotation=slope1;
	stage.addChild(tank);
	tgraph=new createjs.Graphics();
	tgraph.beginStroke("red");
	tgraph.beginFill("red");
	tgraph.drawRoundRect(tank2x,tank2y-15,25,15,5);
	tank=new createjs.Shape(tgraph);
	slope1=(terr[tank2x+10]-terr[tank2x-10])/20.0;
	slope1=Math.floor(Math.atan(slope1)*180/3.14);
	// tank.rotation=slope1;
	// tank.rotation(Math.atan(slope1));
	stage.addChild(tank);
	stage.update();
	
	
}

function backButton()
{
	var btn=new createjs.Shape();
	btn.graphics.beginFill("black");
	btn.graphics.drawCircle(950,50,20);
	stage.addChild(btn);
	btn.addEventListener('click', function (e) {
	// console.log(e.target + ' was double clicked!');
	view=0;
	tank2x=tank1y=tank1x=tank2y=0;
	// grap.clear();

	// stage.clear();
	// terrain();
});

}

function controller()
{

}

function attackMotion(i)
{

}

var power=0;
var angle=0;


var it=0;
function aMotion()
{	
	if(it < attackC.length){	
	g1.beginFill("black");
	g1.drawCircle(attackC[it],attackC[it+1],5);
		
	stage.addChild(attackBall);	
	stage.update();
	it=it+2;
	
	//console.log(it);
    acc =true;
    //setTimeout(stage.removeChild(attackBall),500);
    }
    else
    {	it = 0;
    	acc =false;
    	g1.clear();
    	//stage.removeChild(attackBall);
    	stage.update();
    }	
		
	//setTimeout(stage.removeChild(attackBall),4);
}

var g1=new createjs.Graphics();

attackBall=new createjs.Shape(g1);
	// attackBall.x=attackC[i];
	// attackBall.y=attackC[i+1];
	
var mm1;

socket.on('attackR',function(data){
		
		attackC=[];
		attackC=data.a;
		
		scoreA+= data.b;
		
		console.log(scoreA);

		console.log("Response");
		console.log(attackC);
		
			
		//createjs.Tween.get(attackBall).to({guide:{ path:attackC }},3000);
		
		var l=attackC.length;

		
	    setTimeout(aMotion(),50);
			


		
		
	} );

socket.on('attackR2',function(data){
		
		attackC=[];
		attackC=data.a;
		
		scoreB+= data.b;
		
		console.log('B ka score',scoreB);

		console.log("Response");
		console.log(attackC);
		
			
		//createjs.Tween.get(attackBall).to({guide:{ path:attackC }},3000);
		
		var l=attackC.length;

		
	    setTimeout(aMotion(),50);
			


		
		
	} );








socket.on('loginResponse',function(data){
	console.log(data);
	if(data == true)
	{
		// console.log("")
		view=0;
		// console.log("Hello");
		modal.style.display="none";
		
		
	}
	else
	{
		alert("Wrong Credentials Found. Try Again.");
		document.getElementById("username").value="";
		document.getElementById("password").value="";
	}

});




var first = 1;

function attack(i)
{		
	    playGun();
	    console.log('attacked');
		power=parseInt(document.getElementById("power").value);
		angle=parseInt(document.getElementById("angle").value);
		
		var da={p:power,ang:angle};
		socket.emit('bpress',da);
}	

function attack2(i)
{		
		playGun();
	    console.log('attacked B');
		power = parseInt(document.getElementById("power").value);
		angle = parseInt(document.getElementById("angle").value);
		
		var da={p:power,ang:angle};
		socket.emit('bpress2',da);
}

function terrain()
{
			document.getElementById("canvas").style.background="#87cefa";
			
			grap.clear();
			stage.clear();
			stage.update();
			grap=new createjs.Graphics();
			var shape;
			grap.moveTo(0,500);
			grap.beginLinearGradientFill(["#004d1a","#33ff77"], [0, 1], 0, 620, 0, 50);
			 
			for(var i=0;i<1000;i+=20)
			{
				grap.quadraticCurveTo(i,terr[i],i+10,terr[i+10]);
			}
			grap.quadraticCurveTo(1000,terr[999],1000,500).quadraticCurveTo(1000,500,0,500);//.quadraticCurveTo(1400,450,0,650).quadraticCurveTo(0,650,0,400);
			// console.log(terr[800]);
			shape=new createjs.Shape(grap);
			stage.addChild(shape);
			console.log("Terrain Generated.");
			// attack(1);
			backButton();
			stage.update();	
			tanks();
			stage.update();
			view=-2;

}

function mainmenu()
{

}

function tick()
{

	if(view==0)
	{
		stage.removeAllChildren();
		view =-2;
		starter();
	}
	else
	{
		if(view==1)
		{
			console.log("Tick function for terrrain");
			stage.removeAllChildren();
			stage.update();
			if(view==1)
			setTimeout(terrain(),2000);
			// view=-2;
		}
		else
		{
			if(view==-1)
			{
				loginView();
				stage.update();
				view=-2;
			}
		}
	}

	if(acc == true)
	{
		aMotion();
	}	
	// stage.removeChild(ball);
	stage.update();			
}



