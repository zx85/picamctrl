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
  getPresets() 
  presetTimer = setInterval(getPresets,3000);
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
    for (var i=0; i < 4; i++ ) {
      thisPreset=allPresets[i].split(",");
      presetId="p".concat(thisPreset[0]).concat("label");
      presetLabel=thisPreset[1];
//      debug("presetId is: ".concat(presetId))
      document.getElementById(presetId).innerHTML=presetLabel;
    }
  });
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

// Preset functions here
// ========================


//    The particular thing to do for the presets themselves      
function doPreset(thisElement) {
  textItem=thisElement.id.concat("text");
  labelItem=thisElement.id.concat("label");
  //debug(getComputedStyle(document.getElementById(textItem)).color);
    debug("Go to preset: ".concat(thisElement.id));
    client = new HttpClient();
    client.get(urlStub.concat("camcmd?cmd=callpreset&val1=0&val2=").concat(thisElement.id.substring(1)), function(response) { });
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
