//var thisRed=111;
//var thisGreen=0;
//var thisBlue=255;

const maxHoldValue=60;
const maxMoveTime=2500;
const maxZoomTime=2000;
const maxSpeed=75;
const snapPercent=10;

var urlStub='http://192.168.75.96:5000/';
var holdTimer;
var holdValue=0;
//var selectedItem="navtimer";
navHeight=0;
navWidth=0;
touchX=0;
touchY=0;

// This gets everything going on body load
function doStuff() {

  var clickPresets = document.querySelectorAll('.griditem');
  for ( var i=0; i < clickPresets.length; i++ ) {
    var clickPreset = clickPresets[i];
    new Clicker ( clickPreset );
  }
    new Clicker (document.getElementById("navctl"));
    new Clicker (document.getElementById("zoomctl"))
  getPresets() 
  presetTimer = setInterval(getPresets,5000);
}

// Writes something to the console
function debug(message) {
  console.log(message);
}


// DB business
function getPresets() {
  var presetLabels = document.querySelectorAll('.plabel');
    client = new HttpClient();
    thisOutput=client.get(urlStub.concat('getpresets'), function(response) {
//   debug(response);
    allPresets=response.split("|");
    for (var i=0; i < allPresets.length-1; i++ ) {
      thisPreset=allPresets[i].split(",");
      presetId="p".concat(thisPreset[0]).concat("label");
      presetLabel=thisPreset[1];
//      debug("presetId is: ".concat(presetId))
      document.getElementById(presetId).innerHTML=presetLabel;
    }
  });
}
 
// Colour business section then
// ============================

// Decimal to hex with the groovy 0 on the front
function RGBtoHex(thisDecimal) {
  thisHex=parseInt(thisDecimal).toString(16);
return thisHex.length == 1 ? "0" + thisHex : thisHex;
}

// Hex to decimal
function toDecimal(thisHex) {
return String(parseInt(thisHex, 16));
}

// RGB code to hex code
function colourToHex(inHex) {
  var thisRed=inHex.split("(")[1].split(",")[0];
  var thisGreen=inHex.split("(")[1].split(",")[1];
  var thisBlue=inHex.split("(")[1].split(",")[2].split(")")[0];
  return "#".concat(RGBtoHex(thisRed))	.concat(RGBtoHex(thisGreen)).concat(RGBtoHex(thisBlue));
}

// A function to change the background colour of a thing. Woo
function changeBg(thisElement,thisValue) {
  document.getElementById(thisElement).style.backgroundColor=thisValue; 
}

