import * as THREE from "three";

type NewCameraWrapperParams = {
  position?: {
    x?: number;
    y?: number;
    z?: number;
  };
  rotation?: {
    x?: number;
    y?: number;
    z?: number;
  };
  lookAt?: {
    x?: number;
    y?: number;
    z?: number;
  };
  frustum: {
    fov: number;
    aspect: number;
    near: number;
    far: number;
  };
};
export class CameraWrapper {
  private camera: THREE.PerspectiveCamera;
  constructor(params: NewCameraWrapperParams) {
    this.camera = new THREE.PerspectiveCamera(
      params.frustum.fov,
      params.frustum.aspect,
      params.frustum.near,
      params.frustum.far
    );
    this.camera.position.x = params.position?.x || 0;
    this.camera.position.y = params.position?.y || 0;
    this.camera.position.z = params.position?.z || 0;

    this.camera.lookAt(
      new THREE.Vector3(
        params.lookAt?.x || 0,
        params.lookAt?.y || 0,
        params.lookAt?.z || 0
      )
    );

    this.camera.rotateX(params.rotation?.x || 0);
    this.camera.rotateY(params.rotation?.y || 0);
    this.camera.rotateZ(params.rotation?.z || 0);
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
