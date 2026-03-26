// Three.js Animated Tech Network with colorful glowing nodes
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

let particleCount = 200;
let maxDistance = 30;
let positions = new Float32Array(particleCount * 3);
let velocities = [];
let colors = [];

for(let i=0;i<particleCount;i++){
    positions[i*3] = (Math.random()-0.5)*120;
    positions[i*3+1] = (Math.random()-0.5)*120;
    positions[i*3+2] = (Math.random()-0.5)*120;
    velocities.push([(Math.random()-0.5)*0.2,(Math.random()-0.5)*0.2,(Math.random()-0.5)*0.2]);
    colors.push(Math.random(),Math.random(),Math.random());
}

let geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));

let material = new THREE.PointsMaterial({ vertexColors:true, size:1.5, transparent:true, opacity:0.9 });
let particles = new THREE.Points(geometry, material);
scene.add(particles);

let lineMat = new THREE.LineBasicMaterial({ color:0xffffff, transparent:true, opacity:0.15 });
let lineGeom = new THREE.BufferGeometry();
let maxLines = particleCount * particleCount * 3 *2;
let linePositions = new Float32Array(maxLines);
let lineMesh = new THREE.LineSegments(lineGeom, lineMat);
scene.add(lineMesh);

let mouse = new THREE.Vector2(9999,9999);
window.addEventListener('mousemove',(e)=>{
    mouse.x = (e.clientX/window.innerWidth)*2-1;
    mouse.y = -(e.clientY/window.innerHeight)*2+1;
});

camera.position.z = 90;

function animate(){
    requestAnimationFrame(animate);
    let posArray = particles.geometry.attributes.position.array;
    let lineIndex=0;
    for(let i=0;i<particleCount;i++){
        let idx = i*3;
        posArray[idx]+=velocities[i][0];
        posArray[idx+1]+=velocities[i][1];
        posArray[idx+2]+=velocities[i][2];

        // Bounce
        for(let j=0;j<3;j++){ if(Math.abs(posArray[idx+j])>60) velocities[i][j]*=-1; }

        // Mouse repulsion
        let mx = mouse.x*60;
        let my = mouse.y*60;
        let dx = posArray[idx]-mx;
        let dy = posArray[idx+1]-my;
        let dist = Math.sqrt(dx*dx+dy*dy);
        if(dist<15){ velocities[i][0]+=dx*0.002; velocities[i][1]+=dy*0.002; }

        // Connect lines
        for(let j=i+1;j<particleCount;j++){
            let jdx = j*3;
            let dx2 = posArray[idx]-posArray[jdx];
            let dy2 = posArray[idx+1]-posArray[jdx+1];
            let dz2 = posArray[idx+2]-posArray[jdx+2];
            let d = Math.sqrt(dx2*dx2+dy2*dy2+dz2*dz2);
            if(d<maxDistance){
                linePositions[lineIndex++]=posArray[idx];
                linePositions[lineIndex++]=posArray[idx+1];
                linePositions[lineIndex++]=posArray[idx+2];

                linePositions[lineIndex++]=posArray[jdx];
                linePositions[lineIndex++]=posArray[jdx+1];
                linePositions[lineIndex++]=posArray[jdx+2];
            }
        }
    }

    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0,lineIndex),3));
    lineGeom.computeBoundingSphere();
    particles.geometry.attributes.position.needsUpdate=true;

    particles.rotation.y+=0.0005;
    particles.rotation.x+=0.0002;

    renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
});
