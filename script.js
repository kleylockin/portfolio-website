// Three.js particle background
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

let particles = new THREE.BufferGeometry();
let particleCount = 1500;
let positions = [];

for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() - 0.5) * 150);
    positions.push((Math.random() - 0.5) * 150);
    positions.push((Math.random() - 0.5) * 150);
}

particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

let particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffcc,
    size: 0.3
});

let particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

camera.position.z = 70;

function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.002;
    particleSystem.rotation.x += 0.001;
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
