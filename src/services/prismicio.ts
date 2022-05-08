import * as prismic from '@prismicio/client';

import sm from './../../sm.json';

export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

export function createClient() {
  const client = prismic.createClient(endpoint)

  return client
}