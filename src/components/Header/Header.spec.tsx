import { render, screen } from '@testing-library/react';
import React from 'react';

import { Header } from '.';

// next router in '/' path
jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

// next-auth user not authenticated
jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return {
        data: null,
        status: "unauthenticated"
      }
    }
  }
})

// Workaround next image mock
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub'
  }
}))

describe('Header component', () => {
  it('should renders correctly', () => {
    render(
      <Header />
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })
})