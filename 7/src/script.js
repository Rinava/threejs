import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Cursor */
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
  //divided by sizes.width and sizes.height to get a value between -0.5 and 0.5
  console.log(cursor.x, cursor.y);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera (OrthographicCamera)

// const aspectRatio = sizes.width / sizes.height;
// // we need it because we need to keep the aspect ratio of the camera the same as the aspect ratio of the canvas

// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// ); // left, right, top, bottom, near, far


// Camera (PerspectiveCamera)

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
// dont put near and far too extreme because it will cause z-fighting (when two objects are too close to each other

camera.position.z = 2.5;
camera.lookAt(mesh.position);
scene.add(camera);

// Controls

const controls = new OrbitControls(camera, canvas);
// enables drag and drop of the camera , zoom in and out, rotate around the object

controls.enableDamping = true;
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
//   mesh.rotation.y = elapsedTime;

  // Update camera without controls

  //   camera.position.x = Math.sin(cursor.x * 2 * Math.PI) * 3; //   2* PI because its a full circle
  //   camera.position.z = Math.cos(cursor.x * Math.PI) * 3;
  //   camera.position.y = cursor.y * 5;
  //   camera.lookAt(mesh.position);

    // Update controls
    controls.update(); // if we use damping we need to update the controls because it looks bad if we dont


  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
