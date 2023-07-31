import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

dotenv.config();
const app = express();
app.use(bodyParser.json());
const port = 3000;

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
		await axios
			.post(
				`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
				{
					messaging_product: 'whatsapp',
					to: body.receiver,
					text: {
						body: body.message,
					},
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${process.env.WHATSAPP_AUTH_TOKEN}`,
					},
				},
			)
			.then((response) => res.status(200).send(response.data));

		res.status(200).send();
	} catch (err: unknown) {
		console.error(err);
		res.status(500).send();
	}
});

app.listen(port, () => {
	console.log(`WhatsApp Bot listening on port ${port}`);
});
