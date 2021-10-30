import React, { useEffect, useRef } from "react";
import p5 from "p5";
import { func } from "prop-types";

const P5Container = ({ artwork, ...props }) => {
  const wrapper = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    return () => {
      if (wrapper.current.hasChildNodes()) {
        wrapper.current.removeChild(wrapper.current.firstChild);
      }
      if (canvas.current) {
        canvas.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (wrapper.current.hasChildNodes()) {
      wrapper.current.removeChild(wrapper.current.firstChild);
    }
    if (canvas.current) {
      canvas.current.remove();
    }
    canvas.current = new p5(artwork, wrapper.current);
  }, [artwork]);

  useEffect(() => {
    if (canvas.current.redrawFromProps) {
      canvas.current.redrawFromProps(props);
    }
  }, [props]);

  return <div className="artwork" ref={wrapper}></div>;
};

P5Container.propTypes = {
  artwork: func,
};

export default P5Container;
