import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import * as dat from 'lil-gui';

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
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Debug

// gui.add(mesh.position, 'y', -3, 3, 0.01);
// or we could write it like this
// gui.add(mesh.position, 'y').min(-3).max(3).step(0.01);

const parameters = {
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    }
}
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
gui.addColor(material, 'color');
gui.add(parameters, 'spin'); // the property name should match the function name

// we can also add a folder
const position = gui.addFolder('Position');
position.add(mesh.position, 'y').min(-3).max(3).step(0.01);
position.add(mesh.position, 'x').min(-3).max(3).step(0.01);
position.add(mesh.position, 'z').min(-3).max(3).step(0.01);

const scale = gui.addFolder('Scale');
scale.add(mesh.scale, 'y').min(-3).max(3).step(0.01);
scale.add(mesh.scale, 'x').min(-3).max(3).step(0.01);
scale.add(mesh.scale, 'z').min(-3).max(3).step(0.01);

const rotation = gui.addFolder('Rotation');
rotation.add(mesh.rotation, 'y').min(-3).max(3).step(0.01);
rotation.add(mesh.rotation, 'x').min(-3).max(3).step(0.01);
rotation.add(mesh.rotation, 'z').min(-3).max(3).step(0.01);


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
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
