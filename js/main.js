/* ============================================= */
/* MAIN VARIABLES AND INITIALIZATION */
/* ============================================= */

let scene, camera, renderer, controls;
const planets = [];
const textureLoader = new THREE.TextureLoader();
let asteroidBelt, kuiperBelt;
let loadingComplete = false;
let texturesToLoad = 0;
let loadedTextures = 0;
let currentTourIndex = 0;
let isTourActive = false;
let autoRotate = true;
let realScaleMode = false;
let vrEnabled = false;
let vrButton;
let effect, controlsVR;
let lastClickTime = 0;
let selectedPlanet = null;
let speechSynthesis = window.speechSynthesis || null;
let currentUtterance = null;
let isPaused = false;
let isSpeaking = false;
let speechQueue = [];
let tourTimeout = null;

// Base path for textures
const TEXTURE_BASE_PATH = 'public/textures/';

const tourSequence = [
    'Sol (The Sun)', 
    'Mercury',
    'Venus',
    'Earth (Terra)',
    'Luna (The Moon)',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune',
    'Pluto',
    'Ceres'
];

const planetData = [
    { 
        name: 'Sol (The Sun)', 
        size: 100, 
        realSize: 1391400,
        texture: 'sun.jpg', 
        color: 0xffff33,
        type: 'G-type main-sequence star',
        diameter: '1,391,400 km',
        distance: '0 km (Center of Solar System)',
        period: 'N/A (Orbits galactic center every ~230 million years)',
        rotation: '25-35 days (differential rotation)',
        moons: 0,
        atmosphere: 'Hydrogen (73%), Helium (25%), other elements (2%)',
        temperature: '5,500°C (surface), 15,000,000°C (core)',
        fact: 'The Sun contains 99.86% of the solar system\'s mass and could fit 1.3 million Earths inside it.',
        audioDescription: 'The Sun is a nearly perfect sphere of hot plasma at the center of our solar system.',
        labelColor: '#FFD700'
    },
    { 
        name: 'Mercury', 
        size: 3.8, 
        realSize: 4880,
        a: 140, 
        b: 138, 
        speed: 4.15, 
        tilt: 0, 
        color: 0xCCCCCC, 
        texture: 'mercury.jpg',
        type: 'Terrestrial planet',
        diameter: '4,880 km',
        distance: '57.9 million km from Sun',
        period: '88 Earth days',
        rotation: '59 Earth days',
        moons: 0,
        atmosphere: 'Trace amounts of hydrogen, helium, oxygen',
        temperature: '-173°C to 427°C',
        fact: 'Mercury has the most extreme temperature variations in the solar system and is shrinking as its core cools!',
        audioDescription: 'Mercury is the smallest and innermost planet, with surface temperatures ranging from extremely hot to extremely cold.',
        labelColor: '#A9A9A9'
    },
    { 
        name: 'Venus', 
        size: 9.5, 
        realSize: 12104,
        a: 200, 
        b: 198, 
        speed: 1.62, 
        tilt: 177, 
        color: 0xFF9933, 
        texture: 'venus.jpg',
        type: 'Terrestrial planet',
        diameter: '12,104 km',
        distance: '108.2 million km from Sun',
        period: '225 Earth days',
        rotation: '243 Earth days (retrograde)',
        moons: 0,
        atmosphere: '96.5% CO₂, 3.5% N₂ with thick sulfuric acid clouds',
        temperature: '462°C (constant, hottest planet)',
        fact: 'Venus rotates backwards compared to most planets with a day longer than its year! Its surface pressure is 92 times Earth\'s.',
        audioDescription: 'Venus is often called Earth\'s sister planet, but its thick atmosphere creates a runaway greenhouse effect making it the hottest planet.',
        labelColor: '#FFA07A'
    },
    { 
        name: 'Earth (Terra)', 
        size: 10, 
        realSize: 12742,
        a: 260, 
        b: 258, 
        speed: 1, 
        tilt: 23.4, 
        color: 0x3366FF, 
        texture: 'earth.jpg',
        type: 'Terrestrial planet',
        diameter: '12,742 km',
        distance: '149.6 million km from Sun (1 AU)',
        period: '365.25 days',
        rotation: '23 hours 56 minutes',
        moons: 1,
        atmosphere: '78% N₂, 21% O₂, 1% other gases',
        temperature: '-89°C to 58°C',
        fact: 'Earth is the only known planet with liquid water on its surface and the densest planet in the solar system.',
        audioDescription: 'Earth is our home, the only known planet to support life, with vast oceans and a protective atmosphere.',
        labelColor: '#1E90FF'
    },
    { 
        name: 'Luna (The Moon)', 
        size: 2.7, 
        realSize: 3474,
        a: 30, 
        b: 29, 
        speed: 12, 
        parent: 'Earth (Terra)', 
        color: 0xAAAAAA, 
        texture: 'moon.jpg',
        type: 'Natural satellite',
        diameter: '3,474 km',
        distance: '384,400 km from Earth',
        period: '27.3 Earth days',
        rotation: '27.3 days (tidally locked)',
        moons: 0,
        atmosphere: 'Trace (technically an exosphere)',
        temperature: '-173°C to 127°C',
        fact: 'The Moon is slowly moving away from Earth at about 3.8 cm per year. It has quakes (moonquakes) and its crust is thinner on the near side.',
        audioDescription: 'Earth\'s Moon is the fifth largest natural satellite in the solar system and has been visited by humans.',
        labelColor: '#B0C4DE'
    },
    { 
        name: 'Mars', 
        size: 5.3, 
        realSize: 6779,
        a: 320, 
        b: 315, 
        speed: 0.53, 
        tilt: 25, 
        color: 0xFF3300, 
        texture: 'mars.jpg',
        type: 'Terrestrial planet',
        diameter: '6,779 km',
        distance: '227.9 million km from Sun',
        period: '687 Earth days',
        rotation: '24 hours 37 minutes',
        moons: 2,
        atmosphere: '95% CO₂, 3% N₂, 1.6% Ar',
        temperature: '-140°C to 20°C',
        fact: 'Home to the tallest volcano in the solar system - Olympus Mons (21 km high) and the deepest canyon - Valles Marineris (7 km deep).',
        audioDescription: 'Mars is known as the Red Planet due to iron oxide on its surface. It has the largest dust storms in the solar system.',
        labelColor: '#FF6347'
    },
    { 
        name: 'Jupiter', 
        size: 56.5, 
        realSize: 139820,
        a: 420, 
        b: 415, 
        speed: 0.084, 
        tilt: 3, 
        color: 0xFFCC99, 
        texture: 'jupiter.jpg',
        type: 'Gas giant',
        diameter: '139,820 km',
        distance: '778.3 million km from Sun',
        period: '11.86 Earth years',
        rotation: '9 hours 55 minutes (fastest)',
        moons: 79,
        atmosphere: '90% H₂, 10% He with ammonia clouds',
        temperature: '-145°C at cloud tops',
        fact: 'Jupiter has a storm (Great Red Spot) that has raged for at least 400 years. It\'s so massive that it could swallow Earth.',
        audioDescription: 'Jupiter is the largest planet in our solar system, a gas giant with a Great Red Spot that is a storm larger than Earth.',
        labelColor: '#F4A460'
    },
    { 
        name: 'Saturn', 
        size: 47.5, 
        realSize: 116460,
        a: 520, 
        b: 515, 
        speed: 0.034, 
        tilt: 26, 
        ring: true, 
        color: 0xFFFF99, 
        texture: 'saturn.jpg', 
        ringTexture: 'saturn_rings.png',
        innerRingRadius: 60,
        outerRingRadius: 100,
        ringTilt: 27,
        type: 'Gas giant',
        diameter: '116,460 km',
        distance: '1.4 billion km from Sun',
        period: '29.5 Earth years',
        rotation: '10 hours 33 minutes',
        moons: 82,
        atmosphere: '96% H₂, 3% He with ammonia clouds',
        temperature: '-178°C at cloud tops',
        fact: 'Saturn\'s rings are made mostly of chunks of ice and rock. It\'s the least dense planet - it would float in water!',
        audioDescription: 'Saturn is famous for its spectacular ring system made mostly of ice particles with some rock and dust.',
        labelColor: '#DAA520'
    },
    { 
        name: 'Uranus', 
        size: 20.2, 
        realSize: 50724,
        a: 620, 
        b: 615, 
        speed: 0.011, 
        tilt: 98, 
        ring: true,
        color: 0x99FFFF, 
        texture: 'uranus.jpg',
        ringTexture: 'uranus_rings.png',
        innerRingRadius: 30,
        outerRingRadius: 50,
        ringTilt: 98,
        type: 'Ice giant',
        diameter: '50,724 km',
        distance: '2.9 billion km from Sun',
        period: '84 Earth years',
        rotation: '17 hours 14 minutes (retrograde)',
        moons: 27,
        atmosphere: '83% H₂, 15% He, 2% CH₄',
        temperature: '-224°C (coldest planet)',
        fact: 'Uranus rotates on its side with an axial tilt of 98 degrees! It was the first planet discovered with a telescope.',
        audioDescription: 'Uranus is unique for rotating on its side, likely due to a giant impact early in its history.',
        labelColor: '#AFEEEE'
    },
    { 
        name: 'Neptune', 
        size: 19.2, 
        realSize: 49244,
        a: 700, 
        b: 695, 
        speed: 0.006, 
        tilt: 28, 
        color: 0x3366FF, 
        texture: 'neptune.jpg',
        type: 'Ice giant',
        diameter: '49,244 km',
        distance: '4.5 billion km from Sun',
        period: '165 Earth years',
        rotation: '16 hours 6 minutes',
        moons: 14,
        atmosphere: '80% H₂, 19% He, 1% CH₄',
        temperature: '-214°C',
        fact: 'Neptune has the strongest winds in the solar system - over 2,000 km/h! It was the first planet predicted mathematically before being observed.',
        audioDescription: 'Neptune is the windiest planet with the strongest winds in the solar system, reaching speeds of 2,000 kilometers per hour.',
        labelColor: '#4682B4'
    },
    { 
        name: 'Pluto', 
        size: 1.8, 
        realSize: 2377,
        a: 750, 
        b: 745, 
        speed: 0.004, 
        tilt: 120, 
        color: 0xFFCC99, 
        texture: 'pluto.jpg',
        type: 'Dwarf planet (Kuiper Belt Object)',
        diameter: '2,377 km',
        distance: '5.9 billion km from Sun',
        period: '248 Earth years',
        rotation: '6.4 Earth days',
        moons: 5,
        atmosphere: 'N₂, CH₄, CO (when close to Sun)',
        temperature: '-233°C to -223°C',
        fact: 'Pluto has a heart-shaped glacier (Tombaugh Regio) and its largest moon Charon is so big they orbit a point between them.',
        audioDescription: 'Pluto, now classified as a dwarf planet, has a heart-shaped glacier of nitrogen ice on its surface.',
        labelColor: '#CD853F'
    },
    { 
        name: 'Ceres', 
        size: 1, 
        realSize: 946,
        a: 400, 
        b: 395, 
        speed: 0.3, 
        tilt: 4, 
        color: 0xAAAAAA, 
        texture: 'ceres.jpg',
        type: 'Dwarf planet (Asteroid Belt)',
        diameter: '946 km',
        distance: '414 million km from Sun',
        period: '4.6 Earth years',
        rotation: '9 hours 4 minutes',
        moons: 0,
        atmosphere: 'Trace water vapor',
        temperature: '-105°C',
        fact: 'Ceres is the largest object in the asteroid belt and may have a subsurface ocean of liquid water.',
        audioDescription: 'Ceres is the largest object in the asteroid belt and may contain more fresh water than Earth.',
        labelColor: '#D3D3D3'
    }
];

