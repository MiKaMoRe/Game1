var cvs = document.getElementById('canvas');
var ctx = cvs.getContext('2d');

var man = new Image();
var tilesetImage = new Image();



var rowTileCount = 7;
var colTileCount = 10;
var tileSize = 32;
var imageNumTiles = 32;

var changes = '';
var heartMedication = 40;
var enemyDamage = 15; 
var HP = 100;
var attack = 10;
var xPos = 32;
var yPos = 32;
var position= [];
var width = 320;
var height = 224;
var step = 32;
var manWidth = 32;
var manHeigth = 32;
var walking = 0;


/*Представленная в виде матриц многослойная карта*/

var ground = [
	[17,17,17,17,17,17,17,17,17,17],
	[17,128,128,128,128,128,128,128,128,17],
	[17,128,128,128,128,128,128,128,128,17],
	[17,128,128,128,128,128,128,128,128,17],
	[17,128,128,128,128,128,128,128,128,17],
	[17,128,128,128,128,128,128,128,128,17],
	[17,17,17,17,17,17,17,17,17,17],
];
var toolsAndEnemys =[
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,422,0,0,422,0,422,423,0],
	[0,0,0,422,0,0,422,0,0,0],
	[0,422,422,422,422,0,422,0,0,0],
	[0,0,0,422,423,422,422,0,0,0],
	[0,0,0,0,0,0,0,423,0,0],
	[0,0,0,0,0,0,0,0,0,0],
]
var mist = [
	[749,749,749,749,749,749,749,749,749,749],
	[749,749,749,8,8,8,8,8,8,749],
	[749,749,8,8,8,8,8,8,8,749],
	[749,8,8,8,8,8,8,8,8,749],
	[749,8,8,8,8,8,8,8,8,749],
	[749,8,8,8,8,8,8,8,8,749],
	[749,749,749,749,749,749,749,749,749,749],
];





tilesetImage.src = 'tileset/pack.png';
man.src= 'img/manRight.png';

function draw(){
	ctx.clearRect(0,0,width,height);

	/*Просчет тайлов для карты*/
	for (var r = 0; r < rowTileCount; r++) { 
		for (var c = 0; c < colTileCount; c++) { 
			var tile = ground[r][c]; 
			var tileRow = (tile / imageNumTiles) | 0;
			var tileCol = (tile % imageNumTiles) | 0; 
			ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, (c * tileSize), (r * tileSize), tileSize, tileSize); 
		}
	}
	for (var r = 0; r < rowTileCount; r++) { 
		for (var c = 0; c < colTileCount; c++) { 
			var tile = toolsAndEnemys[r][c]; 
			var tileRow = (tile / imageNumTiles) | 0;
			var tileCol = (tile % imageNumTiles) | 0; 
			ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, (c * tileSize), (r * tileSize), tileSize, tileSize); 
		}
	}
	ctx.drawImage(man, xPos, yPos);
	for (var r = 0; r < rowTileCount; r++) { 
		for (var c = 0; c < colTileCount; c++) { 
			var tile = mist[r][c]; 
			var tileRow = (tile / imageNumTiles) | 0;
			var tileCol = (tile % imageNumTiles) | 0; 
			ctx.drawImage(tilesetImage, (tileCol * tileSize), (tileRow * tileSize), tileSize, tileSize, (c * tileSize), (r * tileSize), tileSize, tileSize); 
		}
	}

	position = [yPos/32,xPos/32 ];

	mist[position[0]-1][position[1]] = 749;
	mist[position[0]+1][position[1]] = 749;
	mist[position[0]][position[1]-1] = 749;
	mist[position[0]][position[1]+1] = 749;

	if(toolsAndEnemys[position[0]][position[1]]!=0){
		calculate();
		toolsAndEnemys[position[0]][position[1]] = 0;
	}
	

	body= {
		top: yPos,
		right: manWidth+xPos,
		bottom: manHeigth+yPos,
		left: xPos
	}

	if(HP <=0){
		return lose();
	} else if(win()){
		return alert('Ты победил');
	}
	
	//for (var x = 32.2; x < 768; x += 32) {
	//  ctx.moveTo(x,32);
	//  ctx.lineTo(x, 576);
	//}
	//for (var y = 32.2; y < 576; y += 32) {
	//  ctx.moveTo(32, y);
	//  ctx.lineTo(768, y);
	//}
	//ctx.strokeStyle = "#000000";
	//ctx.stroke();

	document.getElementById('health').innerHTML = HP;
	document.getElementById('changes').innerHTML = changes;
	requestAnimationFrame(draw);
}

tilesetImage.onload = draw;


/* Просчет лечения и урона врагов */

function calculate(){
	if(toolsAndEnemys[position[0]][position[1]] == 422){
		changes = '';
		HP -= enemyDamage;
		changes += ' -' + enemyDamage;
	} else if(toolsAndEnemys[position[0]][position[1]] == 423){
		changes = '';
		HP += heartMedication;
		changes += ' +' + heartMedication;
	}
}

/* Управление */

function moveRight(){
	if(body.right<288){
		xPos += step;
	}
	man.src='img/manRight.png';
}

function moveLeft(){
	if(body.left>32){
		xPos -= step;
	}
	man.src='img/manLeft.png';
}
function moveUp(){
	if(body.top>32) {
		yPos -= step;
	}
}

function moveDown(){
	if(body.bottom<192){
		yPos += step;
	}
}


addEventListener("keydown", moveRect);
function moveRect(e){
	switch(e.keyCode){
		case 37:
			moveLeft();
			break;
		case 65:
			moveLeft();
			break;
		case 38:
			moveUp();
			break;
		case 87:
			moveUp();
			break;
		case 39:
			moveRight();
			break;
		case 68:
			moveRight();
			break;
		case 40:
			moveDown();
			break;
		case 83:
			moveDown();
			break;
	}
}

/*Проигрыш*/

function lose(){
	alert('Вы проигали!');
}

/*Победа*/

function win(){
	var win = 0;
	for (var i = 0; i < rowTileCount; i++){
		for (var d = 0; d< colTileCount; d++){
			if (toolsAndEnemys[i][d] == 422){
				win += 1;
			}
		}
	}
	if(win == 0){
		return true;
	} else{
		return false;
	}
}

/*Переиграть*/
function replay(){
	HP = 100;
	xPos = 32;
	yPos = 32;
	position= [];
	changes = '';
	ground = [
		[17,17,17,17,17,17,17,17,17,17],
		[17,128,128,128,128,128,128,128,128,17],
		[17,128,128,128,128,128,128,128,128,17],
		[17,128,128,128,128,128,128,128,128,17],
		[17,128,128,128,128,128,128,128,128,17],
		[17,128,128,128,128,128,128,128,128,17],
		[17,17,17,17,17,17,17,17,17,17],
	];
	toolsAndEnemys =[
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,422,0,0,422,0,422,423,0],
		[0,0,0,422,0,0,422,0,0,0],
		[0,422,422,422,422,0,422,0,0,0],
		[0,0,0,422,423,422,422,0,0,0],
		[0,0,0,0,0,0,0,423,0,0],
		[0,0,0,0,0,0,0,0,0,0],
	]
	mist = [
		[749,749,749,749,749,749,749,749,749,749],
		[749,749,749,8,8,8,8,8,8,749],
		[749,749,8,8,8,8,8,8,8,749],
		[749,8,8,8,8,8,8,8,8,749],
		[749,8,8,8,8,8,8,8,8,749],
		[749,8,8,8,8,8,8,8,8,749],
		[749,749,749,749,749,749,749,749,749,749],
	];
	draw();
}