import * as THREE from 'three';
import gsap from 'gsap';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
// Animations with GSAP
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });

gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

const tick = () => {
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Without GSAP
// const clock = new THREE.Clock();
// // Animations
// const tick = () => {
//   // Update objects

//   mesh.rotation.x = clock.getElapsedTime() * Math.PI * 2;
//   mesh.position.y = Math.sin(clock.getElapsedTime());
//   mesh.position.x = Math.cos(clock.getElapsedTime());
//   mesh.position.z = Math.tan(clock.getElapsedTime()*0.2 );

//   camera.lookAt(mesh.position);
//   // Render
//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };

// tick();