/* ============================================= */
/* SCENE INITIALIZATION */
/* ============================================= */

function init() {
    try {
        console.log("Initializing solar system...");
        
        // Count textures to load
        texturesToLoad = planetData.length; // Main textures
        planetData.forEach(data => {
            if (data.ring) texturesToLoad++; // Ring textures
        });
        texturesToLoad += 2; // Asteroid and Kuiper belt textures
        
        // Create scene with proper settings
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000000, 0.0001);
        
        // Create renderer with optimal settings
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        document.body.appendChild(renderer.domElement);
        
        // Create camera with sensible defaults
        camera = new THREE.PerspectiveCamera(
            60, // FOV
            window.innerWidth / window.innerHeight,
            0.1, // Near plane
            100000 // Far plane
        );
        camera.position.set(0, 300, 1000);
        camera.layers.enableAll();
        
        // Set up orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 100;
        controls.maxDistance = 5000;
        controls.maxPolarAngle = Math.PI * 0.9;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        
        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        const sunLight = new THREE.PointLight(0xffffe0, 2, 10000);
        sunLight.castShadow = true;
        sunLight.shadow.bias = -0.0001;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);
        
        // Create celestial objects
        createStarfield();
        createSolarSystem();
        
        // Event handlers
        setupEventHandlers();
        
        // Start animation loop
        animate();
        
        // Loading timeout fallback
        setTimeout(() => {
            if (!loadingComplete) {
                console.warn("Loading timeout - proceeding with available assets");
                document.getElementById('loading').style.display = 'none';
                loadingComplete = true;
            }
        }, 15000);
        
    } catch (error) {
        console.error("Initialization error:", error);
        document.getElementById('loading').innerHTML = 
            `<div>Error loading solar system</div>
             <div style='margin-top:20px;color:#ff6666'>${error.message}</div>`;
    }
}

