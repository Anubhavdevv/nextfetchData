import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { addDoc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

export default function UserDashboard() {
    const { userInfo, currentUser } = useAuth()
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    
    const createNewChat = async() => {
        const doc = await addDoc(collection(db,'users', currentUser.uid, "chats"), {
            userId: currentUser.uid,
            createdAt: serverTimestamp()
        })
        router.push(`/chat/${doc.id}`);
    }
    return (
       
        <div className='w-full max-w-[65ch] text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5'>
           <div onClick={createNewChat} className="border-gray-700 border chatrow">
            <p>New Chat</p>
          </div>
        </div>
        
    )
}
