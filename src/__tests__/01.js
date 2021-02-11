import * as React from 'react';
import {alfredTip} from '@kentcdodds/react-workshop-app/test-utils';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import App from '../final/01'
import App from '../exercise/01';

test('clicking the button increments the count with useReducer', () => {
  jest.spyOn(React, 'useReducer');

  const {container, getByText} = render(<App />);
  const incrementButton = getByText('+');
  const decrementButton = getByText('-');
  userEvent.click(incrementButton);
  expect(container).toHaveTextContent('1');
  userEvent.click(incrementButton);
  expect(container).toHaveTextContent('2');
  userEvent.click(decrementButton);
  expect(container).toHaveTextContent('1');

  alfredTip(() => {
    expect(React.useReducer).toHaveBeenCalled();
  }, 'The Counter component that is rendered must call "useReducer" to get the "state" and "dispatch" function and you should get rid of that useState call.');
});