/* ============================================= */
/* SCENE ELEMENTS CREATION */
/* ============================================= */

function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        vertexColors: true
    });
    
    const starsVertices = [];
    const starsColors = [];
    const color = new THREE.Color();
    
    for (let i = 0; i < 20000; i++) {
        const radius = 10000 * Math.pow(Math.random(), 2);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        starsVertices.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        const hue = 0.1 + Math.random() * 0.1;
        const saturation = 0.1 + Math.random() * 0.3;
        const lightness = 0.5 + Math.random() * 0.5;
        color.setHSL(hue, saturation, lightness);
        starsColors.push(color.r, color.g, color.b);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function createSolarSystem() {
    planetData.forEach(data => {
        if (data.name.includes('Sun')) {
            createSun(data);
        } else {
            createPlanet(data);
        }
    });
    
    createAsteroidBelt();
    createKuiperBelt();
}

function createSun(data) {
    const texturePath = TEXTURE_BASE_PATH + data.texture;
    console.log(`Loading Sun from: ${texturePath}`);

    const geometry = new THREE.SphereGeometry(data.size, 128, 128);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffaa33,
        emissiveIntensity: 0.8
    });
    const sun = new THREE.Mesh(geometry, material);
    sun.name = "SUN_CORE";
    sun.position.set(0, 0, 0);
    sun.renderOrder = 9999;
    sun.layers.enableAll();
    scene.add(sun);

    textureLoader.load(texturePath, 
        (texture) => {
            console.log("Sun texture loaded successfully");
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            sun.material.map = texture;
            sun.material.needsUpdate = true;
        },
        undefined,
        (err) => {
            console.error("Sun texture failed, using fallback:", err);
        }
    );

    const glowGeometry = new THREE.SphereGeometry(data.size * 1.4, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa33,
        transparent: true,
        opacity: 0.4,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.name = "SUN_GLOW";
    sun.add(glow);

    const label = createTextLabel(data.name, 24, data.labelColor);
    label.position.set(0, data.size + 15, 0);
    sun.add(label);

    planets.push({
        data: data,
        mesh: sun,
        label: label,
        glow: glow
    });

    const sunLight = scene.children.find(c => c instanceof THREE.PointLight);
    if (sunLight) {
        sunLight.position.set(0, 0, 0);
        sunLight.intensity = 2;
    }

    updateLoadingProgress();
}

