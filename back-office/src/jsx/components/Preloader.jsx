// src/components/Preloader.jsx
import '../../assets/css/style.css'; // ensure this file imports your spinner styles

/**
 * A reusable loading spinner for Suspense fallback or async operations.
 */
export default function Preloader() {
  return (
    <div id="preloader">
      <div className="sk-three-bounce">
        <div className="sk-child sk-bounce1"></div>
        <div className="sk-child sk-bounce2"></div>
        <div className="sk-child sk-bounce3"></div>
      </div>
    </div>
  );
}
