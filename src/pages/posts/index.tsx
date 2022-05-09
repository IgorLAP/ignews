import * as prismic from '@prismicio/client';
import { asText } from '@prismicio/helpers';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { createClient } from '../../services/prismicio';
import styles from './styles.module.scss';

type Post = {
    slug: string;
    title: string;
    preview: string;
    updatedAt: string;
}
interface PostsProps {
    posts: Post[];
}

export default function Posts({ posts }: PostsProps){
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.postList}>
                    {posts.map((post, index) => (
                        <Link key={index} href={`/posts/${post.slug}`}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.preview}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
   const client = createClient();

   const response = await client.get({
    predicates: [prismic.predicate.at('document.type', 'publication')],
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100
   });

   const posts = response.results.map(i => {
       return {
           slug: i.uid,
           title: asText(i.data.title),
           preview: i.data.content.find(content => content.type == 'paragraph')?.text.split('\n')[0] ?? '',
           updatedAt: new Date(i.last_publication_date).toLocaleDateString('pt-BR', {
               day: '2-digit',
               month: 'long',
               year: 'numeric'
           })
       }
   })

   return {
       props: {
           posts
       }
   }
}