function createPlanet(data) {
    const texturePath = TEXTURE_BASE_PATH + data.texture;
    console.log(`Creating ${data.name} with texture: ${texturePath}`);

    // MOON HANDLING
    if (data.name.includes('Moon') || data.name.includes('Luna')) {
        console.log(`MOON CREATION STARTED for ${data.name}`);
        
        const parentPlanet = planets.find(p => p.data.name === data.parent);
        if (!parentPlanet) {
            console.error(`CRITICAL: Parent ${data.parent} not found for Moon!`);
            return;
        }

        const moonMaterial = new THREE.MeshStandardMaterial({
            color: 0xBBBBBB,
            roughness: 0.9,
            metalness: 0.1,
            emissive: 0x555555,
            emissiveIntensity: 0.7
        });

        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(data.size, 64, 64),
            moonMaterial
        );
        moon.name = `MOON_${data.parent.replace(/\s+/g, '_')}`;
        moon.renderOrder = 999;
        moon.castShadow = true;

        moon.position.copy(parentPlanet.mesh.position);
        moon.position.x += data.a;

        textureLoader.load(texturePath, 
            (texture) => {
                console.log(`Moon texture loaded for ${data.name}`);
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                moon.material.map = texture;
                moon.material.needsUpdate = true;
            },
            undefined,
            (err) => {
                console.warn(`Moon texture failed, using fallback: ${err}`);
            }
        );

        const label = createTextLabel(data.name, 16, data.labelColor);
        label.name = `${data.name}_LABEL`;

        planets.push({
            data: data,
            mesh: moon,
            label: label,
            isMoon: true,
            parentObject: parentPlanet.mesh,
            orbitRadiusX: data.a,
            orbitRadiusZ: data.b,
            orbitSpeed: data.speed
        });

        scene.add(moon);
        scene.add(label);
        
        console.log(`Moon created successfully at:`, moon.position);
        updateLoadingProgress();
        return;
    }

    // NORMAL PLANET CREATION
    const geometry = new THREE.SphereGeometry(data.size, 128, 128);
    const material = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.8,
        metalness: 0.2,
        emissive: 0x000000,
        emissiveIntensity: 0
    });

    const planet = new THREE.Mesh(geometry, material);
    planet.name = data.name.replace(/\s+/g, '_');
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.rotation.z = data.tilt * Math.PI/180;

    textureLoader.load(texturePath, 
        (texture) => {
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            planet.material.map = texture;
            planet.material.needsUpdate = true;
        },
        undefined,
        (err) => {
            console.error(`Texture load failed for ${data.name}:`, err);
        }
    );

    const label = createTextLabel(data.name, 20, data.labelColor);
    
    // Create orbit path
    const curve = new THREE.EllipseCurve(0, 0, data.a, data.b, 0, 2*Math.PI, false);
    const points = curve.getPoints(256).map(pt => new THREE.Vector3(pt.x, 0, pt.y));
    const orbit = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points), 
        new THREE.LineBasicMaterial({ 
            color: 0x555555,
            transparent: true,
            opacity: 0.5
        })
    );

    // Initial position
    const angle = Math.random() * Math.PI * 2;
    planet.position.set(
        data.a * Math.cos(angle),
        0,
        data.b * Math.sin(angle)
    );

    scene.add(planet);
    scene.add(label);
    scene.add(orbit);

    const planetObj = {
        data: data,
        mesh: planet,
        label: label,
        orbit: orbit,
        currentAngle: angle
    };

    planets.push(planetObj);

    // Create rings if specified
    if (data.ring) {
        createPlanetRings(planetObj);
    }

    updateLoadingProgress();
}

function createPlanetRings(planetObj) {
    const data = planetObj.data;
    const ringTexturePath = TEXTURE_BASE_PATH + data.ringTexture;
    
    textureLoader.load(ringTexturePath, (texture) => {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        
        const ringGeometry = new THREE.RingGeometry(
            data.innerRingRadius, 
            data.outerRingRadius, 
            64
        );
        
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        rings.rotation.z = data.ringTilt * Math.PI / 180;
        rings.renderOrder = 1;
        
        planetObj.mesh.add(rings);
        planetObj.rings = rings;
        
        console.log(`Created rings for ${data.name}`);
    }, undefined, (err) => {
        console.error(`Failed to load ring texture for ${data.name}:`, err);
    });
}

