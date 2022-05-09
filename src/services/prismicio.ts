import * as prismic from '@prismicio/client';

import sm from './../../sm.json';

export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

export function createClient(req?: unknown) {
  const client = prismic.createClient(endpoint, req)

  return client
}