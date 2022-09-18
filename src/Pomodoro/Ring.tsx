import { useEffect } from "react";
import * as THREE from "three";
import "./Ring.css";
import MultiColorRing from "../assets/three/multiColorRing";
import Scale from "../assets/three/scale";
import { CameraWrapper } from "../assets/three/camera";

function createRenderer(renderWidth: number, renderHeight: number) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  // Set size
  renderer.setSize(renderWidth, renderHeight);

  // Disable rendering shadow
  renderer.shadowMap.enabled = false;

  return renderer;
}

//
// Init three.js components.
//
const renderWidth = 230;
const renderHeight = 240;
const renderer = createRenderer(renderWidth, renderHeight);

// The following variables needn't be state. So I use just variables.
const scene = new THREE.Scene();

//
//     Camera
//  -----+-----------------------------------------------> z
//      -20
//
const cameraWrapper = new CameraWrapper({
  position: {
    z: -20,
  },
  rotation: {
    z: Math.PI, // to rotate the movement of the ring.
  },
  frustum: {
    fov: 50,
    aspect: renderWidth / renderHeight,
    near: 1,
    far: 50,
  },
});

//
//     Camera           InnerBackRing
//  -----+----- . . . -------+---------------------------> z
//      -20                  0
//
const innerBackRing = new MultiColorRing({
  geometries: {
    innerRadius: 6.6,
    outerRadius: 7.1,
  },
  materials: {
    colors: [0x000000], // This value is overridden later.
  },
  thetaSegments: 500,
});
innerBackRing.addToScene(scene);

//
//                InnerFrontRing
//     Camera           InnerBackRing
//  -----+----- . . . --+----+---------------------------> z
//      -20           -0.01  0
//
const innerFrontRing = new MultiColorRing({
  geometries: {
    innerRadius: 6.6,
    outerRadius: 7.1,
  },
  materials: {
    colors: [0x000000], // This value is overridden later.
  },
  object: {
    position: {
      z: -0.01,
    },
  },
  thetaSegments: 500,
});
innerFrontRing.addToScene(scene);

//
//                InnerFrontRing
//     Camera           InnerBackRing     OuterBackRing
//  -----+----- . . . --+----+------------------+--------> z
//      -20           -0.01  0                  2
//
const outerBackRing = new MultiColorRing({
  geometries: {
    innerRadius: 7.5,
    outerRadius: 7.6,
  },
  materials: {
    colors: [0x000000], // This value is overridden later.
  },
  object: {
    position: {
      z: 2,
    },
  },
  thetaSegments: 500,
});
outerBackRing.addToScene(scene);

//
//                InnerFrontRing
//                OuterFrontRing
//     Camera           InnerBackRing     OuterBackRing
//  -----+----- . . . --+----+------------------+--------> z
//      -20           -0.01  0                  2
//
const outerFrontRing = new MultiColorRing({
  geometries: {
    innerRadius: 7.5,
    outerRadius: 7.6,
  },
  materials: {
    colors: [0x000000], // This value is overridden later.
  },
  object: {
    position: {
      z: -0.01,
    },
  },
  thetaSegments: 500,
});
outerFrontRing.addToScene(scene);

//
//                InnerFrontRing
//                OuterFrontRing
//                         Scale
//     Camera           InnerBackRing     OuterBackRing
//  -----+----- . . . --+----+------------------+--------> z
//      -20           -0.01  0                  2
//
const scales: Scale[] = [];
for (let i = 0; i < 50; i++) {
  const scale = new Scale({
    geometry: {
      width: 0.1,
      height: 0,
    },
    material: { color: 0x000000 }, // This value is overridden later.
    obj: {
      position: {
        y: 8,
      },
    },
  });

  // 0 ~ 4 -> 0
  // 5 ~ 9 -> 5
  //  ...
  // 45 ~ 49 -> 45
  const floor5 = Math.floor(i / 5) * 5;

  const rotateZ = -Math.PI / 2 + (2 * Math.PI * floor5) / 50;
  scale.setRotate(0, 0, rotateZ);
  scale.addToScene(scene);
  scales.push(scale);
}

type RingProps = {
  configIsReady: boolean;
  ringIsReady: boolean;
  setRingIsReady: React.Dispatch<React.SetStateAction<boolean>>;
  timeSec: number;
  currentIntervalSec: number;
  workIntervalSec: number;
  isWorking: boolean;
  workCount: number;
  nWorkBeforeLongBreak: number;
  currentColors: number[];
  backRingColor: number;
  scaleColor: number;
};

