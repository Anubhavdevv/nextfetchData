{import('next').NextApiRequest} req
{import('next').NextApiResponse} res
import query from "../../../lib/queryApi"
import admin from 'firebase-admin'
import { adminDb } from "../../../firebaseAdmin"
export default async function handler(req, res){
    const {prompt, model, sessione} = req.body;
    if(!prompt){
        res.status(400).json({
            answer: "Please provide a prompt!"
        })
        return;
    }
    if(!sessione) {
        res.status(400).json({
            answer: "Provide a valid sesson id!"
        })
        return;
    }
    const response = await query(prompt, model, sessione)

    const message = {
        text: response || "Chat gpt is unable to find an answer",
        createdAt: admin.firestore.Timestamp.now(),
        user: {
            _id: 'ChatGpt',
            name: 'Chatgpt',
            avatar: "https://links.papareact.com/89k",
        }
    };
    await adminDb.collection('users').doc(sessione).collection("chats").doc(sessione).collection("Messages").add(message);

    res.status(200).json({
        answer:message.text
    })
}