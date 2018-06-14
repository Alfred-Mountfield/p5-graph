var widthCentre, heightCentre;
var originalWidth, originalHeight;
var originalMouseX, originalMouseY;
var mouseMove, onceMoved;

var divideNumber = 5;

var backgroundColour;
var lineTextColour;
var axisColour

var scaleSlider;
var scaleFactor;
var labels;
var labelsButton;


var xCentrePixel, yCentrePixel;

var xCentreCoord, yCentreCoord;

var leftXCoord, rightXCoord;

var defaultWidthCoordinates, widthCoordinates, noOfLines, lineDistance, lineDistancePixel;

var pixelToCoordRatio, dark;

var totalLinesOffCentre;

var lineXStart, lineXEnd, lineYStart, lineYEnd;

var axisDistFromCentrePixelX, axisDistFromCentrePixelY;

function setup()
{
  xCentreCoord = 0;
  yCentreCoord = 0;
  
  defaultWidthCoordinates = 20;


  noOfLines = 10;

  backgroundColour = 1;
  axisColour = color('hsb(160, 100%, 50%)');
  lineColour = 	90;
  functionColour = 255;
  textFillColour = 255;
  scaleFactor = 1;

  labels = true;
  dark = true;
  onceMoved = false;

  createCanvas(windowWidth, windowHeight);

  //draw lines and write labels according to the
  //scale factor
  scaleSlider = createSlider(0.1, 600, 0.1, 0.1);
  labelsButton = createButton('Labels');
  labelsButton.mousePressed(labelChange);

  scaleSlider.position(10, 10);
  labelsButton.position(50, 40);
 
  originalWidth = width;
  originalHeight = height;
}

