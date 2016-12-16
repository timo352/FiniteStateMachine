function Graph() {
    this.states = [];
    this.arrows = [];
}

function State(ex, why, rad) {
    this.x = ex;
    this.y = why;
    this.radius = rad;
}

function Arrow(state1, state2, x1, x2, y1, y2) {
    this.startState = state1;
    this.endState = state2;

    this.startx = x1;
    this.endx = x2;
    this.starty = y1;
    this.endy = y2;
}

const CIRCLE_SIZE = 120;
var graph = new Graph();
var start;
var endArrow = false;
var circles = false;
var arrows = false;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    smooth(8);
}

function draw() {
    clear();
    strokeWeight(3);

    for (var i = 0; i < graph.states.length; ++i) {
        var state = graph.states[i];
        //console.log(state.x + " " + state.y + " " + state.radius);
        ellipse(state.x, state.y, state.radius);
    }


    for (arrow in graph.arrows) {
        line(startx, starty, endx, endy);
    }
}

function mousePressed() {
    var x = mouseX;
    var y = mouseY;

    if (! endArrow) {

        var temp = new State(x, y, CIRCLE_SIZE);
        console.log("hey "+ temp.x + " " + temp.y);
        //graph.states.push({x: mouseX, y: mouseY, radius: CIRCLE_SIZE});
        //graph.states.push(new State(x, y, CIRCLE_SIZE));
        graph.states.push(temp);
    }
}

function calculateArrowHead() {

}

function drawArrow() {
    //if we've already clicked, we draw using our start point
    //if not, we save the mouse coordinates
    if (endArrow) {
        draw();
        endArrow = false;
    } else {
        endArrow = true;
        start = new ArrowStart(undefined, undefined, mouseX,
            undefined, mouseY);
    }
}

function drawCircles() {
    circles = true;
    arrows = false;
}

function drawArrows() {
    arrows = true;
    circles = false;
}
