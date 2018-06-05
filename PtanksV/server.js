// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var mysql=require('mysql');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var loginResult=false;

var addScore=0;
var hit = false;

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/Game', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
  // getLogin();
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

setInterval(function() {	
  io.sockets.emit('message', 'hi!');
}, 1000);

var connection=mysql.createConnection(
{
	host:"localhost",user:"root",password:"1111",database:"PocketTank"
});


var password1="";
var userid1="";


var terr=[];//It contains Location of Terrain coordinates(X coordinate is index of array element,y coordinate is value of array)
var xpeak=0;//It contains x coordinate of peak;
var ypeak=400;//It contains y coordinate of peak;
// var password2="";
var tank1x,tank1y,tank2x,tank2y;
// var userid2="";

function createTerrain()
{
	var ranX=Math.random()*400+300;
	terr.push(425);
	var y0=425;
	var y=425;
	// var xpeak=0;
	// var ypeak=400;
	for(var i=1;i<=ranX;i+=1)
	{
		var r=Math.random()*3.8;
		
		var j=r%2;

		if(ranX-i<200 && j>1)
			r+=2.4;
		// if(i%2==0){
		if(j>1)
		{
			if(y-r>100)
			{
				y=y-r;
				terr.push(y);
			}
			else
			{
				// y=51;
				terr.push(y);
			}	
		}
		else
		{
			if(y+r<425)
			{
				y=y+r;
				terr.push(y);
			}
			else
			{
				// y=399;
				terr.push(y);
			}
		}
		// }
		// else
		// {
		// 	terr.push(-1);
		// }
		y0=y;
		xpeak=i;
		ypeak=y;
	}
	for(var i=ranX+1;i<=1000;i+=1)
	{
		var r=Math.random()*2;
		// var y=400;
		var j=r%2;
		// if(y-r<150 || y-r>500)
		// {
		// 	r=0;
		// }
		if(i-ranX<200 && j>1)
			r+=1.2;
		// if(i%2==0){
		if(j>1)
		{
			if(y+r<425)
			{
				y=y+r;
				terr.push(y);
			}
			else
			{
				// y=400;
				terr.push(y);
			}	
		}
		else
		{
			if(y-r>100)
			{
				y=y-r;
				terr.push(y);
			}
			else
			{
				// y=51;
				terr.push(y);
			}

		// }
		}
		// else
		// {
		// 	terr.push(-1);
		// }
		y0=y;
	}

	tank1x=Math.floor(Math.random()*200)+200;
	tank1y=terr[tank1x];
	tank2x=900-Math.floor(Math.random()*400);
	tank2y=terr[tank2x];
	// console.log();
	var tvalues={terrain:terr,x:xpeak,y:ypeak,t1x:tank1x,t1y:tank1y,t2x:tank2x,t2y:tank2y};
	// socket.emit("Terrain",tvalues);
}

createTerrain();

function getLogin()
{
	console.log("GetLogin is working.");
	
	connection.connect(function(err) {
  	// if (err) throw err;
  		connection.query("SELECT * FROM Login", function (err, result, fields) {

    // if (err) throw err;
    var str=JSON.stringify(result);
    var json=JSON.parse(str);
    userid1=json[0].id;
    password1=json[0].password;
    console.log(userid1);

  });

});

}


function checkLogin(userid,password)
{
	console.log("GetLogin is working.");
	connection.connect(function(err) {
  	// if (err) throw err;
  		connection.query("SELECT * FROM Login where id= '"+ userid +"'", function (err, result, fields) {
    if (result.length==1){
    var str=JSON.stringify(result);
    var json=JSON.parse(str);
    
    if ( password == json[0].password )
    {	
    	
    	loginResult = true;
    	console.log("Inside function",loginResult);
    	console.log("Found a match");
        
    	// socket.broadcast.emit('loginResponse', true);
    }
    else
    {
    	loginResult = false;
    	console.log("No match found");
    	// socket.broadcast.emit('loginResponse', false);
	}
	
	}
	else
	{
		loginResult = false;
    	console.log("Username Wrong");
	}
  });
});
}

