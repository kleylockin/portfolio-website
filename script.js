// Professional 3D tech network background with mouse interaction
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

let particleCount = 250;
let positions = [];
let velocities = [];
let particles = new THREE.BufferGeometry();

for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() - 0.5) * 120);
    positions.push((Math.random() - 0.5) * 120);
    positions.push((Math.random() - 0.5) * 120);
    velocities.push([(Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02, (Math.random()-0.5)*0.02]);
}

particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

let particleMaterial = new THREE.PointsMaterial({ 
    color: 0x0077cc, 
    size: 1.2, 
    transparent: true, 
    opacity: 0.9 
});
let particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// Line geometry
let maxDistance = 20;
let lineMaterial = new THREE.LineBasicMaterial({ color: 0x0077cc, transparent: true, opacity: 0.2 });
let linePositions = new Float32Array(particleCount * particleCount * 3 * 2);
let lineGeometry = new THREE.BufferGeometry();
let lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lineMesh);

// Mouse interaction
let mouse = new THREE.Vector2(9999, 9999);
window.addEventListener('mousemove', (e)=>{
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Camera
camera.position.z = 80;

function animate() {
    requestAnimationFrame(animate);

    let positionsArray = particleSystem.geometry.attributes.position.array;
    let lineIndex = 0;

    // Move particles
    for (let i = 0; i < particleCount; i++) {
        let idx = i*3;
        positionsArray[idx] += velocities[i][0];
        positionsArray[idx+1] += velocities[i][1];
        positionsArray[idx+2] += velocities[i][2];

        // Bounce back
        for(let j=0;j<3;j++){
            if(Math.abs(positionsArray[idx+j])>60) velocities[i][j]*=-1;
        }

        // Mouse repel effect
        let mx = mouse.x*60;
        let my = mouse.y*60;
        let dx = positionsArray[idx] - mx;
        let dy = positionsArray[idx+1] - my;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if(dist<15){
            velocities[i][0] += dx*0.001;
            velocities[i][1] += dy*0.001;
        }

        // Connect lines
        for(let j=i+1;j<particleCount;j++){
            let jdx = j*3;
            let dx2 = positionsArray[idx] - positionsArray[jdx];
            let dy2 = positionsArray[idx+1] - positionsArray[jdx+1];
            let dz2 = positionsArray[idx+2] - positionsArray[jdx+2];
            let d = Math.sqrt(dx2*dx2 + dy2*dy2 + dz2*dz2);
            if(d<maxDistance){
                linePositions[lineIndex++] = positionsArray[idx];
                linePositions[lineIndex++] = positionsArray[idx+1];
                linePositions[lineIndex++] = positionsArray[idx+2];

                linePositions[lineIndex++] = positionsArray[jdx];
                linePositions[lineIndex++] = positionsArray[jdx+1];
                linePositions[lineIndex++] = positionsArray[jdx+2];
            }
        }
    }

    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0,lineIndex),3));
    lineGeometry.computeBoundingSphere();
    particleSystem.geometry.attributes.position.needsUpdate = true;

    particleSystem.rotation.y += 0.0005; // slow rotation
    particleSystem.rotation.x += 0.0002;

    renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
