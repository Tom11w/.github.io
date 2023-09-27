let sliderX; // X-coordinate of the slider
let sliderWidth = 100; // Width of the slider
let sliderValue = 50; // Initial value of the slider
let dragging = false;

function setup() {
  createCanvas(400, 200);
  
  // Calculate the initial X-coordinate of the slider
  sliderX = (width - sliderWidth) / 2;
  
  // Draw the slider
  drawSlider(sliderX, sliderValue);
}

function draw() {
  background(220);
  
  // Display the value of the slider
  text("Value: " + sliderValue, 10, height - 10);
  drawSlider(sliderX, sliderValue);
}

function drawSlider(x, value) {
  // Draw the slider track
  fill(150);
  rect(x, height / 2 - 5, sliderWidth, 10);
  
  // Draw the slider knob
  fill(255);
  ellipse(x + map(value, 0, 100, 0, sliderWidth), height / 2, 20, 20);
}

function mousePressed() {
  // Check if the mouse is over the slider knob
  let knobX = sliderX + map(sliderValue, 0, 100, 0, sliderWidth);
  let knobY = height / 2;
  let d = dist(mouseX, mouseY, knobX, knobY);
  
  if (d < 10) {
    dragging = true;
    offsetX = knobX - mouseX;
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (dragging) {
    sliderValue = constrain(map(mouseX + offsetX, sliderX, sliderX + sliderWidth, 0, 100), 0, 100);
    drawSlider(sliderX, sliderValue);
  }
}
