const duration=200
const snapPercent=10;

var urlStub='/';

// This gets everything going on body load
function doStuff() {

  var clickButtons = document.querySelectorAll('.griditem');
  for ( var i=0; i < clickButtons.length; i++ ) {
    var clickButton = clickButtons[i];
    new Clicker ( clickButton );
  }  
}

// Writes something to the console
function debug(message) {
  console.log(message);
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

function doAction(thisElement) {
// TODO: easy bit for the actions. Really easy. Honest.
    whichFunction=thisElement.id; 
    val1="0";
    val2="0";
    switch(whichFunction)
        {
        case "callpreset":
        case "setpreset":
            val2=document.getElementById("presettext").innerText;
            break;
        case "up":
        case "down":
        case "left":
        case "right":      
            val1="30";
            val2="30";
        break;
        default:
        break;
    }
    client = new HttpClient();
    thisUrl=urlStub.concat("camcmd/").concat(whichFunction).concat("/").concat(val1).concat("/").concat(val2).concat("/").concat(duration);
    debug(thisUrl);
    client.get(thisUrl, function(response) { });  
}

Clicker.prototype.onmousedown = function( event ) {
//     debug("mousedown ".concat(document.defaultView.getComputedStyle(this.element,null).getPropertyValue('color')));
      debug("mousedown id ".concat(this.element.id));
     doAction(this.element)
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
     doAction(this.element)
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
