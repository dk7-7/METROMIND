import React from "react";

const ErrorHandler = ({ error }) => {
  if (!error) return null;
  return (
    <div className="error-alert" data-testid="error-handler">
      {error}
    </div>
  );
};

export default ErrorHandler;
