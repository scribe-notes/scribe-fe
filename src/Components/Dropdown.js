import React, { useState, useEffect, useRef } from "react";

import "./Dropdown.scss";

const Dropdown = props => {
  const dropdown = useRef(null);

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleChange = option => {
    setOpen(false);
    if (props.onChange) props.onChange(option);
  };

  const handleClickOutside = event => {
    if(!dropdown?.current?.contains(event.target)) {
      setOpen(false);
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div ref={dropdown} className="dropdown" onClick={handleToggle}>
      <div className="value">
        {props.allcaps ? props.value && props.value.toUpperCase() : props.value}
        <div className={`drawer ${!open && "hidden"}`}>
          {props.options.map(option => {
            return (
              <div
                key={option}
                className="option"
                onClick={() => handleChange(option)}
              >
                {props.allcaps ? option.toUpperCase() : option}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
