// Main variables
let scene, camera, renderer, controls;
const planets = [];
const textureLoader = new THREE.TextureLoader();
let asteroidBelt;
let loadingComplete = false;
let texturesToLoad = 0;
let loadedTextures = 0;
let currentTourIndex = 0;
let isTourActive = false;
let autoRotate = true;
let isPaused = false;
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let tourTimeout = null;
let voiceEnabled = true;
let isMobile = /Mobi|Android/i.test(navigator.userAgent);

// Enhanced planet data with NASA-verified information
const planetData = [
    { 
        name:'Sol (The Sun)', 
        size:100, 
        realSize:1391400,
        texture:'textures/sun.jpg', 
        color:0xffff33,
        type: 'G-type main-sequence star (G2V)',
        diameter: '1,391,400 km (864,938 miles)',
        distance: '0 km (Center of Solar System)',
        period: 'N/A (Orbits galactic center every ~230 million years)',
        rotation: '25.05 days (equator) to 34.3 days (poles)',
        moons: 0,
        atmosphere: 'Hydrogen (73.46%), Helium (24.85%), other elements (1.69%)',
        temperature: '5,500°C (surface), 15,000,000°C (core)',
        fact: 'The Sun contains 99.86% of the solar system\'s mass. Its core fuses 620 million metric tons of hydrogen each second, converting about 4 million tons of matter to energy every second.'
    },
    { 
        name:'Mercury', 
        size:3.8, 
        realSize:4879.4,
        a:140, 
        b:138, 
        speed:4.15, 
        tilt:0.034, 
        color:0xCCCCCC, 
        texture:'textures/mercury.jpg',
        type: 'Terrestrial planet',
        diameter: '4,879.4 km (3,032 miles)',
        distance: '57.91 million km (0.39 AU) from Sun',
        period: '87.969 Earth days',
        rotation: '58.646 Earth days (tidally locked 3:2 to orbit)',
        moons: 0,
        atmosphere: 'Trace exosphere: 42% O₂, 29% Na, 22% H₂, 6% He, 0.5% K',
        temperature: '-173°C to 427°C (-280°F to 800°F)',
        fact: 'Mercury is shrinking as its core cools! The planet has contracted ~14 km in radius over 4 billion years. It has the most eccentric orbit of all planets (e=0.2056).'
    },
    { 
        name:'Venus', 
        size:9.5, 
        realSize:12103.6,
        a:200, 
        b:198, 
        speed:1.62, 
        tilt:177.36, 
        color:0xFF9933, 
        texture:'textures/venus.jpg',
        type: 'Terrestrial planet',
        diameter: '12,103.6 km (7,521 miles)',
        distance: '108.21 million km (0.723 AU) from Sun',
        period: '224.701 Earth days',
        rotation: '243.025 Earth days (retrograde)',
        moons: 0,
        atmosphere: '96.5% CO₂, 3.5% N₂ with sulfuric acid clouds',
        temperature: '462°C (864°F) average surface temperature',
        fact: 'Venus rotates backwards with a day longer than its year! Surface pressure is 92 bar (equivalent to 900 m underwater on Earth). It has the most circular orbit (e=0.0067).'
    },
    { 
        name:'Earth (Terra)', 
        size:10, 
        realSize:12756.3,
        a:260, 
        b:258, 
        speed:1, 
        tilt:23.44, 
        color:0x3366FF, 
        texture:'textures/earth.jpg',
        type: 'Terrestrial planet',
        diameter: '12,756.3 km (equatorial) (7,926 miles)',
        distance: '149.6 million km (1 AU) from Sun',
        period: '365.256 days (1 sidereal year)',
        rotation: '23h 56m 4.1s (sidereal day)',
        moons: 1,
        atmosphere: '78.08% N₂, 20.95% O₂, 0.93% Ar, 0.04% CO₂',
        temperature: '-89.2°C to 56.7°C (-128.6°F to 134°F)',
        fact: 'Earth is the only known planet with liquid water on its surface and plate tectonics. It has the highest density (5.51 g/cm³) of all terrestrial planets.'
    },
    { 
        name:'Luna (The Moon)', 
        size:2.7, 
        realSize:3474.8,
        a:30, 
        b:29, 
        speed:12, 
        parent:'Earth (Terra)', 
        color:0xAAAAAA, 
        texture:'textures/moon.jpg',
        type: 'Natural satellite',
        diameter: '3,474.8 km (2,159 miles)',
        distance: '384,400 km from Earth (center-to-center)',
        period: '27.3217 days (sidereal)',
        rotation: '27.3217 days (tidally locked)',
        moons: 0,
        atmosphere: 'Trace exosphere: He, Ar, Na, K, H, Rn',
        temperature: '-173°C to 127°C (-279°F to 261°F)',
        fact: 'The Moon is receding at 3.8 cm/year. Its near side crust is thinner (30 km) than the far side (50 km). Moonquakes occur up to 7 km depth.'
    },
    { 
        name:'Mars', 
        size:5.3, 
        realSize:6779,
        a:320, 
        b:315, 
        speed:0.53, 
        tilt:25.19, 
        color:0xFF3300, 
        texture:'textures/mars.jpg',
        type: 'Terrestrial planet',
        diameter: '6,779 km (4,212 miles)',
        distance: '227.9 million km (1.52 AU) from Sun',
        period: '686.98 Earth days',
        rotation: '24h 37m 22.6s',
        moons: 2,
        atmosphere: '95.97% CO₂, 1.93% Ar, 1.89% N₂, 0.146% O₂',
        temperature: '-140°C to 20°C (-220°F to 68°F)',
        fact: 'Home to Olympus Mons (21.9 km tall, 600 km wide) and Valles Marineris (4,000 km long, up to 7 km deep). Polar caps contain water ice and dry ice.'
    },
    { 
        name:'Jupiter', 
        size:56.5, 
        realSize:142984,
        a:420, 
        b:415, 
        speed:0.084, 
        tilt:3.13, 
        color:0xFFCC99, 
        texture:'textures/jupiter.jpg',
        type: 'Gas giant',
        diameter: '142,984 km (equatorial) (88,846 miles)',
        distance: '778.3 million km (5.2 AU) from Sun',
        period: '4,332.59 Earth days (11.86 years)',
        rotation: '9h 55m 30s (fastest rotating planet)',
        moons: 79,
        atmosphere: '89.8±2.0% H₂, 10.2±2.0% He, 0.3% CH₄, 0.026% NH₃',
        temperature: '-145°C at 1 bar level (-234°F)',
        fact: 'The Great Red Spot has existed for at least 356 years (since 1665). Jupiter emits more heat than it receives from the Sun (internal heat source). Its magnetic field is 14 times stronger than Earth\'s.'
    },
    { 
        name:'Saturn', 
        size:47.5, 
        realSize:120536,
        a:520, 
        b:515, 
        speed:0.034, 
        tilt:26.73, 
        ring:true, 
        color:0xFFFF99, 
        texture:'textures/saturn.jpg', 
        ringTexture:'textures/saturn_rings.png',
        type: 'Gas giant',
        diameter: '120,536 km (equatorial) (74,898 miles)',
        distance: '1.429 billion km (9.58 AU) from Sun',
        period: '10,759.22 Earth days (29.4571 years)',
        rotation: '10h 33m 38s + 25m (complex rotation)',
        moons: 82,
        atmosphere: '96.3% H₂, 3.25% He, 0.45% CH₄, 0.0125% NH₃',
        temperature: '-178°C at 1 bar level (-288°F)',
        fact: 'Saturn\'s rings are 99.9% water ice. The planet has the lowest density (0.687 g/cm³) - it would float in water! The rings extend up to 282,000 km from the planet but are only about 10 meters thick.'
    },
    { 
        name:'Uranus', 
        size:20.2, 
        realSize:51118,
        a:620, 
        b:615, 
        speed:0.011, 
        tilt:97.77, 
        color:0x99FFFF, 
        texture:'textures/uranus.jpg',
        type: 'Ice giant',
        diameter: '51,118 km (equatorial) (31,763 miles)',
        distance: '2.871 billion km (19.2 AU) from Sun',
        period: '30,688.5 Earth days (84.0205 years)',
        rotation: '17h 14m 24s (retrograde)',
        moons: 27,
        atmosphere: '82.5±3.3% H₂, 15.2±3.3% He, 2.3% CH₄',
        temperature: '-224°C (coldest planetary atmosphere) (-371°F)',
        fact: 'Uranus rotates on its side (97.77° axial tilt), possibly due to a giant impact. Its magnetic field is offset by 59° from its rotational axis and is not centered on the planet\'s core.'
    },
    { 
        name:'Neptune', 
        size:19.2, 
        realSize:49528,
        a:700, 
        b:695, 
        speed:0.006, 
        tilt:28.32, 
        color:0x3366FF, 
        texture:'textures/neptune.jpg',
        type: 'Ice giant',
        diameter: '49,528 km (equatorial) (30,775 miles)',
        distance: '4.498 billion km (30.1 AU) from Sun',
        period: '60,190 Earth days (164.8 years)',
        rotation: '16h 6m 36s',
        moons: 14,
        atmosphere: '80±3.2% H₂, 19±3.2% He, 1.5% CH₄',
        temperature: '-214°C at 1 bar level (-353°F)',
        fact: 'Neptune has the strongest winds in the solar system (2,100 km/h). It radiates 2.61 times more energy than it receives from the Sun. Its largest moon Triton orbits in the opposite direction to Neptune\'s rotation.'
    },
    { 
        name:'Pluto', 
        size:1.8, 
        realSize:2376.6,
        a:750, 
        b:745, 
        speed:0.004, 
        tilt:122.53, 
        color:0xFFCC99, 
        texture:'textures/pluto.jpg',
        type: 'Dwarf planet (Kuiper Belt Object)',
        diameter: '2,376.6 km (1,477 miles)',
        distance: '5.906 billion km (39.48 AU) from Sun (average)',
        period: '90,560 Earth days (247.94 years)',
        rotation: '6.387 Earth days (retrograde)',
        moons: 5,
        atmosphere: 'N₂ (90%), CH₄ (5%), CO (5%) when near perihelion',
        temperature: '-233°C to -223°C (-387°F to -369°F)',
        fact: 'Pluto has a heart-shaped glacier (Sputnik Planitia) of nitrogen ice. Its largest moon Charon is so massive they orbit a barycenter between them. Pluto\'s orbit is highly eccentric (e=0.2488) and inclined (17°).'
    },
    { 
        name:'Ceres', 
        size:1, 
        realSize:939.4,
        a:400, 
        b:395, 
        speed:0.3, 
        tilt:4, 
        color:0xAAAAAA, 
        texture:'textures/ceres.jpg',
        type: 'Dwarf planet (Asteroid Belt)',
        diameter: '939.4 km (584 miles)',
        distance: '414 million km (2.77 AU) from Sun',
        period: '1,680 Earth days (4.6 years)',
        rotation: '9.074 hours',
        moons: 0,
        atmosphere: 'Trace water vapor (outgassing)',
        temperature: '-105°C (average) (-157°F)',
        fact: 'Ceres contains about 25% water by mass (more than all fresh water on Earth). Bright spots in Occator crater are sodium carbonate deposits. It\'s the largest object in the asteroid belt.'
    }
];

