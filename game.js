var dndSupported;
var dndElements = new Array();
var draggingElement;
var winners = {
    // Rock is beaten by Paper
    Rock: 'Paper',
    // Paper is beaten by Scissors
    Paper: 'Scissors',
    // Scissors are beaten by Rock
    Scissors: 'Rock'
};

// on hover we change the border style to this and back
var hoverBorderStyle = '2px dashed #999';
var normalBorderStyle = '0px solid white';

function detectDragAndDrop() {
    if ('draggable' in document.createElement('span')) {

        return true;
    }
    return false;
}



function handleDragStart(e) {
    draggingElement = this;
    // set its class to moving
    draggingElement.className = 'moving';
    // set the opacity and border accordingly
    draggingElement.style.opacity = '0.4';
    draggingElement.style.border = hoverBorderStyle;
    // change the statusMessage
    statusMessage('Drag ' + getRPSType(draggingElement));
    // set the drag image and always put the cursor in the middle
    e.dataTransfer.setDragImage(getRPSImage(draggingElement), 120, 120);
}

// function to handle the dragging end (the mouse button is released)
function handleDragEnd(e) {
    // reset the dragged element's style
    draggingElement.className = undefined;
    draggingElement.style.opacity = '1.0';
    // release the draggingElement
    draggingElement = undefined;
    // reset all of the three outer divs (no more dashed borders)
    for (var i = 0; i < dndElements.length; i++) {
        dndElements[i].style.border = normalBorderStyle;
    }
}

// function to handle dragOver
// we need this function to prevent the default action, otherwise we cannot drop
function handleDragOver(e) {
    // if there is a preventDefault...
    if (e.preventDefault) {
        // ... then call this, otherwise 'drag' gets reset by default
        e.preventDefault();
    }
    // this is the only functional line, adjusting the border
    this.style.border = hoverBorderStyle;
    // some browsers may need this to preventDefault instead
    return false;
}

// function to handle dragEnter
function handleDragEnter(e) {
    // if dragEnter is not happening on the original outer div
    if (this !== draggingElement) {
        // change the statusMessage to 'Hover A over B'
        statusMessage('Hover ' + getRPSType(draggingElement) + ' over ' + getRPSType(this));
    }
    // adjust the border for the underlying outer div
    this.style.border = hoverBorderStyle;
}

// function to handle dragLeave
function handleDragLeave(e) {
    // reset the border of the underlying outer div
    this.style.border = normalBorderStyle;
}

// function to handle drop
function handleDrop(e) {
    // first we prevent browsers from doing weird things
    if (e.stopPropegation) {
        // stops some browsers from redirecting.
        e.stopPropagation();
    }
    if (e.preventDefault) {
        // stops some browsers from resetting the 'drag'
        e.preventDefault();
    }
    // if the drop is happening on itself
    if (this.id === draggingElement.id) {
        // just drop and do nothing else
        return;
    } else {
        // else check if the upper element beats the lower element
        isWinner(this, draggingElement);
    }
}


// Game functions

// check whether the over-element beats the under-element
// the under-element is 'this', the over-element is draggingElement
function isWinner(under, over) {
    // first store these objects is clearly named variables
    var underType = getRPSType(under);
    var overType = getRPSType(over);
    // check if overtype equals its equivalent from the winners array
    if (overType == winners[underType]) {
        // if it does, it wins, so change statusMessage
        statusMessage(overType + ' beats ' + underType);
        // and swap the two outer divs
        swapRPS(under, over);
    } else {
        // otherwise change the statusMessage 
        // (draggingElement still sits at it original position)
        statusMessage(overType + ' does not beat ' + underType);
    }
}

// get the footer from the outer div
function getRPSFooter(e) {
    // grab all child elements inside the div (here just two, the img and footer)
    var children = e.childNodes;
    // loop through these elements
    for (var i = 0; i < children.length; i++) {
        // if this is the footer element
        if (children[i].nodeName.toLowerCase() == 'p') {
            // return that element
            return children[i];
        }
    }
    // if this fails, return undefined
    return undefined;
}

