require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');


const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 8000;
const verifyToken = process.env.VERIFY_TOKEN;
const accessToken = process.env.ACCESS_TOKEN;

app.get('/webhook', (req, res) => {
    const {
        'hub.mode': mode,
        'hub.challenge': challenge,
        'hub.verify_token': token
    } = req.query;

    if (mode && token) {
        if (mode === 'subscribe' && token === verifyToken) {
            console.log('WEBHOOK VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.status(403).end();
        }
    }
});

app.post('/webhook', (req, res) => {
    let body_param = req.body;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`\n\nWebhook received ${timestamp}\n`);
    console.log(JSON.stringify(body_param, null, 2));

    if (body_param.object) {
        if (
            body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.message &&
            body_param.entry[0].changes[0].value.message[0]
        ) {
            let phone_number_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            axios({
                method: 'post',
                url: `https://graph.facebook.com/v23.0/${phone_number_id}/messages`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: msg_body
                    }
                }
            })

            res.status(200).end();
        } else {
            res.status(404).send('No message found');
        }
    }
});

app.listen(port, () => {
  console.log(`webhook is listening on port ${port}`);
});