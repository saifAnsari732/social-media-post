import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { logWebhookEvent } from '@/lib/db';
import { matchRule } from '@/lib/automation/rule-matcher';
import { sendReply } from '@/lib/automation/reply-sender';

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'my_custom_verify_token_123';
const APP_SECRET = process.env.META_APP_SECRET;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Facebook Webhook Verified!');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    if (APP_SECRET && signature) {
      const expectedSignature = `sha256=${crypto
        .createHmac('sha256', APP_SECRET)
        .update(rawBody)
        .digest('hex')}`;
      
      if (signature !== expectedSignature) {
        console.error('Invalid signature');
        return new NextResponse('Invalid signature', { status: 401 });
      }
    }

    const data = JSON.parse(rawBody);
    
    // Quick acknowledge
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Process asynchronously
    processEventAsync(data).catch(console.error);

    return response;
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function processEventAsync(data) {
  if (data.object !== 'page') return;

  for (const entry of data.entry) {
    const pageId = entry.id;
    
    // Handle Messaging (DMs)
    if (entry.messaging) {
      for (const event of entry.messaging) {
        if (event.message && !event.message.is_echo) {
           await logWebhookEvent({
             platform: 'facebook',
             eventType: 'dm',
             account: pageId,
             payload: event,
             processed: false,
             receivedAt: new Date().toISOString()
           });

           // Call rule matcher and reply sender
           const rule = await matchRule(pageId, 'facebook', 'dm', event.message.text);
           if (rule) {
             console.log(`[AutoReply] Matched rule ${rule.name} for FB DM`);
             await sendReply(rule, event.sender.id, event.message.text, 'facebook');
           }
        }
      }
    }
    
    // Handle Comments (Page feed)
    if (entry.changes) {
       for (const change of entry.changes) {
         if (change.field === 'feed' && change.value.item === 'comment' && change.value.verb === 'add') {
            await logWebhookEvent({
               platform: 'facebook',
               eventType: 'comment',
               account: pageId,
               payload: change.value,
               processed: false,
               receivedAt: new Date().toISOString()
            });
         }
       }
    }
  }
}