// grab the image from the outer div
function getRPSImage(e) {
    // grab all child elements inside the div (here just two, the img and footer)
    var children = e.childNodes;
    // loop through these elements
    for (var i = 0; i < children.length; i++) {
        // if this is the image element
        if (children[i].nodeName.toLowerCase() == 'img') {
            // return that element
            return children[i];
        }
    }
    // if this fails, return undefined
    return undefined;
}

// get which of the three divs is being targeted
function getRPSType(e) {
    // grab the footer from the div
    var footer = getRPSFooter(e);
    // if a footer exists
    if (footer) {
        // return the text inside the footer
        return footer.innerHTML;
    }
    // if this fails, return undefined
    return undefined;
}

// function that swaps the contents of two rps-divs
function swapRPS(rpsA, rpsB) {
    // create a temporary container for the swap
    var myPlaceholder = Object();

    // store the src and innerHTML of rpsA in two properties of this placeholder
    myPlaceholder.src = getRPSImage(rpsA).src;
    myPlaceholder.type = getRPSFooter(rpsA).innerHTML;
    myPlaceholder.alt = getRPSImage(rpsA).alt;

    // store these two properties from rpsB in rpsA, replacing them 
    getRPSImage(rpsA).src = getRPSImage(rpsB).src;
    getRPSFooter(rpsA).innerHTML = getRPSFooter(rpsB).innerHTML;
    getRPSImage(rpsA).alt = getRPSImage(rpsB).alt;

    // store the placeholder properties in rpsB, completing the swap
    getRPSImage(rpsB).src = myPlaceholder.src;
    getRPSFooter(rpsB).innerHTML = myPlaceholder.type;
    getRPSImage(rpsB).alt = myPlaceholder.alt;


    console.log(myPlaceholder)
}


// Utility functions

// useful for finding elements (a shortcut for getElementById)
var myElement = function (id) {
    return document.getElementById(id);
};

// sets the html messagee shown in the statusbar at the top of the screen
function statusMessage(myStr) {
    // if an argument is given
    if (myStr) {
        // put the argument in statusMessage
        myElement('statusMessage').innerHTML = myStr;
    } else {
        // else, put a non-breaking space in there, otherwise it won't show
        myElement('statusMessage').innerHTML = '&nbsp;';
    }
}

// App lifetime support
function init() {
    // check if the browser supports DnD using our function
    if ((dndSupported = detectDragAndDrop())) {
        // if so, change the statusMessage to reflect this
        statusMessage('Using HTML5 Drag and Drop');
        // fill the array with the three divs holding the images and footers
        dndElements.push(myElement('rps1'), myElement('rps2'), myElement('rps3'));
        // add the eventListeners to each of these elements
        for (var i = 0; i < dndElements.length; i++) {
            // when a drag gets started, use the appropiate function, execute in bubbling phase
            // bubbling = first run event on the element, then the parent and so further to the top
            dndElements[i].addEventListener('dragstart', handleDragStart, false);

            // event not used is 'drag' - this gets fired over and over as long as we keep dragging

            // when a drag is ended...
            dndElements[i].addEventListener('dragend', handleDragEnd, false);

            // when a drag currently is on a dropzone... will get fired multiple times
            // be aware: you need to stop this from executing its default action!!
            dndElements[i].addEventListener('dragover', handleDragOver, false);

            // when a drag crosses the boundary of the dropzone
            // on slow movement this event might get fired multiple times
            dndElements[i].addEventListener('dragenter', handleDragEnter, false);

            // when a drag inside the dropzone touches the boundary
            // this might get fired multiple times, even when entering a dropzone...
            // ...and you touch the border at the other side of the dropzone
            dndElements[i].addEventListener('dragleave', handleDragLeave, false);

            // when a release/drop happens...
            // but only if the default action for dragover has been stopped!
            dndElements[i].addEventListener('drop', handleDrop, false);
        }
    } else {
        // otherwise change the statusMessage to reflect there is no support for DnD
        statusMessage('This browser does not support Drag and Drop');
    }
}

// when the page is fully loaded, run initialize
window.onload = function () {
    init();
}