import * as THREE from "three";

const isColor = (color: number) =>
  Number.isSafeInteger(color) && color >= 0x000000 && color <= 0xffffff;

//
// about geometry
//

const createGeometry = (width: number, height: number): THREE.PlaneGeometry => {
  return new THREE.PlaneGeometry(width, height);
};

//
// about material
//

const createMaterial = (color: number): THREE.MeshBasicMaterial => {
  if (!isColor(color)) {
    throw new Error(`invalid argument: color = ${color}`);
  }
  const material = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  });
  return material;
};

//
// about mesh
//

const createObj = (
  geometry: THREE.PlaneGeometry,
  material: THREE.MeshBasicMaterial,
  position?: { x?: number; y?: number; z?: number }
): THREE.Object3D => {
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = position?.x || 0;
  mesh.position.y = position?.y || 0;
  mesh.position.z = position?.z || 0;

  const obj = new THREE.Object3D();
  obj.add(mesh);
  obj.position.set(0, 0, 0);
  obj.visible = false;
  return obj;
};

//
// Scale class
//

export type NewScaleParams = {
  geometry: {
    width: number;
    height: number;
  };
  material: {
    color: number;
  };
  obj?: {
    position?: {
      x?: number;
      y?: number;
      z?: number;
    };
  };
};

export default class Scale {
  private obj: THREE.Object3D;

  constructor(params: NewScaleParams) {
    const geometry = createGeometry(
      params.geometry.width,
      params.geometry.height
    );
    const material = createMaterial(params.material.color);
    this.obj = createObj(geometry, material, {
      x: params.obj?.position?.x,
      y: params.obj?.position?.y,
      z: params.obj?.position?.z,
    });
  }

  addToScene(scene: THREE.Scene): void {
    scene.add(this.obj);
  }

  setVisible(visible: boolean): void {
    this.obj.visible = visible;
  }

  getHeight(): number {
    //
    // y
    // ^
    // |      v0------v1
    // |      |       /|
    // |      |      / |
    // |      |     /  |
    // |      |    /   |
    // |      |   /    |
    // |      |  /     |
    // |      | /      |
    // |      |/       |
    // |      v2------v3
    // |
    // +----------------------> x
    //
    const mesh = this.obj.children[0];
    if (!(mesh instanceof THREE.Mesh)) {
      throw new Error(`invalid mesh: mesh = ${mesh}`);
    }
    const v0y = mesh.geometry.attributes.position.getY(0);
    const v2y = mesh.geometry.attributes.position.getY(2);
    return v0y - v2y;
  }

  setHeight(height: number): void {
    const mesh = this.obj.children[0];
    if (!(mesh instanceof THREE.Mesh)) {
      throw new Error(`invalid mesh: mesh = ${mesh}`);
    }
    if (mesh.geometry instanceof THREE.PlaneGeometry === false) {
      throw new Error(`invalid geometry: geometry = ${mesh.geometry}`);
    }
    //
    // y
    // ^
    // |      v0------v1
    // |      |       /|
    // |      |      / |
    // |      |     /  |
    // |      |    /   |
    // |      |   /    |
    // |      |  /     |
    // |      | /      |
    // |      |/       |
    // |      v2------v3
    // |
    // +----------------------> x
    //
    const v0y = mesh.geometry.attributes.position.getY(0);
    const v2y = mesh.geometry.attributes.position.getY(2);
    const currentHeight = v0y - v2y;
    const diffHeight = height - currentHeight;
    mesh.geometry.attributes.position.setY(0, v0y + diffHeight);
    mesh.geometry.attributes.position.setY(1, v0y + diffHeight);
    mesh.geometry.attributes.position.needsUpdate = true;
  }

  setRotate(x: number, y: number, z: number): void {
    this.obj.rotateX(x);
    this.obj.rotateY(y);
    this.obj.rotateZ(z);
  }

  setColor(color: number): void {
    if (this.obj.children.length !== 1) {
      throw new Error(`Mesh of scale is not found.`);
    }
    const mesh = this.obj.children[0];
    if (!(mesh instanceof THREE.Mesh)) {
      throw new Error(`invalid mesh: mesh = ${mesh}`);
    }
    if (!(mesh.material instanceof THREE.MeshBasicMaterial)) {
      throw new Error(`invalid material: material = ${mesh.material}`);
    }
    mesh.material.color.set(color);
  }
}
