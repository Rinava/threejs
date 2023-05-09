import * as THREE from 'three';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);

// position
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;
//  or we could write it as
mesh.position.set(0.7, -0.6, 1);

// scale
mesh.scale.x = 2;
mesh.scale.y = 0.5;
mesh.scale.z = 0.5;
// or write it as
mesh.scale.set(2, 0.5, 0.5);

// rotation
mesh.rotation.reorder('YXZ');
mesh.rotation.y = Math.PI * 0.9;
mesh.rotation.x = Math.PI * 0.5;
// this is Euler, we can also use quaternions, its more complex but more accurate

scene.add(mesh);
//  axes Helper to see the axes
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);


/**
 * Groups
 */
const group = new THREE.Group();
scene.add(group);
group.rotate = Math.PI * 0.25;

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.set(0.5,1,0)
group.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.set(-2,0,0)
group.add(cube3);


/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
// camera.lookAt(mesh.position); // the argument should be a Vector3

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
