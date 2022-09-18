import * as THREE from "three";

import * as ColorUtils from "../../utils/colorUtils";

//
// about geometry
//

type CreateGeometriesParams = {
  innerRadius: number;
  outerRadius: number;
  thetaSegments: number;
};
const createGeometries = (
  params: CreateGeometriesParams
): THREE.BufferGeometry[] => {
  if (!Number.isSafeInteger(params.thetaSegments) || params.thetaSegments < 3) {
    throw new Error(
      `invalid argument: params.thetaSegments = ${params.thetaSegments}`
    );
  }
  const innerRadius = params.innerRadius;
  const outerRadius = params.outerRadius;
  const thetaSegments = params.thetaSegments;

  const geometries = [];
  for (let segCur = 0; segCur < thetaSegments; segCur++) {
    geometries.push(
      createGeometry(innerRadius, outerRadius, thetaSegments, segCur)
    );
  }
  return geometries;
};

const createGeometry = (
  innerRadius: number,
  outerRadius: number,
  thetaSegments: number,
  segCur: number
): THREE.BufferGeometry => {
  const geometry = new THREE.BufferGeometry();
  const vertices = createVertices(
    innerRadius,
    outerRadius,
    thetaSegments,
    segCur
  );
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices), 3)
  );
  geometry.computeVertexNormals();
  return geometry;
};

const createVertices = (
  innerRadius: number,
  outerRadius: number,
  thetaSegments: number,
  segCur: number
): number[] => {
  if (innerRadius < 0) {
    throw new Error(`invalid argument: innerRadius = ${innerRadius}`);
  }
  if (outerRadius <= 0) {
    throw new Error(`invalid argument: outerRadius = ${outerRadius}`);
  }
  if (!Number.isSafeInteger(thetaSegments) || thetaSegments < 3) {
    throw new Error(`invalid argument: thetaSegments = ${thetaSegments}`);
  }
  if (!Number.isSafeInteger(segCur) || segCur >= thetaSegments) {
    throw new Error(
      `invalid argument: segCur = ${segCur}, thetaSegments = ${thetaSegments}`
    );
  }
  const vertices = [];
  //
  //                              v2
  //                             /|\
  //                            / | \
  //                           /  |  \
  //                          /   |   \
  //                         /    |    \
  //                        /     |     \
  //                       /      |      \
  //                      /       |       \
  //                     /        |        \
  //                    v3        |         \
  //                      \       |          \
  //                  /    \      |           \
  //                        \     |            \
  //                /        \    |             \
  // second theta             \   |              \
  //              /            \  |               \
  //                            \ |                \
  //            / first theta    \|                 \
  //           O -  -  -  -  -  - v0 --------------- v1
  //
  const firstTheta = (segCur / thetaSegments) * Math.PI * 2;
  const secondTheta = ((segCur + 1) / thetaSegments) * Math.PI * 2;

  const v0x = innerRadius * Math.cos(firstTheta);
  const v0y = innerRadius * Math.sin(firstTheta);
  const v0z = 0;

  const v1x = outerRadius * Math.cos(firstTheta);
  const v1y = outerRadius * Math.sin(firstTheta);
  const v1z = 0;

  const v2x = outerRadius * Math.cos(secondTheta);
  const v2y = outerRadius * Math.sin(secondTheta);
  const v2z = 0;

  const v3x = innerRadius * Math.cos(secondTheta);
  const v3y = innerRadius * Math.sin(secondTheta);
  const v3z = 0;

  vertices.push(v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z);
  vertices.push(v0x, v0y, v0z, v2x, v2y, v2z, v3x, v3y, v3z);

  return vertices;
};

//
// about material
//

type CreateMaterialParams = {
  colors: number[];
  thetaSegments: number;
};
const createMaterials = (
  params: CreateMaterialParams
): THREE.MeshBasicMaterial[] => {
  const allColors = complementColors(params.colors, params.thetaSegments);

  if (allColors.length === 0) {
    throw new Error(`invalid variable: allColors = ${allColors}`);
  }
  const materials: THREE.MeshBasicMaterial[] = [];
  allColors.forEach((color) => {
    materials.push(createMaterial(color));
  });
  return materials;
};

