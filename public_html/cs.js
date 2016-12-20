//TODO: fix text output, figure out how to get user input
//TODO: fix the arrows, it prints 1 on arrow mode, none when states have been made
//TODO: arrow does weird stuff when you try to put in states nearby

/*
Basic structure of our state machine:

- our whole machine is the graph
- our graph is made of states and arrows
- each state has a coordinate and a radius for size
- each arrow has a set of starting coordinates and ending coordinates
    (a coordinate is just an x and y point)
- each arrow has an arrowhead that has to be drawn on at the end of it
    (this needs some fixing)
- we also have a label we can associate with either states or arrows
 */
function Graph() {
    this.states = [];
    this.arrows = [];
}

function State(coord, rad, text) {
    this.location = new Coordinate(coord.x, coord.y);
    this.radius = rad;
    this.type = "state";
    this.edges = new Array(); //push arrows in here
}

function Arrow(coord, text) {
    this.startCoord = new Coordinate(coord.x, coord.y);
    this.currentCoord = new Coordinate();
    this.type = "arrow";
    this.head = undefined;
    this.slope = undefined;
    this.complete = false;

    graph.arrows.push(this);
}

function ArrowHead(coord1, coord2, arrow) {
    //not currently working because I can't do geometry
    this.type = "arrowhead";

    var slope = arrow.slope;
    this.a = new Coordinate(arrow.currentCoord.x - 5, arrow.currentCoord.y + 5 * (2 * slope));
    this.b = arrow.currentCoord;
    this.c = new Coordinate(arrow.currentCoord.x - 5, arrow.currentCoord.y - 5 * (2 * slope));
}

function Coordinate(ex, why) {
    this.x = ex;
    this.y = why;
}

//CIRCLE_SIZE is a placeholder, the size should be customizable
//TEXT_SIZE is basically the same
//the two buffer variables are just to give some room between
//states or between the text and its label/state
const CIRCLE_SIZE = 120;
const TEXT_SIZE = 14;
const FONT_BUFFER = 5;
const STATE_BUFFER = 15;

//initialize our starting variables
var graph = new Graph();
var circles = false;
var arrows = false;
var start = false;
var moveMode = false;
var endArrow = false;
var pointerToLastArrow = undefined;

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
    //and arrows and labels
    if (start) {
        for (var i = 0; i < graph.states.length; ++i) {
            var state = graph.states[i];
            ellipse(state.location.x, state.location.y, state.radius);
        }

        for (var x = 0; x < graph.arrows.length; x++) {
            var arrow = graph.arrows[x];
            //prints where the cursor currently is
            if (!(arrow.complete)) {
                line(arrow.startCoord.x, arrow.startCoord.y,
                    mouseX, mouseY);
            } else {
                //we've clicked twice, we can print our arrow
                if (arrow.startCoord == arrow.currentCoord) {
                    //draw arrow back to itself
                } else {
                    //draw arrow somewhere else
                    line(arrow.startCoord.x, arrow.startCoord.y,
                        arrow.currentCoord.x, arrow.currentCoord.y);
                }
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

    //start means we've hit a button
    if (start) {
        //draw circles
        if (!endArrow && circles) {
            //did we click on an existing state?
            var state = whichState(new Coordinate(x, y));
            //no, create a new state
            if (state == -1) {
                temp = new State(new Coordinate(x, y), CIRCLE_SIZE);
                graph.states.push(temp);
            }
        //first click for an arrow
        } else if (!endArrow && !circles) {
            new Arrow(new Coordinate(x, y), "");
            endArrow = true;
        //second click of an arrow
        } else if (endArrow && !circles) {
            endArrow = false;
            //set up the pointer to our last arrow
            //this makes printing them a little faster but may not be worth
            //the extra complexity
            pointerToLastArrow = graph.arrows[graph.arrows.length - 1];
            pointerToLastArrow.currentCoord.x = x;
            pointerToLastArrow.currentCoord.y = y;
            pointerToLastArrow.complete = true;
            pointerToLastArrow.slope = slope(pointerToLastArrow.startCoord,
                pointerToLastArrow.currentCoord);
            pointerToLastArrow.head = new ArrowHead(pointerToLastArrow.startCoord,
                pointerToLastArrow.currentCoord, pointerToLastArrow);
        }
    } else if (moveMode) {
        //TODO
    }

}

//returns which state was clicked on
//returns a -1 if there was no state
function whichState(coord) {
    var ex = coord.x;
    var why = coord.y;
    for (var i = 0; i < graph.states.length; i++) {
        var state = graph.states[i];
        var r = state.radius;
        //distance between two points, giving a little buffer room
        //between states close together
        if (r > (Math.sqrt(Math.pow(ex - state.location.x, 2) +
                Math.pow(why - state.location.y, 2))) - STATE_BUFFER) {
            return i;
        }
    }

    return -1;
}

//possibly used for the arrowheads
function slope(coord1, coord2) {
    return ((coord1.x - coord2.x) / (coord1.y - coord2.y));
}

//on click of the state button
function drawCircles() {
    circles = true;
    arrows = false;
    //this is for if the user started an arrow, but clicked on the 
    //state button with the half-formed arrow
    //also works for now as a clear, you can clear by clicking up near the 
    //top of the screen
    if (pointerToLastArrow.currentCoord.y <= 20) graph.arrows.pop();
}

//on click of the arrow button
function drawArrows() {
    arrows = true;
    circles = false;
    start = true;
}

//take this out if you want to, I was just using this
//for some console output
var debug = true;
