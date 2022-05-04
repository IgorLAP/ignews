/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';

import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

async function buffer(readable: Readable){
    const chunks = [];

    for await(const chunk of readable){
        chunks.push(
            typeof chunk == 'string' ? Buffer.from(chunk) : chunk
        );
    }
    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method == 'POST'){
        const buf = await buffer(req);
        const secret = req.headers['stripe-signature'];

        //'Event' é um evento generico, todos possíveis eventos terão a mesma tipagem
        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)            
        } catch(e) {
            return res.status(400).send(`Webhook error: ${e.message}`);
        }

        const { type } = event;

        if(relevantEvents.has(type)){
            try {
                switch(type) {
                    case 'checkout.session.completed':

                        //Por estar no case, tipamos para ficar de forma mais clara a manipulação pelo TS
                        const checkoutSession = event.data.object as Stripe.Checkout.Session;

                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        );
                        break;
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':

                        const subscription = event.data.object as Stripe.Subscription;

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString()
                        );

                        break;
                    default: 
                        throw new Error('Unhandled error')
                }
            } catch (e) {
                return res.json({ error: 'Webhook handler failed.' })
            }
        }

        res.json({ recieved: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
    }
}