var attackC=[];
function attack(tx,power,angle)
{	

	var xpos = tank1x;
	var ypos = 0;
	attackC=[];
	
	var uh = power*(Math.cos(angle*2*3.14/360));
	var uv = power*(Math.sin(angle*2*3.14/360));
	
	

	var t = 0;
	var xint;
	while(xpos<=1000 && xpos>=0 )
	{
		xpos= tank1x + uh*t ;
		ypos =  uv*t - 5*t*t;

		t = t + 0.1 ;
		attackC.push(xpos);
		attackC.push(tank1y-10-ypos);

		xint = Math.floor(xpos);
		yint = (terr[xint]);

		console.log(yint,(tank1y-ypos));

		if( yint - (tank1y-ypos)  < 0 &&  xpos!=tank1x )
		break;	

	}	
	var l = attackC.length ;

	console.log('Hit is' ,attackC[l-2],tank2x);
	
	if(Math.abs(attackC[l-2] - tank2x)< 60 )
	{	console.log("HIT DONE");
		addScore =  Math.abs( 100 -Math.abs(attackC[l-2] - tank2x) ) ;
		hit = true;
	}	




	//console.log(attackC);
}


function attack2(tx,power,angle)
{	

	var xpos = tank2x;
	var ypos = 0;
	attackC=[];
	
	var uh = power*(Math.cos(angle*2*3.14/360));
	var uv = power*(Math.sin(angle*2*3.14/360));
	
	

	var t = 0;
	var xint;
	while(xpos<=1000 && xpos>=0 )
	{
		xpos= tank2x - uh*t ;
		ypos =  uv*t - 5*t*t;

		t = t + 0.1 ;
		attackC.push(xpos);
		attackC.push(tank2y-10-ypos);

		xint = Math.floor(xpos);
		yint = (terr[xint]);

		console.log(yint,(tank1y-ypos));

		if( yint - (tank2y-ypos)  < 0 &&  xpos!=tank2x )
		break;	

	}	

	var l = attackC.length ;

	console.log('Hit is' ,attackC[l-2],tank1x);
	
	if(Math.abs(attackC[l-2] - tank1x)< 60 )
	{	console.log("HIT DONE");
		addScore =  Math.abs( 100 -Math.abs(attackC[l-2] - tank1x) ) ;
		hit = true;
	}	
	//consoio.sockets.emit('attackR', {attackC:a,addScore:b});le.log(attackC);
		

}


















function setLogin(userid,pswd)
{
	console.log("SetLogin is working.");
	connection.connect(function(err) {
  	var sql="INSERT INTO Login (id,password) VALUES ('"+String(userid)+"','"+String(pswd)+"')";
  		console.log("Second");
  		connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Data Inserted.");
  
  });
});	
}




io.on('connection', function(socket) {
  	
  socket.on('chat', function(data){
    // console.log(data);
    io.sockets.emit('chat', data);
  });	




  socket.on('bpress', function(data) {
    
    console.log('INside bpress');
    attack(tank1x-10,data.p,data.ang);
    console.log(attackC.length);
 	 if(hit == true)
 	 { io.sockets.emit('attackR', {a:attackC,b:addScore});
	   hit = false;
	 }
	 else
	 {
	 	io.sockets.emit('attackR', {a:attackC,b:0});
	 }

	console.log("Hey");
 	// socket.broadcast.emit('bpress2', data);
}
);


socket.on('bpress2', function(data) {
    
    console.log('INside bpress');
    attack2(tank2x-10,data.p,data.ang);
    console.log(attackC.length);

     if(hit == true)
 	 { io.sockets.emit('attackR2', {a:attackC,b:addScore});
	   hit = false;
	 }
	 else
	 {
	 	io.sockets.emit('attackR2', {a:attackC,b:0});
	 }

	console.log("Hey");
 	// socket.broadcast.emit('bpress2', data);
}
);






socket.on('login', function(data) {
    
 	
	checkLogin(data.username,data.password); 
	
	console.log(data.username,data.password);
	
	console.log('login result is',loginResult);
	setTimeout(function(){socket.emit('loginResponse', loginResult);},1000 );
	
		
		
}
);

socket.on('getTerrain', function(data) {
    
	setTimeout(function(){socket.emit('Terrain', {terrain:terr,x:xpeak,y:ypeak,t1x:tank1x,t1y:tank1y,t2x:tank2x,t2y:tank2y});},1000 );
		
}
);
  

});





