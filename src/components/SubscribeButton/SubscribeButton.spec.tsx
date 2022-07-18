import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

import { SubscribeButton } from '.';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/stripe-js')
jest.mock('../../services/api')

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

  it('correctly send subscribe request and redirect to checkout', async () => {
    const useSessionMock = jest.mocked(useSession)
    const functionMock = jest.fn()
    const getStripeJSMock = jest.mocked(getStripeJs)
    const apiPostMock = jest.mocked(api.post)

    useSessionMock.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe'
        }
      }
    } as any)

    apiPostMock.mockResolvedValueOnce({
      data: {
        sessionId: 'fake-session-id'
      }
    })

    getStripeJSMock.mockResolvedValueOnce({
      redirectToCheckout: functionMock
    } as any)

    render(<SubscribeButton />)
    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    await waitFor(
      () => expect(functionMock).toHaveBeenCalledWith({ sessionId: 'fake-session-id' })
    )
  })

  it('throws an error if subscribe request fails', async () => {
    const useSessionMock = jest.mocked(useSession)

    useSessionMock.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe'
        }
      }
    } as any)

    const windowAlertMock = window.alert = jest.fn()

    render(<SubscribeButton />)
    const subscribeButton = screen.getByText('Subscribe Now')
    fireEvent.click(subscribeButton)

    waitFor(() => {
      expect(windowAlertMock).toBeCalled()
      windowAlertMock.mockClear()
    })
  })
})