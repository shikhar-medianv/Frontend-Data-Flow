import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('webhooks')
export class WebhookController {
    @Post('receive')
    @HttpCode(HttpStatus.OK)
    handleIncomingWebhook(@Body() payload: any) {
        console.log('--- Incoming Webhook Received ---');
        console.log('Payload:', JSON.stringify(payload, null, 2));
        console.log('--------------------------------');
        return { status: 'acknowledged', timestamp: new Date().toISOString() };
    }
}
