import React, { useState, useCallback } from 'react'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../../../firebase'
import { useRouter } from 'next/router'
import { useAuth } from '../../../context/AuthContext'

import toast from 'react-hot-toast'
import ClientProvider from '../../../components/ClientProvider'

export default function UserDashboard(chatId) {
    const [prompt, setPrompt] = useState('');
    const { userInfo, currentUser } = useAuth();
    const model = "text-davinci-003";
    const sendMessage = async (e)=> {
        e.preventDefault()
        if(!prompt)
          return
        const input = prompt.trim();  
        setPrompt("");
        const message = {
            text: input,
            createdAt: serverTimestamp(),
            user: {
                _id: currentUser.email,
                // name: currentUser.name,
                // avatar: currentUser.image || `https://ui-avatars.com/api/?name=${currentUser.name}`,
            }
        }
        await addDoc(collection(db, "users", currentUser.email, "chats"), 
            message
        )
        const notification = toast.loading('Chatgptis thinking')
        await fetch('/api/askQuestion',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                prompt: input, chatId, model, currentUser
            })
        }).then(()=>{
            toast.success('chatgpt is repsonded',{
                id: notification,
            })
        })


    }
    return (
       
        <div className='w-full max-w-[65ch] text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5'>
            <div className='flex items-stretch'>
                <form onSubmit={sendMessage} className="p-5 space-x-5 flex-1">
                    <input type='text' placeholder="Ask anything you want" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="outline-none p-3 text-base sm:text-lg text-slate-900 flex-1" />
                    <button type="submit" className='w-fit px-4 sm:px-6 py-2 sm:py-3 bg-amber-400 text-white font-medium text-base duration-300 hover:opacity-40'>ASK</button>
                </form>
            </div>
            <ClientProvider/>
        </div>
        
    )
}