const complementColors = (
  keyColors: number[],
  thetaSegments: number
): number[] => {
  if (!Array.isArray(keyColors) || keyColors.length === 0) {
    throw new Error(`invalid argument: keyColors = ${keyColors}`);
  }
  keyColors.forEach((color, index) => {
    if (!ColorUtils.isColorNumber(color)) {
      throw new Error(`invalid argument: keyColors[${index}] = ${color}`);
    }
  });
  if (thetaSegments < 3) {
    throw new Error(`invalid argument: thetaSegments = ${thetaSegments}`);
  }

  let allColors: number[] = [];

  // If the number of key color is only 1, set same color to all theta segments.
  if (keyColors.length === 1) {
    for (let i = 0; i < thetaSegments; i++) {
      allColors.push(keyColors[0]);
    }
    return allColors;
  }

  // Number of segments between key colors.
  // For example, theta segment = 6 and number of key colors is 2,
  // this number is 3.
  //
  //                          (theta 2)
  //                           -------
  //  key color 2 (theta 1)  /         \  (theta 3)
  //                        /           \
  //                        \           /
  //              (theta 3)  \         /  (theta 1) key color 1
  //                           -------
  //                          (theta 2)
  //
  let nSegBetweenKeyColors = Math.floor(thetaSegments / keyColors.length);
  for (let keyColorCur = 0; keyColorCur < keyColors.length; keyColorCur++) {
    //
    // (1) keyColorCur === 0
    //
    //                         \           /
    //      endColor (theta 3)  \         /  (theta 1) startColor
    //                            -------
    //                           (theta 2)
    //
    //
    // (2) keyColorCur === 1
    //                           (theta 2)
    //                            -------
    //    startColor (theta 1)  /         \  (theta 3) endColor
    //                         /           \
    //

    const startColor = {
      red: ColorUtils.ntorn(keyColors[keyColorCur]),
      green: ColorUtils.ntogn(keyColors[keyColorCur]),
      blue: ColorUtils.ntobn(keyColors[keyColorCur]),
    };
    const endColor = (() => {
      if (keyColorCur + 1 === keyColors.length) {
        return {
          red: ColorUtils.ntorn(keyColors[0]),
          green: ColorUtils.ntogn(keyColors[0]),
          blue: ColorUtils.ntobn(keyColors[0]),
        };
      }
      return {
        red: ColorUtils.ntorn(keyColors[keyColorCur + 1]),
        green: ColorUtils.ntogn(keyColors[keyColorCur + 1]),
        blue: ColorUtils.ntobn(keyColors[keyColorCur + 1]),
      };
    })();

    const diffRed = endColor.red - startColor.red;
    const diffGreen = endColor.green - startColor.green;
    const diffBlue = endColor.blue - startColor.blue;

    // If thetaSegments can not be divided by keyColors.length,
    // treat the remainder as the last segments group.
    if (keyColorCur + 1 === keyColors.length) {
      nSegBetweenKeyColors += thetaSegments % keyColors.length;
    }

    const diffRedBetweenSegments = diffRed / nSegBetweenKeyColors;
    const diffGreenBetweenSegments = diffGreen / nSegBetweenKeyColors;
    const diffBlueBetweenSegments = diffBlue / nSegBetweenKeyColors;
    for (let segCur = 0; segCur < nSegBetweenKeyColors; segCur++) {
      const red = Math.floor(startColor.red + diffRedBetweenSegments * segCur);
      const green = Math.floor(
        startColor.green + diffGreenBetweenSegments * segCur
      );
      const blue = Math.floor(
        startColor.blue + diffBlueBetweenSegments * segCur
      );
      const color = (red << 16) + (green << 8) + blue;
      if (!ColorUtils.isColorNumber(color)) {
        throw new Error(`invalid color: color = ${color.toString(16)}`);
      }
      allColors.push(color);
    }
  }
  return allColors;
};

const createMaterial = (color: number): THREE.MeshBasicMaterial => {
  if (!ColorUtils.isColorNumber(color)) {
    throw new Error(`invalid argument: color = ${color}`);
  }
  const material = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide,
  });
  return material;
};

//
// about meshes
//

