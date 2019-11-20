import React from 'react';
import renderer from 'react-test-renderer';

import DotStage from '.';

describe('DotStage', () => {
  test('It renders', () => {
    const component = renderer.create(<DotStage />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
