import data from '../../../../data.json';
export type ImageData = typeof data[0];

export type ImageScoreAnalyzer = (imageData: ImageData) => number;

export const HueAnalyzer = (imageData: ImageData) => {
  const averageColor = imageData.data.averageColor;
  const min = Math.min(averageColor.r, averageColor.g, averageColor.b);
  const max = Math.max(averageColor.r, averageColor.g, averageColor.b);

  const red = averageColor.r;
  const green = averageColor.g;
  const blue = averageColor.b;

  if(min === max) return 0.0;

  let hue = 0.0;
  if (max == red) {
      hue = (green - blue) / (max - min);
  } else if (max == green) {
      hue = 2.0 + (blue - red) / (max - min);
  } else {
      hue = 4.0 + (red - green) / (max - min);
  }

  hue = hue * 60;
  if (hue < 0) hue = hue + 360;

  return hue;
}

export const SaturationAnalyzer = (imageData: ImageData) => {
  const averageColor = imageData.data.averageColor;
  const min = Math.min(averageColor.r, averageColor.g, averageColor.b);
  const max = Math.max(averageColor.r, averageColor.g, averageColor.b);

  const delta = max - min;

  return delta < 0.00001 ? 0.0 : (delta / max);
}

export const BrightnessAnalyzer = (imageData: ImageData) => {
  const averageColor = imageData.data.averageColor;
  return 0.21 * averageColor.r + 0.72 * averageColor.g + 0.7 * averageColor.b;
}


export const orderImages = (imagesData: ImageData[], analyzers: ImageScoreAnalyzer): ImageData[] => {
  return [...imagesData].sort((d1, d2) => analyzers(d2) - analyzers(d1));
}