function createAsteroidBelt() {
    const beltGeometry = new THREE.BufferGeometry();
    const pts = [];
    const colors = [];
    const color = new THREE.Color();
    
    textureLoader.load(TEXTURE_BASE_PATH + 'asteroid.jpg', function(texture) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        
        for(let i = 0; i < 10000; i++) {
            const r = 350 + Math.random() * 100;
            const ang = Math.random() * Math.PI * 2;
            const x = r * Math.cos(ang);
            const z = r * Math.sin(ang);
            const y = (Math.random() - 0.5) * 40;
            pts.push(x, y, z);
            
            const hue = 0.05 + Math.random() * 0.1;
            const saturation = 0.3 + Math.random() * 0.3;
            const lightness = 0.1 + Math.random() * 0.2;
            color.setHSL(hue, saturation, lightness);
            colors.push(color.r, color.g, color.b);
        }
        
        beltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        beltGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        asteroidBelt = new THREE.Points(
            beltGeometry, 
            new THREE.PointsMaterial({ 
                size: 1.5,
                map: texture,
                vertexColors: true,
                transparent: true,
                opacity: 0.9
            })
        );
        scene.add(asteroidBelt);
        updateLoadingProgress();
    }, undefined, function(err) {
        console.error("Error loading asteroid texture:", err);
        // Fallback without texture
        for(let i = 0; i < 10000; i++) {
            const r = 350 + Math.random() * 100;
            const ang = Math.random() * Math.PI * 2;
            const x = r * Math.cos(ang);
            const z = r * Math.sin(ang);
            const y = (Math.random() - 0.5) * 40;
            pts.push(x, y, z);
            
            const hue = 0.05 + Math.random() * 0.1;
            const saturation = 0.3 + Math.random() * 0.3;
            const lightness = 0.1 + Math.random() * 0.2;
            color.setHSL(hue, saturation, lightness);
            colors.push(color.r, color.g, color.b);
        }
        
        beltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        beltGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        asteroidBelt = new THREE.Points(
            beltGeometry, 
            new THREE.PointsMaterial({ 
                size: 1.5,
                vertexColors: true,
                transparent: true,
                opacity: 0.9
            })
        );
        scene.add(asteroidBelt);
        updateLoadingProgress();
    });
}

function createKuiperBelt() {
    const beltGeometry = new THREE.BufferGeometry();
    const pts = [];
    const colors = [];
    const color = new THREE.Color();
    
    textureLoader.load(TEXTURE_BASE_PATH + 'kuiper.jpg', function(texture) {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        
        for(let i = 0; i < 5000; i++) {
            const r = 750 + Math.random() * 250;
            const ang = Math.random() * Math.PI * 2;
            const x = r * Math.cos(ang);
            const z = r * Math.sin(ang);
            const y = (Math.random() - 0.5) * 100;
            pts.push(x, y, z);
            
            const hue = 0.1 + Math.random() * 0.1;
            const saturation = 0.2 + Math.random() * 0.3;
            const lightness = 0.1 + Math.random() * 0.2;
            color.setHSL(hue, saturation, lightness);
            colors.push(color.r, color.g, color.b);
        }
        
        beltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        beltGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        kuiperBelt = new THREE.Points(
            beltGeometry, 
            new THREE.PointsMaterial({ 
                size: 1.2,
                map: texture,
                vertexColors: true,
                transparent: true,
                opacity: 0.8
            })
        );
        scene.add(kuiperBelt);
        updateLoadingProgress();
    }, undefined, function(err) {
        console.error("Error loading kuiper belt texture:", err);
        // Fallback without texture
        for(let i = 0; i < 5000; i++) {
            const r = 750 + Math.random() * 250;
            const ang = Math.random() * Math.PI * 2;
            const x = r * Math.cos(ang);
            const z = r * Math.sin(ang);
            const y = (Math.random() - 0.5) * 100;
            pts.push(x, y, z);
            
            const hue = 0.1 + Math.random() * 0.1;
            const saturation = 0.2 + Math.random() * 0.3;
            const lightness = 0.1 + Math.random() * 0.2;
            color.setHSL(hue, saturation, lightness);
            colors.push(color.r, color.g, color.b);
        }
        
        beltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        beltGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        kuiperBelt = new THREE.Points(
            beltGeometry, 
            new THREE.PointsMaterial({ 
                size: 1.2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8
            })
        );
        scene.add(kuiperBelt);
        updateLoadingProgress();
    });
}

function createTextLabel(text, size, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const padding = 10;
    
    context.font = `Bold ${size}px Arial`;
    const textWidth = context.measureText(text).width;
    
    canvas.width = Math.min(512, textWidth + padding * 2);
    canvas.height = size + padding * 2;
    
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.beginPath();
    context.roundRect(0, 0, canvas.width, canvas.height, 8);
    context.fill();
    
    context.strokeStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 10;
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(0, 0, canvas.width, canvas.height, 8);
    context.stroke();
    context.shadowBlur = 0;
    
    context.font = `Bold ${size}px Arial`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        depthTest: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(canvas.width / 10, canvas.height / 10, 1);
    return sprite;
}

