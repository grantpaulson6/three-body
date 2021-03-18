import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 50;

// const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// const points = [];
// points.push( new THREE.Vector3( - 1, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 1, 0 ) );
// points.push( new THREE.Vector3( 1, 0, 0 ) );
// const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
// const line = new THREE.Line( lineGeometry, lineMaterial );
// scene.add( line );

let sphereGeometry = new THREE.SphereGeometry(2);
let sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
let sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
let sphere1 = { ref: sphere, v: { x: 0, y: 0, z: 0 } };
sphere.position.z = 20;
sphere.position.x = -10;
scene.add( sphere1.ref );

sphereGeometry = new THREE.SphereGeometry(2);
sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xDF870F } );
sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.x = 35;
sphere.position.y = -15;
let sphere2 = { ref: sphere, v: { x: 0, y: 0, z: 0 } };
scene.add( sphere2.ref );

sphereGeometry = new THREE.SphereGeometry(2);
sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x0F12DF } );
sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.y = 40;
sphere.position.z = -20;
let sphere3 = { ref: sphere, v: { x: 0, y: 0, z: 0 } };
scene.add( sphere3.ref );

let t = 0;
let dt = 0.01;
let dvx;
let dvy;
let dvz;
let dx;
let dy;
let dz;
let d;
let dv;
let spheres = [sphere1, sphere2, sphere3];
let g = 1000;

function gravity(arr) {
  arr.forEach((sphereA, i) => {
    arr.slice(i + 1).forEach((sphereB) => {
      dx = (sphereA.ref.position.x - sphereB.ref.position.x);
      dy = (sphereA.ref.position.y - sphereB.ref.position.y);
      dz = (sphereA.ref.position.z - sphereB.ref.position.z) ;
      d = (dx ** 2 + dy ** 2 + dz ** 2) ** (0.5);
      dv = dt * g / d ** 0.5;

      dvx = dv * dx / d;
      dvy = dv * dy / d;
      dvz = dv * dz / d;

      sphereA.v.x -= dvx;
      sphereB.v.x += dvx;
      sphereA.v.y -= dvy;
      sphereB.v.y += dvy;
      sphereA.v.z -= dvz;
      sphereB.v.z += dvz;
    });
  })

  if (arr.length > 2) gravity(arr.slice(1));
}


// const stars = [];
// let material;

// create the particle variables
var particleCount = 1800,
  particles = new THREE.Geometry(),
  pMaterial = new THREE.ParticleBasicMaterial({
    color: 0xFFFFFF,
    size: 20
  });

// now create the individual particles
for (var p = 0; p < particleCount; p++) {

  // create a particle with random
  // position values, -250 -> 250
  var pX = Math.random() * 500 - 250,
    pY = Math.random() * 500 - 250,
    pZ = Math.random() * 500 - 250,
    particle = new THREE.Vertex(
      new THREE.Vector3(pX, pY, pZ)
    );

  // add it to the geometry
  particles.vertices.push(particle);
}

// create the particle system
var particleSystem = new THREE.ParticleSystem(
  particles,
  pMaterial);

// add it to the scene
scene.addChild(particleSystem);
}






function animate() {
  requestAnimationFrame( animate );
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  cube.position.x = (Math.cos(t));
  cube.position.y = Math.sin(t);
  renderer.render( scene, camera );
  t += dt;

  gravity(spheres);

  spheres.forEach((s) => {
    s.ref.position.x += (s.v.x * dt);
    s.ref.position.y += (s.v.y * dt);
    s.ref.position.z += (s.v.z * dt);
  })

}
animate();
