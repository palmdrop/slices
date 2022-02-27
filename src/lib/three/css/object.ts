import { assignStyles, Styles } from "$lib/dom/utils";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

export const imageToCSS3DObject = ({
  path,
  width,
  height,
  styles, 
  onLoad
}: {
  path: string,
  width?: number,
  height?: number,
  styles?: Styles,
  onLoad?: (e: Event) => void
}) => {
  const img = new Image();
  img.src = path;
  img.onload = onLoad;

  assignStyles(
    img,
    styles
  )

  if (width) img.width = width;
  if (height) img.height = height;

  return new CSS3DObject( img );
}