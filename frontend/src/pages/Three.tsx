import React, { useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { TextureLoader, Vector3, Euler } from 'three';
import Layout from '../components/Layout.tsx/Layout';
import { useAuth } from '../context/auth';

interface ModelViewerProps {
  modelUrl: string;
  textureUrl: string | null;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl, textureUrl }) => {
  const { scene } = useGLTF(modelUrl);
  const texture = useLoader(TextureLoader, textureUrl || '');

  // Apply texture to all mesh objects in the scene
  scene.traverse((child) => {
    if ((child as any).isMesh) {
      (child as any).material.map = texture;
    }
  });

  // State for transformations based on the model
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  const [rotation, setRotation] = useState<Euler>(new Euler(0, 0, 0));

  useEffect(() => {
    // Define custom properties for different models
    switch(modelUrl) {
      case '/glbs/combo.glb':
        setScale(2);
        setPosition(new Vector3(0, 0, 0));
        setRotation(new Euler(0, 0, 0));
        break;
      case '/glbs/dress.glb':
        setScale(1.5);
        setPosition(new Vector3(0, -0.5, 0));
        setRotation(new Euler(0, Math.PI, 0));
        break;
      case '/glbs/shirt.glb':
        setScale(2.2);
        setPosition(new Vector3(0.5, 0, 0));
        setRotation(new Euler(0, Math.PI / 2, 0));
        break;
      case '/glbs/trousers.glb':
        setScale(2.5);
        setPosition(new Vector3(-0.5, 0, 0));
        setRotation(new Euler(0, -Math.PI / 2, 0));
        break;
      default:
        setScale(1);
        setPosition(new Vector3(0, 0, 0));
        setRotation(new Euler(0, 0, 0));
    }
  }, [modelUrl]);

  return (
    <primitive 
      object={scene} 
      scale={scale} 
      position={position.toArray()} 
      rotation={rotation.toArray()} 
    />
  );
};

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // Added quantity state
  const [selectedModel, setSelectedModel] = useState<string>('combo.glb'); // Default model
  const [auth] = useAuth();

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `${String(auth.token)}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok && data.imageUrls && data.imageUrls.length > 0) {
        setImage(data.imageUrls[0]); // Assuming the first URL is the desired image
      } else {
        setError('Failed to generate image. Please try again.');
        console.error('Error response:', data);
      }
    } catch (error) {
      setError('An error occurred while generating the image. Please try again.');
      console.error('Error generating image:', error);
    }

    setLoading(false);
  };

  const handleSave3DModel = async () => {
    if (!image) {
      setError('No image generated to save.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/save3d`, {
        method: 'POST',
        headers: {
          'Authorization': `${String(auth.token)}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedModel, // Use the model name as the name
          picURL: image,       // The generated image URL
          quantity: quantity,  // The quantity entered by the user
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('3D model saved successfully.');
      } else {
        setError('Failed to save 3D model. Please try again.');
        console.error('Error response:', data);
      }
    } catch (error) {
      setError('An error occurred while saving the 3D model. Please try again.');
      console.error('Error saving 3D model:', error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center p-4 gap-8">
        <h1 className="rounded-full text-white font-semibold text-center w-full bg-[#141414] p-4">
          3D Model Designer
        </h1>
        <div className="flex flex-col items-center w-full gap-4">
          <div className="flex flex-col md:flex-row items-center w-full gap-4">
            {/* Dropdown to select model */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border rounded-full p-2"
            >
              <option value="combo.glb">Combo</option>
              <option value="dress.glb">Dress</option>
              <option value="shirt.glb">Shirt</option>
              <option value="trousers.glb">Trousers</option>
            </select>

            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your design prompt"
              className="border rounded-full p-2 w-full md:w-auto"
            />
            <button
              className="text-white hover:bg-black bg-[#141414] h-fit w-fit p-2 rounded-full"
              onClick={handleGenerateImage}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Quantity input */}
          <div className="flex flex-col md:flex-row items-center w-full gap-4">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
              className="border rounded-full p-2 w-full md:w-auto"
              min="1"
            />
            <button
              className="text-white hover:bg-black bg-[#141414] h-fit w-fit p-2 rounded-full"
              onClick={handleSave3DModel}
              disabled={!image}
            >
              Save 3D Model
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {image && (
            <div className="w-full h-96">
              <Canvas>
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <ModelViewer modelUrl={`/glbs/${selectedModel}`} textureUrl={image} />
              </Canvas>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
