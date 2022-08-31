import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import classes from './styles.module.css';

const CustomToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick }, ref) => (
  <button className={classes.MoreOptionsButton} onClick={onClick} ref={ref}>
    <i className="bi bi-three-dots" />
  </button>
));

type Props = {
  fileId: string;
  onDelete: (fileId: string) => any;
};

const MoreOptionsDropdown: React.FC<Props> = ({ fileId, onDelete }) => {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle as={CustomToggle} id="more-options-dropdown" />
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onDelete(fileId)}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MoreOptionsDropdown;
