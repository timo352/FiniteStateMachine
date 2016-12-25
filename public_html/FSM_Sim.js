
// The underlying simulation structure that actually implements the state function
// name stores the string representation of the "state"
// edges is an array of all edges leaving this state
var State_Sim = function (name) {
  this.name = name;  
  this.edges = []; 
  // edges.length = degree of the state
};

// pushes an edge onto the list of edges leaving a state
// this is called by the Edge_Sim constructor so the user (us) doesn't have to separately
function addEdge(node, edge){
    node.edges.push(edge);    
}

// renames a given state
// always returns true; we don't care if two states have the same name
function renameState(/*states, */node, name){
/*    for(var i=0; i<states.length; i++){
        if(states[i].name === name){
            return false;
        }
    }*/
    // allow the rename
    node.name = name;
    return true;
}

// returns the appropriate edge based on the input
// returns null if the input does not match the name of any edge leaving a state
function getTraverseEdge(node, input){
    for(var i=0; i<node.edges.length; i++){
        if(input === node.edges[i].name){
            return node.edges[i];
        }
    }
    return null;
}

// leverages the getTraverseEdge function to return the next state based on a
// current state and the given input
// returns null if the input does not match any leaving edges
function getNextState(node, input){
    var destEdge = getTraverseEdge(node,input);
    
    if(destEdge !== null){
        return destEdge.destination;
    } else{
        return null;
    }
}

// The underlying simulation structure that actually implements the edges (arrows)
// name stores the string representation of the output needed to traverse this edge
// source is the state from whence this edge originates
// destination is the state to whom this edge points

// adds the newly created edge to the appropriate state
var Edge_Sim = function (name, source, destination) {
  this.source = source;
  this.destination = destination;
  
  // CHANGE THIS CODE TO WORK
  // need to make sure the edge name passed in isn't already taken by a diff edge
  renameEdge(this, name);
  if(source !== null) addEdge(this.source, this);
};

// renames an edge so that new input can be used to traverse it
// returns false if that name is already taken by another edge leaving the source state
// returns true on successful name change
function renameEdge(edge, name){
    var sourceState = edge.source;
    
    if(sourceState !== null){
        for(var i=0; i<sourceState.edges.length; i++){
            if(sourceState.edges[i].name === name){
                return false;
            }
        }
        edge.name = name;
        return true;
    } else{
        edge.name = name;
        return true;
    }
}

// sets the source of the edge to be a different state
function changeSource(edge, source){
    edge.source = source;
}

// set the destination of the edge to be a different state
function changeDestination(edge, dest){
    edge.destination = dest;
}

// runs a simulation given a starting state and a list of inputs to run
// returns a list of the visited states in order (the first state listed is the starting state)
// will cut short and return part of the list if an input doesn't match anything and will
// append a 'NIL' state at the end of the list
function simulate(startState, cmds){
    
    var states = [];
    states.push(startState.name);
    
    // begin simulation
    var nextState;
    var prevState = startState;
    for(var i=0; i<cmds.length; i++){
        nextState = getNextState(prevState, cmds[i]);
        
        if(nextState === null){
            states.push("NIL");
            return states;
        } else{
            states.push(nextState.name);
            prevState = nextState;
        }
    }
    
    return states;    
}


// THIS IS ALL TEST CODE
var state0 = new State_Sim("0");
var state1 = new State_Sim("1");
var state2 = new State_Sim("2");
var state3 = new State_Sim("3");
var state4 = new State_Sim("4");

// finite state machine that matches the pattern ABCD and then stays in the 
// final state once a match is made
new Edge_Sim("A", state0, state1);
new Edge_Sim("B", state1, state2);
new Edge_Sim("C", state2, state3);
new Edge_Sim("D", state3, state4);

new Edge_Sim("B", state0, state0);
new Edge_Sim("C", state0, state0);
new Edge_Sim("D", state0, state0);

new Edge_Sim("A", state1, state0);
new Edge_Sim("C", state1, state0);
new Edge_Sim("D", state1, state0);

new Edge_Sim("A", state2, state0);
new Edge_Sim("B", state2, state0);
new Edge_Sim("D", state2, state0);

new Edge_Sim("A", state3, state0);
new Edge_Sim("B", state3, state0);
new Edge_Sim("C", state3, state0);

new Edge_Sim("A", state4, state4);
new Edge_Sim("B", state4, state4);
new Edge_Sim("C", state4, state4);
new Edge_Sim("D", state4, state4);

// test input 
var cmds = ["A", "B", "C", "D", "A", "B", "C", "D"];
var output = simulate(state0, cmds);

var outcmds = [];
outcmds.push("-");
for(var i=0; i<output.length; i++){
    outcmds.push(cmds[i]);
    document.write(outcmds[i] + " : " + output[i] + "<br>");
}