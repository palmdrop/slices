import { Styles } from '$lib/dom/utils';
import * as THREE from 'three';
import { ImageData } from '../analyzis/imageSpace';
import { imageToCSS3DObject } from '../../css/object';

export const stack = (
  imageData: ImageData[],
  from: THREE.Vector3,
  to: THREE.Vector3,
  rotation?: number | ((index: number) => number),
  styles?: Styles
) => {
  const vector = to.clone().sub(from);
  const distance = vector.length();
  const direction = vector.clone().normalize();

  const axis = new THREE.Vector3(0, 0, 1).cross(direction);

  const objects = imageData.map((data, i) => {
    const object = imageToCSS3DObject({
      path: data.file,
      styles
    });

    object.position
      .copy(direction)
      .multiplyScalar(i * distance / imageData.length)
      .add(from);

    object.setRotationFromAxisAngle(axis, Math.PI / 2);

    if (rotation) {
      typeof rotation === 'number' 
        ? object.setRotationFromAxisAngle(direction, rotation)
        : object.setRotationFromAxisAngle(direction, rotation(i));
    }

    return object;
  })

  return new THREE.Object3D().add(...objects);
}

export const volume = (
  imageData: [
    ImageData, ImageData, // front, back
    ImageData, ImageData, // top, bottom
    ImageData, ImageData  // left, right
  ],
  width: number,
  height: number,
  depth: number,
  styles: Styles
) => {

  const objects = imageData.map((data, i) => {
    let w, h;
    const rotation = new THREE.Vector3();
    const position = new THREE.Vector3();
    if (i < 2) {
      w = width; 
      h = height;
      position.set(
        0,
        0,
        depth / 2.0,
      );
    } else if(i < 4) {
      w = width;
      h = depth;
      rotation.set(
        Math.PI / 2.0,
        0, 
        0
      );
      position.set(
        0,
        height / 2.0,
        0,
      );
    } else {
      w = depth;
      h = height;
      rotation.set(
        0,
        Math.PI / 2.0,
        0
      );
      position.set(
        width / 2.0,
        0,
        0,
      );
    }

    if (i % 2 == 0) {
      position.multiplyScalar( -1 );
    }

    const object = imageToCSS3DObject({
      path: data.file,
      width: w,
      height: h,
      styles
    });

    object.position.copy(position);
    object.rotation.setFromVector3(rotation);

    return object;
  })

  return new THREE.Object3D().add(...objects);
}
