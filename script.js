// Three.js Professional Tech Network Background
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

let particleCount = 200;
let maxDistance = 25;
let particles = [];
let particleGeometry = new THREE.BufferGeometry();
let positions = new Float32Array(particleCount * 3);

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 120;
    particles.push({ 
        velocity: [(Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2]
    });
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
let particleMaterial = new THREE.PointsMaterial({ color: 0x0077cc, size: 1.2 });
let particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

// Line system
let lineMaterial = new THREE.LineBasicMaterial({ color: 0x0077cc, transparent: true, opacity: 0.2 });
let lineGeometry = new THREE.BufferGeometry();
let linePositions = new Float32Array(particleCount * particleCount * 3 * 2);
let lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lineMesh);

// Mouse
let mouse = new THREE.Vector2(9999, 9999);
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Camera
camera.position.z = 80;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    let positionsArray = particleSystem.geometry.attributes.position.array;
    let lineIndex = 0;

    for (let i = 0; i < particleCount; i++) {
        let idx = i*3;

        // Move particles
        positionsArray[idx] += particles[i].velocity[0];
        positionsArray[idx+1] += particles[i].velocity[1];
        positionsArray[idx+2] += particles[i].velocity[2];

        // Bounce back if out of bounds
        for (let j = 0; j < 3; j++) {
            if (Math.abs(positionsArray[idx+j]) > 60) particles[i].velocity[j] *= -1;
        }

        // Mouse repulsion
        let mx = mouse.x*60;
        let my = mouse.y*60;
        let dx = positionsArray[idx] - mx;
        let dy = positionsArray[idx+1] - my;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 15){
            particles[i].velocity[0] += dx*0.002;
            particles[i].velocity[1] += dy*0.002;
        }

        // Lines between close particles
        for(let j=i+1;j<particleCount;j++){
            let jdx = j*3;
            let dx2 = positionsArray[idx] - positionsArray[jdx];
            let dy2 = positionsArray[idx+1] - positionsArray[jdx+1];
            let dz2 = positionsArray[idx+2] - positionsArray[jdx+2];
            let d = Math.sqrt(dx2*dx2 + dy2*dy2 + dz2*dz2);
            if(d < maxDistance){
                linePositions[lineIndex++] = positionsArray[idx];
                linePositions[lineIndex++] = positionsArray[idx+1];
                linePositions[lineIndex++] = positionsArray[idx+2];

                linePositions[lineIndex++] = positionsArray[jdx];
                linePositions[lineIndex++] = positionsArray[jdx+1];
                linePositions[lineIndex++] = positionsArray[jdx+2];
            }
        }
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0,lineIndex), 3));
    lineGeometry.computeBoundingSphere();
    particleSystem.geometry.attributes.position.needsUpdate = true;

    // Slow rotation
    particleSystem.rotation.y += 0.0005;
    particleSystem.rotation.x += 0.0002;

    renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
