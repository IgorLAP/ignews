import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { createClient } from '../../services/prismicio';

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: 'Post Content',
  updatedAt: '17 de julho de 2022',
}

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/prismicio.ts')
jest.mock('@prismicio/helpers', () => {
  return {
    asText: () => 'My New Post'
  }
})

describe('PostPreview page', () => {
  it('renders correctly', () => {
    const useSessionMock = jest.mocked(useSession)
    useSessionMock.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

    render(<PostPreview post={post} />)

    expect(screen.findByText('My New Post'))
    expect(screen.findByText('Wanna continue reading?'))
    expect(screen.findByText('Subscribe now 🤗'))
  })

  it('redirects user if active subscription is found', async () => {
    const useSessionMock = jest.mocked(useSession)
    const useRouterMock = jest.mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMock.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription'
      }
    } as any)
    useRouterMock.mockReturnValueOnce({ push: pushMock } as any)

    render(<PostPreview post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('receive initial props if unsubscribed', async () => {
    const prismicCreateClientMock = jest.mocked(createClient)
    prismicCreateClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My New Post' }],
          content: [{ type: 'paragraph', text: 'Post Content' }],
        },
        last_publication_date: '07-17-2022'
      })
    } as any)

    const response = await getStaticProps({ params: { slug: 'my-new-post' } })

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