import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import React from 'react';

import { SignInButton } from '.';

jest.mock('next-auth/react')

describe('SignInButton component', () => {
  it('should render "Sign In with Github button" if user is unauthenticated', () => {
    jest.mocked(useSession)
      .mockReturnValueOnce({ data: null, status: 'unauthenticated' })

    render(<SignInButton />)

    expect(screen.getByText('Sign In with Github')).toBeInTheDocument()
  })

  it('should display username in button if user is authenticated', () => {
    jest.mocked(useSession)
      .mockReturnValueOnce({
        data: {
          user: { name: 'John Doe', email: 'johndoe@gmail.com' },
          expires: 'fake-expires'
        },
        status: 'authenticated'
      })

    render(<SignInButton />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})