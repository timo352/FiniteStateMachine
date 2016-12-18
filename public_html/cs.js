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

function State(coord, rad, text) {
    this.location = new Coordinate(coord.x, coord.y);
    this.radius = rad;
    this.name = (text == undefined ? new Label("") : new Label(text));
}

function Arrow(coord1, coord2) {
    this.startState = undefined;
    this.endState = undefined;

    this.head = undefined;

    this.startCoord = new Coordinate(coord1.x, coord1.y);
    if (coord2 != undefined) this.endCoord = new Coordinate(coord2.x, coord2.y);
    else this.endCoord = new Coordinate();

    this.complete = false;
}

function ArrowHead(coord1, coord2) {
/*
    INSTEAD OF DOING SINES AND JUNK:

    start with the endpoint of the arrow (x + 5)
    go backwards, match the point of x + 5 to the y +/y - 3
    connect the a and b together since you know their coordinates

     */

    //delta y over delta x to calculate slope
    var slope = (coord1.y - coord2.y) / (coord1.x  - coord2.x);

    this.a = new Coordinate(coord2.x - TRIANGLE_BASE_X_CHANGE, coord2.y + TRIANGLE_BASE_LENGTH);
    this.b = new Coordinate(coord2.x + TRIANGLE_BASE_X_CHANGE, coord2.y - TRIANGLE_BASE_LENGTH);
    //set the head of the triangles 5 pixels further, accounting for slope
    //
    this.c = new Coordinate(coord2.x + TRIANGLE_CENTRAL_LENGTH, Math.round(coord2.y + (5 * slope)));
}

function Coordinate(ex, why) {
    this.x = ex;
    this.y = why;
}

function Label(text) {
    this.fontSize = TEXT_SIZE;
    this.text = text;
}

//CIRCLE_SIZE is a placeholder, the size should be customizable
//TBL is how far one point of the triangle base is from coord2
const CIRCLE_SIZE = 120;
const TEXT_SIZE = 14;
const TRIANGLE_BASE_LENGTH = 3; //(5 * (Math.sin(Math.PI / 6))) / (Math.sin(Math.PI / 3))
                                //but rounded up because pixels
const TRIANGLE_BASE_X_CHANGE = 2;   //(3 * (Math.sin(Math.PI / 6))) / (Math.sin(Math.PI / 3))
                                    //but rounded up because pixels
const TRIANGLE_CENTRAL_LENGTH = 5;

//initialize our starting variables
var graph = new Graph();
var endArrow = false;
var circles = false;
var arrows = false;
var start = false;
var moveMode = false;

//make a canvas, do anti-aliasing
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    var mouseIsPressed = false;
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
                var ah = arrow.head;
                triangle(ah.a.x, ah.a.y, ah.c.x, ah.c.y, ah.b.x, ah.b.y);
            }
        }
    }
}

if (mouse) {
    if (mouseButton == LEFT) {
        leftClick();
    } else if (mouseButton == RIGHT) {
        rightClick();
    }
}

//p5 calls this, we don't need to
//get the mouse coordinates
//if we've already clicked a button, we check the conditions of our buttons
//make new state/arrow or finish an arrow as applicable
function leftClick() {
    var x = mouseX;
    var y = mouseY;
    var temp;

    if (start) {
        if (!endArrow && circles) {
            var state = whichState(new Coordinate(mouseX, mouseY));
            if (state == -1) {
                temp = new State(new Coordinate(x, y), CIRCLE_SIZE);
                graph.states.push(temp);
            } else {
                name(graph.states[state]);
            }

        } else if (!endArrow && !circles) {
            temp = new Arrow(new Coordinate(x, y));
            graph.arrows.push(temp);
            endArrow = true;
        } else if (endArrow && !circles) {
            temp = graph.arrows[graph.arrows.length - 1];
            temp.endCoord.x = x;
            temp.endCoord.y = y;
            temp.complete = true;
            temp.head = new ArrowHead(temp.startCoord, temp.endCoord);
            endArrow = false;
        }
    } else if (moveMode) {

    }

}

function rightClick() {

}

function whichState(coord) {
    ex = coord.x;
    why = coord.y;
    for (var i = 0; i < graph.states.length; i++) {
        var state = graph.states[i];
        var r = state.radius;
        //distance between two points
        if (r > (Math.sqrt(Math.pow(ex - state.location.x, 2) +
                Math.pow(why - state.location.y, 2)))) {
            return i;
        }
    }

    return -1;
}

function slope(coord1, coord2) {
    return (coord1.y - coord2.y) / (coord2.x  - coord1.x);
}

function name(coord) {
    var location = this.location;

}

//on click of the state button
function drawCircles() {
    circles = true;
    arrows = false;
    start = true;
}

//on click of the arrow button
function drawArrows() {
    arrows = true;
    circles = false;
    start = true;
}

var debug = true;