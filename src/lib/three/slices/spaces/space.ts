import { Styles } from '$lib/dom/utils';
import * as THREE from 'three';
import { ImageData } from '../analyzis/imageSpace';

export type CreateSpace = (
  imageData: ImageData[],
  styles: Styles,
  onInteraction ?: ( img: HTMLImageElement | null) => void
) => THREE.Object3D;