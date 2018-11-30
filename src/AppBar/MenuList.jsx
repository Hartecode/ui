import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import NavLink from './NavLink';

const MenuList = ({ linkSet, onMouseEnter }) => (
  <ul onMouseEnter={onMouseEnter} className="tui-app-nav-list">
    {linkSet.main.map(link => (
      <li className="nav-li__mobile-only" key={_.uniqueId('link_')}>
        <NavLink {...link} />
      </li>
    ))}
    <div className="tui-app-nav-list-sub">
      {linkSet.menu.map(link => (
        <li key={_.uniqueId('link_')}>
          <NavLink className="tui-app-nav-link__in-menu" {...link} />
        </li>
      ))}
    </div>
  </ul>
);

MenuList.propTypes = {
  linkSet: PropTypes.shape({
    main: PropTypes.arrayOf(PropTypes.object),
    menu: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onMouseEnter: PropTypes.func.isRequired,
};

module.exports = MenuList;