// Initialize the scene
function init() {
    try {
        // Count textures to load for progress tracking
        planetData.forEach(data => {
            texturesToLoad++; // Main texture
            if (data.ring) texturesToLoad++; // Ring texture
        });

        // Create scene with background
        scene = new THREE.Scene();
        
        // Create camera with responsive aspect ratio
        camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 1, 100000);
        camera.position.set(0, 400, 1200);
        
        // Create renderer with responsive settings
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(renderer.domElement);
        
        // Create controls with improved parameters for touch devices
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 100;
        controls.maxDistance = 5000;
        controls.maxPolarAngle = Math.PI * 0.9;
        controls.enablePan = false;
        
        // Adjust controls for touch devices
        if (isMobile) {
            controls.touchDampingFactor = 0.1;
            controls.enableZoom = true;
            controls.screenSpacePanning = false;
        }
        
        // Add lighting with shadows
        scene.add(new THREE.AmbientLight(0x404040));
        const sunLight = new THREE.PointLight(0xffffe0, 2, 100000);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = isMobile ? 1024 : 2048;
        sunLight.shadow.mapSize.height = isMobile ? 1024 : 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 50000;
        scene.add(sunLight);
        
        // Add directional light for better planet illumination
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(1, 1, 1);
        scene.add(dirLight);
        
        // Create starfield
        createStarfield();
        
        // Create solar system
        createSolarSystem();
        
        // Setup UI events
        setupUI();
        
        // Setup planet click/touch detection
        setupPlanetClickDetection();
        
        // Setup tour controls
        setupTourControls();
        
        // Setup fullscreen
        setupFullscreen();
        
        // Setup pause button
        setupPauseButton();
        
        // Setup voice toggle
        setupVoiceToggle();
        
        // Start animation
        animate();
        
        // Fallback in case some textures fail to load
        setTimeout(() => {
            if (!loadingComplete) {
                document.getElementById('loading').style.display = 'none';
                loadingComplete = true;
            }
        }, 10000);
        
    } catch (error) {
        console.error("Initialization error:", error);
        document.getElementById('loading').innerHTML = 
            "<div>Error loading solar system</div>" +
            "<div style='margin-top:20px;color:#ff6666'>" + error.message + "</div>";
    }
}

