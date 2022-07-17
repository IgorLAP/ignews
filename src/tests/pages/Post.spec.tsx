import { screen, render } from '@testing-library/react'
import { getSession } from 'next-auth/react'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { createClient } from '../../services/prismicio'

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: 'Post Content',
  updatedAt: '17 de julho de 2022',
}

jest.mock('next-auth/react')
jest.mock('../../services/prismicio.ts')
jest.mock('@prismicio/helpers', () => {
  return {
    asHTML: () => 'Post Content',
    asText: () => 'My New Post'
  }
})

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.findByText('My New Post'))
    expect(screen.findByText('Post Content'))
  })

  it('redirects user if no active subscription is found', async () => {
    const getSessionMock = jest.mocked(getSession)
    getSessionMock.mockResolvedValueOnce({ activeSubscription: null } as any)

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/my-new-post'
        })
      })
    )
  })

  it('receive initial props if active subscription found', async () => {
    const getSessionMock = jest.mocked(getSession)
    getSessionMock.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    const prismicCreateClientMock = jest.mocked(createClient)
    prismicCreateClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        slug: 'my-new-post',
        data: {
          title: [{ type: 'heading', text: 'My New Post' }],
          content: [{ type: 'paragraph', text: 'Post Content' }],
        },
        last_publication_date: '07-17-2022'
      })
    } as any)

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: 'Post Content',
            updatedAt: '17 de julho de 2022'
          }
        }
      })
    )
  })
})