import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import { AbstractCSSRenderScene } from "../AbstractCSSRenderScene";

import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { HueAnalyzer, SaturationAnalyzer } from './analyzis/imageSpace';
import imageData from '../../../assets/images/data.json';
import { BrightnessAnalyzer, orderImages } from './analyzis/imageSpace';
import { stack, volume } from './structures/geometrical';
import { Styles } from '$lib/dom/utils';
import { createStackVolume } from './spaces/stackVolume';
import { createGridVolume } from './spaces/gridVolume';

const spaceCreators = [
  createStackVolume,
  createGridVolume
];

export class SlicesRenderScene extends AbstractCSSRenderScene {
  onUpdateCallback ?: ( domElement : HTMLElement ) => void;

  object : THREE.Object3D;
  rotationSpeed : THREE.Vector3;

  constructor( 
    domElement : HTMLElement,
    styles : Styles,
    onHover ?: ( img: HTMLImageElement | null) => void
  ) {
    super( domElement );

    // this.controls = new TrackballControls( this.camera, domElement );

    const orderedImages = orderImages(
      imageData, 
      // BrightnessAnalyzer
      HueAnalyzer
      // SaturationAnalyzer
    );

    const spaceCreator = spaceCreators[
      Math.floor(Math.random() * spaceCreators.length)
    ];

    const object = 
      spaceCreator(
        orderedImages, styles, onHover
      );

    this.scene.add( object );
    this.camera.position.set( 0, 0, 2000 );

    this.object = object;
    this.rotationSpeed = new THREE.Vector3(
      THREE.MathUtils.randFloat( -0.08, 0.08 ),
      THREE.MathUtils.randFloat( -0.08, 0.08 ),
      THREE.MathUtils.randFloat( -0.08, 0.08 )
    );
  }

  onUpdate( callback: ( domElement : HTMLElement ) => void ) {
    this.onUpdateCallback = callback;
  }

  update( delta: number, now: number ): void {
    // this.controls.update();

    this.onUpdateCallback?.( this.domElement );

    this.object.rotation.x += this.rotationSpeed.x * delta;
    this.object.rotation.y += this.rotationSpeed.y * delta;
    this.object.rotation.z += this.rotationSpeed.z * delta;
  }

  addElement( 
    element : HTMLElement, 
    position ?: THREE.Vector3,  
    scale ?: THREE.Vector3,  
  ) {
    const object = new CSS3DObject( element );

    position && object.position.copy( position );
    scale && object.scale.copy( scale );

    this.scene.add( 
      object
    )
  }
}