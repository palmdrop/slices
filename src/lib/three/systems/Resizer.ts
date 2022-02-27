import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer';
import type { ResizeCallback, Resizer } from '../core';

export class SimpleResizer implements Resizer {
  private container : HTMLElement;
  private camera : THREE.Camera;
  private renderer : CSS3DRenderer;

  constructor( container : HTMLElement, camera : THREE.Camera, renderer : CSS3DRenderer ) {
    this.container = container;
    this.camera = camera;
    this.renderer = renderer;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resize( callback ?: ResizeCallback, width ?: number, height ?: number ) {
    if( !width ) width = this.container.clientWidth;
    if( !height ) height = this.container.clientHeight;

    // const currentSize = this.renderer.getSize( new THREE.Vector2() );
    const newSize = new THREE.Vector2( width, height );

    // If size is unchanged, do nothing
    // if( !force && currentSize.equals( newSize ) ) return;

    this.renderer.setSize( newSize.x, newSize.y );

    if( (this.camera as THREE.PerspectiveCamera).isPerspectiveCamera ) {
      const camera = this.camera as THREE.PerspectiveCamera;
      camera.aspect = newSize.x / newSize.y;
      camera.updateProjectionMatrix();
    }

    callback && callback( newSize.x, newSize.y );
  }
}