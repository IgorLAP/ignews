import { screen, render } from '@testing-library/react'

import { stripe } from '../../services/stripe'
import Home from '../../pages'
import { getStaticProps } from '../../pages/index'

jest.mock('next-auth/react', () => {
  return {
    useSession: () => ({
      data: null,
      status: 'unauthenticated'
    })
  }
})

jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: 'RS$10,00' }} />)

    expect(screen.findByText('for RS$10,00 month'))
  })

  it('receive initial props correctly', async () => {
    const stripeRetrievePricesMock = jest.mocked(stripe.prices.retrieve)
    stripeRetrievePricesMock.mockResolvedValueOnce({
      id: 'fake-price-id', unit_amount: 1000
    } as any)

    const response = await getStaticProps({})
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: { priceId: 'fake-price-id', amount: '$10.00' }
        }
      })
    )
  })
})