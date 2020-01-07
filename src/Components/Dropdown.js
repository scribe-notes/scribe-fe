import React, { useState } from "react";

import "./Dropdown.scss";

const Dropdown = props => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleChange = option => {
    setOpen(false);
    if (props.onChange) props.onChange(option);
  };

  return (
    <div className="dropdown" onClick={handleToggle}>
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
