
export type Styles = Partial<CSSStyleDeclaration>;

export const forEachChildRecursive = ( 
  element : HTMLElement, 
  action : ( element : HTMLElement ) => void 
) => { 
  action( element );
  
  element.childNodes
    .forEach(
      child => child && forEachChildRecursive( child as HTMLElement, action )
    );
}

export const assignStyles = (
  domElement : HTMLElement,
  styles : Styles
) => {
  Object.entries(styles).forEach(
    ([name, value]) => {
      domElement.style[name] = value;
    }
  );
}