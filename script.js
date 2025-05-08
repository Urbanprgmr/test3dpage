// Basic Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a ground plane
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

// Function to create a building
function createBuilding(width, height, depth, color, position, link) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(position.x, position.y + height / 2, position.z);
    building.userData = { link: link }; // Store the link in userData
    scene.add(building);
    return building;
}

// Create some buildings
const buildings = [];
buildings.push(createBuilding(3, 6, 3, 0xff0000, { x: -10, y: 0, z: 0 }, "https://www.example.com/building1"));
buildings.push(createBuilding(4, 8, 4, 0x00ff00, { x: 0, y: 0, z: 0 }, "https://www.example.com/building2"));
buildings.push(createBuilding(3.5, 7, 3.5, 0x0000ff, { x: 10, y: 0, z: 0 }, "https://www.example.com/building3"));

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Camera position
camera.position.set(0, 15, 25);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Basic animation (e.g., rotate the scene slightly)
    // scene.rotation.y += 0.005;

    renderer.render(scene, camera);
}
animate();

// Raycasting for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(buildings);

    if (intersects.length > 0) {
        // The first intersected object is the one closest to the camera
        const clickedBuilding = intersects[0].object;
        const link = clickedBuilding.userData.link;
        if (link) {
            window.open(link, '_blank'); // Open the link in a new tab
        }
    }
}

window.addEventListener('click', onMouseClick, false);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
