/*
 Sets up the canvas for the game to be played on
 */
/*var lineStart = true;
var s_button = false;
var a_button = false;
var graph = new Machine();

window.onload = function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
};

function leftClick() {
  var x = event.clientX;
  var y = event.clientY;
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  if (s_button) newState(x, y, canvas, context);
  else newArrow(x, y, canvas, context);
}

function newState(x, y, canvas, context) {
  var curr = new State(x, y, 70, "State".concat((graph.numstates).toString));
  graph.states.push(curr);
  context.beginPath();
  context.beginPath();
  context.arc(curr.x, curr.y, curr.radius, 0, 2 * Math.PI);
  context.stroke();
  context.closePath();
}

function newArrow(x, y, canvas, context) {
  if (lineStart) {
    graph.arrows.push(new Arrow(event.clientX, event.clientY));
    graph.numarrows += 1;
    lineStart = false;
  } else {
    var temp = graph.arrows[graph.numarrows - 1];
    temp.endx = event.clientX;
    temp.endy = event.clientY;
    context.beginPath();
    context.moveTo(temp.startx, temp.starty);
    context.lineTo(temp.endx, temp.endy);
    context.stroke();
    lineStart = true;
  }
}

function Machine() {
  this.states = [];
  this.numstates = 0;
  this.arrows = [];
  this.numarrows = 0;
}

function Arrow(x, y) {
  this.startx = x;
  this.starty = y;
  this.endx = 0;
  this.endy = 0;
}

function State(xcoord, ycoord, rad, name) {
  this.x = xcoord;
  this.y = ycoord;
  this.radius = rad;
  this.name = "";
  graph.states.numstates += 1;
}

function stateClick() {
  s_button = true;
  a_button = false;
}

function arrowClick() {
  a_button = true;
  s_button = false;
}
*/

var x = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    ellipse(x, height/2, 20, 20);
    x = x + 1;
}