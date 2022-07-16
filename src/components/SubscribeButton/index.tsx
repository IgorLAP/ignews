import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';


export function SubscribeButton() {
  const { data } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!data) {
      signIn('github');
      return;
    }

    if (data.activeSubscription) {
      router.push('/posts')
      return;
    }

    try {
      const response = await api.post('/subscribe');
      const { sessionId } = response.data;
      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (e) {
      alert(e.message);
    }
  }


  return (
    <button type="button" onClick={handleSubscribe} className={styles.subscribeButton}>
      Subscribe Now
    </button>
  )
}