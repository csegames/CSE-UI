import Sender from './Sender';
import messageType from './messageType';
declare class Message {
    id: number;
    time: Date;
    message: string;
    roomName: string;
    type: messageType;
    sender: Sender;
    constructor(id: number, time: Date, message: string, roomName: string, type: messageType, sender: Sender);
}
export default Message;
