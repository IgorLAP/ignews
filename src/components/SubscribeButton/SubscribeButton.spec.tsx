import { fireEvent, render, screen } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import React from 'react';

import { SubscribeButton } from '.';

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton Component', () => {
  it('renders correctly', () => {
    const useSessionMock = jest.mocked(useSession)
    useSessionMock.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe Now'))
  })

  it('redirects to sign in if user is not authenticated', () => {
    const useSessionMock = jest.mocked(useSession)
    const signInMock = jest.mocked(signIn)

    useSessionMock.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)
    expect(signInMock).toHaveBeenCalled()
  })

  it('redirects to posts if user already has a subscription', () => {
    const useSessionMock = jest.mocked(useSession)
    const useRouterMock = jest.mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMock.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@gmail.com'
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires'
      },
      status: 'authenticated'
    })

    useRouterMock.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    // se a função foi chamada com o parametro '/posts'
    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})