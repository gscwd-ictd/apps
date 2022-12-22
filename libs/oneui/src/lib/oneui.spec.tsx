import { render } from '@testing-library/react';

import Oneui from './oneui';

describe('Oneui', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Oneui />);
    expect(baseElement).toBeTruthy();
  });
});
