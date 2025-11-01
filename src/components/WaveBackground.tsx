const WaveBackground = () => {
  return (
    <div className="fixed top-[100vh] left-0 right-0 h-[15vh] min-h-[100px] max-h-[150px] pointer-events-none z-0">
      <svg className="relative w-full h-full" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className="parallax">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(0,86,149,0.7)" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(98,144,128,0.5)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(0,86,149,0.9)" />
        </g>
      </svg>
    </div>
  );
};

export default WaveBackground;
