import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyButton } from '../../index';

describe('MyButton Component', () => {
  it('should render the component without crashing', () => {
    const { getByText } = render(<MyButton />);
    expect(getByText('This is the update!')).toBeInTheDocument();
    expect(getByText('Latest')).toBeInTheDocument();
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});
