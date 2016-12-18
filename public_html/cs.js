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
    this.labels = [];
}

function State(coord, rad, text) {
    this.location = new Coordinate(coord.x, coord.y);
    this.radius = rad;
    this.name = (text == undefined ? new Label("", this) : new Label(text, this));
}

function Arrow(coord1, coord2, text ) {
    this.startState = undefined;
    this.endState = undefined;

    this.head = undefined;

    this.startCoord = new Coordinate(coord1.x, coord1.y);
    if (coord2 != undefined) this.endCoord = new Coordinate(coord2.x, coord2.y);
    else this.endCoord = new Coordinate();

    this.label = (text == undefined ? new Label("", this) : new Label(text, this));

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

function Label(text, obj, type, location) {
    this.fontSize = TEXT_SIZE;
    this.text = text;
    this.associate = obj;
    this.isState = (type == 'State');
    this.location = location;
}

//CIRCLE_SIZE is a placeholder, the size should be customizable
//TEXT_SIZE is basically the same
//the two buffer variables are just to give some room between
//states or between the text and its label/state
const CIRCLE_SIZE = 120;
const TEXT_SIZE = 14;
const FONT_BUFFER = 5;
const STATE_BUFFER = 15;
const TRIANGLE_BASE_LENGTH = 3; //(5 * (Math.sin(Math.PI / 6))) / (Math.sin(Math.PI / 3))
                                //but rounded up because pixels
const TRIANGLE_BASE_X_CHANGE = 2;   //(3 * (Math.sin(Math.PI / 6))) / (Math.sin(Math.PI / 3))
                                    //but rounded up because pixels
const TRIANGLE_CENTRAL_LENGTH = 5; //5 units longer than the line segment

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
            var arrow = graph.arrows[i];
            if (arrow.complete) {
                line(arrow.startCoord.x, arrow.startCoord.y, arrow.endCoord.x, arrow.endCoord.y);
                var ah = arrow.head;
                triangle(ah.a.x, ah.a.y, ah.c.x, ah.c.y, ah.b.x, ah.b.y);
            }
        }

        for (var y = 0; y < graph.labels.length; y++) {
            var label = graph.labels[y];
            text(label.text, label.location.x, label.location.y);
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
            var state = whichState(new Coordinate(mouseX, mouseY));
            //no, create a new state
            if (state == -1) {
                temp = new State(new Coordinate(x, y), CIRCLE_SIZE);
                graph.states.push(temp);
            } else {
                //yes, rename the state
                name(graph.states[state], 'State');
            }
        //first click for an arrow
        } else if (!endArrow && !circles) {
            temp = new Arrow(new Coordinate(x, y));
            graph.arrows.push(temp);
            endArrow = true;
        //second click of an arrow
        } else if (endArrow && !circles) {
            //set the ending coordinates for the arrow
            temp = graph.arrows[graph.arrows.length - 1];
            temp.endCoord.x = x;
            temp.endCoord.y = y;
            //our arrow is done and printable
            temp.complete = true;
            temp.head = new ArrowHead(temp.startCoord, temp.endCoord);
            //ready to start a new arrow
            endArrow = false;
        }
    } else if (moveMode) {
        //TODO
    }

}

//returns which state was clicked on
//returns a -1 if there was no state
function whichState(coord) {
    ex = coord.x;
    why = coord.y;
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

//Sets up our label
function name(obj, type) {
    //puts the text above the state but with a little bit of room
    var temp;
    if (type == 'State') {
        //label with default text, a lebel for a state, and a defined location
        //based on its associate object
        temp = new Label("WORD", obj, 'State', new Coordinate(obj.location.x + obj.radius +
                        obj.name.fontSize / 2 + FONT_BUFFER, obj.location.y));
        obj.name = "WORD";
    } else if (type == 'Arrow') {
        //same condition but for an arrow
        obj = graph.arrows[index];
        obj.name = "WORD";
    } else {
        //I don't know how this would happen
        alert("Somehow we passed this a bad name.");
        return;
    }

    //push the new label
    graph.labels.push(temp);
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

//take this out if you want to, I was just using this
//for some console output
var debug = true;