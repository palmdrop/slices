import * as THREE from 'three';
import { CSS3DObject } from "../../examples/jsm/renderers/CSS3DRenderer";
import { volume } from '../structures/geometrical';
import { CreateSpace } from "./space";
import { makeNoise3D } from 'fast-simplex-noise';

const noise3D = makeNoise3D(() => 1000 * Math.random());

export const createGridVolume: CreateSpace = (
  imageData,
  styles,
  onInteraction
) => {
  const object = new THREE.Object3D();

  const offset = Math.floor(Math.random() * imageData.length);

  const rows = Math.floor(Math.random() * 6 + 1);
  const columns = Math.floor(Math.random() * 6 + 1);
  const layers = Math.floor(Math.random() * 6 + 1);
  const spacing = 550;

  for(let x = 0; x < columns; x++) for(let y = 0; y < rows; y++) for(let z = 0; z < layers; z++) {
    const volumeGroup = volume(
      Array(6).fill(imageData[(x * rows + y + offset) % imageData.length]) as any,
      150, 350, 150,
      styles
    );

    volumeGroup.position.x = (x - (columns - 1) / 2.0) * spacing;
    volumeGroup.position.y = (y - (rows - 1) / 2.0) * spacing;
    volumeGroup.position.z = (z - (layers - 1) / 2.0) * spacing;

    const componentNoise = ( x: number, y: number, z: number, frequency: number, min = -1.0, max = 1.0) => {
      return THREE.MathUtils.mapLinear(
        noise3D( x * frequency, y * frequency, z * frequency ),
        -1.0, 1.0,
        min, max 
      );
    }

    const min = -0.3 * ( layers - z - 1);
    const max = 0.3 * ( layers - z - 1);
    const frequency = 0.024;
    const offsetMultiplier = 300;

    volumeGroup.rotation.set(
      componentNoise( columns, rows, layers +   0, frequency, min, max ),
      componentNoise( columns, rows, layers + 131, frequency, min, max ),
      componentNoise( columns, rows, layers + 712, frequency, min, max )
    )

    volumeGroup.position.add(new THREE.Vector3(
      THREE.MathUtils.randFloatSpread( max * offsetMultiplier ),
      THREE.MathUtils.randFloatSpread( max * offsetMultiplier ),
      THREE.MathUtils.randFloatSpread( max * offsetMultiplier ),
    ))

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

  object.position.set( 0, 0, -1000 );

  return object;
}