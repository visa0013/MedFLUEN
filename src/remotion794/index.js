import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {ProductScene794} from './ProductScene794';

function RemotionRoot794() {
  return <Composition
    id="MedFLUENProductCinema794"
    component={ProductScene794}
    durationInFrames={241}
    fps={30}
    width={1200}
    height={800}
    defaultProps={{language: 'da'}}
  />;
}

registerRoot(RemotionRoot794);