/* ============================================= */
/* VOICE CONTROL FUNCTIONS */
/* ============================================= */

function speakText(text, onComplete) {
    if (!speechSynthesis || isPaused) {
        if (onComplete) onComplete();
        return;
    }

    stopSpeech();

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1;
    
    currentUtterance.onend = function() {
        isSpeaking = false;
        if (onComplete) onComplete();
    };
    
    currentUtterance.onerror = function() {
        isSpeaking = false;
        if (onComplete) onComplete();
    };
    
    isSpeaking = true;
    speechSynthesis.speak(currentUtterance);
}

function stopSpeech() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
    isSpeaking = false;
    currentUtterance = null;
    speechQueue = [];
}

function pauseSpeech() {
    if (speechSynthesis) {
        speechSynthesis.pause();
    }
}

function resumeSpeech() {
    if (speechSynthesis) {
        speechSynthesis.paused ? speechSynthesis.resume() : 
        currentUtterance && speechSynthesis.speak(currentUtterance);
    }
}

/* ============================================= */
/* EVENT HANDLERS AND UI CONTROLS */
/* ============================================= */

function setupEventHandlers() {
    window.addEventListener('resize', onWindowResize);
    setupPlanetClickDetection();
    setupUIControls();
    setupTourControls();
    setupVR();
    setupFullscreen();
    setupVoiceControls();
    setupPauseButton();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function setupPlanetClickDetection() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    function onPlanetClick(event) {
        if (!loadingComplete) return;
        
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
            planets.map(p => p.mesh),
            true
        );
        
        if (intersects.length > 0) {
            let planetMesh = intersects[0].object;
            while (planetMesh.parent && planetMesh.parent !== scene) {
                planetMesh = planetMesh.parent;
            }
            
            const planet = planets.find(p => p.mesh === planetMesh);
            if (planet) {
                selectPlanet(planet);
                
                const now = Date.now();
                if (now - lastClickTime < 300) {
                    flyToPlanet(planets.indexOf(planet));
                }
                lastClickTime = now;
            }
        }
    }
    
    window.addEventListener('click', onPlanetClick);
}

function selectPlanet(planet) {
    selectedPlanet = planet;
    showPlanetInfo(planet.data);
    highlightPlanet(planet);
    
    stopSpeech();
    speakText(planet.data.audioDescription);
}

function highlightPlanet(planet) {
    // Reset all highlights
    planets.forEach(p => {
        if (p.mesh.material.emissive) {
            p.mesh.material.emissive.setHex(0x000000);
            p.mesh.material.emissiveIntensity = 0;
        }
    });
    
    // Highlight selected planet
    if (planet.mesh.material.emissive) {
        planet.mesh.material.emissive.setHex(0x333333);
        planet.mesh.material.emissiveIntensity = 0.5;
    }
    
    // Pulse animation
    const originalScale = planet.mesh.scale.clone();
    planet.mesh.scale.multiplyScalar(1.1);
    setTimeout(() => planet.mesh.scale.copy(originalScale), 500);
}

function setupUIControls() {
    document.getElementById('speed').addEventListener('input', function() {
        const speedValue = parseFloat(this.value);
        document.getElementById('speed-value').textContent = speedValue.toFixed(1) + 'x';
    });
    
    const toggleControls = {
        'show-orbits': (visible) => planets.forEach(p => p.orbit && (p.orbit.visible = visible)),
        'show-labels': (visible) => planets.forEach(p => p.label && (p.label.visible = visible)),
        'show-asteroids': (visible) => {
            if (asteroidBelt) asteroidBelt.visible = visible;
            if (kuiperBelt) kuiperBelt.visible = visible;
        },
        'show-scale': (visible) => {
            document.getElementById('scale-indicator').style.display = visible ? 'block' : 'none';
        },
        'auto-rotate': (enabled) => {
            autoRotate = enabled;
            if (!isTourActive && !vrEnabled) {
                controls.autoRotate = autoRotate;
                controls.autoRotateSpeed = 0.5;
            }
        }
    };
    
    Object.entries(toggleControls).forEach(([id, callback]) => {
        document.getElementById(id).addEventListener('change', (e) => callback(e.target.checked));
    });
}

function setupPauseButton() {
    document.getElementById('pause-button').addEventListener('click', function() {
        isPaused = !isPaused;
        this.textContent = isPaused ? 'Resume' : 'Pause';
        
        if (isPaused) {
            pauseSpeech();
        } else {
            resumeSpeech();
        }
    });
}

