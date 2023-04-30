var canvas = document.getElementById("petri-dish");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var ctx = canvas.getContext('2d');

const sliderSeparation = document.getElementById("sliderSeparation");
const sliderCohesion = document.getElementById("sliderCohesion");
const sliderAlignment = document.getElementById("sliderAlignment");

const separationInput = document.getElementById("separationInput");
const cohesionInput = document.getElementById("cohesionInput");
const alignmentInput = document.getElementById("alignmentInput");

separationInput.innerHTML = sliderSeparation.value;
cohesionInput.innerHTML = sliderCohesion.value;
alignmentInput.innerHTML = sliderAlignment.value;

var separationMultiplier = 1;
var cohesionMultiplier = 1;
var alignmentMultiplier = 1;


var wrapElement = document.getElementById("wrap");
var discriminationElement = document.getElementById("discrimination");

var wrap = wrapElement.checked;
var discrimination = discriminationElement.checked;



wrapElement.addEventListener('change', function() {
  wrap = wrapElement.checked;
  for (let i=0; i <microbes.length; i++) {
    microbes[i].wrap = wrap;
  }

});

discriminationElement.addEventListener('change', function(){
    discrimination = discriminationElement.checked;
    console.log("discrimination: ", discrimination);
    for (let i=0; i <microbes.length; i++) {
        microbes[i].discrimination = discrimination;
      }
})


sliderSeparation.oninput = function() {
    separationInput.innerHTML = this.value;
    separationMultiplier = separationInput.innerHTML;
    console.log("separation input", separationMultiplier);
}

sliderCohesion.oninput = function() {
    cohesionInput.innerHTML = this.value;
    cohesionMultiplier = cohesionInput.innerHTML;
    console.log("cohesion input", cohesionMultiplier);
}

sliderAlignment.oninput = function() {
    alignmentInput.innerHTML = this.value;
    alignmentMultiplier = alignmentInput.innerHTML
    console.log("alignment input", alignmentMultiplier);
}

function drawNutrients() {
    for (let i=0; i<nutrientCount; i++) {
        let nutrient = nutrients[i];
        ctx.beginPath();
        ctx.arc(nutrient.x, nutrient.y, nutrient.radius, 0, Math.PI*2, false);
        ctx.fillStyle="rgba(255,255,255, .075)";
        ctx.fill();
        ctx.closePath();
    }
}

function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawNutrients();
    for (let i=0; i<microbeCount; i++) {
        microbes[i].update();
    }
}

function startAnimation() {
    animate();
}

// ==============================================================================

var microbes = [];
const microbeCount = 450;
const microbeRadius = Math.random() * 8 + 2;

const influenceRadius = 50;
const matchAtDistance = 25;
const avoidanceDistance =  23;



// recommended: influence > matchAtDistance > avoidanceDistance

var nutrients = [];
const nutrientCount = 25;
for (let i =0; i<nutrientCount; i++) {
    nutrients.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height, 
        radius: Math.random() * 16 + 3
    })
}

var microbeId = 0;
for (let i=0; i<microbeCount; i++) {
    microbes.push(new Boid({

        population: microbes,
        id: microbeId++,
        radius:Math.random() * 14 + 2, // 2 < r <16
       //radius: 15,

        influence: influenceRadius,
        avoid: avoidanceDistance, 
        matchRadius: matchAtDistance,

        separation: true,
        alignment: true,
        cohesion: true,

        wrap: wrap,
        discrimination: discrimination
    }))
}


startAnimation();