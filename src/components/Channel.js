import React, { useState, useEffect } from "react";
import firebase from 'firebase/compat/app';
import Message from './/Message';

const Channel = ({ user = null, db = null }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const { uid, displayName, photoURL } = user;

    useEffect(() => {
        if (db) {
            const unsubscribe = db
                .collection('messages')
                .orderBy('createdAt')
                .limit(100)
                .onSnapshot(querySnapshot => {
                    // Get all documents from collection -with IDs
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    // Update state
                    setMessages(data);
                });

            //Detach listener
            return unsubscribe;
        }
    }, [db]);

    const handleOnChange = e => {
        setNewMessage(e.target.value);
    };

    const handleOnSubmit = e => {
        e.preventDefault();

        if (db) {
            db.collection('messages').add({
                text: newMessage,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                displayName,
                photoURL
            })
        }
    }

    return (
        <>
        <ul>
            {messages.map(message => (
                <li key={message.id}>
                    <Message {...message} />
                    </li>
            ))}
        </ul>
        <form onSubmit={handleOnSubmit}>
            <input
                type="text"
                value={newMessage}
                onChange={handleOnChange}
                placeholder="Type your message here..."
            />
            <button type="submit" disabled={!newMessage}>
                Send
            </button>
        </form>
        </>
    );
};

export default Channel;