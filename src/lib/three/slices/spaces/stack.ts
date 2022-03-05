import * as THREE from 'three';
import { CSS3DObject } from "../../examples/jsm/renderers/CSS3DRenderer";
import { volume } from '../structures/geometrical';
import { CreateSpace } from "./space";

export const createStack: CreateSpace = (
  imageData,
  styles,
  onInteraction
) => {
  const object = new THREE.Object3D();

  const offset = Math.floor(Math.random() * imageData.length);

  const width = 1000;
  const height = THREE.MathUtils.randInt( 50, 100 );
  const depth = 1000;
  const padding = height;

  const layers = THREE.MathUtils.randInt( 5, 20 );

  for(let i = 0; i < layers; i++) {
    const volumeGroup = volume(
      Array(6).fill(imageData[(i + offset) % imageData.length]) as any,
      width, height, depth,
      styles
    );

    // volumeGroup.position.y = 100 * i - 500;
    volumeGroup.position.y = ( height + padding ) * i - layers * ( height + padding ) / 2.0;

    volumeGroup.rotation.x += THREE.MathUtils.randFloatSpread(
      i * i * 0.00025
    );
    volumeGroup.rotation.z += THREE.MathUtils.randFloatSpread(
      i * i * 0.00025
    );

    volumeGroup.rotation.y += THREE.MathUtils.randFloatSpread(
      i * i * 0.002
    );


    volumeGroup.children.forEach((child: CSS3DObject) => {
      const element = child.element as HTMLImageElement;

      element.onclick = 
      element.ontouchstart = 
      element.onmouseenter = () => {
        onInteraction?.(element);
      }
    })

    object.add( volumeGroup );
  }

  return object;
}