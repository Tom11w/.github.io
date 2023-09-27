let walking_speed = null;
let lot1 = null;
let lot2 = null;
let time_table_event = null

class Slider {
    constructor(position) {
    this.pos    = position; // middle of the slider
    this.Width  = 200; // Width of the slider
    this.height = 20; // height of the slider
    this.Value  = 4; // Initial value of the slider
    this.Max    = 6;
    this.Min    = 2;
    this.PX     = 50; // Count of px from the left to the value 
    this.dragging= false;
    this.rpos   = createVector(this.pos.x - (this.Width/2), this.pos.y - (this.height/2)); //top left of rect
    this.knob   = createVector(this.rpos.x + this.PX, this.pos.y);
    this.knobSize = 40;
    this.text   = () => "Value: " + this.Value.toFixed(2);
    }


    draw() {  // Display the slider and it's value
        rectMode(CORNER);
        this.drawSlider();
        this.drawText();
    }


    drawSlider() {
        // Draw the slider track
        fill(150);
        rect(this.rpos.x, this.rpos.y, this.PX, this.height); //dark side
        fill(200);
        rect(this.rpos.x + this.PX , this.rpos.y, this.Width-this.PX, this.height); // light side
    
        // Draw the slider knob
        fill(127);
        ellipse(this.rpos.x + this.PX, this.pos.y, this.knobSize, this.knobSize);
    }


    drawText() {
        //let roundedValue = round(this.Value * 100) / 100; // round
        //text("Value: " + roundedValue, 10, height - 10);
        textAlign(CENTER);
        fill(255);
        text(this.text(), this.pos.x, this.pos.y + this.height + 10);
    }

    
    press(mousePos) { // Check if the mouse is over the slider knob when pressed
        if (this.knob.dist(mousePos) < 10) {
            this.dragging = true;
            //this.offsetX = this.knob.x - mousePos.x;
        }
    }


    drag(mx) {
        if (this.dragging) {
            this.Value = map(mx - this.rpos.x, 0, this.Width, this.Min, this.Max);
            this.Value = constrain(this.Value, this.Min, this.Max);
            this.PX = map(this.Value, this.Min, this.Max, 0, this.Width);
            this.knob.x = this.rpos.x + this.PX;
        }
    }
}


class parkingLot {
    constructor (Position, Park_finding_time, distance, name) {
        this.pos = Position;
        this.ttp = Park_finding_time;  // time to (find a) park
        this.distance = distance;
        this.name = name;
        this.color = color(200,50,20);
        this.vec_to_event = p5.Vector.sub(time_table_event.pos,this.pos);
        this.vec_to_event.mult(0.6);
    }

    draw() {
        rectMode(CENTER);
        fill(200);
        rect(this.pos.x,this.pos.y, 150,100);
        //textAlign(LEFT);
        fill(0);
        text("Parking Lot " + this.name + "\n" +
            "Time to park: " + timeConvert(this.ttp) + "\n" +
            "Total time: " + timeConvert(this.ttp + this.time_to_walk()),
             this.pos.x, this.pos.y);
        drawArrow(
            p5.Vector.lerp(this.pos,time_table_event.pos,0.20),
            this.vec_to_event,
            this.color,
            "Time to walk: " + this.ttw_text());
    }
    ttw_text() {  // time to walk as string with nice to read message
        return timeConvert(this.time_to_walk()) 
    }
    time_to_walk() { //time to walk to event in hours
        return this.distance/walking_speed.Value;  // (distance (km) / speed (km/h))= walking time
    }
}

class cal_event {
    constructor () {
        this.pos = createVector(600,100);
        this.name = "Event";
    }

    draw() {
        rectMode(CENTER);
        fill(200);
        rect(this.pos.x,this.pos.y, 150,150);
        //textAlign(LEFT);
        fill(0);
        text(this.name, this.pos.x, this.pos.y);
    }
}

// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor, label) {
    push();
    stroke(myColor);
    strokeWeight(10);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 30;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    fill(255);
    textSize(15);
    stroke(color(0,0,0,0));
    text(label, -vec.mag()/2, -10);
    pop();
  } // from example https://p5js.org/reference/#/p5.Vector/dist


function timeConvert(n) {
    var num = n;
    //var hours = (num / 60);
    var hours = n
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.floor(minutes);
    var seconds = (minutes - rminutes) * 60;
    var rseconds = Math.floor(seconds);
    var text = "";
    if (rhours!=0) {
        text += rhours.toString() + "hour"; 
        if (rhours > 1){
            text += "s";
        }
    }
    if (rhours!=0 && rminutes != 0) {
        text += " and";
    }
    if (rminutes != 0) {
        text += rminutes.toString() + " minute";
        if (rminutes != 1) {
            text += "s";
        }
    }
    if ((rhours!=0 || rminutes != 0) && rseconds != 0) {
        text += " and ";
    }
    if (rseconds != 0) {
        text += rseconds .toString() + " second";
        if (rseconds != 1) {
            text += "s";
        }
    }
    return text;
    //return num + " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).";
}


function setup() {
    //createCanvas(400, 200);
    createCanvas(windowWidth, windowHeight);
  
    // Calculate the initial X-coordinate of the slider
    //sliderX = (width - sliderWidth) / 2;
    //sliderPX = map(sliderValue, sliderMin, sliderMax, 0, sliderWidth)
  
    // Draw the slider
    walking_speed = new Slider(createVector(width/2, height-200));
    walking_speed.text = () => "Walking Speed (KM/H): " + walking_speed.Value.toFixed(2);
    //drawSlider(sliderX, sliderValue);

    time_table_event = new cal_event();

    lot1 = new parkingLot(
        createVector(100,100),  // position to display on screen
        1/60,                   // 1 min to find park
        1/3,                    // 0.33km takes 5min to walk at 4km/h
        "7"
    );
    lot2 = new parkingLot(
        createVector(100,300),  // position to display on screen
        5/60,                   // 5 min to find park
        8/60,                   // 0.13km takes 2min to walk at 4km/h
        "10"
    );
}


function draw() {
    background(0);
    walking_speed.draw();
    time_table_event.draw();
    lot1.draw();  
    lot2.draw();  
}


function mousePressed() {
  walking_speed.press(createVector(mouseX,mouseY));
}


function mouseReleased() {
  walking_speed.dragging = false;
}


function mouseDragged() {
    walking_speed.drag(mouseX);
}