function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
        color: 0xFFFFFF, 
        size: isMobile ? 0.1 : 0.2,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    const starsVertices = [];
    
    for (let i = 0; i < (isMobile ? 5000 : 10000); i++) {
        starsVertices.push(
            THREE.MathUtils.randFloatSpread(10000),
            THREE.MathUtils.randFloatSpread(10000),
            THREE.MathUtils.randFloatSpread(10000)
        );
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function createSolarSystem() {
    // Create planets with optimized settings for mobile
    planetData.forEach(data => {
        if (data.name.includes('Sun')) {
            createSun(data);
        } else {
            createPlanet(data);
        }
    });
    
    // Create asteroid belt with fewer asteroids on mobile
    createAsteroidBelt();
}

function createSun(data) {
    textureLoader.load(
        data.texture,
        (texture) => {
            const segments = isMobile ? 64 : 128;
            const geometry = new THREE.SphereGeometry(data.size, segments, segments);
            const material = new THREE.MeshBasicMaterial({ 
                map: texture,
                color: data.color
            });
            const sun = new THREE.Mesh(geometry, material);
            
            // Add glow effect
            const glowGeometry = new THREE.SphereGeometry(data.size * 1.2, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: 0xffaa33,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            sun.add(glow);
            
            scene.add(sun);
            
            // Position the light at the sun
            const sunLight = scene.children.find(child => child instanceof THREE.PointLight);
            if (sunLight) sunLight.position.copy(sun.position);
            
            // Create label
            const label = createTextLabel(data.name, isMobile ? 18 : 24, '#ffff00');
            label.position.set(0, data.size + 20, 0);
            sun.add(label);
            
            planets.push({
                data: data,
                mesh: sun,
                label: label
            });
            
            updateLoadingProgress();
        },
        undefined,
        (err) => {
            console.error("Error loading sun texture:", err);
            const geometry = new THREE.SphereGeometry(data.size, 64, 64);
            const material = new THREE.MeshBasicMaterial({ 
                color: data.color,
                emissive: 0xffaa33,
                emissiveIntensity: 0.5
            });
            const sun = new THREE.Mesh(geometry, material);
            scene.add(sun);
            
            const label = createTextLabel(data.name, isMobile ? 18 : 24, '#ffff00');
            label.position.set(0, data.size + 20, 0);
            sun.add(label);
            
            planets.push({
                data: data,
                mesh: sun,
                label: label
            });
            
            updateLoadingProgress();
        }
    );
}

function createPlanet(data) {
    textureLoader.load(
        data.texture,
        (texture) => {
            const segments = isMobile ? 64 : 128;
            const geometry = new THREE.SphereGeometry(data.size, segments, segments);
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                color: data.color,
                roughness: 0.8,
                metalness: 0.1
            });
            
            const planet = new THREE.Mesh(geometry, material);
            planet.name = data.name;
            planet.userData = data;
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.rotation.z = THREE.MathUtils.degToRad(data.tilt);

            // Initial position in orbit
            const angle = Math.random() * Math.PI * 2;
            const x = data.a * Math.cos(angle);
            const z = data.b * Math.sin(angle);
            planet.position.set(x, 0, z);
            scene.add(planet);

            // Create orbit path with fewer segments on mobile
            const orbitCurve = new THREE.EllipseCurve(
                0, 0,
                data.a, data.b,
                0, Math.PI * 2,
                false,
                0
            );

            const orbitPoints = orbitCurve.getPoints(isMobile ? 64 : 128);
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0x555555,
                transparent: true,
                opacity: 0.5
            });
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            orbit.name = `${data.name} Orbit`;
            scene.add(orbit);

            // Create label
            const label = createTextLabel(data.name, isMobile ? 16 : 20, '#ffffff');
            label.position.set(x, data.size + 15, z);
            scene.add(label);

            // Add rings if applicable
            if (data.ring) {
                textureLoader.load(
                    data.ringTexture,
                    (ringTexture) => {
                        const ringGeometry = new THREE.RingGeometry(
                            data.size * 1.5,
                            data.size * 2.5,
                            isMobile ? 32 : 64
                        );
                        const ringMaterial = new THREE.MeshStandardMaterial({
                            map: ringTexture,
                            side: THREE.DoubleSide,
                            transparent: true,
                            opacity: 0.8,
                            metalness: 0.5,
                            roughness: 0.5
                        });
                        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                        ring.rotation.x = Math.PI / 2;
                        ring.name = `${data.name} Rings`;
                        planet.add(ring);
                        updateLoadingProgress();
                    },
                    undefined,
                    (err) => {
                        console.error(`Error loading rings for ${data.name}:`, err);
                        const ringGeometry = new THREE.RingGeometry(
                            data.size * 1.5,
                            data.size * 2.5,
                            32
                        );
                        const ringMaterial = new THREE.MeshStandardMaterial({
                            color: 0xFFFFCC,
                            side: THREE.DoubleSide,
                            transparent: true,
                            opacity: 0.4
                        });
                        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                        ring.rotation.x = Math.PI / 2;
                        planet.add(ring);
                        updateLoadingProgress();
                    }
                );
            }

            planets.push({
                data: data,
                mesh: planet,
                orbit: orbit,
                label: label
            });

            updateLoadingProgress();
        },
        undefined,
        (err) => {
            console.error(`Error loading planet ${data.name}:`, err);
            const geometry = new THREE.SphereGeometry(data.size, 64, 64);
            const material = new THREE.MeshStandardMaterial({ 
                color: data.color,
                roughness: 0.8,
                metalness: 0.1
            });
            const planet = new THREE.Mesh(geometry, material);
            planet.name = data.name;
            planet.userData = data;
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.rotation.z = THREE.MathUtils.degToRad(data.tilt);

            const angle = Math.random() * Math.PI * 2;
            const x = data.a * Math.cos(angle);
            const z = data.b * Math.sin(angle);
            planet.position.set(x, 0, z);
            scene.add(planet);

            const orbitCurve = new THREE.EllipseCurve(
                0, 0,
                data.a, data.b,
                0, Math.PI * 2,
                false,
                0
            );

            const orbitPoints = orbitCurve.getPoints(64);
            const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0x555555,
                transparent: true,
                opacity: 0.5
            });
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            orbit.name = `${data.name} Orbit`;
            scene.add(orbit);

            const label = createTextLabel(data.name, isMobile ? 16 : 20, '#ffffff');
            label.position.set(x, data.size + 15, z);
            scene.add(label);

            planets.push({
                data: data,
                mesh: planet,
                orbit: orbit,
                label: label
            });

            updateLoadingProgress();
        }
    );
}