function draw()
{
  xCentrePixel = width/2;
  yCentrePixel = height/2;
  
  scaleFactor = scaleSlider.value();
  background(backgroundColour);
  stroke(lineColour);
  strokeWeight(1);

  widthCoordinates = defaultWidthCoordinates*scaleFactor;
  
  leftXCoord = xCentreCoord - widthCoordinates/2;
  rightXCoord = xCentreCoord + widthCoordinates/2;
  
  lineDistance = widthCoordinates/noOfLines;
  lineDistancePixel = width/noOfLines;
  
  // first we round the centre, so we're drawing our lines at nice intervals
  xRounded = mRound(xCentreCoord, lineDistance);
  yRounded = mRound(yCentreCoord, lineDistance);

  // distance between the rounded and the actual centre
  xDistanceCentres = xCentreCoord - xRounded;
  yDistanceCentres = yCentreCoord - yRounded;

  totalLinesOffCentre = noOfLines * 4;


  //we need to know where the lines are in pixels, which is in reference to our centre, 
  //so we need the distance of the rounded from the centre coords in pixels, and then that distance
  //from the centre pixel will be where we draw the lines
  coordToPixelRatio = width/widthCoordinates;
  roundedXDistancePixels = xDistanceCentres*coordToPixelRatio;
  roundedYDistancePixels = yDistanceCentres*coordToPixelRatio;

  //then we want to draw y-axis gridlines with reference to the centre of the view point
  for (i = (totalLinesOffCentre * (-1)); i <= totalLinesOffCentre; i++) {
      lineXStart = xCentrePixel + i*lineDistancePixel - roundedXDistancePixels;
      lineYStart = 0;
      lineXEnd = lineXStart;
      lineYEnd = height;
      line(lineXStart, lineYStart, lineXEnd, lineYEnd);
  }

  //then we want to draw x-axis gridlines with reference to the centre of the view point
  for (i = (totalLinesOffCentre * (-1)); i <= totalLinesOffCentre; i++) {
      lineXStart = 0;
      lineYStart = yCentrePixel + i * lineDistancePixel + roundedYDistancePixels;
      lineXEnd = width;
      lineYEnd = lineYStart;
      line(lineXStart, lineYEnd, lineXEnd, lineYEnd);
  }

  axisDistFromCentrePixelX = - xCentreCoord * coordToPixelRatio;
  axisDistFromCentrePixelY = - yCentreCoord * coordToPixelRatio;
  
  // draw the axis
  push();
  stroke(axisColour);
  strokeWeight(3);
  line(0, yCentrePixel  - axisDistFromCentrePixelY, width, yCentrePixel - axisDistFromCentrePixelY);
  line(xCentrePixel + axisDistFromCentrePixelX, 0, xCentrePixel + axisDistFromCentrePixelX, height);
  pop();
  
  
  //show labels if they are activated by pressing a button or "l"
  if (labels) {
    for (i = (totalLinesOffCentre * (-1)); i <= totalLinesOffCentre; i++) {
      push();
      if (!dark)
        textFillColour = 1;
      else
        textFillColour = 255;
      fill(textFillColour);
      var label;
      // numbers with one decimal place
      if(lineDistance<1) {
      label = Math.round((i*lineDistance)*10)/10;
      }
      // integers
      else {
      label = Math.round(i*lineDistance)
      }

      if (i != 0) {
      text(label, xCentrePixel + axisDistFromCentrePixelX - 25, yCentrePixel
      - i * lineDistancePixel - axisDistFromCentrePixelY);
      }
      text(label, xCentrePixel + i*lineDistancePixel +
      axisDistFromCentrePixelX - 15, yCentrePixel - axisDistFromCentrePixelY + 18);
      pop();
    }  
  }

  //redraw centre coordinates if you change the values of width and height
  //and you haven't already changed the position of the centre
  if ((width != originalWidth || height != originalHeight) 
       && onceMoved == false) {
    changeSettings();
  }

  drawGraph();
}

  function keyPressed() {
    switch (keyCode) {
      // if you press 'r', the centre coordinates become 0
      case(82):
        xCentreCoord = 0;
        yCentreCoord = 0;
        onceMoved = false;
        break;
      // if you press 'l', labels appear/disappear
      case(76):
        if (labels)
          labels = false;
        else
          labels = true;
        break;
      // if you press 'W', you increase the number of lines on the screen
      case(87):
        noOfLines ++;
        break;
      // if you press 'Q', you decrease the number of lines on the screen
      case(81):
        noOfLines --;
        break;
      // shift view upwards by lineDistance
      case(UP_ARROW):
        yCentreCoord += lineDistance;
        break;
      // shift view downwards by lineDistance
      case(DOWN_ARROW):
        yCentreCoord -= lineDistance;
        break;
      // shift view to the left by lineDistance
      case(LEFT_ARROW):
        xCentreCoord -= lineDistance;
        break;
      // shift view to the right by lineDistance
      case(RIGHT_ARROW):
        xCentreCoord += lineDistance;
        break;
      case(67):
        if (dark) {
        backgroundColour = 255;
        lineColour = 200;
        dark = false;
        }
        else {
          backgroundColour = 1;
          lineColour = 90;
          dark = true;
        }
        break;
    }
  }
  
  // update the centre and the original with and height
  function changeSettings() {
    originalWidth = width;
    originalHeight = height;
    xCentreCoord = 0;
    yCentreCoord = 0;
  }
  
  //save the coordinates of the mouse
  function mousePressed() {
    startMouseX = mouseX;
    startMouseY = mouseY;
  }
  
  //move the centre with the difference between the latest
  //position of the mouse and its start position.
  //update the start position afterwards
  function mouseDragged() {
    onceMoved = true;
    mouseMove = true;
    
    xCentreCoord -= (1/coordToPixelRatio)*(mouseX - startMouseX);
    yCentreCoord += (1/coordToPixelRatio)*(mouseY - startMouseY);

    startMouseX = mouseX;
    startMouseY = mouseY;
  }

  function mouseReleased() {
    mouseMove = false;
  }

  function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
  }

  function labelChange() {
    if (labels)
      labels = false;
    else
      labels = true;
  }

function mRound(value, factor) {
    return Math.round(value / factor) * factor;
}

  function mathsFunction(xValue) {
    return Math.sin(xValue);
  }

  function coordToPixel(coordAxis, value) {
    if(coordAxis == "x") {
      return xCentrePixel - coordToPixelRatio*(xCentreCoord - value);
    }
    else if (coordAxis == "y") {
        return yCentrePixel + coordToPixelRatio*(yCentreCoord - value);
    }
  }

  function drawGraph() {
    push();
      //console.log(leftXCoord);
    if (dark)
      functionColour = 255;
    else
      functionColour = 1;
    stroke(functionColour);
    noFill();
    coordWidth = Math.abs(rightXCoord - leftXCoord);
    beginShape();
    curveVertex(coordToPixel("x", leftXCoord), coordToPixel("y", mathsFunction(leftXCoord)));
    noOfPoints = 1000;
    for (i = 1; i < noOfPoints; i++) {
      distance = coordWidth/noOfPoints;
      xVal = leftXCoord+distance*i;
      curveVertex(coordToPixel("x", xVal), coordToPixel("y", mathsFunction(xVal)));
    }
    endShape();
    pop();
  }