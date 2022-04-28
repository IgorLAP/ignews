import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton(){
    const [isLogged, setIsLogged] = useState(false);

    return isLogged ? (
        <button className={styles.signInButton}>
            <FaGithub color='#04D361' />
            Igor Pedrosa
            <FiX />
        </button>
    ) : (
        <button className={styles.signInButton}>
            <FaGithub color='#EBA417' />
            Sign In with Github
            <FiX />
        </button>
    )
}