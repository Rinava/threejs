import * as THREE from 'three';
import * as dat from 'lil-gui';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const textureLoader = new THREE.TextureLoader();

const textures = {
  floor: {
    color: textureLoader.load(
      'Textures/Floor/Stylized_Stone_Floor_005_basecolor.jpg'
    ),
    normal: textureLoader.load(
      'Textures/Floor/Stylized_Stone_Floor_005_normal.jpg'
    ),
    roughness: textureLoader.load(
      'Textures/Floor/Stylized_Stone_Floor_005_roughness.jpg'
    ),
    height: textureLoader.load(
      'Textures/Floor/Stylized_Stone_Floor_005_height.png'
    ),
    ao: textureLoader.load(
      'Textures/Floor/Stylized_Stone_Floor_005_ambientOcclusion.jpg'
    ),
  },
};

Object.keys(textures.floor).forEach((key) => {
  textures.floor[key].wrapS = THREE.RepeatWrapping;
  textures.floor[key].wrapT = THREE.RepeatWrapping;
  textures.floor[key].repeat.set(15, 15);
});

let camera, scene, renderer, controls;

const objects = [];

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
const happyFeet = 30;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();
// setInterval(changeBoxes, 100);
const axesHelper = new THREE.AxesHelper( 1000 );
scene.add( axesHelper );
const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();

function createBox(position) {
  const randomColor = new THREE.Color(Math.random() * 0xffffff);
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: randomColor,
  });

  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.copy(position);

  scene.add(box);
  objects.push(box);
}
function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}

function normalDistributionBoxes() {

for (let i = 0; i < 1000; i++) {
  const xAxis = randn_bm(-200,200,2);
  const yAxis = randn_bm(1,1000,2);
  const zAxis = randn_bm(-400,400,2);
  const position = new THREE.Vector3(
    xAxis,
    yAxis,
    zAxis
  );
  createBox(position);

}}


// normalDistributionBoxes();

function rabbitDistributionBoxes() {
  const numRows = 22; // Number of rows in the triangle
  const rowOffset = 15; // Distance between rows
  const boxOffset = 20; // Distance between boxes

  for (let row = 0; row < numRows; row++) {
    const numBoxesInRow = numRows - row;
    const rowStartOffset = (-(numBoxesInRow - 1) * boxOffset) / 2;
    console.log (rowStartOffset);

    for (let i = 0; i < numBoxesInRow; i++) {
      const xAxis = rowStartOffset + i * boxOffset;
      const yAxis = rowOffset * row + 20 * Math.sin(xAxis / 20) + 20 * Math.cos(xAxis / 20);
      console.log(yAxis)
      const zAxis = 70* Math.sin(xAxis / 20) + 20 * Math.cos(yAxis / 20)
      const position = new THREE.Vector3(
        xAxis,
        yAxis,
        zAxis
      );
      createBox(position);
    }
  }
}

rabbitDistributionBoxes();
function stairsDistributionBoxes() {
  const numRows = 5; // Number of rows in the pyramid
  const rowOffset = 20; // Distance between rows
  const boxOffset = 20; // Distance between boxes

  for (let row = 0; row < numRows; row++) {
    const numBoxesInRow = numRows - row;
    const rowStartOffset = (-(numBoxesInRow - 1) * boxOffset) / 2;

    for (let i = 0; i < numBoxesInRow; i++) {
      const position = new THREE.Vector3(
        rowStartOffset + i * boxOffset,
        row * rowOffset,
        (-(numRows - 1) * boxOffset) / 2 + row * boxOffset
      );
      createBox(position);
    }
  }
}

// stairsDistributionBoxes();

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    900
  );
  camera.position.y = 35;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const ligh2 = new THREE.AmbientLight(0xfffeee, 0.1);
  scene.add(ligh2);

  controls = new PointerLockControls(camera, document.body);

  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');

  instructions.addEventListener('click', function () {
    controls.lock();
  });

  controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
  });

  scene.add(controls.getObject());

  const onKeyDown = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // floor

  let floorGeometry = new THREE.PlaneGeometry(1000, 1000, 2500, 2500);
  floorGeometry.rotateX(-Math.PI / 2);

  let position = floorGeometry.attributes.position;
  position = floorGeometry.attributes.position;

  const floorMaterial = new THREE.MeshStandardMaterial({
    roughness: 1.0,
    metalness: 0.0,
    map: textures.floor.color,
    normalMap: textures.floor.normal,
    roughnessMap: textures.floor.roughness,
    aoMap: textures.floor.ao,
    displacementMap: textures.floor.height,
    displacementScale: 2,
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);

  const cubeMap = new THREE.CubeTextureLoader()
    .setPath('cubeMap/')
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
  scene.background = cubeMap;

  scene.environment = cubeMap;

  /**
    Debug */

  const gui = new dat.GUI();

  const floorDebug = gui.addFolder('floor');
  floorDebug.add(floorMaterial, 'wireframe');
  floorDebug.add(floorMaterial, 'wireframeLinewidth', 0, 10);
  floorDebug.add(floorMaterial, 'metalness', 0, 1);
  floorDebug.add(floorMaterial, 'roughness', 0, 1);
  floorDebug.add(floorMaterial, 'aoMapIntensity', 0, 1);
  floorDebug.add(floorMaterial, 'displacementScale', 0, 1);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
function deleteRandom() {
  const random = Math.floor(Math.random() * objects.length);
  scene.remove(objects[random]);
  objects.splice(random, 1);
}

function changeBoxes() {
  deleteRandom();
  createBox();
}

function animate() {
  renderer.setAnimationLoop(() => {
    const time = performance.now();

    if (controls.isLocked) {
      const { position } = controls.getObject();
      raycaster.ray.origin
        .copy(position)
        .addScaledVector(direction, -happyFeet);

      const intersections = raycaster.intersectObjects(objects, false);
      const onObject = intersections.length > 0;

      const delta = (time - prevTime) / 1000;
      const deltaVelocity = delta * 2.0;
      const deltaMove = delta * 400.0;

      velocity.x -= velocity.x * deltaVelocity;
      velocity.z -= velocity.z * deltaVelocity;
      velocity.y -= 9.8 * 100.0 * delta;

      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize();

      if (moveForward || moveBackward) velocity.z -= direction.z * deltaMove;
      if (moveLeft || moveRight) velocity.x -= direction.x * deltaMove;

      // if (onObject) {
      //   velocity.y = Math.max(0, velocity.y);
      //   canJump = true;
      // }

      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);

      position.y += velocity.y * delta;

      if (position.y < happyFeet) {
        velocity.y = 0;
        position.y = happyFeet;
        canJump = true;
      }
    }

    prevTime = time;
    renderer.render(scene, camera);
  });
}
