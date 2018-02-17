import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Welcome } from '@storybook/react/demo';

// Import the styles
import 'tfstyleguide/core.less';
import '../less/main.less';

import Icon from '../src/Icon';
import Tag from '../src/Tag';

storiesOf('Welcome', module).add('to Storybook', () => (
  <Welcome showApp={linkTo('Button')} />
));

storiesOf('Icon', module).add('Navigate right', () => (
  <Icon name="navigateright" />
));

storiesOf('Tag', module)
  .add('Basic', () => <Tag displayName="Test" />)
  .add('With class', () => (
    <Tag displayName="With a class" className="some-class" />
  ))
  .add('With link', () => (
    <Tag displayName="Thinkful.com" url="https://www.thinkful.com" />
  ));

storiesOf('Headers', module)
  .add('h1', () => <h1>This is an h1</h1>)
  .add('h2', () => <h2>This is an h2</h2>)
  .add('h3', () => <h3>This is an h3</h3>)
  .add('h4', () => <h4>This is an h4</h4>)
  .add('h5', () => <h5>This is an h5</h5>)
  .add('h6', () => <h6>This is an h6</h6>);
