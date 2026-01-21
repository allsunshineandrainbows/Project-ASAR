/* var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

var myGamePiece;

function startEpisode1() {
  myGameArea.start();
  myGamePiece = new component(30, 30, "red", 10, 120);
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function(){
    var ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function updateGameArea() {
  myGameArea.clear();
  myGamePiece.update();
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  drawMaintenanceMessage();
}

function drawMaintenanceMessage() {
    const ctx = myGameArea.context;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Sorry but there is work being done here,", myGameArea.canvas.width / 2, myGameArea.canvas.height / 2 - 20);
    ctx.fillText("nothing to see", myGameArea.canvas.width / 2, myGameArea.canvas.height / 2 + 20);
} */