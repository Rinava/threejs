const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 2, 2);
//  size 1 1 1 (x,y,z)
const material = new THREE.MeshBasicMaterial({ color: 'blue' ,  wireframe: true });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height );

// 75 is angle of view and 800/600 is aspect ratio
camera.position.z = 5;
camera.position.x = 2;
camera.position.y = -1;
camera.rotation.z = 0.1;
scene.add(camera);

// renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
