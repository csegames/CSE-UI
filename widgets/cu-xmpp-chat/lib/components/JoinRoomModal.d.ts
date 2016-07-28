import * as React from 'react';
import { Room } from '../lib/CSEChat';
export interface JoinRoomModalProps {
    closeModal: () => void;
    joinRoom: (roomName: string) => void;
    getRooms: () => void;
}
export interface JoinRoomModalState {
    rooms: Room[];
    filter: string;
}
declare class JoinRoomModal extends React.Component<JoinRoomModalProps, JoinRoomModalState> {
    constructor(props: JoinRoomModalProps);
    initialState(): JoinRoomModalState;
    componentDidMount(): void;
    getRooms: () => void;
    gotRooms: (rooms: Room[]) => void;
    joinRoom: () => void;
    selectRoom: (room: Room) => void;
    render(): JSX.Element;
}
export default JoinRoomModal;
