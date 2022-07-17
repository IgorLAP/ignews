import { signIn, signOut, useSession } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton() {
  const { data } = useSession();

  return data ? (
    <button className={styles.signInButton}>
      <FaGithub color='#04D361' />
      {data.user.name}
      <FiX data-testid='signOutIcon' onClick={() => signOut()} />
    </button>
  ) : (
    <button onClick={() => signIn('github')} className={styles.signInButton}>
      <FaGithub color='#EBA417' />
      Sign In with Github
    </button>
  )
}