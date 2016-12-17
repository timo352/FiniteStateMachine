/*
Basic structure of our state machine:

- our whole machine is the graph
- our graph is made of states and arrows
- each state has a coordinate and a radius for size
- each arrow has a set of starting coordinates and ending coordinates
    (a coordinate is just an x and y point)
-
 */
function Graph() {
    this.states = [];
    this.arrows = [];
}

function State(coord, rad) {
    this.location = new Coordinate(coord.x, coord.y);
    this.radius = rad;
}

function Arrow(coord1, coord2) {
    this.startState = undefined;
    this.endState = undefined;

    this.startCoord = new Coordinate(coord1.x, coord1.y);
    if (coord2 != undefined) this.endCoord = new Coordinate(coord2.x, coord2.y);
    else this.endCoord = new Coordinate();
    this.complete = false;
}

function Coordinate(ex, why) {
    this.x = ex;
    this.y = why;
}

//CIRCLE_SIZE is a placeholder, the size should be customizable
const CIRCLE_SIZE = 120;

//initialize our starting variables
var graph = new Graph();
var endArrow = false;
var circles = false;
var arrows = false;
var start = false;

//make a canvas, do anti-aliasing
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    smooth(8);
}

//rendering function
function draw() {
    //clear the old canvas and thicken the lines a bit
    clear();
    strokeWeight(3);

    //if we've clicked on a button, we can start printing our states
    //and arrows
    if (start) {
        for (var i = 0; i < graph.states.length; ++i) {
            var state = graph.states[i];
            ellipse(state.location.x, state.location.y, state.radius);
        }

        for (var x = 0; x < graph.arrows.length; x++) {
            var arrow = graph.arrows[i];
            if (arrow.complete) {
                line(arrow.startCoord.x, arrow.startCoord.y, arrow.endCoord.x, arrow.endCoord.y);
            }
        }
    }

}

//p5 calls this, we don't need to
//get the mouse coordinates
//if we've already clicked a button, we check the conditions of our buttons
//make new state/arrow or finish an arrow as applicable
function mousePressed() {
    var x = mouseX;
    var y = mouseY;
    var temp;

    if (start) {
        if (!endArrow && circles) {
            temp = new State(new Coordinate(x, y), CIRCLE_SIZE);
            graph.states.push(temp);
        } else if (!endArrow && !circles) {
            temp = new Arrow(new Coordinate(x, y));
            graph.arrows.push(temp);
            endArrow = true;
        } else if (endArrow && !circles) {
            temp = graph.arrows[graph.arrows.length - 1];
            temp.endCoord.x = x;
            temp.endCoord.y = y;
            temp.complete = true;
            endArrow = false;
        }
    }

}

function calculateArrowHead() {

}

function drawCircles() {
    circles = true;
    arrows = false;
    start = true;
}

function drawArrows() {
    arrows = true;
    circles = false;
    start = true;
}
