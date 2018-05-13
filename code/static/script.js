var stage;
var playerid="";
var grap=new createjs.Graphics();
var attackBall;
var acc=false;
var view=-1;
var canvas;
var ctx;
var terr=[];
var xpeak;
var ypeak;
var tank1x=0;
var tank1y=0;
var tank2x=0;
var tank2y=0;
var computer=0,env=1;
var weapon=0;
var soundID="Tinkling";
var soundID2="Gun";

var playerNum;

var turn1=0;
var turn2=0;

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

function playSound()
{
	createjs.Sound.play(soundID);
}

function playGun()
{
	createjs.Sound.play(soundID2);
}

function loadSound()
{
	createjs.Sound.registerSound("/static/bcg.mp3",soundID);
	createjs.Sound.registerSound("/static/bomb.mp3",soundID2);
}

function init()
{
	loadSound();
	console.log("Init function completed");
	stage=new createjs.Stage("canvas");
	modal = document.getElementById('id01');
	attackBall= createjs.Shape();
	canvas=document.getElementById("canvas");
}

function restart()
{
 grap=new createjs.Graphics();
 acc=false;
 view=-1;
 terr=[];
 tank1x=0;
 tank1y=0;
 tank2x=0;
 tank2y=0;
 computer=0;
 env=1;
 weapon=0;
 turn1=0;
 turn2=0;
 scoreA=0;
 scoreB=0;

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
	playerid=id;
	var up={username:id,password:pswd};
	socket.emit('login',up);
}

function insertHistory()
{
	socket.emit('history',playerid);
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
	// stage.addChild(s1);
	
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
	computer=parseInt(document.getElementById("computer").value);

	env=document.getElementById("env").value;
});
	
	
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
	img1=new createjs.Bitmap("/static/tank.png");
	img1.x=tank1x-20;
	img1.y=tank1y-20;
	img1.scaleX=img1.scaleY=0.05;
	img1.rotation=-20;
	stage.addChild(img1);
	img2=new createjs.Bitmap("/static/tank2.png");
	img2.x=tank2x+5;
	img2.y=tank2y-20;
	img2.scaleX=img2.scaleY=0.05;
	img2.rotation=20;
	stage.addChild(img2);
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
	if(weapon==0)
	{
		g1.beginFill("black");
		g1.drawCircle(attackC[it],attackC[it+1],5);
	
	}
	else
	{
		if(weapon==1)
		{
			g1.beginFill("black");
			g1.drawCircle(attackC[it],attackC[it+1],8);
	
		}
		else
		{
			g1.beginFill("red");
			g1.drawCircle(attackC[it],attackC[it+1],3);
	
		}
	}	
		
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
    	if(turn2==10)
		{
			if(scoreB>scoreA)
			{
				var d={playerid:2,scoreW:scoreB,scoreL:scoreA};
				socket.emit("history",d);
				alert("Congratulations Player2");
			}
			else
			{
				if(scoreB<scoreA){
				var d={playerid:1,scoreW:scoreA,scoreL:scoreB};
				socket.emit("history",d);
				alert("Congratulations Player1");
				}
				else
				{
					alert("It is a draw.");		
				}

			}
		}
    }
    	
		
	// setTimeout(scoreCard(),3000);
}

// function scoreCard(){
// if(turn2==10)
// 		{
// 			if(scoreB>scoreA)
// 			{
// 				alert("Congratulations Player2");
// 			}
// 			else
// 			{
// 				alert("Congratulations Player1");	
// 			}
// 		}
// }
var g1=new createjs.Graphics();

attackBall=new createjs.Shape(g1);
	// attackBall.x=attackC[i];
	// attackBall.y=attackC[i+1];
	
var mm1;

socket.on('attackR',function(data){
		
		attackC=[];
		attackC=data.a;
		
		scoreA+= data.b;
		
		// console.log(scoreA);
		document.getElementById("player1").innerHTML="Player1: "+scoreA;
		// console.log("Response");
		// console.log(attackC);
		turn1+=1;	
			
		//createjs.Tween.get(attackBall).to({guide:{ path:attackC }},3000);
		
		var l=attackC.length;

		
	    setTimeout(aMotion(),50);
			


		
		
	} );

socket.on('attackR2',function(data){
		
		attackC=[];
		turn2+=1;
		attackC=data.a;
		
		scoreB+= data.b;
		
		// console.log('B ka score',scoreB);
		document.getElementById("player2").innerHTML="Player2: "+scoreB;
		// console.log("Response");
		// console.log(attackC);

		//createjs.Tween.get(attackBall).to({guide:{ path:attackC }},3000);
		
		var l=attackC.length;

		
	    setTimeout(aMotion(),50);

		


		
		
	} );








socket.on('loginResponse',function(data){
	// console.log(data);
	if(data == true)
	{
		// console.log("")
		view=0;
		// console.log("Hello");
		modal.style.display="none";
		alert("Make sure to Select Battle Mode and Environment.");
		
		
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
	if(turn1==turn2 && turn1<=9){
		playGun();
		// console.log('attacked');
		power=parseInt(document.getElementById("power").value);
		angle=parseInt(document.getElementById("angle").value);
		
		var da={p:power,ang:angle};
		socket.emit('bpress',da);
		// turn1+=1;
		weapon=parseInt(document.getElementById("weapon").value);
	}
	else
	{
		if(turn1>10)
		{
			alert("Match is Over.(Restart the server for another match.)")
		}
		else
			alert("You can only attack once.");

		}	
}

function attack2(i)
{		

		if(turn2+1==turn1 && turn1<=10){
			playGun();
	    // console.log('attacked B');
		power = parseInt(document.getElementById("power").value);
		angle = parseInt(document.getElementById("angle").value);

		
		if(computer==1)
		{
			angle = Math.random()*(90);
			power = Math.random()*(100);
		}
		else
		{
			// if(computer==2)
			// {
			// 	angle=85*3.14/180;
			// 	var xdef=tank1x-tank2x;
			// 	var ydef=tank1y-tank2y;
			// 	power=0.01*Math.sqrt(10*xdef*xdef/(2*Math.cos(angle)*Math.cos(angle)*(xdef*Math.tan(angle)-ydef)));
			// }
		}	
		var da={p:power,ang:angle};
		socket.emit('bpress2',da);
		// turn2+=1;
		weapon=parseInt(document.getElementById("weapon").value);
	}
	else
	{
		if(turn1>10)
		{
			alert("Match is Over.(Restart the server for another match.)")
		}
		else
			alert("You can only attack once.");
	}
}

function terrain()
{

		if(env=="1")
			document.getElementById("canvas").style.background="#87cefa";
		else
			document.getElementById("canvas").style.background="#1f263b";
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
			shape=new createjs.Shape(grap);
			stage.addChild(shape);
			// console.log("Terrain Generated.");
			stage.update();	
			tanks();
			stage.update();
			view=-2;

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
			// console.log("Tick function for terrrain");
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
	stage.update();			
}