function createAsteroidBelt() {
    const beltGeometry = new THREE.BufferGeometry();
    const pts = [];
    const colors = [];
    const color = new THREE.Color();
    
    // Create asteroid belt with fewer asteroids on mobile
    const asteroidCount = isMobile ? 1500 : 3000;
    
    for (let i = 0; i < asteroidCount; i++) {
        const r = 300 + Math.random() * 200;
        const angle = Math.random() * Math.PI * 2;
        const x = r * Math.cos(angle);
        const z = r * Math.sin(angle);
        const y = (Math.random() - 0.5) * 40;
        
        pts.push(x, y, z);
        
        // Color based on asteroid type
        const asteroidType = Math.random();
        if (asteroidType < 0.75) {
            color.setHSL(0.1, 0.1, Math.random() * 0.1 + 0.1); // C-type
        } else if (asteroidType < 0.95) {
            color.setHSL(0.1, 0.3, Math.random() * 0.2 + 0.3); // S-type
        } else {
            color.setHSL(0.7, 0.3, Math.random() * 0.2 + 0.5); // M-type
        }
        colors.push(color.r, color.g, color.b);
    }
    
    beltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    beltGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const beltMaterial = new THREE.PointsMaterial({
        size: isMobile ? 1 : 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });
    
    asteroidBelt = new THREE.Points(beltGeometry, beltMaterial);
    asteroidBelt.name = "Asteroid Belt";
    scene.add(asteroidBelt);
}