type CreateObjParams = {
  thetaSegments: number;
  position?: {
    x?: number;
    y?: number;
    z?: number;
  };
};
const createObj = (
  params: CreateObjParams,
  geometries: THREE.BufferGeometry[],
  materials: THREE.MeshBasicMaterial[]
): THREE.Object3D => {
  if (!Number.isSafeInteger(params.thetaSegments) || params.thetaSegments < 3) {
    throw new Error(
      `invalid argument: params.thetaSegments = ${params.thetaSegments}`
    );
  }
  if (params.thetaSegments !== geometries.length) {
    throw new Error(
      `number of geometries is invalid: thetaSegments = ${params.thetaSegments}, geometries.length = ${geometries.length}`
    );
  }
  if (params.thetaSegments !== materials.length) {
    throw new Error(
      `number of materials is invalid: thetaSegments = ${params.thetaSegments}, materials.length = ${materials.length}`
    );
  }

  const obj = new THREE.Object3D();
  for (let segCur = 0; segCur < params.thetaSegments; segCur++) {
    obj.add(createMesh(geometries[segCur], materials[segCur]));
  }

  obj.position.x = params.position?.x || 0;
  obj.position.y = params.position?.y || 0;
  obj.position.z = params.position?.z || 0;

  return obj;
};

const createMesh = (
  geometry: THREE.BufferGeometry,
  material: THREE.MeshBasicMaterial
): THREE.Mesh => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;
  return mesh;
};

//
// MultiColorRing class
//

export type NewMultiColorRingParams = {
  geometries: {
    innerRadius: number;
    outerRadius: number;
  };
  materials: {
    colors: number[];
  };
  object?: {
    position?: {
      x?: number;
      y?: number;
      z?: number;
    };
  };
  thetaSegments: number;
};

export default class MultiColorRing {
  private obj: THREE.Object3D;
  private drawRange: number;
  private thetaSegments: number;
  private originalColors: number[];

  constructor(params: NewMultiColorRingParams) {
    this.thetaSegments = params.thetaSegments;

    const geometries = createGeometries({
      ...params.geometries,
      thetaSegments: this.thetaSegments,
    });

    const materials = createMaterials({
      ...params.materials,
      thetaSegments: this.thetaSegments,
    });
    this.originalColors = params.materials.colors;

    this.obj = createObj(
      { ...params.object, thetaSegments: this.thetaSegments },
      geometries,
      materials
    );

    this.drawRange = 0;
  }

  addToScene(scene: THREE.Scene): void {
    scene.add(this.obj);
  }

  getDrawRange(): number {
    return this.drawRange;
  }

  getPosition(): { x: number; y: number; z: number } {
    return {
      x: this.obj.position.x,
      y: this.obj.position.y,
      z: this.obj.position.z,
    };
  }

  getThetaSegments(): number {
    return this.thetaSegments;
  }

  setDrawRange(nSegments: number): void {
    if (!Number.isSafeInteger(nSegments) || nSegments < 0) {
      throw new Error(`invalid argument: nSegments = ${nSegments}`);
    }
    if (nSegments > this.thetaSegments) {
      nSegments = this.thetaSegments;
    }

    this.drawRange = nSegments;
    for (let meshCur = 0; meshCur < nSegments; meshCur++) {
      this.obj.children[meshCur].visible = true;
    }
    for (
      let meshCur = nSegments;
      meshCur < this.obj.children.length;
      meshCur++
    ) {
      this.obj.children[meshCur].visible = false;
    }
  }

  setColors(colors: number[]): void {
    // Setting colors is heavy.
    // So if the argument's colors are the same with current one, do nothing and return.
    if (this.originalColors.length === colors.length) {
      console.log(
        `New color's length is the same with current color's length.`
      );
      let isSameColors = true;
      for (let i = 0; i < this.originalColors.length; i++) {
        if (this.originalColors[i] !== colors[i]) {
          isSameColors = false;
          break;
        }
      }
      if (isSameColors) {
        return;
      }
    }
    console.log(`Color is changed.`);
    this.originalColors = colors;

    const newAllColors = complementColors(colors, this.obj.children.length);
    this.obj.children.forEach((mesh, index) => {
      if (!(mesh instanceof THREE.Mesh)) {
        throw new Error(`invalid mesh: mesh = ${mesh}`);
      }
      if (!(mesh.material instanceof THREE.MeshBasicMaterial)) {
        throw new Error(`invalid material: material = ${mesh.material}`);
      }
      mesh.material.color.set(newAllColors[index]);
    });
  }

  setPosition(x: number, y: number, z: number): void {
    this.obj.position.x = x;
    this.obj.position.y = y;
    this.obj.position.z = z;
  }
}
