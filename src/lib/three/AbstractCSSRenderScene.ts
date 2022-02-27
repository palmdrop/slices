import * as THREE from 'three';

import { CSS3DRenderer } from './examples/jsm/renderers/CSS3DRenderer';

import { AnimationLoop, DataURLCallback, RenderScene, Resizer, VoidCallback } from './core';
import { SimpleAnimationLoop } from './systems/AnimationLoop';
import { SimpleResizer } from './systems/Resizer';

type Resizeable = {
  setSize : ( width : number, height : number ) => void
}

export abstract class AbstractCSSRenderScene implements RenderScene {
  // canvas : HTMLCanvasElement;
  domElement ?: HTMLElement;
  onLoad ?: VoidCallback;

  protected loop : AnimationLoop;
  protected resizer : Resizer;
  protected resizeables : Resizeable[];

  protected renderer : CSS3DRenderer;
  protected scene : THREE.Scene;
  protected camera : THREE.Camera;

  // protected composer ?: EffectComposer;

  protected captureNext : boolean;
  protected captureFrameResolutionMultiplier : number;
  protected dataCallback ?: DataURLCallback;

  constructor( domElement ?: HTMLElement, onLoad ?: VoidCallback ) {
    // this.canvas = canvas;
    this.onLoad = onLoad;
    this.loop = this.createLoop();

    this.renderer = this.createRenderer( domElement );
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.resizer = this.createResizer();
    this.resizeables = [];

    this.captureNext = false;
    this.dataCallback = undefined;
    this.captureFrameResolutionMultiplier = 2.0;
  }

  private createLoop() : AnimationLoop {
    return new SimpleAnimationLoop( ( delta : number, now : number ) : void => {
      this.update( delta, now );
      this.render( delta, now );

      if( this.captureNext ) {
        this.captureNext = false;
      }
    } );
  }

  protected createRenderer( domElement ?: HTMLElement ) : CSS3DRenderer {
    const renderer = new CSS3DRenderer( {
      element: domElement
    } );

    this.domElement = renderer.domElement;

    return renderer;
  }

  private createScene() : THREE.Scene {
    const scene = new THREE.Scene();

    return scene;
  }

  private createCamera() : THREE.Camera {
    /*
    const camera = new THREE.PerspectiveCamera(
      75,
      this.domElement.clientWidth / this.domElement.clientHeight,
      0.1,
      50 
    );
    */
    const camera = new THREE.OrthographicCamera(
      -1500, 1500,
      1500, -1500,
      0, 5000
    );

    camera.position.set( 0, 0, 6 );

    return camera;
  }

  private createResizer() : Resizer {
    return new SimpleResizer( this.domElement, this.camera, this.renderer );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render( delta : number, now : number ) : void {
    /*
    if( this.composer ) {
      this.composer.render( delta );
    } else {
      this.renderer.render( this.scene, this.camera );
    }
    */
    this.renderer.render(
      this.scene, this.camera
    );
  }

  abstract update( delta : number, now : number ) : void;

  resize( width ?: number, height ?: number, force ?: boolean ) : void {
    this.resizer.resize( ( width : number, height : number ) => {
      this.resizeables.forEach( resizeable => resizeable.setSize( width, height ) );
    }, width, height, force );
  }

  start() : void {
    this.loop.start();
  }

  stop() : void {
    this.loop.stop();
  }
}