function createTextLabel(text, size, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = isMobile ? 200 : 256;
    const height = isMobile ? 100 : 128;
    canvas.width = width;
    canvas.height = height;
    
    // Draw background
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, width, height);
    
    // Draw border
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.strokeRect(0, 0, width, height);
    
    // Draw text
    context.font = `Bold ${size}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;
    
    // Split text if too long
    const maxLength = isMobile ? 15 : 20;
    if (text.length > maxLength) {
        const parts = text.split(' ');
        let line1 = '', line2 = '';
        
        for (const word of parts) {
            if ((line1 + word).length <= maxLength) {
                line1 += word + ' ';
            } else {
                line2 += word + ' ';
            }
        }
        
        context.fillText(line1.trim(), width/2, height/2 - (line2 ? 10 : 0));
        if (line2) context.fillText(line2.trim(), width/2, height/2 + 10);
    } else {
        context.fillText(text, width/2, height/2);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        depthTest: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(width/10, height/10, 1);
    return sprite;
}

function updateLoadingProgress() {
    loadedTextures++;
    const progress = Math.round((loadedTextures / texturesToLoad) * 100);
    document.getElementById('loading-progress').value = progress;
    document.getElementById('loading-texture').textContent = `Loading textures (${loadedTextures}/${texturesToLoad})...`;
    
    if (loadedTextures === texturesToLoad) {
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
            loadingComplete = true;
            
            // Initial camera animation
            new TWEEN.Tween(camera.position)
                .to({ x: 0, y: 300, z: 800 }, 2000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
        }, 500);
    }
}

function setupUI() {
    // Speed control
    const speedControl = document.getElementById('speed');
    speedControl.addEventListener('input', function() {
        document.getElementById('speed-value').textContent = this.value + 'x';
    });
    
    // Toggle orbits
    document.getElementById('show-orbits').addEventListener('change', function() {
        planets.forEach(p => {
            if (p.orbit) p.orbit.visible = this.checked;
        });
    });
    
    // Toggle labels
    document.getElementById('show-labels').addEventListener('change', function() {
        planets.forEach(p => {
            if (p.label) p.label.visible = this.checked;
        });
    });
    
    // Toggle asteroid belt
    document.getElementById('show-asteroids').addEventListener('change', function() {
        if (asteroidBelt) asteroidBelt.visible = this.checked;
    });
    
    // Toggle scale indicator
    document.getElementById('show-scale').addEventListener('change', function() {
        document.getElementById('scale-indicator').style.display = this.checked ? 'block' : 'none';
        updateScaleIndicator();
    });
    
    // Auto-rotate
    document.getElementById('auto-rotate').addEventListener('change', function() {
        autoRotate = this.checked;
    });
}

function setupPauseButton() {
    const pauseButton = document.getElementById('pause-button');
    pauseButton.addEventListener('click', function() {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
        
        // Pause or resume speech
        if (isPaused) {
            speechSynthesis.pause();
        } else {
            speechSynthesis.resume();
        }
    });
}

function setupVoiceToggle() {
    const voiceToggle = document.getElementById('voice-toggle');
    voiceToggle.addEventListener('click', function() {
        voiceEnabled = !voiceEnabled;
        voiceToggle.textContent = `Voice: ${voiceEnabled ? 'ON' : 'OFF'}`;
        
        if (!voiceEnabled) {
            speechSynthesis.cancel();
        }
    });
}

function setupTourControls() {
    document.getElementById('tour-btn').addEventListener('click', startTour);
    document.getElementById('next-planet').addEventListener('click', nextPlanet);
    document.getElementById('prev-planet').addEventListener('click', prevPlanet);
}

function startTour() {
    const btn = document.getElementById('tour-btn');
    if (isTourActive) {
        isTourActive = false;
        btn.textContent = 'Start Tour';
        
        // Clear any pending tour timeout
        if (tourTimeout) {
            clearTimeout(tourTimeout);
            tourTimeout = null;
        }
        
        // Stop any ongoing speech
        speechSynthesis.cancel();
    } else {
        isTourActive = true;
        currentTourIndex = 0;
        btn.textContent = 'Stop Tour';
        flyToPlanet(currentTourIndex);
    }
}

function nextPlanet() {
    const tourOrder = [
        "Sol (The Sun)", "Mercury", "Venus", "Earth (Terra)", 
        "Luna (The Moon)", "Mars", "Jupiter", "Saturn", 
        "Uranus", "Neptune", "Pluto", "Ceres"
    ];
    
    const currentPlanetName = planets[currentTourIndex].data.name;
    let currentPos = tourOrder.indexOf(currentPlanetName);
    if (currentPos === -1) currentPos = 0;
    
    currentPos = (currentPos + 1) % tourOrder.length;
    const nextPlanetName = tourOrder[currentPos];
    currentTourIndex = planets.findIndex(p => p.data.name === nextPlanetName);
    
    if (currentTourIndex === -1) currentTourIndex = 0;
    flyToPlanet(currentTourIndex);
}

function prevPlanet() {
    const tourOrder = [
        "Sol (The Sun)", "Mercury", "Venus", "Earth (Terra)", 
        "Luna (The Moon)", "Mars", "Jupiter", "Saturn", 
        "Uranus", "Neptune", "Pluto", "Ceres"
    ];
    
    const currentPlanetName = planets[currentTourIndex].data.name;
    let currentPos = tourOrder.indexOf(currentPlanetName);
    if (currentPos === -1) currentPos = 0;
    
    currentPos = (currentPos - 1 + tourOrder.length) % tourOrder.length;
    const prevPlanetName = tourOrder[currentPos];
    currentTourIndex = planets.findIndex(p => p.data.name === prevPlanetName);
    
    if (currentTourIndex === -1) currentTourIndex = 0;
    flyToPlanet(currentTourIndex);
}

function flyToPlanet(index) {
    if (index < 0 || index >= planets.length) return;
    
    // Clear any pending tour timeout
    if (tourTimeout) {
        clearTimeout(tourTimeout);
        tourTimeout = null;
    }
    
    // Stop any ongoing speech
    speechSynthesis.cancel();
    
    const planet = planets[index];
    let targetPosition = planet.mesh.position.clone();
    const distance = targetPosition.length();
    
    // Calculate a good viewing position
    targetPosition.multiplyScalar(1.5);
    targetPosition.y += planet.data.size * 2;
    
    // Special handling for the Sun
    if (planet.data.name.includes('Sun')) {
        targetPosition.set(0, 300, 800);
    }
    
    // Smooth camera movement
    new TWEEN.Tween(camera.position)
        .to(targetPosition, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    
    // Calculate target position for controls
    let targetLookAt = planet.mesh.position.clone();
    
    new TWEEN.Tween(controls.target)
        .to(targetLookAt, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
            // Show planet info
            showPlanetInfo(planet.data);
            
            // Speak the text if voice is enabled
            if (voiceEnabled) {
                const planetName = planet.data.name;
                const planetType = planet.data.type;
                const planetDiameter = planet.data.diameter;
                const planetDistance = planet.data.distance;
                const planetPeriod = planet.data.period;
                const planetRotation = planet.data.rotation;
                const planetMoons = planet.data.moons;
                const planetAtmosphere = planet.data.atmosphere;
                const planetTemperature = planet.data.temperature;
                const planetFact = planet.data.fact;
                
                const text = `${planetName}. ${planetType}. Diameter: ${planetDiameter}. Distance from Sun: ${planetDistance}. 
                    Orbital Period: ${planetPeriod}. Rotation Period: ${planetRotation}. 
                    Moons: ${planetMoons}. Atmosphere: ${planetAtmosphere}. 
                    Temperature: ${planetTemperature}. Fun Fact: ${planetFact}`;
                
                // Create speech utterance
                currentUtterance = new SpeechSynthesisUtterance(text);
                currentUtterance.rate = 0.9;
                currentUtterance.pitch = 1;
                
                // Speak the text
                speechSynthesis.speak(currentUtterance);
                
                // Calculate when the speech will finish
                const speechDuration = (text.length / 180) * 1000; // Approximate speech duration in ms
                
                // Continue tour if active after speech finishes
                if (isTourActive) {
                    tourTimeout = setTimeout(() => {
                        nextPlanet();
                    }, speechDuration + 1000); // Add 1 second buffer
                }
            } else if (isTourActive) {
                // If voice is disabled but tour is active, wait 5 seconds before moving to next planet
                tourTimeout = setTimeout(() => {
                    nextPlanet();
                }, 5000);
            }
        })
        .start();
}
        
function setupPlanetClickDetection() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function onPointerDown(event) {
        if (!loadingComplete) return;
        
        // Get pointer position
        if (event.type === 'touchstart') {
            if (event.touches.length !== 1) return;
            mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        } else {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
            planets.map(p => p.mesh)
        );
        
        if (intersects.length > 0) {
            const planet = planets.find(
                p => p.mesh === intersects[0].object
            );
            showPlanetInfo(planet.data);
            flyToPlanet(planets.indexOf(planet));
            
            // If tour was active, stop it
            if (isTourActive) {
                startTour();
            }
        }
    }
    
    // Add both mouse and touch events
    window.addEventListener('click', onPointerDown);
    window.addEventListener('touchstart', onPointerDown);
}

function showPlanetInfo(planetData) {
    document.getElementById('info-title').textContent = planetData.name;
    document.getElementById('info-type').textContent = planetData.type;
    document.getElementById('info-diameter').textContent = planetData.diameter;
    document.getElementById('info-distance').textContent = planetData.distance;
    document.getElementById('info-period').textContent = planetData.period;
    document.getElementById('info-rotation').textContent = planetData.rotation;
    document.getElementById('info-moons').textContent = planetData.moons;
    document.getElementById('info-atmosphere').textContent = planetData.atmosphere;
    document.getElementById('info-temperature').textContent = planetData.temperature;
    document.getElementById('info-fact').textContent = planetData.fact;
    
    // Show info panel (don't auto-hide)
    document.getElementById('info-panel').style.display = 'block';
}

function updateLabelSizes() {
    planets.forEach(planet => {
        if (planet.label) {
            const distance = planet.mesh.position.distanceTo(camera.position);
            const scaleFactor = Math.min(1, 1000 / distance);
            planet.label.scale.set(scaleFactor * (isMobile ? 20 : 25.6), scaleFactor * (isMobile ? 10 : 12.8), 1);
        }
    });
}

function updateScaleIndicator() {
    const sun = planets.find(p => p.data.name.includes('Sun'));
    if (!sun) return;
    
    const distance = camera.position.distanceTo(sun.mesh.position);
    const scale = Math.round(distance / 10) * 1000;
    
    document.getElementById('scale-value').textContent = scale.toLocaleString();
}

function setupFullscreen() {
    const fullscreenButton = document.getElementById('fullscreen-button');
    
    fullscreenButton.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            fullscreenButton.textContent = 'Exit Fullscreen';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenButton.textContent = 'Fullscreen';
            }
        }
    });
    
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement) {
            fullscreenButton.textContent = 'Fullscreen';
        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    if (isPaused) return;
    
    const t = Date.now()*0.00005 * document.getElementById('speed').value;
    
    TWEEN.update();
    
    if (autoRotate && !isTourActive) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
    } else {
        controls.autoRotate = false;
    }
    
    planets.forEach(planet => {
        const data = planet.data;
        
        planet.mesh.rotation.y += 0.005 * document.getElementById('speed').value;
        
        if (data.parent) {
            const parent = planets.find(p => p.data.name === data.parent);
            if (parent) {
                const phi = t * data.speed;
                const x = parent.mesh.position.x + data.a * Math.cos(phi);
                const z = parent.mesh.position.z + data.b * Math.sin(phi);
                planet.mesh.position.set(x, 0, z);
                if (planet.label) {
                    planet.label.position.set(x, data.size + 10, z);
                }
            }
        } else if (!data.name.includes('Sun')) {
            const phi = t * data.speed;
            const x = data.a * Math.cos(phi);
            const z = data.b * Math.sin(phi);
            planet.mesh.position.set(x, 0, z);
            if (planet.label) {
                planet.label.position.set(x, data.size + 10, z);
            }
        }
        
        if (planet.label) {
            planet.label.lookAt(camera.position);
        }
    });
    
    updateLabelSizes();
    
    if (document.getElementById('show-scale').checked) {
        updateScaleIndicator();
    }
    
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the simulation
init();
