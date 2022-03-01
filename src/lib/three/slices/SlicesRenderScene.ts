import * as THREE from 'three';

import { AbstractCSSRenderScene } from "../AbstractCSSRenderScene";

import { CSS3DObject } from "../examples/jsm/renderers/CSS3DRenderer";

import { HueAnalyzer, BrightnessAnalyzer, orderImages } from './analyzis/imageSpace';
import imageData from '../../../data.json';
import { Styles } from '$lib/dom/utils';
import { createStackVolume } from './spaces/stackVolume';
import { createGridVolume } from './spaces/gridVolume';

const analyzers = [
  HueAnalyzer,
  BrightnessAnalyzer
]

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

    const orderedImages = orderImages(
      imageData, 
      analyzers[
        Math.floor(Math.random() * analyzers.length)
      ]
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
    const object = new CSS3DObject( element as any );

    position && object.position.copy( position );
    scale && object.scale.copy( scale );

    this.scene.add( 
      object
    )
  }
}