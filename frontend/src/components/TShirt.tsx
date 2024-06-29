import React from 'react';
import { useLoader, extend } from '@react-three/fiber';
import { TextureLoader, BoxGeometry, MeshStandardMaterial } from 'three';

// Extend the THREE namespace
extend({ BoxGeometry, MeshStandardMaterial });

interface TShirtModelProps {
  image: string;
}

const TShirtModel: React.FC<TShirtModelProps> = ({ image }) => {
  const texture = useLoader(TextureLoader, image);

  return (
    <mesh rotation={[0, Math.PI, 0]}>
      <boxGeometry args={[2, 3, 0.5]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default TShirtModel;
