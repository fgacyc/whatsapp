import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { WABAClient } from 'whatsapp-business';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(bodyParser.json());
const port = 3000;

const client = new WABAClient({
	accountId: process.env.WABA_ID ?? '',
	apiToken: process.env.WHATSAPP_AUTH_TOKEN ?? '',
	phoneId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? '',
});

type WhatsAppMessage = {
	receiver: string;
	message: string;
};

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.post('/message', async (req, res) => {
	const body = req.body as WhatsAppMessage;

	// res.send(body);

	try {
		await client.sendMessage({
			to: body.receiver,
			type: 'text',
			text: {
				body: body.message,
			},
		});

		res.status(200).send();
	} catch (err: unknown) {
		console.error(err);
		res.status(500).send();
	}
});

app.listen(port, () => {
	console.log(`WhatsApp Bot listening on port ${port}`);
});
