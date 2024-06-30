/*import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Define the type for the result of useGLTF
interface GLTFResult extends GLTF {
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
}

interface GLBModelProps {
  url: string;
  position?: [number, number, number];
}

const GLBModel = ({ url, position = [0, 0, 0] }: GLBModelProps) => {
  const { scene } = useGLTF(url) as GLTFResult;
  return <primitive object={scene} position={position} />;
};

interface GLBProps {
  id: string;
  width: string;
  height: string;
}

const GLB = ({ id, width, height }: GLBProps) => {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Fetch the URL from localhost:8000
    const fetchUrl = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/products/getone/${id}`, {
          method: 'GET',
        });
        const data = await response.json();
        console.log(data.data)
        setUrl(data.data.modelPic); // Assuming the response contains the URL in the 'url' field
      } catch (error) {
        console.error('Error fetching the model URL:', error);
      }
    };

    fetchUrl();
  }, [id]);

  return (
    <div style={{ width: width, height: height }} className='z-10 bg-white rounded-lg'>
      <Canvas>
        <ambientLight intensity={1} />
        <pointLight position={[0, 0, 0]} />
        {url && <GLBModel url={url} position={[0, 0, 3]} />} {/* You can set any position here }
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default GLB;
*/