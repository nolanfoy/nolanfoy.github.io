let theOsc, fft;
let playing,scale;
let particles = [];
let cb = [];
let db = [];
let cob = [];
let ob = [];
const num = 5;
const bassNum = 6;
const dist = 20;
const colDist = 255;
const speed = 0.005;
let position = 0;
let colorTime = 0;
let lineTime = 0;
let lineSpeed = .001;
let colorSpeed = .004;
let changingRed;
let changingGreen;
let changingBlue;
let bass;
let rate = 5;
let bassAnalyzer;
let bgPicker = 0;
let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 35.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let yvalues; // Using an array to store height values for the wave
let end = 0;
let snareAnalyzer;
const snareNum = 3;
let cs = [];
let os = [];
let ds = [];
let cos = [];
let sParticles = [];
let transp;
let mic;
let inVol;
let lineRate = 0.01;


const diatonic = [27.50,30.87,32.70,36.71,41.20,43.65,49.00,55.00,61.74,65.41,73.42,82.41,87.31,98.00,110.00,123.47,130.81,146.83,164.81,174.61,196.00,220.00,246.94,261.63,293.66,329.63,349.23,392.00,440.00,493.88,523.25,587.33,659.25,698.46,783.99,880.00,987.77,1046.50];
const chromatic = [27.50,29.14,30.87,32.70,34.65,36.71,38.89,41.20,43.65,46.25,49.00,51.91,55.00,58.27,61.74,65.41,69.30,73.42,77.78,82.41,87.31,92.50,98.00,103.83,110.00,116.54,123.47,130.81,138.59,146.83,155.56,164.81,174.61,185.00,196.00,207.65,220.00,233.08,246.94,261.63,277.18,293.66,311.13,329.63,349.23,369.99,392.00,415.30,440.00,466.16,493.88,523.25,554.37,587.33,622.25,659.25,698.46,739.99,783.99,830.61,880.00,932.33,987.77,1046.50];

