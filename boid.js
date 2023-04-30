class Boid {
    constructor(boid) {
        this.id = boid.id;
        this.population = boid.population; 
        this.position = this.getRandomPosition();
        let randomVector = this.getRandomUnitVector();
        this.velocity = new Victor(randomVector.x, randomVector.y);
        this.acceleration = new Victor(0,0);
        this.radius = boid.radius;
        this.species = this.getSpecies();

        this.influence = boid.influence;
        this.avoidanceDistance = boid.avoid + boid.radius;
        this.matchRadius = boid.matchRadius;

        this.maxForce = .09;
        this.maxSpeed =4;

        this.separation = boid.separation;
        this.cohesion = boid.cohesion;
        this.alignment = boid.alignment;
        this.wrap = boid.wrap;
        this.discrimination = boid.discrimination;
    }

    draw() {
        // implement a stack to add trails 
        if (this.radius < 2.5) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
            ctx.fillStyle="purple";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
            ctx.stroke();
            ctx.closePath();
        }
        else if (this.radius < 6) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
            ctx.fillStyle="rgba(230, 248, 178, .3)";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius/2, 0, Math.PI*2, false);
            ctx.fillStyle="orange"
            ctx.fill();
            ctx.closePath();

        }
        else if (this.radius < 12) {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
            ctx.fillStyle = "rgba(86,163,166, .4)";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius/4, 0, Math.PI*2, false);
            ctx.fillStyle="green";
            ctx.fill();
            ctx.closePath();

        }   
        else {
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
            ctx.fillStyle = "rgba(0,0,0, .1)";
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius/2, 0, Math.PI*2, false);
            ctx.fillStyle = "purple";
            ctx.fill();
            ctx.closePath();
        }



    }

    move() {

        // 3 Behaviors:
            // separation - border & boid collision
            // alignment - move in the similar direction of neighbors
            // cohesion  - move in the direction of center of mass

        this.checkBorder();

        var separationVector;
        var alignmentVector;
        var cohesionVector;

        if (this.separation) separationVector = this.getSeparation();
        else separationVector = new Victor(0,0);
        
        if (this.alignment) alignmentVector = this.getAlignment();
        else alignmentVector = new Victor(0,0);

        if (this.cohesion) cohesionVector  = this.getCohesion();
        else cohesionVector = new Victor(0,0);

        alignmentVector.multiply(new Victor(alignmentMultiplier,alignmentMultiplier));
        cohesionVector.multiply(new Victor(cohesionMultiplier,cohesionMultiplier));
        separationVector.multiply(new Victor(separationMultiplier,separationMultiplier));


        this.acceleration.x =0;
        this.acceleration.y =0;
        this.acceleration.add(alignmentVector);
        this.acceleration.add(cohesionVector);
        this.acceleration.add(separationVector);

        //this.acceleration.x /= this.radius;
        //this.acceleration.y /= this.radius;

        
       

    }

    update() {
        // flock
        this.move();

        
        
        this.acceleration = this.limitVector(this.acceleration, this.maxSpeed);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        
        this.draw();
    }

    checkBorder() {
        // border collision 
        if (this.wrap) {
            if (this.position.x > canvas.width)   this.position.x = 0;
            else if (this.position.x < 0)               this.position.x = canvas.width;

            if (this.position.y > canvas.height)  this.position.y = 0;
            else if  (this.position.y < 0)              this.position.y = canvas.height;
        }
        else {        
            if (this.position.x + this.radius >= canvas.width || this.position.x - this.radius <= 0) this.velocity.x *= -0.75;
            if (this.position.y + this.radius >= canvas.height || this.position.y - this.radius <=0) this.velocity.y*=-0.75;
        }
    }


    /*---BEHAVIORAL-FUNCTIONS---------------------------------------------------------------*/ 
    getSeparation() {
        var steering = new Victor(0,0); // actual move influence
        var neighborCount =0;

        for(let i=0; i<microbeCount; i++) {
            var microbe = this.population[i];
            if (microbe.id === this.id) continue;

            var distance = this.position.distance(microbe.position);
            if (distance < this.influence) {

                // get the avoid vector
                let avoid = this.position.clone();
                avoid.subtract(microbe.position);

                // make avoid magnitude proportional to how close they are
                avoid.x /= (distance * distance);
                avoid.y /= (distance * distance);

                steering.add(avoid);
                neighborCount++;
            }
        }

        if (neighborCount > 0) {
            steering.x /= neighborCount;
            steering.y /= neighborCount;

            steering = this.setMagnitude(steering, this.maxSpeed);
            steering.subtract(this.velocity);
            steering = this.limitVector(steering, this.maxForce);
        }
        return steering;
    }

    getAlignment() {
        // for all this.population not current microbe
            // if microbe is a neighbor push to neighbors

        // for all neighbors 
            // get average velocity of neighbors

        var neighborsVelocities = new Victor(0,0); 
        var neighborCount = 0;

        for (let i =0; i<microbeCount; i++) {
            let microbe = this.population[i];
            if (microbe.id === this.id) continue;

            let distance = this.position.distance(microbe.position);
            // if microbe is a neighbor, add its 
            if (this.discrimination) {
                if (distance <= this.matchRadius && this.species === microbe.species) {
                    neighborsVelocities.add(microbe.velocity);
                    neighborCount++;
                }
            }
            else {
                if (distance <= this.matchRadius) {
                    neighborsVelocities.add(microbe.velocity);
                    neighborCount++;
                }
            }

                
        }
        var steerForce = neighborsVelocities.clone();
        if (neighborCount > 0) {
            steerForce.x /= neighborCount;
            steerForce.y /= neighborCount;
           // steerForce.divide(new Victor(neighborCount, neighborCount));

            steerForce = this.setMagnitude(steerForce, this.maxSpeed);
            steerForce.subtract(this.velocity);
            steerForce = this.limitVector(steerForce, this.maxForce);
            
            
        }
        return steerForce;
    }    

    getCohesion() {
        // steer towards average position of neighbors

        // for every microbe
            // if microbe is neighbor, add position
        // get average position

        var neighborsPositions = new Victor(0,0); 
        var neighborCount = 0;

        // add all positional vectors of neighbors
        for (let i =0; i<microbeCount; i++) {
            let microbe = this.population[i];
            if (microbe.id === this.id) continue;

            let distance = this.position.distance(microbe.position);
            // if microbe is a neighbor, add its 
            if (this.discrimination) {
                if (distance <= this.influence && this.species === microbe.species) {
                    neighborsPositions.add(microbe.position);
                    neighborCount++;
                }
            }
            else {
                if (distance <= this.influence) {
                    neighborsPositions.add(microbe.position);
                    neighborCount++;
                }
            }
        }

        // getCenterOfMass
        var steerForce = neighborsPositions.clone();

        if (neighborCount > 0) {
            steerForce.x /= neighborCount;
            steerForce.y /= neighborCount;

            steerForce.subtract(this.position);
            steerForce = this.setMagnitude(steerForce, this.maxSpeed);
            steerForce.subtract(this.velocity);
            steerForce = this.limitVector(steerForce, this.maxForce);
            //steerForce.normalize();
        }
        return steerForce;
    }

    /*---HELPER-FUNCTIONS---------------------------------------------------------------*/  

    getRandomUnitVector() {
        return new Victor(Math.random()*2-1, Math.random()*2-1).normalize();
    }

    getRandomPosition() {
        return new Victor(Math.random() * canvas.width, Math.random() * canvas.height)
        //return new Victor(Math.random() * (canvas.width/2 - canvas.width/3) + canvas.width/3, Math.random() * (canvas.height/2 - canvas.height/3) + canvas.height/3);

        
    }

    // return the passed in vector with adjust magnitude
    limitVector(forceVector, magnitude) {

        if (forceVector.length() > magnitude) {

            let currMagnitude = forceVector.length();
            let s = magnitude / currMagnitude;
            forceVector.x = forceVector.x * s;
            forceVector.y = forceVector.y * s;

        }
        return forceVector;
    }

    setMagnitude(forceVector, magnitude) {

        let currMagnitude = forceVector.length();
        let s = magnitude / currMagnitude;
        forceVector.x = forceVector.x * s;
        forceVector.y = forceVector.y * s;
        

        return forceVector;
    }

    drawRandomBlob(x, y, radius, color) {
        const numVertices = Math.floor(Math.random() * 8) + 3; // random number of vertices between 3 and 10
        const angleIncrement = (2 * Math.PI) / numVertices; // angle increment for each vertex
        const angleOffset = Math.random() * 2 * Math.PI; // random starting angle
        ctx.beginPath();
        ctx.moveTo(
          x + radius * Math.cos(angleOffset),
          y + radius * Math.sin(angleOffset)
        );
        for (let i = 1; i <= numVertices; i++) {
          const angle = angleOffset + i * angleIncrement + Math.random() * angleIncrement - angleIncrement / 2; // random angle with some deviation from regular polygon
          const distance = radius + Math.random() * radius / 2 - radius / 4; // random distance from center with some deviation
          const vertexX = x + distance * Math.cos(angle);
          const vertexY = y + distance * Math.sin(angle);
          ctx.lineTo(vertexX, vertexY);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }

      getSpecies() {
        if (this.radius<2.5) {
            return "tiny";
        }
        else if (this.radius < 5) {
            return "small";
        }
        else if (this.radius < 12) {
            return "medium";
        }
        else {
            return "large";
        }
      }


}