//var myFirebaseRef = new Firebase("**firebase url**");

var x = 0;

var currentColor = '#000000';
var span = document.getElementById('currentColor');
var color = document.getElementById('color');
var setColor = document.getElementById('setColor').onclick = setColorText;
//var clear = document.getElementById('delete').onclick = clearCanvas;

myFirebaseRef.set({
  elements: [],
});

function setColorText() {
  currentColor = color.value; 
  while( span.firstChild ) {
      span.removeChild( span.firstChild );
  }
  span.appendChild( document.createTextNode(currentColor) );
}

var elem = document.getElementById('myCanvas'),
    elemLeft = elem.offsetLeft,
    elemTop = elem.offsetTop,
    context = elem.getContext('2d'),
    elements = [];

var initialDataLoaded = false;

function clearCanvas() {
  elements = [];
  //writeDots();
  context.clearRect(0, 0, myCanvas.width, myCanvas.height);
}

//var eleRef = myFirebaseRef.child("elements");
//eleRef.set({
//  elements: []
//});

myFirebaseRef.on('child_added', function(snapshot) {
  if (initialDataLoaded) {
    //console.log(snapshot.val());
    // do something here
  } else {
    if(snapshot.val() == undefined) {
      elements = [];
    }
    else
      elements = snapshot.val();
    renderAll();
    // we are ignoring this child since it is pre-existing data
  }
});

myFirebaseRef.on("value", function(snapshot) {
    //console.log('updated');
    //console.log(snapshot.val());
    if(initialDataLoaded) {
      if(snapshot.val() === null) {
        elements = [];
        clearCanvas()
      }
      else {
        elements = snapshot.val().elements;
        console.log(elements);
      }
      //console.log(elements);
      renderAll();
    }
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

myFirebaseRef.once('value', function(snapshot) {
  initialDataLoaded = true;
});

var dragFlag = 0;
var currentDrawing = [];
var tempElements = [];

// Add event listener for `click` events.
elem.addEventListener('mousedown', function(event) {
    dragFlag = 1;
    drawing = [];
    tempElements = [];
}, false);

elem.addEventListener('mousemove', function(event) {
    if(dragFlag === 1) {
      var x = event.pageX - elemLeft,
          y = event.pageY - elemTop;
      addDrawing(x,y);
      renderTemp();
    }
}, false);

elem.addEventListener('mouseup', function(event) {
    dragFlag = 0;
    elements[genRandomString()] = (drawing);
    writeDots();
    renderAll();
}, false);

function genRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Add element.
function addDrawing(_x, _y) {
  //console.log(elements);
  drawing.push({
      colour: currentColor,
      width: 5,
      height: 5,
      top: _y,
      left: _x
  });
  tempElements.push({
    colour: currentColor,
    width: 5,
    height: 5,
    top: _y,
    left: _x
  });
}

// Render elements.
function renderAll() {
  for (var key in elements) {
    element = elements[key].elements;
    for (var i=0; i < element.length; i++) {
      context.fillStyle = element[i].colour;
      context.fillRect(element[i].left, element[i].top, element[i].width, element[i].height);
    }
  }
}

function renderTemp() {
  tempElements.forEach(function(drawing) {
    context.fillStyle = drawing.colour;
    context.fillRect(drawing.left, drawing.top, drawing.width, drawing.height);
  });
}

function writeDots() {
  var eleRef = myFirebaseRef.child("elements");
  eleRef.push().set({
    elements: drawing,
  });
}

