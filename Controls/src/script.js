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
  textures.floor[key].repeat.set(15,15);

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
const color = new THREE.Color();

init();
animate();

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

  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  const ligh2 = new THREE.AmbientLight(0xFFFeee, 0.5);
  scene.add(ligh2);
  
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

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
  .load([
    'px.png',
    'nx.png',
    'py.png',
    'ny.png',
    'pz.png',
    'nz.png',
  ]);
  scene.background = cubeMap;

  scene.environment = cubeMap;
// Debug

const gui = new dat.GUI();

const floorDebug = gui.addFolder('floor');
floorDebug.add(floorMaterial, 'wireframe');
floorDebug.add(floorMaterial, 'wireframeLinewidth', 0, 10);
floorDebug.add(floorMaterial, 'metalness', 0, 1);
floorDebug.add(floorMaterial, 'roughness', 0, 1);
floorDebug.add(floorMaterial, 'aoMapIntensity', 0, 1);
floorDebug.add(floorMaterial, 'displacementScale', 0, 1);



  // objects

  const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();

  position = boxGeometry.attributes.position;
  const colorsBox = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(
      Math.random() * 0.3 + 0.5,
      0.75,
      Math.random() * 0.25 + 0.75,
      THREE.SRGBColorSpace
    );
    colorsBox.push(color.r, color.g, color.b);
  }

  boxGeometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colorsBox, 3)
  );

  for (let i = 0; i < 500; i++) {
    const boxMaterial = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      flatShading: true,
      vertexColors: true,
    });
    boxMaterial.color.setHSL(
      Math.random() * 0.2 + 0.5,
      0.75,
      Math.random() * 0.25 + 0.75,
      THREE.SRGBColorSpace
    );

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
    box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

    scene.add(box);
    objects.push(box);
  }

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  window.addEventListener('resize', onWindowResize);
}





function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= happyFeet;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 2.0 * delta;
    velocity.z -= velocity.z * 2.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < happyFeet) {
      velocity.y = 0;
      controls.getObject().position.y = happyFeet ;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}
