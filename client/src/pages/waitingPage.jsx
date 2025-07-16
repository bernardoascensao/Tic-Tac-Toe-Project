import { Channel, useChatContext } from 'stream-chat-react';
import React, { useState } from 'react';
import GamePage from './gamePage';


const WaitingPage = ({ logout }) => {
    const { client } = useChatContext();
    const [opponentUserName, setOpponentUserName] = useState("");
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitInvite = async () => {
        try {
            const response = await client.queryUsers({ userName: { $eq: opponentUserName } });
    
            if (response.users.length === 0) {
                alert("User not found");
                return;
            }
    
            const newChannel = client.channel("messaging", {
                members: [client.userID, response.users[0].id],
            });

            setLoading(true);

            // Monitora o canal para eventos ao vivo
            await newChannel.watch();

            if(newChannel.state.watcher_count === 2){ setLoading(false); setChannel(newChannel); }

            // Escuta o evento `member.added` para saber quando o oponente se juntar
            newChannel.on("user.watching.start", (event) => {
                if (event.user.id === response.users[0].id) {
                    setLoading(false);
                    setChannel(newChannel);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {channel ? (
                <Channel channel={channel}>
                    <GamePage />
                </Channel>
            ) : (
                <div className='h-96 w-96 flex flex-col justify-around items-center bg-slate-200 border-2 border-slate-400'>
                    <div className='flex flex-col items-center gap-2'>
                        <label className='text-5xl'>Waiting Room</label>
                        <br/>
                        <p>Your username: <b>{client._user.username}</b></p>
                        <input
                            id="opponent-username"
                            className='p-1 rounded-md'
                            type="text"
                            placeholder='Opponent username'
                            onChange={(event) => setOpponentUserName(event.target.value)}
                            required
                        />
                        <p>{loading ? "Waiting for opponent..." : null}</p>
                        <button className='w-24 p-1 rounded-md text-white bg-lime-600' onClick={submitInvite}>Invite</button>
                    </div>
                    <button className='w-24 p-1 rounded-md text-white bg-red-500' onClick={logout}>Log Out</button>
                </div>
            )}
        </div>
    );
};

export default WaitingPage;