// Functional function to change hsl to Rgb
function hslToRgb(h, s, l){
  var r, g, b;

  if(s == 0){
      r = g = b = l; // achromatic
  }else{
      var hue2rgb = function hue2rgb(p, q, t){
          if(t < 0) t += 1;
          if(t > 1) t -= 1;
          if(t < 1/6) return p + (q - p) * 6 * t;
          if(t < 1/2) return q;
          if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Functional function to change a number to a colour (input between 0 and 1)
function numberToColorHsl(i) {
  // as the function expects a value between 0 and 1, and red = 0° and green = 120°
  // we convert the input to the appropriate hue value
  var hue = 1-i;
  var light = i;
  // we convert hsl to rgb (saturation 100%, lightness 50%)
  var rgb = hslToRgb(hue, light, .5);
  // we format to css value and return
  return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'; 
}


// ==============================
// End of Colour Business Section

// Functions for doing cursor finding business. Not great
// This is called by GetCoordinates
function FindPosition(oElement)
{
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
      return [ posX, posY ];
    }
    else
    {
      return [ oElement.x, oElement.y ];
    }
}

// Get the coordinates of an element. Works OK with mouse. Less so with touch
function GetCoordinates(thisElement)
{
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  debug ("In GetCoordinates with: ".concat(thisElement.id));
  ImgPos = FindPosition(thisElement);
  elemHeight=thisElement.clientHeight;
  elemWidth=thisElement.clientWidth;  
  //debug ("elemHeight: ".concat(elemHeight));
  //debug ("elemWidth: ".concat(elemWidth));
  //if (!e) var e = window.event;
  var e = window.event;
  //if (e.pageX || e.pageY)
  //{
  //  PosX = e.pageX;
  //  PosY = e.pageY;
  //}
  //else if (e.clientX || e.clientY)
  //  {
  //    PosX = e.clientX + document.body.scrollLeft
  //      + document.documentElement.scrollLeft;
  //    PosY = e.clientY + document.body.scrollTop
  //      + document.documentElement.scrollTop;
  //  }
  //PosX = PosX - ImgPos[0];
  //PosY = PosY - ImgPos[1];
  PosX=e.offsetX;
  PosY=e.offsetY;

  //debug("PosX is".concat(String(PosX)));
  //debug("PosY is".concat(String(PosY)));  
  return [PosX,PosY,elemHeight,elemWidth];
}

function getTouchCoords(thisElement) {
debug("touchCoords: "+thisElement.id);
elemHeight=thisElement.clientHeight;
elemWidth=thisElement.clientWidth;  
return [elemHeight,elemWidth];
}

// Clicker definitions
function Clicker( element ) {
  this.element = element;

  // bind self for event handlers
  this.mousedownHandler = this.onmousedown.bind( this );
  this.mouseupHandler = this.onmouseup.bind( this );
  this.touchstartHandler = this.ontouchstart.bind ( this );
  this.touchendHandler = this.ontouchend.bind ( this );
  
  this.element.addEventListener( 'mousedown', this.mousedownHandler );
  this.element.addEventListener( 'touchstart', this.touchstartHandler );
}

// Timer functions here

// Timer function for holding down the navigation with a mousepress or touch. Both the same behaviour
function holdTime() {
  holdValue++;
  changeBg("navbg",numberToColorHsl(holdValue/maxHoldValue));
  //document.getElementById(selectedItem).innerText=String(holdValue);
  if (holdValue>=maxHoldValue) {
    clearInterval(holdTimer) 
  }
}

// Shim for selecting texting
function selectText(node) {
  if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(node);
      range.select();
  } else if (window.getSelection) {
    console.log("Well the selectText getSelection");
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
  } else {
      console.warn("Could not select text in node: Unsupported browser.");
  }
}

// Preset functions here
// ========================

//    The particular thing to do for the SET button
function doSetPreset (thisElement) {
//  Set the text to a standard name
//  What's the set button's current style
    thisElem=document.querySelector('.ptext');
    thisStyle = getComputedStyle(thisElem)
    //var thisColour=window.getComputedStyle(thisElem).style.color;
    thisColour=colourToHex(thisStyle.color);
    // Change the preset buttons to yellow
    if (thisColour=="#cccccc") {
      thisColour="#ffff00";
      // make the preset text editable
      thisLabel=document.getElementById("presetlabel");
      thisLabel.innerHTML= "Preset Name";
      thisLabel.style.border="2px solid #777";
      thisLabel.contentEditable = "true";
      selectText(thisLabel);
    }
    else{ 
      thisColour="#cccccc";
      // make the preset text not ediable any more
      thisLabel=document.getElementById("presetlabel")
      thisLabel.innerHTML= "";
      thisLabel.style.border="0px";
      thisLabel.contentEditable = "false";
    }
    var griditems = document.querySelectorAll('.ptext');
    for (var i = 0; i < griditems.length; i++) {
      //debug(i);
      //debug("changing preset colour to: ".concat(thisColour));
      griditems[i].style.color = thisColour;
    } 
}

//    The particular thing to do for the presets themselves      
function doPreset(thisElement) {
  textItem=thisElement.id.concat("text");
  labelItem=thisElement.id.concat("label");
  //debug(getComputedStyle(document.getElementById(textItem)).color);
  if (colourToHex(getComputedStyle(document.getElementById(textItem)).color)!="#cccccc") {
    debug("Set preset: ".concat(thisElement.id));
    thisColour="#cccccc";
    var griditems = document.querySelectorAll('.ptext');
    for (var i = 0; i < griditems.length; i++) {
    //debug(i);
    //debug("changing preset colour to: ".concat(thisColour));
    griditems[i].style.color = thisColour;
  }
  presetLabel=document.getElementById("presetlabel").innerHTML;
  document.getElementById(labelItem).innerHTML=presetLabel;
  client = new HttpClient();
  client.get(urlStub.concat("set/").concat(thisElement.id.substring(1)).concat("/").concat(presetLabel), function(response) { });
  document.getElementById("presetlabel").innerHTML=""; 
  thisLabel.style.border="0px";
  thisLabel.contentEditable = "false"; 
  }
  else {
    debug("Go to preset: ".concat(thisElement.id));
    client = new HttpClient();
    client.get(urlStub.concat("call/").concat(thisElement.id.substring(1)), function(response) { });
  }
}

// Navigator functions here
// ========================

// The mouse has been pressed - waiting until it gets released
function doNavWait(thisElement) {
  //selectedItem=thisElement.id.slice(0, -3).concat("timer");
  holdValue=0;
  clearInterval(holdTimer);
  holdTimer = setInterval(holdTime,50);
// bit of a shim because when you don't unclick it goes away I think
  ImgPos=GetCoordinates(thisElement);
  navHeight=ImgPos[2];
  navWidth=ImgPos[3];
}



// The mouse has been released - do the navigation
function doNavCtlm(thisElement) {
  debug("Doing Mouse nav business with: ".concat(thisElement.id));
  ImgPos=GetCoordinates(thisElement);
  debug("MouseX vs navWidth: ".concat(String(ImgPos[0])).concat(" : ").concat(String(navWidth)));
  debug("MouseY vs navHeight: ".concat(String(ImgPos[1])).concat(" : ").concat(String(navHeight)));
  
  lrLevel=Math.floor(2*maxSpeed*(ImgPos[0]-0.5*navWidth)/navWidth);
  udLevel=Math.floor(2*maxSpeed*(0.5*navHeight-ImgPos[1])/navHeight);
  debug("udLevel is: ".concat(String(udLevel)));
  debug("lrLevel is: ".concat(String(lrLevel)));
  if (udLevel<0) {
    firstCommand="d"
  }
  else {
    firstCommand="u"
  }
  if (lrLevel<0) {
    secondCommand="l"
  }
    else {
    secondCommand="r"
  }
  command=firstCommand.concat(secondCommand)
  udValue=Math.abs(udLevel)
  lrValue=Math.abs(lrLevel)
// snap for horizontal / vertical movement
  if (udValue<(snapPercent/100*maxSpeed)) {
    debug ("snapping to no UD");
    udValue=0
  }
  if (lrValue<(snapPercent/100*maxSpeed)) {
    debug ("snapping to no LR");
    lrValue=0
  }
  duration=Math.floor(holdValue/maxHoldValue*maxMoveTime)
  client = new HttpClient();
  client.get(urlStub.concat("camcmd/").concat(command).concat("/").concat(String(lrValue)).concat("/").concat(String(udValue)).concat("/").concat(duration), function(response) { });
}

// The touch has been released - do the navigation
function doNavCtlt(thisElement) {
  debug("Doing Touch nav business with: ".concat(thisElement.id));
  ImgPos=getTouchCoords(thisElement) ;
  navHeight=ImgPos[0];
  navWidth=ImgPos[1];
  debug("touchX vs navWidth: ".concat(touchX).concat(" : ").concat(navHeight));
  debug("touchY vs navHeight: ".concat(touchY).concat(" : ").concat(navHeight));
  
  lrLevel=Math.floor(2*maxSpeed*(touchX-0.5*navWidth)/navWidth);
  udLevel=Math.floor(2*maxSpeed*(0.5*navHeight-touchY)/navHeight);
  debug("udLevel is: ".concat(String(udLevel)));
  debug("lrLevel is: ".concat(String(lrLevel)));
  if (udLevel<0) {
    firstCommand="d"
  }
  else {
    firstCommand="u"
  }
  if (lrLevel<0) {
    secondCommand="l"
  }
    else {
    secondCommand="r"
  }
  command=firstCommand.concat(secondCommand)
  udValue=Math.abs(udLevel)
  lrValue=Math.abs(lrLevel)
// snap for horizontal / vertical movement
  if (udValue<(snapPercent/100*maxSpeed)) {
    debug ("snapping to no UD");
    udValue=0
  }
  if (lrValue<(snapPercent/100*maxSpeed)) {
    debug ("snapping to no LR");
    lrValue=0
  }
  duration=Math.floor(holdValue/maxHoldValue*maxMoveTime)
  client = new HttpClient();
  client.get(urlStub.concat("camcmd/").concat(command).concat("/").concat(String(lrValue)).concat("/").concat(String(udValue)).concat("/").concat(duration), function(response) { });
}


function doZoomCtlm(thisElement) {
  debug("Doing Zoom mouse business with: ".concat(thisElement.id));
  ImgPos=GetCoordinates(thisElement);
//    debug("MouseX vs elemWidth: ".concat(String(ImgPos[0])).concat(" : ").concat(String(ImgPos[3])));
    debug("MouseY vs elemHeight: ".concat(String(ImgPos[1])).concat(" : ").concat(String(ImgPos[2])));
  zoomLevel=Math.floor(maxZoomTime*(0.5*ImgPos[2]-ImgPos[1])/ImgPos[2]);
  debug("Computed is ".concat(zoomLevel));
  if (zoomLevel<0) {
    command="zoomout";
  }
  else {
    command="zoomin";
  }
  client = new HttpClient();
  client.get(urlStub.concat("camcmd/").concat(command).concat("/0/0/").concat(Math.abs(zoomLevel)), function(response) { });
}

function doZoomCtlt(thisElement) {
  debug("Doing Zoom touch business with: ".concat(thisElement.id));
  ImgPos=getTouchCoords(thisElement) ;
  zoomHeight=ImgPos[0];
  zoomWidth=ImgPos[1];
    debug("touchY vs zoomHeight: ".concat(touchY).concat(" : ").concat(zoomHeight));
  zoomLevel=Math.floor(maxZoomTime*(0.5*zoomHeight-touchY)/zoomHeight);
  debug("Computed is ".concat(zoomLevel));
  if (zoomLevel<0) {
    command="zoomout";
  }
  else {
    command="zoomin";
  }
  client = new HttpClient();
  client.get(urlStub.concat("camcmd/").concat(command).concat("/0/0/").concat(Math.abs(zoomLevel)), function(response) { });
}


function doAction(thisElement,thisFormat) {
//    Different functions for different clicks really
if (thisElement.id.includes("p")) {
    whichFunction="preset" ;
  } 
else
  {
    whichFunction=thisElement.id.concat(thisFormat); 
  }
  switch(whichFunction)
    {
    case "preset":
      doPreset(thisElement);
    break;
    case "setbuttonm":
    case "setbuttont":
      doSetPreset(thisElement);
      break;
    case "navctlm":
    case "navctlt":
      doNavWait(thisElement);
      break;
    case "zoomctlm":
      doZoomCtlm(thisElement);
      break;
    case "zoomctlt":
      doZoomCtlt(thisElement);
      break;
    default:
      break;
    }
}


Clicker.prototype.onmousedown = function( event ) {
//     debug("mousedown ".concat(document.defaultView.getComputedStyle(this.element,null).getPropertyValue('color')));
      debug("mousedown id ".concat(this.element.id));
     doAction(this.element,"m")
     window.addEventListener( 'mouseup', this.mouseupHandler );
//   }   
};

Clicker.prototype.ontouchstart = function( event ) {
 //     debug("touchstart ".concat(document.defaultView.getComputedStyle(this.element,null).getPropertyValue('background-color')));
//   console.log("borderthingy ".concat(document.defaultView.getComputedStyle(document.getElementById("colourOutline"),null).getPropertyValue('border-top-color')));

  // Cache the client X/Y coordinates
  touchX = event.touches[0].clientX;
  touchY = event.touches[0].clientY;

bcr = event.target.getBoundingClientRect();
touchX = Math.floor(event.targetTouches[0].clientX - bcr.x);
touchY = Math.floor(event.targetTouches[0].clientY - bcr.y);
debug("clientX: ".concat(String(touchX)));
debug("clientY: ".concat(String(touchY)));

  debug("touchstart id ".concat(this.element.id));
     doAction(this.element,"t")
//     debug("touchstart ".concat(document.defaultView.getComputedStyle(this.element,null).getPropertyValue('background-color')));
     window.addEventListener( 'touchend', this.touchendHandler );
};


Clicker.prototype.onmouseup = function() {
//  screenTimerActive();
//debug("mouseup ".concat(document.defaultView.getComputedStyle(this.element,null).getPropertyValue('background-color')));
      debug("mouseup id ".concat(this.element.id));  
      if (this.element.id=="navctl") {
        changeBg("navbg","#333");
        doNavCtlm(this.element)
      }
      clearInterval(holdTimer);

      window.removeEventListener( 'mouseup', this.mouseupHandler );
//  window.removeEventListener( 'mousemove', this.mousemoveHandler );
};

Clicker.prototype.ontouchend = function() {
  event.preventDefault();
  debug("touchend id ".concat(this.element.id));  
  if (this.element.id=="navctl") {
    changeBg("navbg","#333");
    doNavCtlt(this.element)
  }
//debug("touchend ".concat(document.defaultView.getComputedStyle(this.element,null).getPropertyValue('background-color')));
    clearInterval(holdTimer);
    window.removeEventListener( 'touchend', this.touchendHandler );
//  window.removeEventListener( 'touchmove', this.touchmoveHandler );
};


var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}
