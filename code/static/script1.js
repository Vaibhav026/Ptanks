var socket = io();
socket.on('message', function(data) {
  // console.log(data,socket.id);
});

var x=0;
var table;
var btn;
function showHistory()
{
	socket.emit('getHistory',x);
}

function clearHistory()
{
	table.parentNode.removeChild(table);
	socket.emit('clearHistory',x);
}

socket.on('setHistory',function(data)
{
	var divv=document.getElementById("divtable");
	table = document.createElement('table');
	btn=document.createElement('button');
	btn.value="Back to Game";
	// btn.onclick=clearHistory();
	// btn.setAttribute("")
	table.style.background="white";
//	table.style.text-align="center";

	var tr = document.createElement('tr');   

    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    var text1 = document.createTextNode('Match Number');
    var text2 = document.createTextNode('Winner');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');

    var text3 = document.createTextNode('Winner\'s Score');
    var text4 = document.createTextNode('Loser\'s Score');

    td1.appendChild(text1);
    td2.appendChild(text2);
    tr.appendChild(td1);
    tr.appendChild(td2);
    td3.appendChild(text3);
    td4.appendChild(text4);
    tr.appendChild(td3);
    tr.appendChild(td4);

    table.appendChild(tr);
for (var i = 1; i <= data.length; i++){
    tr = document.createElement('tr');   

     td1 = document.createElement('td');
     td2 = document.createElement('td');

     text1 = document.createTextNode(i);
     text2 = document.createTextNode(data[i-1].winner);

    td1.appendChild(text1);
    td2.appendChild(text2);
    tr.appendChild(td1);
    tr.appendChild(td2);
    td3 = document.createElement('td');
     td4 = document.createElement('td');

     text3 = document.createTextNode(data[i-1].scorew);
     text4 = document.createTextNode(data[i-1].scorel);

    td3.appendChild(text3);
    td4.appendChild(text4);
    tr.appendChild(td3);
    tr.appendChild(td4);

    table.appendChild(tr);
}
divv.appendChild(table);
// document.body.appendChild(btn);
});
