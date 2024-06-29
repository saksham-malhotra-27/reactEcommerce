import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import TShirtModel from '../components/TShirt';
import Layout from '../components/Layout.tsx/Layout';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      // In a real application, replace the following line with the API call to generate the image
      // Here we're just using the local image path for demonstration
      setImage('/nitro.jpg');
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center p-4 gap-8">
        <h1 className="rounded-full text-white font-semibold text-center w-full bg-[#141414] p-4">
          3D T-Shirt Designer
        </h1>
        <div className="flex flex-col items-center w-full gap-4">
          <div className="flex flex-col md:flex-row items-center w-full gap-4">
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
          {image && (
            <div className="w-full h-96">
              <Canvas>
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <TShirtModel image={image} />
              </Canvas>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
