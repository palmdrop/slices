import * as THREE from 'three';
import { volume } from '../structures/geometrical';
import { CSS3DObject } from "../../examples/jsm/renderers/CSS3DRenderer";
import { CreateSpace } from "./space";
import { imageToCSS3DObject } from '../../css/object';

import { makeNoise3D } from 'fast-simplex-noise';
const noise3D = makeNoise3D(() => Math.random() * 1000)

export const createSky : CreateSpace = (
  imageData,
  styles,
  onInteraction
) => {
  const object = new THREE.Object3D();
  const offset = THREE.MathUtils.randInt(0, imageData.length - 1);

  const layerSpacing = THREE.MathUtils.randFloat( 100, 200 );
  const layers =  THREE.MathUtils.randInt( 1, 10 );
  const centerRadius = THREE.MathUtils.randInt( 750 - layers * 90, 1000 - layers * 90);

  const noiseFrequency = THREE.MathUtils.randFloat( 0.001, 0.004 );
  const rotationAmount = Math.random() > 0.5 
    ? THREE.MathUtils.randFloat( 0, 0.4 * Math.PI ) 
    : 0.0;
  
  const randomChildRotation = Math.random() > 0.5
    ? rotationAmount * 0.1
    : 0.0;
  
  const replaceChildRotation = Math.random() > 0.5 && !rotationAmount;

  const makeInteractive = (element: HTMLImageElement) => {
    element.onclick = 
    element.ontouchstart = 
    element.onmouseenter = () => {
      onInteraction?.(element);
    }
  }

  const componentNoise = ( x: number, y: number, z: number, frequency: number, min = -1.0, max = 1.0) => {
    return THREE.MathUtils.mapLinear(
      noise3D( x * frequency, y * frequency, z * frequency ),
      -1.0, 1.0,
      min, max 
    );
  }

  for(let i = 0; i < layers; i++) {
    const size = centerRadius + i * layerSpacing;

    const layer = volume(
      Array(6).fill( imageData[ (offset + i) % imageData.length ] ) as any,
      size, 
      size, 
      size,

      { ...styles, 
        borderRadius: '100em',
        opacity: '0.3',
        filter: (styles.filter ?? '') + ' brightness(300%)',
        // mixBlendMode: 'difference'
      }
    );

    layer.children.map(
      (child: CSS3DObject) => child.element as HTMLImageElement
    ).forEach(makeInteractive)

    layer.rotation.set(
      componentNoise( i, 0, 0, noiseFrequency, -i * rotationAmount, i * rotationAmount),
      componentNoise( 0, i, 0, noiseFrequency, -i * rotationAmount, i * rotationAmount),
      componentNoise( 0, 0, i, noiseFrequency, -i * rotationAmount, i * rotationAmount),
    )

    layer.children.forEach(child => {
      const rx = THREE.MathUtils.randFloatSpread(i * randomChildRotation);
      const ry = THREE.MathUtils.randFloatSpread(i * randomChildRotation);
      const rz = THREE.MathUtils.randFloatSpread(i * randomChildRotation);

      if(replaceChildRotation) {
        child.rotation.set(rx, ry, rz);
      } else {
        child.rotation.x += rx;
        child.rotation.y += ry;
        child.rotation.z += rz;
      }
    })

    object.add( layer );
  }


  object.rotation.set(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  );

  return object;
}