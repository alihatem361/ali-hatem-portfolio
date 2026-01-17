const LowerCurve = () => {
  return (
    <div className="lower__Curved position-relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="position-absolute bottom-0"
        style={{ zIndex: "-5" }}
      >
        <path
          fill="var(--tertiary-color)"
          fill-opacity="1"
          d="M0,32L288,192L576,128L864,288L1152,64L1440,192L1440,320L1152,320L864,320L576,320L288,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default LowerCurve;
