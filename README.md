# PetriDishSimulation
Craig Reynolds' Boids algorithm is a well-known artificial life simulation that models flocking behavior in groups of agents, like birds, fish, or even crowds. Introduced in 1986, it uses three simple rules to create complex emergent behavior:


### 1. Separation (Avoid Crowding)
Each boid steers away from its nearby neighbors to prevent collisions.

### 2. Alignment (Match Velocity)
Each boid aligns its direction and speed with the average velocity of nearby boids.

### 3. Cohesion (Stay Close)
Each boid moves toward the center of mass of nearby boids to stay part of the group.

The toolbar provides access to adjust these crowding/avoidant behaviors evenly among boids and/or boid type.
Discrimination voids the separation behavior between boids of similar color. 

### Emergent Behavior
Despite the simplicity of these rules, the collective behavior that emerges mimics real-world flocking, where boids can:

- Form clusters
- Maintain fluid motion
- Avoid obstacles
- Dynamically to changes in their environment
