import React from "react";

import './ContextMenu.scss';

const ContextMenu = ({ show, position, options }) => {

  const handleClick = (e, callback) => {
    e.stopPropagation();
    if(callback) callback();
  }

  return (
    <div className={`options ${!show && "hidden"}`} style={position}>
      {options.map(option => (
        <div key={option.name} className="option" onClick={e => handleClick(e, option.action)}>
          { !option.icon ? <div className='icon' /> :
            <img alt={option.name} src={option.icon} />
          }
          <span>{option.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
