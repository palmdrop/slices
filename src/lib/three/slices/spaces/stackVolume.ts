import * as THREE from 'three';
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { volume } from '../structures/geometrical';
import { CreateSpace } from "./space";

export const createStackVolume: CreateSpace = (
  imageData,
  styles,
  onHover
) => {
  const object = new THREE.Object3D();

  const offset = Math.floor(Math.random() * imageData.length);

  for(let i = 0; i < 10; i++) {
    const volumeGroup = volume(
      Array(6).fill(imageData[(i + offset) % imageData.length]) as any,
      1000, 60, 1000,
      styles
    );

    volumeGroup.position.y = 100 * i - 500;

    volumeGroup.children.forEach((child: CSS3DObject) => {
      const element = child.element as HTMLImageElement;

      element.onmouseenter = () => {
        onHover?.(element);
      }

      element.onmouseleave = () => {
        onHover?.(null);
      }
    })

    object.add( volumeGroup );
  }

  return object;
}