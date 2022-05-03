import { query as q } from 'faunadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { fauna } from '../../services/fauna';
import { stripe } from './../../services/stripe';

type User = {
    ref: {
        id: string;
    },
    data: {
        email: string;
        stripe_costumer_id: string;
    }
}

export default async function Subscribe (req: NextApiRequest, res: NextApiResponse) {
    if(req.method == 'POST') {
        const stripeSession = await getSession({ req });

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(stripeSession.user.email)
                )
            )
        )

        let customerId = user.data.stripe_costumer_id;

        if(!customerId){
            const stripeCustomer = await stripe.customers.create({
                email: stripeSession.user.email
            });
    
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_costumer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id;
        }

        

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1Ktsv4LIuZqHu2KQRxzJLjJW', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        });
        
        return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed')
    }
}