import { render, screen } from '@testing-library/react';

import Posts, { getStaticProps } from '../../pages/posts';
import { createClient } from '../../services/prismicio';

jest.mock('../../services/prismicio')

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  preview: 'Post Content',
  updatedAt: '17 de julho de 2022',
}

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={[post]} />)

    expect(screen.findByText('My New Post'))
  })

  it('receive initial props correctly', async () => {
    const createClientMock = jest.mocked(createClient)
    createClientMock.mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({
        results: [{
          uid: 'my-new-post',
          data: {
            title: [
              { type: 'heading', text: 'My New Post' }
            ],
            content: [
              { type: 'paragraph', text: 'Post Content' }
            ],
          },
          last_publication_date: '07-17-2022'
        }]
      })
    } as any)

    const response = await getStaticProps({})
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My New Post',
            preview: 'Post Content',
            updatedAt: '17 de julho de 2022'
          }]
        }
      })
    )
  })
})