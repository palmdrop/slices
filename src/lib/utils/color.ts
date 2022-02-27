import * as THREE from 'three';

const map = THREE.MathUtils.mapLinear;

export const randomCssColor = (
  minRed = 0,
  maxRed = 1.0,

  minGreen = 0,
  maxGreen = 1.0,

  minBlue = 0,
  maxBlue = 1.0,

  minAlpha = 1.0,
  maxAlpha = 1.0
) => {
  const randomComponent = (min: number, max: number, multiplier = 255) => {
    return multiplier * map(Math.random(), 0, 1, min, max)
  }

  const r = Math.floor(randomComponent(minRed, maxRed));
  const g = Math.floor(randomComponent(minGreen, maxGreen));
  const b = Math.floor(randomComponent(minBlue, maxBlue));
  const a = randomComponent(minAlpha, maxAlpha, 1.0);
  return `rgb(${r}, ${g}, ${b}, ${a})`
} 