// src/declarations.d.ts
declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Loader, LoadingManager, Group, BufferGeometry, Material } from 'three';
  
    export class GLTFLoader extends Loader {
      constructor(manager?: LoadingManager);
      load(
        url: string,
        onLoad: (gltf: GLTF) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
      ): void;
      parse(data: ArrayBuffer | string, path: string, onLoad: (gltf: GLTF) => void): void;
      setDRACOLoader(dracoLoader: any): this;
    }
  
    export interface GLTF {
      animations: AnimationClip[];
      scene: Group;
      scenes: Group[];
      cameras: Camera[];
      asset: object;
      parser: object;
      userData: object;
    }
  
    export interface GLTFReference {
      type: string;
      index: number;
      object: any;
    }
  
    export interface GLTFNode {
      [key: string]: any;
    }
  }
  