function setupTourControls() {
    document.getElementById('tour-btn').addEventListener('click', function() {
        isTourActive = !isTourActive;
        this.textContent = isTourActive ? 'Stop Tour' : 'Start Tour';
        
        if (isTourActive) {
            stopSpeech();
            currentTourIndex = 0;
            flyToPlanetInSequence(currentTourIndex);
        } else {
            if (tourTimeout) {
                clearTimeout(tourTimeout);
                tourTimeout = null;
            }
            
            if (selectedPlanet) {
                selectedPlanet.mesh.material.emissive.setHex(0x000000);
                selectedPlanet.mesh.material.emissiveIntensity = 0;
            }
        }
    });
    
    document.getElementById('next-planet').addEventListener('click', function() {
        if (isTourActive) {
            stopSpeech();
            if (tourTimeout) {
                clearTimeout(tourTimeout);
                tourTimeout = null;
            }
        }
        
        currentTourIndex = (currentTourIndex + 1) % tourSequence.length;
        flyToPlanetInSequence(currentTourIndex);
    });
    
    document.getElementById('prev-planet').addEventListener('click', function() {
        if (isTourActive) {
            stopSpeech();
            if (tourTimeout) {
                clearTimeout(tourTimeout);
                tourTimeout = null;
            }
        }
        
        currentTourIndex = (currentTourIndex - 1 + tourSequence.length) % tourSequence.length;
        flyToPlanetInSequence(currentTourIndex);
    });
}

function flyToPlanetInSequence(index) {
    if (index < 0 || index >= tourSequence.length) return;
    
    if (tourTimeout) {
        clearTimeout(tourTimeout);
        tourTimeout = null;
    }

    stopSpeech();

    const planetName = tourSequence[index];
    const planetIndex = planets.findIndex(p => p.data.name === planetName);
    
    if (planetIndex === -1) return;
    
    const planet = planets[planetIndex];
    const targetPosition = planet.mesh.position.clone()
        .normalize()
        .multiplyScalar(Math.max(planet.data.size * 10, 300));
    targetPosition.y += planet.data.size * 3;
    
    const lookAtPosition = planet.mesh.position.clone();
    lookAtPosition.y += planet.data.size * 0.5;
    
    new TWEEN.Tween(camera.position)
        .to(targetPosition, 2500)
        .easing(TWEEN.Easing.Quintic.InOut)
        .start();
    
    new TWEEN.Tween(controls.target)
        .to(lookAtPosition, 2500)
        .easing(TWEEN.Easing.Quintic.InOut)
        .onStart(() => {
            highlightPlanet(planet);
        })
        .onComplete(() => {
            selectPlanet(planet);
            
            const wordCount = planet.data.audioDescription.split(/\s+/).length;
            const estimatedDuration = Math.max(3000, (wordCount / 150) * 60 * 1000);
            
            speakText(planet.data.audioDescription, () => {
                if (isTourActive) {
                    tourTimeout = setTimeout(() => {
                        currentTourIndex = (index + 1) % tourSequence.length;
                        flyToPlanetInSequence(currentTourIndex);
                    }, 1000);
                }
            });
        })
        .start();
}

function flyToPlanet(index) {
    if (index < 0 || index >= planets.length) return;
    
    const planet = planets[index];
    const targetPosition = planet.mesh.position.clone()
        .normalize()
        .multiplyScalar(Math.max(planet.data.size * 10, 300));
    targetPosition.y += planet.data.size * 3;
    
    const lookAtPosition = planet.mesh.position.clone();
    lookAtPosition.y += planet.data.size * 0.5;
    
    new TWEEN.Tween(camera.position)
        .to(targetPosition, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    
    new TWEEN.Tween(controls.target)
        .to(lookAtPosition, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
            selectPlanet(planet);
        })
        .start();
}

function setupVR() {
    if (!('xr' in navigator)) {
        document.getElementById('vr-button').style.display = 'none';
        return;
    }
    
    navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        if (!supported) {
            document.getElementById('vr-button').style.display = 'none';
            return;
        }
        
        document.getElementById('vr-button').addEventListener('click', toggleVR);
    });
}

function toggleVR() {
    if (vrEnabled) {
        renderer.xr.getSession()?.end();
        vrEnabled = false;
        document.getElementById('vr-button').textContent = 'VR Mode';
    } else {
        renderer.xr.enabled = true;
        navigator.xr.requestSession('immersive-vr')
            .then(session => {
                renderer.xr.setSession(session);
                vrEnabled = true;
                document.getElementById('vr-button').textContent = 'Exit VR';
                renderer.setAnimationLoop(() => renderer.render(scene, camera));
                session.addEventListener('end', () => {
                    vrEnabled = false;
                    document.getElementById('vr-button').textContent = 'VR Mode';
                    renderer.setAnimationLoop(null);
                });
            });
    }
}

function setupFullscreen() {
    document.getElementById('fullscreen-button').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => {
                    document.getElementById('fullscreen-button').textContent = 'Exit Fullscreen';
                });
        } else {
            document.exitFullscreen();
        }
    });
    
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            document.getElementById('fullscreen-button').textContent = 'Fullscreen';
        }
    });
}

