import React from "react";
const LoaderCom = () => {
  return (
    <React.Fragment>
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoaderCom;
