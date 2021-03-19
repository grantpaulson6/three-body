import * as THREE from 'three';
import * as dat from 'dat.gui';

const gui = new dat.GUI({
  name: 'Cool Hack Day',
});

const settings = {
  force: 1000,
  zoom: 20
}
gui.add(settings, 'force', 0, 10000);
gui.add(settings, 'zoom', 0, 100);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 100;

// spheres
const sphere_information = [
  {
    v: { x: 0, y: 0, z: 0 },
    position: { x: -10, y: 0, z: 20 },
    color: 0x00ff00
  },
  {
    v: { x: 0, y: 0, z: 0 },
    position: { x: 35, y: -15, z: 0},
    color: 0xDF870F
  },
  {
    v: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 40, z: -20},
    color: 0x0F12DF
  }
]

let r = 2;
let sphereGeometry = new THREE.SphereGeometry(r);

const spheres = []
for (let i = 0; i < sphere_information.length; i++) {
  const cur_sphere_info = sphere_information[i]
  const {v, position, color} = cur_sphere_info
  const {x, y, z} = position

  let sphereMaterial = new THREE.MeshBasicMaterial({ color });
  let sphere_mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  let sphere = { ref: sphere_mesh, v };
  sphere_mesh.position.x = x
  sphere_mesh.position.y = y
  sphere_mesh.position.z = z
  spheres.push(sphere)
  scene.add(sphere.ref)
}

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

// lines
const NUM_SPHERES = sphere_information.length
const list_of_points = []
const list_of_buffer_geometry = []
const list_of_lineMaterial = []
const lines = []

for (let i = 0; i < NUM_SPHERES; i++) {
  list_of_points.push([])
  list_of_buffer_geometry.push(new THREE.BufferGeometry().setFromPoints(list_of_points[i]));
  list_of_lineMaterial.push(new THREE.LineBasicMaterial({color: sphere_information[i].color}));
  lines.push(new THREE.Line(list_of_buffer_geometry[i], list_of_lineMaterial[i]));
}

// functions
function gravity(arr) {
  arr.forEach((sphereA, i) => {
    arr.slice(i + 1).forEach((sphereB) => {
      dx = (sphereA.ref.position.x - sphereB.ref.position.x);
      dy = (sphereA.ref.position.y - sphereB.ref.position.y);
      dz = (sphereA.ref.position.z - sphereB.ref.position.z);
      d = (dx ** 2 + dy ** 2 + dz ** 2) ** (0.5);
      dv = dt * settings.force / d ** 0.5;

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

const starQty = 1000;
const geo1 = new THREE.SphereGeometry(0.1);
const mat1 = new THREE.MeshBasicMaterial( { color: 0xffffff } );

for (let i = 0; i < starQty; i++) {
  let star = new THREE.Mesh( geo1, mat1 );
  star.position.x = Math.random() * 200 - 100;
  star.position.y = Math.random() * 200 - 100;
  star.position.z = Math.random() * 200 - 100;
  scene.add( star );
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
  cube.position.x = (Math.cos(t));
  cube.position.y = Math.sin(t);
  for (let i = 0; i < NUM_SPHERES; i++) {
    scene.add(lines[i])
  }
  renderer.render(scene, camera);
  camera.setFocalLength(settings.zoom)
  t += dt;
  gravity(spheres);

  if (list_of_points.length > 0 && list_of_points[0].length > 1000) {
    list_of_points.forEach(arr => {
      arr.shift()
    })
  }

  spheres.forEach((s) => {
    s.ref.position.x += (s.v.x * dt);
    s.ref.position.y += (s.v.y * dt);
    s.ref.position.z += (s.v.z * dt);
  })

  for (let i = 0; i < NUM_SPHERES; i++) {
    list_of_points[i].push(new THREE.Vector3(spheres[i].ref.position.x, spheres[i].ref.position.y, spheres[i].ref.position.z));
    list_of_buffer_geometry[i].setFromPoints(list_of_points[i])
    const lineMaterial = list_of_lineMaterial[i];
    lines[i] = new THREE.Line(list_of_buffer_geometry[i], lineMaterial)
  }
}
animate();