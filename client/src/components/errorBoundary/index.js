import "../../pages/common.scss";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <div className="chatContainer">
        <div className="chatBody">
          <div className="chat">
            <div className="errorPage">
              <p>Something went wrong:</p>
              <pre>{error.message}</pre>
              <button className="tryAgain" onClick={resetErrorBoundary}>
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorFallback;
