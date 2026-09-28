import React, {useEffect, useRef} from 'react';
import {Player} from '@remotion/player';
import {ProductScene794} from './remotion794/ProductScene794';

export function ProductCinema794({playerRef, language = 'da', className = '', initialFrame = 0, autoPlay = true, reducedMotion = false}) {
  const internalRef = useRef(null);

  useEffect(() => {
    if (reducedMotion && internalRef.current) {
      internalRef.current.pause();
      internalRef.current.seekTo(240);
    }
  }, [reducedMotion]);

  return <div className={className} aria-hidden="true" style={{position: 'relative', width: '100%', aspectRatio: '3 / 2', overflow: 'hidden', pointerEvents: 'none'}}>
    <Player
      ref={(instance) => {
        internalRef.current = instance;
        if (playerRef) playerRef.current = instance;
      }}
      component={ProductScene794}
      inputProps={{language}}
      compositionWidth={1200}
      compositionHeight={800}
      fps={30}
      durationInFrames={241}
      initialFrame={reducedMotion ? 240 : initialFrame}
      autoPlay={autoPlay && !reducedMotion}
      loop={false}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      allowFullscreen={false}
      numberOfSharedAudioTags={0}
      style={{width: '100%', height: '100%'}}
      errorFallback={() => <div style={{width: '100%', height: '100%', display: 'grid', placeItems: 'center', backgroundColor: '#f6f4ec', color: '#174f40', fontFamily: 'Georgia, serif', fontSize: 45}}>MedFLUEN</div>}
    />
  </div>;
}

export default ProductCinema794;
