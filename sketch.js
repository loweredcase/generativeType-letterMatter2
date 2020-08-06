// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//        Letter.Matter v2.1
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//      a series of generative 
//        typographic worlds
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//  - for Generative Type, 2020 -
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// issues : clear canvas & window resize not working



var Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint

var engine
var world
var mConstraint
var wordBlock = []
var ground
var boundaries = []

const yAxis = 1
let prevX, prevY
let poemI = 0
let ptSize
let bgCol


let poem = 'A DAILY TEDIUM OF COMMUTING TO FIND REMOVE. YOU ARE RACING THE CLOCK ABOVE THE BAR KEEP TO CREATE AN IMPRESSION THAT CAN LAND ALL THE LITTLE DIALS SET TO; YES. YOU ARE TRAVELING ON A PIANO… STEPPING STRING TO STRING: YOU MUST PASS OVER ALL THE TRIP WIRE. MUST SOUND ONLY THOSE NOTES THAT BEAUTIFY THE CONVERSATION, AND NOT TOO PRACTICED IN THE PROCESS. HERE, YOUR BRAIN IS TOO FULL OF STATIC CHARGE TO PAY ANY NOTICE TO THE BUZZ OF APPREHENSION THAT VIBRATES YOUR SOBRIETY LIKE A NEVER ENDING TRAIN. THE GREATEST REMOVE THAT CAN BE OBTAINED BY LEGAL, MINIMUM WAGE MEANS; THE $3-DOLLAR AMERICAN CLASSIC-TOUCH CAR WASH. A CARWASH ADDRESSES THESE MOMENTS OF REMOVE AND VULNERABILITY DIRECTLY. A CAR WASH SAYS YES, THERE IS DANGER ALL ABOUT. YOU ARE IN THE EPICENTER OF A TRIPLE-COLOR FOAM TSUNAMI… BUT YOU? YOU ARE SURVIVING SPOT FREE. IN A DIVING BELL EQUIPPED WITH AN AM/FM STEREO & HEATED POWER-LEATHER SEATS.'



function preload(){
  //font = loadFont('assets/Kvetch-01-RegularItalic.otf')
  //font = loadFont('assets/Obviously-NarrowBlack.otf')
  font = loadFont('assets/Obviously-NarrowMedium.otf')
}


function setup() {
  // var canvas = createCanvas(550, 750)
  var canvas = createCanvas(windowWidth, windowHeight)  
  initialSize = min(width, height)
  cursor(CROSS)
  ptSize = windowHeight/15
  engine = Engine.create()
  world = engine.world
  // Make Everything Float:
  //engine.world.gravity.y = -1

  // make a floor (new Boundary (x, y, width, height, angle)
  boundaries.push(new Boundary (width/2, height-5, width, 10, 0))
  boundaries.push(new Boundary (width/2, 5, width, 10, 0))
  boundaries.push(new Boundary (5, height/2, 10, height, 0))
  boundaries.push(new Boundary (width-5, height/2, 10, height, 0))
  
  var canvasMouse = Mouse.create(canvas.elt)
  canvasMouse.pixelRatio = pixelDensity()
  var options = {
    mouse: canvasMouse
  }

  mConstraint = MouseConstraint.create(engine, options)
  World.add(world, mConstraint)

  colors = [
    c1 = color('#020b1a'),
    c2 = color('#325d7d'),
    c3 = color('#00dded'),
    c4 = color('#3cffb5'),
    c5 = color('#ffff7d'),
    c6 = color('#fea32c'),
    c7 = color('#fb39ae'),
    c8 = color('#a12859'),
    c9 = color('#020b1a')
    ]


    //bgLayer = createGraphics(windowWidth, windowHeight)
    bgCol = color(220)

}





function draw() {
  Engine.update(engine)


    gradHeight = height/8
  
    for (let gradHeightNum = 0; gradHeightNum <= 7; gradHeightNum += 1){
        let color1 = colors[gradHeightNum]
        let color2 = colors[gradHeightNum + 1]
        bgCol = setGradient(0, gradHeight * gradHeightNum, width, gradHeight, color1, color2, yAxis)
      }

  
  for (var i = 0; i < wordBlock.length; i++) {
    wordBlock[i].show();
    if (wordBlock[i].isOffScreen()){
      // splice removes objects from screen
      wordBlock[i].removeFromWorld()
      wordBlock.splice(i, 1)
      i--
    }
  }
  
    for (var i = 0; i < boundaries.length; i++) {
    boundaries[i].show();
  }  

  
}



function mouseClicked(){
  
  if (mConstraint.body) {
     return
  } 

  let word = split(poem, ' ')
  wordBlock.push(new Rectangle(mouseX, mouseY, this.w, this.h, word[poemI]))   
  poemI = (poemI + 1) % poem.length
    
}



function keyTyped() {
  if (key === 's') {
    saveCanvas(canvas, 'letterMatter', 'png')
  } //else if (key === 'c'){
  //      changeBg()
  //  } 
  return false
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
  //let size = min(width, height)
  //scaleVal = size / initialSize
}



function Rectangle(x, y, w, h, poem) {
  var options = {
    friction: .8,
    restitution: .4,
    //angle : (random(0, -Math.PI))
    //density: .001
  }

  

  // textToPoints(glyph, x, y, ptSize)
  this.ptSize = ptSize
  this.poem = poemI
  let points = font.textToPoints(poem, 0, 0, this.ptSize)
  let bounds = font.textBounds(poem, 0, 0, this.ptSize)

  this.w = bounds.w
  this.h = bounds.h
  //this.density = 100
  
  
  for (let pt of points){
    pt.x = pt.x - bounds.x - bounds.w/2
    pt.y = pt.y - bounds.y - bounds.h/2
  }
  
  
  // defining center, then defining bounds
  this.body = Bodies.rectangle(x + bounds.w/2, y + bounds.h/2, bounds.w, bounds.h, options)
  
  this.poem = poem
  this.bounds = bounds
  World.add(world, this.body)

  this.isOffScreen = function() {
    var pos = this.body.position
    return (pos.y > height + 20) 
  }
  
  this.removeFromWorld = function(){
    World.remove(world, this.body)
  }
  
  this.show = function() {
    var pos = this.body.position
    var angle = this.body.angle

    push()
    translate(pos.x, pos.y)
    rotate(angle)
    rectMode(CENTER)
    //noFill()
    //strokeWeight(1)
    noStroke()
    fill('white')
    rect(0, 0, this.bounds.w, this.bounds.h)
    fill(0)
    noStroke()
    textFont(font)
    textSize(ptSize/2)
    textAlign(CENTER, CENTER)
    translate(0, 0)
    text(this.poem, 0, -this.bounds.h/5)
    pop()
  }
}



function Boundary(x, y, w, h, a) {
  var options = {
    friction: .3,
    restitution: .06,
    isStatic: true,
    angle: a
  }

  this.body = Bodies.rectangle(x, y, w, h, options)
  this.w = w
  this.h = h
  World.add(world, this.body)

  this.show = function() {
    var pos = this.body.position
    var angle = this.body.angle

    push()
    translate(pos.x, pos.y)
    rotate(angle)
    rectMode(CENTER)
    noStroke()
    fill(255)
    rect(0, 0, this.w, this.h)
    pop()

  }
}


function setGradient(x, y, width, height, color1, color2, axis) {
  noFill()
  
  if (axis === yAxis) {
    for (let i = y; i <= y + height; i ++) {
      let inter = map(i, y, y + height, 0, 1)
      let c = lerpColor(color1, color2, inter)
      stroke(c);
      line(x, i, x + width, i)
    }
  }
}






