import React, { useEffect, useRef } from "react";

import PropTypes from "prop-types"; // Corrected import for PropTypes
import p5 from "p5";

const P5Container = ({ artwork, ...props }) => {
  const wrapper = useRef(null); // Ref for the container
  const canvas = useRef(null); // Ref for the p5 canvas instance

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (wrapper.current?.hasChildNodes()) {
        wrapper.current.removeChild(wrapper.current.firstChild);
      }
      if (canvas.current) {
        canvas.current.remove();
      }
    };
  }, []);

  // Reinitialize p5 instance when artwork changes
  useEffect(() => {
    if (wrapper.current?.hasChildNodes()) {
      wrapper.current.removeChild(wrapper.current.firstChild);
    }
    if (canvas.current) {
      canvas.current.remove();
    }
    canvas.current = new p5(artwork, wrapper.current);
  }, [artwork]);

  // Update props in the p5 instance
  useEffect(() => {
    if (canvas.current?.redrawFromProps) {
      canvas.current.redrawFromProps(props);
    }
  }, [props]);

  // Render container div
  return <div className="artwork" ref={wrapper} />;
};

P5Container.propTypes = {
  artwork: PropTypes.func.isRequired, // Ensures 'artwork' is a function and required
};

export default P5Container;