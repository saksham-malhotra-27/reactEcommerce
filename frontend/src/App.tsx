import './App.css'
import { useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import GLTF from 'three/examples/jsm/loaders/GLTFLoader';
import THREE from "three"

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
};

const GLBModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url) as GLTFResult;
  return <primitive object={scene} />;
};

function App() {
 
  return (
  <div style={{ width: '90vw', height: '100vh' }}>
    <Canvas >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <GLBModel  url="https://res.cloudinary.com/dxptcdxtr/image/upload/v1717339412/qpygjqsn5ktdd5tnaona.glb" />
      <OrbitControls />
    </Canvas>
  </div>
  )
}

export default App
