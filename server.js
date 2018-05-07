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
	host:"localhost",user:"root",password:"8p16ff0015",database:"PocketTank"
});


var password1="";
var userid1="";


var terr=[];//It contains Location of Terrain coordinates(X coordinate is index of array element,y coordinate is value of array)
var xpeak=0;//It contains x coordinate of peak;
var ypeak=400;//It contains y coordinate of peak;
// var password2="";
// var userid2="";

function createTerrain()
{
	var ranX=Math.random()*400+300;
	terr.push(400);
	var y0=400;
	// var xpeak=0;
	// var ypeak=400;
	for(var i=1;i<=ranX;i+=1)
	{
		var r=Math.random()*8/3;
		var y=400;
		var j=r%2;

		if(ranX-i<200 && j>1)
			r+=3;
		if(j>1)
		{
			if(y-r>50)
			{
				y=y-r;
				terr.push(y);
			}	
		}
		else
		{
			if(y+r<400)
			{
				y=y+r;
				terr.push(y);
			}
		}
		xpeak=i;
		ypeak=y;
	}
	for(var i=ranX+1;i<=1000;i+=1)
	{
		var r=Math.random()*8/3;
		var y=400;
		var j=r%2;

		if(i-ranX<200 && j>1)
			r+=3;
		if(j>1)
		{
			if(y+r<400)
			{
				y=y+r;
				terr.push(y);
			}	
		}
		else
		{
			if(y-r>50)
			{
				y=y-r;
				terr.push(y);
			}
		}
	}
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
    
 	socket.broadcast.emit('bpress2', data);

 	getLogin();
}
);


socket.on('login', function(data) {
    
 	
	checkLogin(data.username,data.password); 
	
	console.log(data.username,data.password);
	
	console.log('login result is',loginResult)
	setTimeout(function(){socket.emit('loginResponse', loginResult)},1000 );
	
		
		
}
);




 	
}
);
  




