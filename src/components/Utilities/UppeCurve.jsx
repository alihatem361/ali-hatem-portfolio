const UppeCurve = () => {
  return (
    <div className="upper__Curved position-relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="position-absolute top-0"
        style={{ zIndex: "-5" }}
      >
        <path
          fill="var(--tertiary-color)"
          fill-opacity="1"
          d="M0,256L240,224L480,160L720,224L960,192L1200,96L1440,96L1440,0L1200,0L960,0L720,0L480,0L240,0L0,0Z"
        ></path>
      </svg>
    </div>
  );
};

export default UppeCurve;