function preload() {
  bass = loadSound('2085__opm__kk-set1Edited.wav');
  song = loadSound('backgroundChorus.wav');
  snare = loadSound('snare.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight+110);
  background(25);
  
  scale = diatonic;
  w = width + 16;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
  
  let c = createVector(width/2,height/2);
  let o = createVector(random(-dist,dist),random(-dist,dist));
  let d = 65;
  let co = createVector(random(-colDist,colDist),random(-colDist,colDist),random(-colDist,colDist))
  theOsc = new p5.Oscillator('sine');

  analyzer = new p5.Amplitude();
  // Patch the input to an volume analyzer
  analyzer.setInput(bass);

  snareAnalyzer = new p5.Amplitude();
  // Patch the input to an volume analyzer
  snareAnalyzer.setInput(snare);

  fft = new p5.FFT();

  
  for (let i = 0; i < bassNum; i++) {
    
    cb[i] = createVector(width/2,height/2);
    ob[i] = createVector(random(-dist,dist),random(-dist,dist));
    db[i] = 35;
    cob[i] = createVector(random(-colDist,colDist),random(-colDist,colDist),random(-colDist,colDist))
    particles[i] = new BassParticle(cb[i],db[i],ob[i],color(255,255,255,100),cob[i]);
  }
 
  
  for (let i = 0; i < snareNum; i++) {
    
    cs[i] = createVector(width/2,height/2);
    os[i] = createVector(random(-dist,dist),random(-dist,dist));
    ds[i] = 35;
    cos[i] = createVector(random(-colDist,colDist),random(-colDist,colDist),random(-colDist,colDist))
    sParticles[i] = new SnareParticle(cs[i],ds[i],os[i],color(255,255,255,0),cos[i]);
  }
  dot = new Particle(c,d,o,color(255,255,255,100),co,theOsc);
 
    
  
}

function mouseClicked() {
  
  if (playing === true) {
    theOsc.amp(0,0.1);
    playing = false;
  
    noLoop();
    bass.stop();
    song.stop();
    
  } else {
    theOsc.start();
    theOsc.amp(0);
    playing = true;
    end = 0;
    loop();
    bass.amp(1.0);
    bass.loop();
    song.loop();
    song.amp(.7);
    snare.amp(.5);
    mic = new p5.AudioIn();

    mic.start();
  } 
}

function keyTyped() {
  if (key == 'b') {
    if (bgPicker == 0){
      bgPicker = 1;
    } else {
      bgPicker = 0;
    }
  }

  if (key == 'd') {
    end = 1;
    song.setVolume(0.0, 1.0);
    bass.setVolume(0.0, 2.0, 4.0);
    theOsc.amp(0.0, 3.0, 3.0);
    console.log(theOsc.getAmp());
   
  } else {
    end = 0;
  }

  if (key == ' ') {
    snare.play();
    
  }
}

function ArrayAvg(myArray) {
  var i = 0, summ = 0, ArrayLen = myArray.length;
  while (i < ArrayLen) {
      summ = summ + myArray[i++];
}
  return summ / ArrayLen;
}

function draw() {
  // if (theOsc.getAmp() == 0)
  //   background(255, 255, 255, 100)
  if (bgPicker == 0)
    background(0, 10);
  else
    background(0, 1);
    dot.changeColor();
    noStroke();
  if (playing){
    dot.play();
    //dot.display();
    dot.changeColor();
    dot.move();
    position += speed;
    colorTime += colorSpeed;
    lineTime += lineSpeed;
  }

  if (end == 1) {
    playing = false;
  }
  dot.display();
  for (i = 0; i < snareNum; i++) { 
    sParticles[i].display();
    sParticles[i].move();
  }
  for (i = 0; i < bassNum; i++) { 
    particles[i].display();
    particles[i].move();
  }
  
  
  // For every x value, calculate a y value with sine function
  let x = theta;
  
  let off = map(noise(lineTime), 0, 1, -400, 400);
  let mOff = map(mouseY, 0, height, -400, 400);
  off += mOff;

  if (keyIsDown(UP_ARROW)) {
    off -= 100;
  }
 if (keyIsDown(DOWN_ARROW)) {
    off += 100;
  }

  let songSpeed = map(off, 100, -100, 0.8, 1.2);
  songSpeed = constrain(songSpeed, .8, 1.1);
  song.rate(songSpeed);
  theta += lineRate;
  if (playing) {
    micVol = map(mic.getLevel(), 0, 1, 0.01, 0.7);
    lineRate = micVol;
  }
  for (let i = 0; i < yvalues.length; i++) {
    if (end != 1) {
      yvalues[i] = sin(x) * amplitude + off;
      x += dx;
      
    } else {
      yvalues[i] = ArrayAvg(yvalues);
    }
    
  }

  noStroke();
  //fill(dot.col);
  // A simple way to draw the wave with an ellipse at each location
  for (let x = 0; x < yvalues.length; x++) {
    rect(x * xspacing, height / 2 + yvalues[x], 10, 10, 2, 2, 2, 2);
    
  }

  
  
  

  //calcWave();
  //renderWave();

  
 
}

function calcWave() {
  // Increment theta (try different values for
  // 'angular velocity' here)
  theta += 0.01;

  // For every x value, calculate a y value with sine function
  let x = theta;
  let offVal = random(-dist,dist);
  let off = map(noise(colorTime), 0, 1, -300, 300);
  for (let i = 0; i < yvalues.length; i++) {
    yvalues[i] = sin(x) * amplitude + off;
    x += dx;
    
  }
}

function renderWave() {
  noStroke();
  color(200, 0, 50, 75);
  
  // A simple way to draw the wave with an ellipse at each location
  
  for (let x = 0; x < yvalues.length; x++) {
    rect(x * xspacing, (height+110) / 2 + yvalues[x], 10, 10, 2, 2, 2, 2);
    
  }
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + Math.cos(a) * radius2;
    let sy = y + Math.sin(a) * radius2;
    vertex(sx, sy);
    sx = x + Math.cos(a + halfAngle) * radius1;
    sy = y + Math.sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


class Particle {
  constructor(coords,diameter,offset,col,colOffset,osc) {
    this.coords = coords;
    this.diam = diameter;
    this.offset = offset;
    this.col = col;
    this.colOffset = colOffset;
    this.osc = theOsc;
  }

  display() {
    fill(this.col);
    circle(this.coords.x,this.coords.y,this.diam);
  }

  move() {
    this.coords.x = map(noise(position+this.offset.x),0,1,0,width);
    this.coords.y = map(noise(position+this.offset.y),0,1,0,height);
    changingRed = map(noise(colorTime+this.colOffset.x), 0, 1, 0, 255);
    changingGreen = map(noise(colorTime+this.colOffset.y), 0, 1, 0, 255);
    changingBlue = map(noise(colorTime+this.colOffset.z), 0, 1, 0, 255);
    //this.col = color(changingRed,0,changingBlue,100);
    
  }

  play() {
    //let f = map(this.coords.x,0,width,49.00,1046.5,true);
    let f = map(changingRed,0,255,73.42,1046.5,true);
    f = scale.sort((a,b) => Math.abs(f-a) - Math.abs(f-b))[0];
    //let a = map(this.coords.y,0,height,.1,0,true);
    this.osc.freq(f,0.1);  
    this.osc.amp(.3);  

  }

  changeColor() {
    changingRed = map(noise(colorTime+this.colOffset.x), 0, 1, 0, 255);
    changingGreen = map(noise(colorTime+this.colOffset.y), 0, 1, 0, 255);
    changingBlue = map(noise(colorTime+this.colOffset.z), 0, 1, 0, 255);
    if (keyIsDown(LEFT_ARROW)) {
      changingBlue += 50;   
      changingRed -= 50; 
    }
   if (keyIsDown(RIGHT_ARROW)) {
      changingBlue -= 50;
      changingRed += 50;   
      
    }
    //console.log(changingRed);
    this.col = color(changingRed,0,changingBlue,100);
}
}

class BassParticle {
  constructor(coords,diameter,offset,col,colOffset) {
    this.coords = coords;
    this.diam = diameter;
    this.offset = offset;
    this.col = col;
    this.colOffset = colOffset;
  }
  display() {
    fill(this.col);
    let vol = analyzer.getLevel();
    let mult = map(vol,0,1,0.5,5);
    circle(this.coords.x,this.coords.y,this.diam*mult);
  }
  move() {
    
    this.coords.x = map(noise(position+this.offset.x),0,1,0,width);
    this.coords.y = map(noise(position+this.offset.y),0,1,0,height);
    changingRed = map(noise(colorTime+this.colOffset.x), 0, 1, 0, 255);
    changingGreen = map(noise(colorTime+this.colOffset.y), 0, 1, 0, 255);
    changingBlue = map(noise(colorTime+this.colOffset.z), 0, 1, 0, 255);
    this.col = color(changingRed,changingGreen,changingBlue,100);
    
    //fill(this.col);
    

  }
}

class SnareParticle {
  constructor(coords,diameter,offset,col,colOffset) {
    this.coords = coords;
    this.diam = diameter;
    this.offset = offset;
    this.col = col;
    this.colOffset = colOffset;
    
  }
  display() {
    fill(this.col);
    let vol = snareAnalyzer.getLevel();
    let mult = map(vol,0,1,0,15);
    //quad(this.coords.x*mult, this.coords.y*mult, (this.coords.x + 10)*mult, this.coords.y*mult, this.coords.x*mult, (this.coords.y+10)*mult, (this.coords.x+10)*mult, (this.coords.y+10)*mult);
    //circle(this.coords.x,this.coords.y,this.diam*mult);
    star(this.coords.x, this.coords.y, 10*mult, 50*mult, 8);
  }
  move() {
    if (snare.isPlaying()) {
      transp = 100;
    } else {
      transp = 0;
    }
    this.coords.x = random(0, width);//map(noise(position+this.offset.x),0,1,0,width);
    this.coords.y = random(0, height);//map(noise(position+this.offset.y),0,1,0,height);
    changingRed = map(noise(colorTime+this.colOffset.x), 0, 1, 0, 255);
    changingGreen = map(noise(colorTime+this.colOffset.y), 0, 1, 0, 255);
    changingBlue = map(noise(colorTime+this.colOffset.z), 0, 1, 0, 255);
    this.col = color(changingRed,changingGreen,changingBlue,transp);
    
  }
}