function setupVoiceControls() {
    if (!speechSynthesis) {
        document.getElementById('read-aloud').style.display = 'none';
        document.getElementById('voice-controls').style.display = 'none';
        return;
    }
    
    document.getElementById('read-aloud').addEventListener('click', readAloud);
    document.getElementById('voice-stop').addEventListener('click', stopSpeech);
    document.getElementById('voice-pause').addEventListener('click', pauseSpeech);
    document.getElementById('voice-play').addEventListener('click', resumeSpeech);
}

function readAloud() {
    const infoTitle = document.getElementById('info-title').textContent;
    const facts = Array.from(document.querySelectorAll('.planet-fact'))
        .map(el => el.textContent)
        .join('. ');
    stopSpeech();
    speakText(`${infoTitle}. ${facts}`);
}

/* ============================================= */
/* INFO PANEL AND UTILITIES */
/* ============================================= */

function showPlanetInfo(planetData) {
    Object.entries({
        'info-title': planetData.name,
        'info-type': planetData.type,
        'info-diameter': planetData.diameter,
        'info-distance': planetData.distance,
        'info-period': planetData.period,
        'info-rotation': planetData.rotation,
        'info-moons': planetData.moons,
        'info-atmosphere': planetData.atmosphere,
        'info-temperature': planetData.temperature,
        'info-fact': planetData.fact
    }).forEach(([id, value]) => {
        document.getElementById(id).textContent = value;
    });
    
    const panel = document.getElementById('info-panel');
    panel.style.display = 'block';
    panel.style.borderColor = planetData.labelColor;
    panel.style.boxShadow = `0 0 15px ${planetData.labelColor}`;
    
    setTimeout(() => {
        if (!panel.matches(':hover')) {
            panel.style.display = 'none';
        }
    }, 15000);
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
            
            new TWEEN.Tween(camera.position)
                .to({ x: 0, y: 300, z: 800 }, 2000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
                
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
        }, 500);
    }
}

/* ============================================= */
/* ANIMATION LOOP */
/* ============================================= */

function animate() {
    requestAnimationFrame(animate);
    
    if (isPaused) return;
    
    const t = Date.now() * 0.00005 * parseFloat(document.getElementById('speed').value);
    
    TWEEN.update();
    
    controls.autoRotate = autoRotate && !isTourActive && !vrEnabled;
    
    planets.forEach(planet => {
        if (planet.isMoon) {
            const time = Date.now() * 0.001 * planet.orbitSpeed;
            
            planet.mesh.position.set(
                planet.parentObject.position.x + planet.orbitRadiusX * Math.cos(time),
                planet.parentObject.position.y,
                planet.parentObject.position.z + planet.orbitRadiusZ * Math.sin(time)
            );
            
            planet.mesh.rotation.y += 0.002;
            
            if (planet.label) {
                planet.label.position.copy(planet.mesh.position);
                planet.label.position.y += planet.data.size + 8;
                planet.label.lookAt(camera.position);
                
                const dist = camera.position.distanceTo(planet.mesh.position);
                const scale = Math.min(1, 500/dist);
                planet.label.scale.set(scale * 20, scale * 10, 1);
            }
            return;
        }

        planet.mesh.rotation.y += 0.005;
        
        if (!planet.data.name.includes('Sun')) {
            const phi = t * planet.data.speed;
            planet.mesh.position.set(
                planet.data.a * Math.cos(phi),
                0,
                planet.data.b * Math.sin(phi)
            );
        }
        
        if (planet.label) {
            planet.label.position.copy(planet.mesh.position);
            planet.label.position.y += planet.data.size + 10;
            planet.label.lookAt(camera.position);
            
            const dist = camera.position.distanceTo(planet.mesh.position);
            const scale = Math.min(1, 1000/dist);
            planet.label.scale.set(scale * 25, scale * 12, 1);
        }
    });
    
    if (!vrEnabled) {
        controls.update();
        renderer.render(scene, camera);
    }
}

function updateLabelSizes() {
    planets.forEach(planet => {
        if (planet.label) {
            const distance = planet.mesh.position.distanceTo(camera.position);
            const scaleFactor = Math.min(1, 1000 / distance);
            planet.label.scale.set(scaleFactor * 25.6, scaleFactor * 12.8, 1);
            
            const labelHeight = planet.data.size + (planet.label.scale.y * 5);
            planet.label.position.y = labelHeight;
            
            const visibility = Math.min(1, 100 / distance);
            planet.label.material.opacity = visibility;
        }
    });
}

function updateScaleIndicator() {
    const sun = planets.find(p => p.data.name.includes('Sun'));
    if (!sun) return;
    
    const distance = camera.position.distanceTo(sun.mesh.position);
    const scale = Math.round(distance / 10) * 1000;
    document.getElementById('scale-value').textContent = scale.toLocaleString();
    
    const scaleIndicator = document.getElementById('scale-indicator');
    scaleIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    scaleIndicator.style.border = '1px solid #1E90FF';
    scaleIndicator.style.borderRadius = '5px';
    scaleIndicator.style.padding = '5px';
    scaleIndicator.style.color = '#1E90FF';
}

/* ============================================= */
/* INITIALIZATION */
/* ============================================= */

window.addEventListener('load', init);