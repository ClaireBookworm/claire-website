import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Layout from '../components/layout';
import { getBookColor, getBookDimensions } from '../lib/bookUtils';

export default function Recommendations({ recommendations }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const raycasterRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2());
  const [hoveredBook, setHoveredBook] = useState(null);

  useEffect(() => {
    if (!recommendations) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background for cleaner look
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 8);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Raycaster for mouse interactions
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Load FBX bookshelf model
    loadBookshelfModel(scene, recommendations);

    // Create vinyl stack
    createVinylStack(scene);

    // Create magazine layout
    createMagazineLayout(scene);

    // Mouse events
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update raycaster
      raycaster.setFromCamera(mouseRef.current, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Handle hover effects
      let foundHover = false;
      intersects.forEach((intersect) => {
        if (intersect.object.userData.type === 'book') {
          foundHover = true;
          setHoveredBook(intersect.object.userData.bookData);
          intersect.object.material.emissive.setHex(0x222222);
        } else if (intersect.object.userData.type === 'magazine') {
          foundHover = true;
          setHoveredBook(intersect.object.userData.magazineData);
          intersect.object.material.emissive.setHex(0x222222);
        }
      });

      if (!foundHover && hoveredBook) {
        setHoveredBook(null);
        // Reset all book and magazine materials
        scene.traverse((child) => {
          if (child.userData.type === 'book' || child.userData.type === 'magazine') {
            child.material.emissive.setHex(0x000000);
          }
        });
      }

      // Gentle camera movement
      camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
      camera.lookAt(0, 1, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Mount renderer
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hoveredBook, recommendations]);

  const loadBookshelfModel = (scene, recs) => {
    const loader = new FBXLoader();
    
    loader.load('/aio_shelf.FBX', (fbx) => {
      // Scale and position the model
      fbx.scale.setScalar(0.01); // Adjust scale as needed
      fbx.position.set(0, -2, 0);
      
      // Enable shadows
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      scene.add(fbx);
      
      // Add books to the loaded model
      addBooksToModel(fbx, recs);
    }, (progress) => {
      console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    }, (error) => {
      console.error('Error loading FBX:', error);
      // Fallback to simple bookshelf if FBX fails to load
      createSimpleBookshelf(scene, recs);
    });
  };

  const addBooksToModel = (bookshelfModel, recs) => {
    const allBooks = recs.books || [];
    
    allBooks.forEach((bookData, index) => {
      const dimensions = getBookDimensions(index);
      const bookGeometry = new THREE.BoxGeometry(
        dimensions.width,
        dimensions.height,
        dimensions.depth
      );
      
      const bookMaterial = new THREE.MeshLambertMaterial({
        color: getBookColor(index)
      });
      
      const book = new THREE.Mesh(bookGeometry, bookMaterial);
      
      // Position books on shelves (adjust these positions based on your FBX model)
      const shelfIndex = Math.floor(index / 8);
      const bookIndex = index % 8;
      
      book.position.x = (bookIndex - 3.5) * 0.8;
      book.position.y = shelfIndex * 1.5 + 0.5 + dimensions.height / 2;
      book.position.z = -8 + dimensions.depth / 2;
      
      book.castShadow = true;
      book.userData = {
        type: 'book',
        bookData: {
          title: bookData.title,
          author: bookData.author,
          notes: bookData.notes,
          link: bookData.link
        }
      };
      
      bookshelfModel.add(book);
    });
  };

  const createSimpleBookshelf = (scene, recs) => {
    // Fallback simple bookshelf if FBX fails to load
    const bookshelfGroup = new THREE.Group();
    
    // Simple bookshelf structure
    const shelfMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    
    // Vertical supports
    for (let i = 0; i < 3; i++) {
      const support = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 6, 0.1),
        shelfMaterial
      );
      support.position.x = i * 3 - 3;
      support.position.y = 3;
      support.position.z = -8;
      support.castShadow = true;
      bookshelfGroup.add(support);
    }

    // Horizontal shelves
    for (let i = 0; i < 4; i++) {
      const shelf = new THREE.Mesh(
        new THREE.BoxGeometry(6, 0.1, 0.3),
        shelfMaterial
      );
      shelf.position.x = 0;
      shelf.position.y = i * 1.5 + 0.5;
      shelf.position.z = -8;
      shelf.castShadow = true;
      bookshelfGroup.add(shelf);
    }

    scene.add(bookshelfGroup);
    addBooksToModel(bookshelfGroup, recs);
  };

  const createVinylStack = (scene) => {
    const vinylGroup = new THREE.Group();
    
    // Create stack of vinyl records
    for (let i = 0; i < 8; i++) {
      const vinylGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.02, 32);
      const vinylMaterial = new THREE.MeshLambertMaterial({ 
        color: i % 2 === 0 ? 0x000000 : 0x333333 
      });
      
      const vinyl = new THREE.Mesh(vinylGeometry, vinylMaterial);
      vinyl.position.x = 6;
      vinyl.position.y = i * 0.02 + 0.01;
      vinyl.position.z = -6;
      vinyl.rotation.x = Math.PI / 2;
      vinyl.castShadow = true;
      
      vinylGroup.add(vinyl);
    }

    // Vinyl player
    const playerGeometry = new THREE.BoxGeometry(1.5, 0.3, 1.5);
    const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x2C2C2C });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.x = 6;
    player.position.y = 0.15;
    player.position.z = -6;
    player.castShadow = true;
    
    vinylGroup.add(player);
    scene.add(vinylGroup);
  };

  const createMagazineLayout = (scene) => {
    const magazineGroup = new THREE.Group();
    
    // Coffee table
    const tableGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.x = -4;
    table.position.y = 0.05;
    table.position.z = -2;
    table.castShadow = true;
    magazineGroup.add(table);

    // Magazines scattered on table
    const magazines = recommendations.blogs || [];
    const magazineColors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0x96CEB4, 0xFFB347, 0x98D8C8];

    magazines.forEach((mag, index) => {
      const magGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.02);
      const magMaterial = new THREE.MeshLambertMaterial({ 
        color: magazineColors[index % magazineColors.length] 
      });
      const magazine = new THREE.Mesh(magGeometry, magMaterial);
      
      magazine.position.x = -4 + (index - 1.5) * 0.4;
      magazine.position.y = 0.1 + index * 0.01;
      magazine.position.z = -2 + Math.sin(index) * 0.3;
      magazine.rotation.y = Math.sin(index) * 0.3;
      magazine.castShadow = true;
      
      magazine.userData = {
        type: 'magazine',
        magazineData: { 
          title: mag.name,
          notes: mag.notes,
          link: mag.link
        }
      };
      
      magazineGroup.add(magazine);
    });

    scene.add(magazineGroup);
  };

  return (
    <Layout active="recs">
      <div className="relative">
        <div className="heading mb-8">recommendations</div>
        
        {/* 3D Scene */}
        <div 
          ref={mountRef} 
          className="w-full h-screen"
          style={{ height: '80vh' }}
        />
        
        {/* Hover Info Panel */}
        {hoveredBook && (
          <div className="fixed top-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg max-w-sm z-10">
            <h3 className="font-gilroy text-lg font-bold mb-2">
              {hoveredBook.title}
            </h3>
            {hoveredBook.author && (
              <p className="text-sm text-gray-600 mb-2">
                by {hoveredBook.author}
              </p>
            )}
            {hoveredBook.notes && (
              <p className="text-xs text-gray-700 mb-2">
                {hoveredBook.notes}
              </p>
            )}
            {hoveredBook.link && (
              <a 
                href={hoveredBook.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                View more →
              </a>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="fixed bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg z-10">
          <p className="text-sm text-gray-700">
            🖱️ Hover over books to see titles<br/>
            🎵 Vinyl records and magazines<br/>
            📚 Interactive 3D bookshelf
          </p>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');

  const filePath = path.join(process.cwd(), 'lib', 'recommendations.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const recommendations = JSON.parse(fileContents);

  return {
    props: {
      recommendations
    }
  };
}