function Ring(props: RingProps) {
  function renderInnerBackRingInitAnimation() {
    if (innerBackRing.getDrawRange() === innerBackRing.getThetaSegments()) {
      // Init animation of the inner back ring is completed.
      console.log(`Init animation of the inner back ring is completed.`);
      // Start animation of the outer back ring.
      outerBackRing.setDrawRange(outerBackRing.getThetaSegments());
      requestAnimationFrame(renderOuterBackRingInitAnimation);
      return;
    }
    setTimeout(() => {
      innerBackRing.setDrawRange(innerBackRing.getDrawRange() + 15);
      renderer.render(scene, cameraWrapper.getCamera());
      requestAnimationFrame(renderInnerBackRingInitAnimation);
    }, 16); // about 60 fps
  }

  function renderOuterBackRingInitAnimation() {
    const ringPosition = outerBackRing.getPosition();
    if (ringPosition.z === 0) {
      // Init animation of the outer back ring is completed.
      console.log(`Init animation of the outer back ring is completed.`);
      // Start animation of the scale.
      for (let i = 0; i < 50; i++) {
        scales[i].setVisible(true);
      }
      requestAnimationFrame(renderScaleStretchAnimation);
      return;
    }
    setTimeout(() => {
      const nextZCandidate = ringPosition.z - 0.25;
      const nextZ = nextZCandidate > 0 ? nextZCandidate : 0;
      outerBackRing.setPosition(0, 0, nextZ);
      renderer.render(scene, cameraWrapper.getCamera());
      requestAnimationFrame(renderOuterBackRingInitAnimation);
    }, 16); // about 60 fps
  }

  const scaleStretchIsDone: boolean[] = Array.from({ length: 50 }, () => false);
  const scaleStretchCount: number[] = Array.from({ length: 50 }, () => 0);
  function renderScaleStretchAnimation() {
    setTimeout(() => {
      for (let i = 0; i < 50; i++) {
        if (scaleStretchCount[i] < 7) {
          if (i % 5 === 0) {
            scales[i].setHeight(scales[i].getHeight() + 0.1);
          } else {
            scales[i].setHeight(scales[i].getHeight() + 0.05);
          }
          scaleStretchCount[i] += 1;
        } else {
          scaleStretchIsDone[i] = true;
        }
      }
      if (scaleStretchIsDone.every((isDone) => isDone)) {
        // Stretch animation of the scale is completed.
        console.log(`Stretch animation of the scale is completed.`);
        requestAnimationFrame(renderScaleRotateAnimation);
        return;
      }
      renderer.render(scene, cameraWrapper.getCamera());
      requestAnimationFrame(renderScaleStretchAnimation);
    }, 16); // about 60 fps
  }

  // Array to save each scale's condition.
  const scaleRotationIsDone: boolean[] = Array.from(
    { length: 50 },
    () => false
  );
  // Array to save each scale's count.
  const scaleRotationCount: number[] = Array.from({ length: 50 }, () => 0);

  function renderScaleRotateAnimation() {
    setTimeout(() => {
      for (let i = 0; i < 50; i++) {
        if (scaleRotationCount[i] < 15) {
          scales[i].setRotate(0, 0, ((i % 5) * ((2 * Math.PI) / 50)) / 15);
          scaleRotationCount[i] += 1;
        } else {
          scaleRotationIsDone[i] = true;
        }
      }
      if (scaleRotationIsDone.every((isDone) => isDone)) {
        // Rotate animation of the scale is completed.
        console.log(`Rotate animation of the scale is completed.`);
        props.setRingIsReady(true);
        return;
      }
      renderer.render(scene, cameraWrapper.getCamera());
      requestAnimationFrame(renderScaleRotateAnimation);
    }, 16); // about 60 fps
  }

  //
  // (1) Operations when react completes the mount process.
  //
  useEffect(() => {
    if (!props.configIsReady) {
      console.warn(`Config is not ready. Stop starting timer.`);
      return;
    }

    innerBackRing.setColors([props.backRingColor]);
    outerBackRing.setColors([props.backRingColor]);
    innerFrontRing.setColors(props.currentColors);
    outerFrontRing.setColors(props.currentColors);
    scales.forEach((scale) => {
      scale.setColor(props.scaleColor);
    });

    if (props.ringIsReady) {
      // If the ring has already setup, don't start init animation twice.
      console.warn(`Ring is already ready. Stop starting init animation.`);
      return;
    }

    console.log(`Add ring to dom element.`);
    const ringElem = document.getElementById("Ring");
    if (ringElem !== null) {
      ringElem.appendChild(renderer.domElement);
    } else {
      console.warn(`Ring element is null. Skip appending a renderer.`);
      return;
    }

    console.log(`Start ring init animation.`);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderInnerBackRingInitAnimation();
  }, [props.ringIsReady, props.configIsReady]);

  //
  // (2) Update ring
  //
  useEffect(() => {
    if (!props.configIsReady) {
      console.warn(`Config is not ready. Stop updating ring.`);
      return;
    }
    if (!props.ringIsReady) {
      console.warn(`Ring is not ready. Stop updating ring.`);
      return;
    }
    console.log(`Update ring.`);

    // innerDrawRange
    const newInnerDrawRange = Math.ceil(
      ((props.currentIntervalSec - props.timeSec) / props.currentIntervalSec) *
        innerFrontRing.getThetaSegments()
    );
    innerFrontRing.setDrawRange(newInnerDrawRange);
    innerFrontRing.setColors(props.currentColors);

    // outerDrawRange
    const totalWorkSec = props.nWorkBeforeLongBreak * props.workIntervalSec;
    let currentElapsedSec: number;
    if (props.isWorking) {
      currentElapsedSec =
        (props.workCount - 1) * props.workIntervalSec +
        (props.currentIntervalSec - props.timeSec);
    } else {
      currentElapsedSec = props.workCount * props.workIntervalSec;
    }
    const newOuterDrawRange = Math.ceil(
      (currentElapsedSec / totalWorkSec) * innerFrontRing.getThetaSegments()
    );
    outerFrontRing.setDrawRange(newOuterDrawRange);
    outerFrontRing.setColors(props.currentColors);

    renderer.render(scene, cameraWrapper.getCamera());
  }, [props.timeSec, props.currentIntervalSec, props.currentColors]);

  return <div id="Ring"></div>;
}

export default Ring;
