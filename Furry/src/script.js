import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as dat from 'lil-gui';
const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture = textureLoader.load('/Textures/Fur/Stylized_Fur_002_basecolor.jpg');
const heightTexture = textureLoader.load('/Textures/Fur/Stylized_Fur_002_height.png');
const normalTexture = textureLoader.load('/Textures/Fur/Stylized_Fur_002_normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/Textures/Fur/Stylized_Fur_002_ambientOcclusion.jpg');
const roughnessTexture = textureLoader.load('/Textures/Fur/Stylized_Fur_002_roughness.jpg');
const textures = [colorTexture, heightTexture, normalTexture, ambientOcclusionTexture, roughnessTexture];

for (let texture of textures) {
  texture.repeat.x = 5;
  texture.repeat.y = 5;
   texture.wrapS = THREE.RepeatWrapping;
   texture.wrapT = THREE.RepeatWrapping;
}



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Object
 */
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    roughnessMap: roughnessTexture,
    normalMap: normalTexture,
    aoMap: ambientOcclusionTexture,
    displacementMap: heightTexture,
    displacementScale: 0.03,

    transparent: true,
    
});

/**
 * Light 
 *  */


const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const light1 = new THREE.PointLight(0xffffee, 50);
light1.position.set(2, 2, 2);
scene.add(light1);



const body = new THREE.Mesh(geometry, material);
body.scale.y = 0.42;
body.scale.x = -0.39;
body.scale.z = 0.94;

scene.add(body);

const head = new THREE.Mesh(geometry, material);
head.position.y = 0.5;
head.position.x = 0.2
head.position.z = 0.2
head.scale.set(0.2, 0.2, 0.2);

scene.add(head);

body.castShadow = true;
head.castShadow = true;
body.receiveShadow = true;
head.receiveShadow = true;

light1.castShadow = true;
light1.shadow.mapSize.width = 128;
light1.shadow.mapSize.height = 128;


// Debug

// gui.add(body.position, 'y', -3, 3, 0.01);
// or we could write it like this
// gui.add(body.position, 'y').min(-3).max(3).step(0.01);

const parameters = {
    spin: () => {
        gsap.to(body.rotation, { duration: 1, y: body.rotation.y + Math.PI * 2 })
    }
}
gui.add(body, 'visible');
gui.add(material, 'wireframe');
gui.addColor(material, 'color');
gui.add(parameters, 'spin'); // the property name should match the function name

// we can also add a folder

const position = gui.addFolder('Position');
position.add(body.position, 'y').min(-3).max(3).step(0.01);
position.add(body.position, 'x').min(-3).max(3).step(0.01);
position.add(body.position, 'z').min(-3).max(3).step(0.01);

const scale = gui.addFolder('Scale');
scale.add(body.scale, 'y').min(-3).max(3).step(0.01);
scale.add(body.scale, 'x').min(-3).max(3).step(0.01);
scale.add(body.scale, 'z').min(-3).max(3).step(0.01);

const rotation = gui.addFolder('Rotation');
rotation.add(body.rotation, 'y').min(-3).max(3).step(0.01);
rotation.add(body.rotation, 'x').min(-3).max(3).step(0.01);
rotation.add(body.rotation, 'z').min(-3).max(3).step(0.01);

const light = gui.addFolder('Light');
light.add(light1.position, 'y').min(-3).max(3).step(0.01);
light.add(light1.position, 'x').min(-3).max(3).step(0.01);
light.add(light1.position, 'z').min(-3).max(3).step(0.01);

const materialDebug = gui.addFolder('Material');
materialDebug.add(material, 'metalness').min(0).max(1).step(0.01);
materialDebug.add(material, 'roughness').min(0).max(1).step(0.01);
materialDebug.add(material, 'aoMapIntensity').min(0).max(1).step(0.01);
materialDebug.add(material, 'displacementScale').min(0).max(1).step(0.01);


/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();


  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
