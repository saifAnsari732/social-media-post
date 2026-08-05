import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { logWebhookEvent } from '@/lib/db';
import { matchRule } from '@/lib/automation/rule-matcher';
import { sendReply } from '@/lib/automation/reply-sender';

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'my_custom_verify_token_123';
const APP_SECRET = process.env.META_APP_SECRET;

// GET method for Meta Webhook Verification
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Instagram Webhook Verified!');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// POST method to handle incoming events
export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-hub-signature-256');

    // Verify signature if APP_SECRET is available
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
    
    // Quick acknowledge to Meta to prevent retries
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Process asynchronously (or add to a queue in production)
    // We are simulating immediate queue addition by processing in the background
    processEventAsync(data).catch(console.error);

    return response;
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function processEventAsync(data) {
  if (data.object !== 'instagram') return;

  for (const entry of data.entry) {
    const accountId = entry.id; // The Instagram Business Account ID
    
    // Handle Messaging (DMs)
    if (entry.messaging) {
      for (const event of entry.messaging) {
        if (event.message && !event.message.is_echo) {
           await logWebhookEvent({
             platform: 'instagram',
             eventType: 'dm',
             account: accountId,
             payload: event,
             processed: false,
             receivedAt: new Date().toISOString()
           });
           
           // Call rule matcher and reply sender
           const rule = await matchRule(accountId, 'instagram', 'dm', event.message.text);
           if (rule) {
             console.log(`[AutoReply] Matched rule ${rule.name} for IG DM`);
             await sendReply(rule, event.sender.id, event.message.text, 'instagram');
           }
        }
      }
    }
    
    // Handle Comments
    if (entry.changes) {
       for (const change of entry.changes) {
         if (change.field === 'comments') {
            await logWebhookEvent({
               platform: 'instagram',
               eventType: 'comment',
               account: accountId,
               payload: change.value,
               processed: false,
               receivedAt: new Date().toISOString()
            });
            
            const commentText = change.value.text;
            const commentId = change.value.id;
            
            // Call rule matcher and reply sender
            const rule = await matchRule(accountId, 'instagram', 'comment', commentText);
            if (rule) {
              console.log(`[AutoReply] Matched rule ${rule.name} for IG Comment`);
              await sendReply(rule, commentId, commentText, 'instagram', 'comment');
            }
         }
       }
    }
  }
}
