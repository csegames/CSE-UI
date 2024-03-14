import * as $protobuf from "protobufjs";
/** Namespace chat. */
export namespace chat {

    /** Properties of a RoomActionRequest. */
    interface IRoomActionRequest {

        /** RoomActionRequest action */
        action?: (chat.RoomActionRequest.ActionType|null);

        /** RoomActionRequest create */
        create?: (chat.RoomActionRequest.ICreateRoom|null);

        /** RoomActionRequest delete */
        "delete"?: (chat.RoomActionRequest.IDeleteRoom|null);

        /** RoomActionRequest rename */
        rename?: (chat.RoomActionRequest.IRenameRoom|null);

        /** RoomActionRequest join */
        join?: (chat.RoomActionRequest.IJoinRoom|null);

        /** RoomActionRequest leave */
        leave?: (chat.RoomActionRequest.ILeaveRoom|null);

        /** RoomActionRequest createRole */
        createRole?: (chat.RoomActionRequest.ICreateRole|null);

        /** RoomActionRequest updateRole */
        updateRole?: (chat.RoomActionRequest.IUpdateRole|null);

        /** RoomActionRequest deleteRole */
        deleteRole?: (chat.RoomActionRequest.IDeleteRole|null);

        /** RoomActionRequest assignRole */
        assignRole?: (chat.RoomActionRequest.IAssignRole|null);

        /** RoomActionRequest inviteUser */
        inviteUser?: (chat.RoomActionRequest.IInviteUser|null);

        /** RoomActionRequest kickUser */
        kickUser?: (chat.RoomActionRequest.IKickUser|null);

        /** RoomActionRequest banUser */
        banUser?: (chat.RoomActionRequest.IBanUser|null);

        /** RoomActionRequest muteUser */
        muteUser?: (chat.RoomActionRequest.IMuteUser|null);

        /** RoomActionRequest transferOwner */
        transferOwner?: (chat.RoomActionRequest.ITransferOwnership|null);
    }

    /** Represents a RoomActionRequest. */
    class RoomActionRequest implements IRoomActionRequest {

        /**
         * Constructs a new RoomActionRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomActionRequest);

        /** RoomActionRequest action. */
        public action: chat.RoomActionRequest.ActionType;

        /** RoomActionRequest create. */
        public create?: (chat.RoomActionRequest.ICreateRoom|null);

        /** RoomActionRequest delete. */
        public delete?: (chat.RoomActionRequest.IDeleteRoom|null);

        /** RoomActionRequest rename. */
        public rename?: (chat.RoomActionRequest.IRenameRoom|null);

        /** RoomActionRequest join. */
        public join?: (chat.RoomActionRequest.IJoinRoom|null);

        /** RoomActionRequest leave. */
        public leave?: (chat.RoomActionRequest.ILeaveRoom|null);

        /** RoomActionRequest createRole. */
        public createRole?: (chat.RoomActionRequest.ICreateRole|null);

        /** RoomActionRequest updateRole. */
        public updateRole?: (chat.RoomActionRequest.IUpdateRole|null);

        /** RoomActionRequest deleteRole. */
        public deleteRole?: (chat.RoomActionRequest.IDeleteRole|null);

        /** RoomActionRequest assignRole. */
        public assignRole?: (chat.RoomActionRequest.IAssignRole|null);

        /** RoomActionRequest inviteUser. */
        public inviteUser?: (chat.RoomActionRequest.IInviteUser|null);

        /** RoomActionRequest kickUser. */
        public kickUser?: (chat.RoomActionRequest.IKickUser|null);

        /** RoomActionRequest banUser. */
        public banUser?: (chat.RoomActionRequest.IBanUser|null);

        /** RoomActionRequest muteUser. */
        public muteUser?: (chat.RoomActionRequest.IMuteUser|null);

        /** RoomActionRequest transferOwner. */
        public transferOwner?: (chat.RoomActionRequest.ITransferOwnership|null);

        /**
         * Creates a new RoomActionRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomActionRequest instance
         */
        public static create(properties?: chat.IRoomActionRequest): chat.RoomActionRequest;

        /**
         * Encodes the specified RoomActionRequest message. Does not implicitly {@link chat.RoomActionRequest.verify|verify} messages.
         * @param message RoomActionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomActionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomActionRequest message, length delimited. Does not implicitly {@link chat.RoomActionRequest.verify|verify} messages.
         * @param message RoomActionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomActionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomActionRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomActionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest;

        /**
         * Decodes a RoomActionRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomActionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest;

        /**
         * Verifies a RoomActionRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomActionRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomActionRequest
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest;

        /**
         * Creates a plain object from a RoomActionRequest message. Also converts values to other types if specified.
         * @param message RoomActionRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomActionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomActionRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace RoomActionRequest {

        /** ActionType enum. */
        enum ActionType {
            CREATE = 0,
            DELETE = 1,
            RENAME = 2,
            JOIN = 3,
            LEAVE = 4,
            CREATEROLE = 5,
            UPDATEROLE = 6,
            DELETEROLE = 7,
            ASSIGNROLE = 8,
            INVITEUSER = 9,
            KICKUSER = 10,
            BANUSER = 11,
            MUTEUSER = 12,
            TRANSFEROWNERSHIP = 13,
            DIRECTORY = 14
        }

        /** Properties of a CreateRoom. */
        interface ICreateRoom {

            /** CreateRoom name */
            name?: (string|null);

            /** CreateRoom isPublic */
            isPublic?: (boolean|null);

            /** CreateRoom forGroupID */
            forGroupID?: (string|null);
        }

        /** Represents a CreateRoom. */
        class CreateRoom implements ICreateRoom {

            /**
             * Constructs a new CreateRoom.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.ICreateRoom);

            /** CreateRoom name. */
            public name: string;

            /** CreateRoom isPublic. */
            public isPublic: boolean;

            /** CreateRoom forGroupID. */
            public forGroupID: string;

            /**
             * Creates a new CreateRoom instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateRoom instance
             */
            public static create(properties?: chat.RoomActionRequest.ICreateRoom): chat.RoomActionRequest.CreateRoom;

            /**
             * Encodes the specified CreateRoom message. Does not implicitly {@link chat.RoomActionRequest.CreateRoom.verify|verify} messages.
             * @param message CreateRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.ICreateRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.CreateRoom.verify|verify} messages.
             * @param message CreateRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.ICreateRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateRoom message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.CreateRoom;

            /**
             * Decodes a CreateRoom message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.CreateRoom;

            /**
             * Verifies a CreateRoom message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateRoom message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateRoom
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.CreateRoom;

            /**
             * Creates a plain object from a CreateRoom message. Also converts values to other types if specified.
             * @param message CreateRoom
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.CreateRoom, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateRoom to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DeleteRoom. */
        interface IDeleteRoom {

            /** DeleteRoom roomID */
            roomID?: (string|null);
        }

        /** Represents a DeleteRoom. */
        class DeleteRoom implements IDeleteRoom {

            /**
             * Constructs a new DeleteRoom.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IDeleteRoom);

            /** DeleteRoom roomID. */
            public roomID: string;

            /**
             * Creates a new DeleteRoom instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeleteRoom instance
             */
            public static create(properties?: chat.RoomActionRequest.IDeleteRoom): chat.RoomActionRequest.DeleteRoom;

            /**
             * Encodes the specified DeleteRoom message. Does not implicitly {@link chat.RoomActionRequest.DeleteRoom.verify|verify} messages.
             * @param message DeleteRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IDeleteRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeleteRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.DeleteRoom.verify|verify} messages.
             * @param message DeleteRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IDeleteRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeleteRoom message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeleteRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.DeleteRoom;

            /**
             * Decodes a DeleteRoom message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeleteRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.DeleteRoom;

            /**
             * Verifies a DeleteRoom message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DeleteRoom message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DeleteRoom
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.DeleteRoom;

            /**
             * Creates a plain object from a DeleteRoom message. Also converts values to other types if specified.
             * @param message DeleteRoom
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.DeleteRoom, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DeleteRoom to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a RenameRoom. */
        interface IRenameRoom {

            /** RenameRoom roomID */
            roomID?: (string|null);

            /** RenameRoom name */
            name?: (string|null);
        }

        /** Represents a RenameRoom. */
        class RenameRoom implements IRenameRoom {

            /**
             * Constructs a new RenameRoom.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IRenameRoom);

            /** RenameRoom roomID. */
            public roomID: string;

            /** RenameRoom name. */
            public name: string;

            /**
             * Creates a new RenameRoom instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RenameRoom instance
             */
            public static create(properties?: chat.RoomActionRequest.IRenameRoom): chat.RoomActionRequest.RenameRoom;

            /**
             * Encodes the specified RenameRoom message. Does not implicitly {@link chat.RoomActionRequest.RenameRoom.verify|verify} messages.
             * @param message RenameRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IRenameRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RenameRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.RenameRoom.verify|verify} messages.
             * @param message RenameRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IRenameRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RenameRoom message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RenameRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.RenameRoom;

            /**
             * Decodes a RenameRoom message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RenameRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.RenameRoom;

            /**
             * Verifies a RenameRoom message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RenameRoom message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RenameRoom
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.RenameRoom;

            /**
             * Creates a plain object from a RenameRoom message. Also converts values to other types if specified.
             * @param message RenameRoom
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.RenameRoom, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RenameRoom to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a JoinRoom. */
        interface IJoinRoom {

            /** JoinRoom roomID */
            roomID?: (string|null);

            /** JoinRoom inviteToken */
            inviteToken?: (string|null);
        }

        /** Represents a JoinRoom. */
        class JoinRoom implements IJoinRoom {

            /**
             * Constructs a new JoinRoom.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IJoinRoom);

            /** JoinRoom roomID. */
            public roomID: string;

            /** JoinRoom inviteToken. */
            public inviteToken: string;

            /**
             * Creates a new JoinRoom instance using the specified properties.
             * @param [properties] Properties to set
             * @returns JoinRoom instance
             */
            public static create(properties?: chat.RoomActionRequest.IJoinRoom): chat.RoomActionRequest.JoinRoom;

            /**
             * Encodes the specified JoinRoom message. Does not implicitly {@link chat.RoomActionRequest.JoinRoom.verify|verify} messages.
             * @param message JoinRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IJoinRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified JoinRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.JoinRoom.verify|verify} messages.
             * @param message JoinRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IJoinRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a JoinRoom message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns JoinRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.JoinRoom;

            /**
             * Decodes a JoinRoom message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns JoinRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.JoinRoom;

            /**
             * Verifies a JoinRoom message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a JoinRoom message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns JoinRoom
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.JoinRoom;

            /**
             * Creates a plain object from a JoinRoom message. Also converts values to other types if specified.
             * @param message JoinRoom
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.JoinRoom, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this JoinRoom to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a LeaveRoom. */
        interface ILeaveRoom {

            /** LeaveRoom roomID */
            roomID?: (string|null);
        }

        /** Represents a LeaveRoom. */
        class LeaveRoom implements ILeaveRoom {

            /**
             * Constructs a new LeaveRoom.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.ILeaveRoom);

            /** LeaveRoom roomID. */
            public roomID: string;

            /**
             * Creates a new LeaveRoom instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LeaveRoom instance
             */
            public static create(properties?: chat.RoomActionRequest.ILeaveRoom): chat.RoomActionRequest.LeaveRoom;

            /**
             * Encodes the specified LeaveRoom message. Does not implicitly {@link chat.RoomActionRequest.LeaveRoom.verify|verify} messages.
             * @param message LeaveRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.ILeaveRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LeaveRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.LeaveRoom.verify|verify} messages.
             * @param message LeaveRoom message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.ILeaveRoom, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LeaveRoom message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LeaveRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.LeaveRoom;

            /**
             * Decodes a LeaveRoom message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LeaveRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.LeaveRoom;

            /**
             * Verifies a LeaveRoom message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LeaveRoom message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LeaveRoom
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.LeaveRoom;

            /**
             * Creates a plain object from a LeaveRoom message. Also converts values to other types if specified.
             * @param message LeaveRoom
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.LeaveRoom, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LeaveRoom to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a CreateRole. */
        interface ICreateRole {

            /** CreateRole roomID */
            roomID?: (string|null);

            /** CreateRole name */
            name?: (string|null);

            /** CreateRole permissions */
            permissions?: (number|null);
        }

        /** Represents a CreateRole. */
        class CreateRole implements ICreateRole {

            /**
             * Constructs a new CreateRole.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.ICreateRole);

            /** CreateRole roomID. */
            public roomID: string;

            /** CreateRole name. */
            public name: string;

            /** CreateRole permissions. */
            public permissions: number;

            /**
             * Creates a new CreateRole instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CreateRole instance
             */
            public static create(properties?: chat.RoomActionRequest.ICreateRole): chat.RoomActionRequest.CreateRole;

            /**
             * Encodes the specified CreateRole message. Does not implicitly {@link chat.RoomActionRequest.CreateRole.verify|verify} messages.
             * @param message CreateRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.ICreateRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CreateRole message, length delimited. Does not implicitly {@link chat.RoomActionRequest.CreateRole.verify|verify} messages.
             * @param message CreateRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.ICreateRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CreateRole message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CreateRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.CreateRole;

            /**
             * Decodes a CreateRole message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CreateRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.CreateRole;

            /**
             * Verifies a CreateRole message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CreateRole message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CreateRole
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.CreateRole;

            /**
             * Creates a plain object from a CreateRole message. Also converts values to other types if specified.
             * @param message CreateRole
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.CreateRole, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CreateRole to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an UpdateRole. */
        interface IUpdateRole {

            /** UpdateRole roomID */
            roomID?: (string|null);

            /** UpdateRole name */
            name?: (string|null);

            /** UpdateRole permissions */
            permissions?: (number|null);

            /** UpdateRole rename */
            rename?: (string|null);
        }

        /** Represents an UpdateRole. */
        class UpdateRole implements IUpdateRole {

            /**
             * Constructs a new UpdateRole.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IUpdateRole);

            /** UpdateRole roomID. */
            public roomID: string;

            /** UpdateRole name. */
            public name: string;

            /** UpdateRole permissions. */
            public permissions: number;

            /** UpdateRole rename. */
            public rename: string;

            /**
             * Creates a new UpdateRole instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UpdateRole instance
             */
            public static create(properties?: chat.RoomActionRequest.IUpdateRole): chat.RoomActionRequest.UpdateRole;

            /**
             * Encodes the specified UpdateRole message. Does not implicitly {@link chat.RoomActionRequest.UpdateRole.verify|verify} messages.
             * @param message UpdateRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IUpdateRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UpdateRole message, length delimited. Does not implicitly {@link chat.RoomActionRequest.UpdateRole.verify|verify} messages.
             * @param message UpdateRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IUpdateRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UpdateRole message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UpdateRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.UpdateRole;

            /**
             * Decodes an UpdateRole message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UpdateRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.UpdateRole;

            /**
             * Verifies an UpdateRole message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an UpdateRole message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UpdateRole
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.UpdateRole;

            /**
             * Creates a plain object from an UpdateRole message. Also converts values to other types if specified.
             * @param message UpdateRole
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.UpdateRole, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UpdateRole to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DeleteRole. */
        interface IDeleteRole {

            /** DeleteRole roomID */
            roomID?: (string|null);

            /** DeleteRole name */
            name?: (string|null);
        }

        /** Represents a DeleteRole. */
        class DeleteRole implements IDeleteRole {

            /**
             * Constructs a new DeleteRole.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IDeleteRole);

            /** DeleteRole roomID. */
            public roomID: string;

            /** DeleteRole name. */
            public name: string;

            /**
             * Creates a new DeleteRole instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeleteRole instance
             */
            public static create(properties?: chat.RoomActionRequest.IDeleteRole): chat.RoomActionRequest.DeleteRole;

            /**
             * Encodes the specified DeleteRole message. Does not implicitly {@link chat.RoomActionRequest.DeleteRole.verify|verify} messages.
             * @param message DeleteRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IDeleteRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeleteRole message, length delimited. Does not implicitly {@link chat.RoomActionRequest.DeleteRole.verify|verify} messages.
             * @param message DeleteRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IDeleteRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeleteRole message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeleteRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.DeleteRole;

            /**
             * Decodes a DeleteRole message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeleteRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.DeleteRole;

            /**
             * Verifies a DeleteRole message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DeleteRole message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DeleteRole
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.DeleteRole;

            /**
             * Creates a plain object from a DeleteRole message. Also converts values to other types if specified.
             * @param message DeleteRole
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.DeleteRole, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DeleteRole to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an AssignRole. */
        interface IAssignRole {

            /** AssignRole roomID */
            roomID?: (string|null);

            /** AssignRole role */
            role?: (string|null);

            /** AssignRole userID */
            userID?: (string|null);
        }

        /** Represents an AssignRole. */
        class AssignRole implements IAssignRole {

            /**
             * Constructs a new AssignRole.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IAssignRole);

            /** AssignRole roomID. */
            public roomID: string;

            /** AssignRole role. */
            public role: string;

            /** AssignRole userID. */
            public userID: string;

            /**
             * Creates a new AssignRole instance using the specified properties.
             * @param [properties] Properties to set
             * @returns AssignRole instance
             */
            public static create(properties?: chat.RoomActionRequest.IAssignRole): chat.RoomActionRequest.AssignRole;

            /**
             * Encodes the specified AssignRole message. Does not implicitly {@link chat.RoomActionRequest.AssignRole.verify|verify} messages.
             * @param message AssignRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IAssignRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified AssignRole message, length delimited. Does not implicitly {@link chat.RoomActionRequest.AssignRole.verify|verify} messages.
             * @param message AssignRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IAssignRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an AssignRole message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns AssignRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.AssignRole;

            /**
             * Decodes an AssignRole message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns AssignRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.AssignRole;

            /**
             * Verifies an AssignRole message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an AssignRole message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns AssignRole
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.AssignRole;

            /**
             * Creates a plain object from an AssignRole message. Also converts values to other types if specified.
             * @param message AssignRole
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.AssignRole, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this AssignRole to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an InviteUser. */
        interface IInviteUser {

            /** InviteUser roomID */
            roomID?: (string|null);

            /** InviteUser userID */
            userID?: (string|null);

            /** InviteUser characterName */
            characterName?: (string|null);
        }

        /** Represents an InviteUser. */
        class InviteUser implements IInviteUser {

            /**
             * Constructs a new InviteUser.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IInviteUser);

            /** InviteUser roomID. */
            public roomID: string;

            /** InviteUser userID. */
            public userID: string;

            /** InviteUser characterName. */
            public characterName: string;

            /**
             * Creates a new InviteUser instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InviteUser instance
             */
            public static create(properties?: chat.RoomActionRequest.IInviteUser): chat.RoomActionRequest.InviteUser;

            /**
             * Encodes the specified InviteUser message. Does not implicitly {@link chat.RoomActionRequest.InviteUser.verify|verify} messages.
             * @param message InviteUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IInviteUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InviteUser message, length delimited. Does not implicitly {@link chat.RoomActionRequest.InviteUser.verify|verify} messages.
             * @param message InviteUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IInviteUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InviteUser message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InviteUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.InviteUser;

            /**
             * Decodes an InviteUser message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InviteUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.InviteUser;

            /**
             * Verifies an InviteUser message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InviteUser message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InviteUser
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.InviteUser;

            /**
             * Creates a plain object from an InviteUser message. Also converts values to other types if specified.
             * @param message InviteUser
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.InviteUser, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InviteUser to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a KickUser. */
        interface IKickUser {

            /** KickUser roomID */
            roomID?: (string|null);

            /** KickUser userID */
            userID?: (string|null);
        }

        /** Represents a KickUser. */
        class KickUser implements IKickUser {

            /**
             * Constructs a new KickUser.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IKickUser);

            /** KickUser roomID. */
            public roomID: string;

            /** KickUser userID. */
            public userID: string;

            /**
             * Creates a new KickUser instance using the specified properties.
             * @param [properties] Properties to set
             * @returns KickUser instance
             */
            public static create(properties?: chat.RoomActionRequest.IKickUser): chat.RoomActionRequest.KickUser;

            /**
             * Encodes the specified KickUser message. Does not implicitly {@link chat.RoomActionRequest.KickUser.verify|verify} messages.
             * @param message KickUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IKickUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified KickUser message, length delimited. Does not implicitly {@link chat.RoomActionRequest.KickUser.verify|verify} messages.
             * @param message KickUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IKickUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a KickUser message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns KickUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.KickUser;

            /**
             * Decodes a KickUser message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns KickUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.KickUser;

            /**
             * Verifies a KickUser message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a KickUser message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns KickUser
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.KickUser;

            /**
             * Creates a plain object from a KickUser message. Also converts values to other types if specified.
             * @param message KickUser
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.KickUser, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this KickUser to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BanUser. */
        interface IBanUser {

            /** BanUser roomID */
            roomID?: (string|null);

            /** BanUser userID */
            userID?: (string|null);

            /** BanUser seconds */
            seconds?: (number|null);
        }

        /** Represents a BanUser. */
        class BanUser implements IBanUser {

            /**
             * Constructs a new BanUser.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IBanUser);

            /** BanUser roomID. */
            public roomID: string;

            /** BanUser userID. */
            public userID: string;

            /** BanUser seconds. */
            public seconds: number;

            /**
             * Creates a new BanUser instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BanUser instance
             */
            public static create(properties?: chat.RoomActionRequest.IBanUser): chat.RoomActionRequest.BanUser;

            /**
             * Encodes the specified BanUser message. Does not implicitly {@link chat.RoomActionRequest.BanUser.verify|verify} messages.
             * @param message BanUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IBanUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BanUser message, length delimited. Does not implicitly {@link chat.RoomActionRequest.BanUser.verify|verify} messages.
             * @param message BanUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IBanUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BanUser message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BanUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.BanUser;

            /**
             * Decodes a BanUser message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BanUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.BanUser;

            /**
             * Verifies a BanUser message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BanUser message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BanUser
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.BanUser;

            /**
             * Creates a plain object from a BanUser message. Also converts values to other types if specified.
             * @param message BanUser
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.BanUser, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BanUser to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MuteUser. */
        interface IMuteUser {

            /** MuteUser roomID */
            roomID?: (string|null);

            /** MuteUser userID */
            userID?: (string|null);

            /** MuteUser seconds */
            seconds?: (number|null);
        }

        /** Represents a MuteUser. */
        class MuteUser implements IMuteUser {

            /**
             * Constructs a new MuteUser.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.IMuteUser);

            /** MuteUser roomID. */
            public roomID: string;

            /** MuteUser userID. */
            public userID: string;

            /** MuteUser seconds. */
            public seconds: number;

            /**
             * Creates a new MuteUser instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MuteUser instance
             */
            public static create(properties?: chat.RoomActionRequest.IMuteUser): chat.RoomActionRequest.MuteUser;

            /**
             * Encodes the specified MuteUser message. Does not implicitly {@link chat.RoomActionRequest.MuteUser.verify|verify} messages.
             * @param message MuteUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.IMuteUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MuteUser message, length delimited. Does not implicitly {@link chat.RoomActionRequest.MuteUser.verify|verify} messages.
             * @param message MuteUser message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.IMuteUser, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MuteUser message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MuteUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.MuteUser;

            /**
             * Decodes a MuteUser message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MuteUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.MuteUser;

            /**
             * Verifies a MuteUser message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MuteUser message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MuteUser
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.MuteUser;

            /**
             * Creates a plain object from a MuteUser message. Also converts values to other types if specified.
             * @param message MuteUser
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.MuteUser, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MuteUser to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a TransferOwnership. */
        interface ITransferOwnership {

            /** TransferOwnership roomID */
            roomID?: (string|null);

            /** TransferOwnership newOwnerID */
            newOwnerID?: (string|null);
        }

        /** Represents a TransferOwnership. */
        class TransferOwnership implements ITransferOwnership {

            /**
             * Constructs a new TransferOwnership.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomActionRequest.ITransferOwnership);

            /** TransferOwnership roomID. */
            public roomID: string;

            /** TransferOwnership newOwnerID. */
            public newOwnerID: string;

            /**
             * Creates a new TransferOwnership instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TransferOwnership instance
             */
            public static create(properties?: chat.RoomActionRequest.ITransferOwnership): chat.RoomActionRequest.TransferOwnership;

            /**
             * Encodes the specified TransferOwnership message. Does not implicitly {@link chat.RoomActionRequest.TransferOwnership.verify|verify} messages.
             * @param message TransferOwnership message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomActionRequest.ITransferOwnership, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TransferOwnership message, length delimited. Does not implicitly {@link chat.RoomActionRequest.TransferOwnership.verify|verify} messages.
             * @param message TransferOwnership message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomActionRequest.ITransferOwnership, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TransferOwnership message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TransferOwnership
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionRequest.TransferOwnership;

            /**
             * Decodes a TransferOwnership message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TransferOwnership
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionRequest.TransferOwnership;

            /**
             * Verifies a TransferOwnership message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TransferOwnership message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TransferOwnership
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomActionRequest.TransferOwnership;

            /**
             * Creates a plain object from a TransferOwnership message. Also converts values to other types if specified.
             * @param message TransferOwnership
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomActionRequest.TransferOwnership, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TransferOwnership to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a RoomActionResponse. */
    interface IRoomActionResponse {

        /** RoomActionResponse action */
        action?: (chat.RoomActionResponse.ActionResponseType|null);

        /** RoomActionResponse success */
        success?: (boolean|null);

        /** RoomActionResponse message */
        message?: (string|null);
    }

    /** Represents a RoomActionResponse. */
    class RoomActionResponse implements IRoomActionResponse {

        /**
         * Constructs a new RoomActionResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomActionResponse);

        /** RoomActionResponse action. */
        public action: chat.RoomActionResponse.ActionResponseType;

        /** RoomActionResponse success. */
        public success: boolean;

        /** RoomActionResponse message. */
        public message: string;

        /**
         * Creates a new RoomActionResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomActionResponse instance
         */
        public static create(properties?: chat.IRoomActionResponse): chat.RoomActionResponse;

        /**
         * Encodes the specified RoomActionResponse message. Does not implicitly {@link chat.RoomActionResponse.verify|verify} messages.
         * @param message RoomActionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomActionResponse message, length delimited. Does not implicitly {@link chat.RoomActionResponse.verify|verify} messages.
         * @param message RoomActionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomActionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomActionResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomActionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomActionResponse;

        /**
         * Decodes a RoomActionResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomActionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomActionResponse;

        /**
         * Verifies a RoomActionResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomActionResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomActionResponse
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomActionResponse;

        /**
         * Creates a plain object from a RoomActionResponse message. Also converts values to other types if specified.
         * @param message RoomActionResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomActionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomActionResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace RoomActionResponse {

        /** ActionResponseType enum. */
        enum ActionResponseType {
            CREATE = 0,
            DELETE = 1,
            RENAME = 2,
            JOIN = 3,
            LEAVE = 4,
            CREATEROLE = 5,
            UPDATEROLE = 6,
            DELETEROLE = 7,
            ASSIGNROLE = 8,
            INVITE = 9,
            KICKUSER = 10,
            BANUSER = 11,
            MUTEUSER = 12,
            TRANSFEROWNERSHIP = 13
        }
    }

    /** Properties of a RoomInfo. */
    interface IRoomInfo {

        /** RoomInfo roomID */
        roomID?: (string|null);

        /** RoomInfo name */
        name?: (string|null);

        /** RoomInfo category */
        category?: (chat.RoomInfo.RoomCategory|null);

        /** RoomInfo roles */
        roles?: (chat.RoomInfo.IRoomRole[]|null);
    }

    /** Represents a RoomInfo. */
    class RoomInfo implements IRoomInfo {

        /**
         * Constructs a new RoomInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomInfo);

        /** RoomInfo roomID. */
        public roomID: string;

        /** RoomInfo name. */
        public name: string;

        /** RoomInfo category. */
        public category: chat.RoomInfo.RoomCategory;

        /** RoomInfo roles. */
        public roles: chat.RoomInfo.IRoomRole[];

        /**
         * Creates a new RoomInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomInfo instance
         */
        public static create(properties?: chat.IRoomInfo): chat.RoomInfo;

        /**
         * Encodes the specified RoomInfo message. Does not implicitly {@link chat.RoomInfo.verify|verify} messages.
         * @param message RoomInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomInfo message, length delimited. Does not implicitly {@link chat.RoomInfo.verify|verify} messages.
         * @param message RoomInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomInfo;

        /**
         * Decodes a RoomInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomInfo;

        /**
         * Verifies a RoomInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomInfo
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomInfo;

        /**
         * Creates a plain object from a RoomInfo message. Also converts values to other types if specified.
         * @param message RoomInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace RoomInfo {

        /** RoomCategory enum. */
        enum RoomCategory {
            GENERAL = 0,
            WARBAND = 1,
            ORDER = 2,
            CAMPAIGN = 3,
            CUSTOM = 4
        }

        /** Properties of a RoomRole. */
        interface IRoomRole {

            /** RoomRole name */
            name?: (string|null);

            /** RoomRole permissions */
            permissions?: (number|null);
        }

        /** Represents a RoomRole. */
        class RoomRole implements IRoomRole {

            /**
             * Constructs a new RoomRole.
             * @param [properties] Properties to set
             */
            constructor(properties?: chat.RoomInfo.IRoomRole);

            /** RoomRole name. */
            public name: string;

            /** RoomRole permissions. */
            public permissions: number;

            /**
             * Creates a new RoomRole instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RoomRole instance
             */
            public static create(properties?: chat.RoomInfo.IRoomRole): chat.RoomInfo.RoomRole;

            /**
             * Encodes the specified RoomRole message. Does not implicitly {@link chat.RoomInfo.RoomRole.verify|verify} messages.
             * @param message RoomRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: chat.RoomInfo.IRoomRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RoomRole message, length delimited. Does not implicitly {@link chat.RoomInfo.RoomRole.verify|verify} messages.
             * @param message RoomRole message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: chat.RoomInfo.IRoomRole, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RoomRole message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RoomRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomInfo.RoomRole;

            /**
             * Decodes a RoomRole message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RoomRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomInfo.RoomRole;

            /**
             * Verifies a RoomRole message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RoomRole message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RoomRole
             */
            public static fromObject(object: { [k: string]: any }): chat.RoomInfo.RoomRole;

            /**
             * Creates a plain object from a RoomRole message. Also converts values to other types if specified.
             * @param message RoomRole
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: chat.RoomInfo.RoomRole, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RoomRole to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a RoomDirectory. */
    interface IRoomDirectory {

        /** RoomDirectory rooms */
        rooms?: (chat.IRoomInfo[]|null);
    }

    /** Represents a RoomDirectory. */
    class RoomDirectory implements IRoomDirectory {

        /**
         * Constructs a new RoomDirectory.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomDirectory);

        /** RoomDirectory rooms. */
        public rooms: chat.IRoomInfo[];

        /**
         * Creates a new RoomDirectory instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomDirectory instance
         */
        public static create(properties?: chat.IRoomDirectory): chat.RoomDirectory;

        /**
         * Encodes the specified RoomDirectory message. Does not implicitly {@link chat.RoomDirectory.verify|verify} messages.
         * @param message RoomDirectory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomDirectory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomDirectory message, length delimited. Does not implicitly {@link chat.RoomDirectory.verify|verify} messages.
         * @param message RoomDirectory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomDirectory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomDirectory message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomDirectory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomDirectory;

        /**
         * Decodes a RoomDirectory message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomDirectory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomDirectory;

        /**
         * Verifies a RoomDirectory message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomDirectory message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomDirectory
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomDirectory;

        /**
         * Creates a plain object from a RoomDirectory message. Also converts values to other types if specified.
         * @param message RoomDirectory
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomDirectory, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomDirectory to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomJoined. */
    interface IRoomJoined {

        /** RoomJoined roomID */
        roomID?: (string|null);

        /** RoomJoined userID */
        userID?: (string|null);

        /** RoomJoined name */
        name?: (string|null);

        /** RoomJoined role */
        role?: (string|null);
    }

    /** Represents a RoomJoined. */
    class RoomJoined implements IRoomJoined {

        /**
         * Constructs a new RoomJoined.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomJoined);

        /** RoomJoined roomID. */
        public roomID: string;

        /** RoomJoined userID. */
        public userID: string;

        /** RoomJoined name. */
        public name: string;

        /** RoomJoined role. */
        public role: string;

        /**
         * Creates a new RoomJoined instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomJoined instance
         */
        public static create(properties?: chat.IRoomJoined): chat.RoomJoined;

        /**
         * Encodes the specified RoomJoined message. Does not implicitly {@link chat.RoomJoined.verify|verify} messages.
         * @param message RoomJoined message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomJoined, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomJoined message, length delimited. Does not implicitly {@link chat.RoomJoined.verify|verify} messages.
         * @param message RoomJoined message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomJoined, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomJoined message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomJoined
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomJoined;

        /**
         * Decodes a RoomJoined message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomJoined
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomJoined;

        /**
         * Verifies a RoomJoined message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomJoined message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomJoined
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomJoined;

        /**
         * Creates a plain object from a RoomJoined message. Also converts values to other types if specified.
         * @param message RoomJoined
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomJoined, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomJoined to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomLeft. */
    interface IRoomLeft {

        /** RoomLeft roomID */
        roomID?: (string|null);

        /** RoomLeft userID */
        userID?: (string|null);

        /** RoomLeft name */
        name?: (string|null);
    }

    /** Represents a RoomLeft. */
    class RoomLeft implements IRoomLeft {

        /**
         * Constructs a new RoomLeft.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomLeft);

        /** RoomLeft roomID. */
        public roomID: string;

        /** RoomLeft userID. */
        public userID: string;

        /** RoomLeft name. */
        public name: string;

        /**
         * Creates a new RoomLeft instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomLeft instance
         */
        public static create(properties?: chat.IRoomLeft): chat.RoomLeft;

        /**
         * Encodes the specified RoomLeft message. Does not implicitly {@link chat.RoomLeft.verify|verify} messages.
         * @param message RoomLeft message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomLeft, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomLeft message, length delimited. Does not implicitly {@link chat.RoomLeft.verify|verify} messages.
         * @param message RoomLeft message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomLeft, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomLeft message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomLeft
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomLeft;

        /**
         * Decodes a RoomLeft message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomLeft
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomLeft;

        /**
         * Verifies a RoomLeft message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomLeft message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomLeft
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomLeft;

        /**
         * Creates a plain object from a RoomLeft message. Also converts values to other types if specified.
         * @param message RoomLeft
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomLeft, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomLeft to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomRenamed. */
    interface IRoomRenamed {

        /** RoomRenamed roomID */
        roomID?: (string|null);

        /** RoomRenamed name */
        name?: (string|null);
    }

    /** Represents a RoomRenamed. */
    class RoomRenamed implements IRoomRenamed {

        /**
         * Constructs a new RoomRenamed.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomRenamed);

        /** RoomRenamed roomID. */
        public roomID: string;

        /** RoomRenamed name. */
        public name: string;

        /**
         * Creates a new RoomRenamed instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomRenamed instance
         */
        public static create(properties?: chat.IRoomRenamed): chat.RoomRenamed;

        /**
         * Encodes the specified RoomRenamed message. Does not implicitly {@link chat.RoomRenamed.verify|verify} messages.
         * @param message RoomRenamed message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomRenamed, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomRenamed message, length delimited. Does not implicitly {@link chat.RoomRenamed.verify|verify} messages.
         * @param message RoomRenamed message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomRenamed, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomRenamed message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomRenamed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomRenamed;

        /**
         * Decodes a RoomRenamed message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomRenamed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomRenamed;

        /**
         * Verifies a RoomRenamed message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomRenamed message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomRenamed
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomRenamed;

        /**
         * Creates a plain object from a RoomRenamed message. Also converts values to other types if specified.
         * @param message RoomRenamed
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomRenamed, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomRenamed to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomRoleAdded. */
    interface IRoomRoleAdded {

        /** RoomRoleAdded roomID */
        roomID?: (string|null);

        /** RoomRoleAdded name */
        name?: (string|null);

        /** RoomRoleAdded permissions */
        permissions?: (number|null);
    }

    /** Represents a RoomRoleAdded. */
    class RoomRoleAdded implements IRoomRoleAdded {

        /**
         * Constructs a new RoomRoleAdded.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomRoleAdded);

        /** RoomRoleAdded roomID. */
        public roomID: string;

        /** RoomRoleAdded name. */
        public name: string;

        /** RoomRoleAdded permissions. */
        public permissions: number;

        /**
         * Creates a new RoomRoleAdded instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomRoleAdded instance
         */
        public static create(properties?: chat.IRoomRoleAdded): chat.RoomRoleAdded;

        /**
         * Encodes the specified RoomRoleAdded message. Does not implicitly {@link chat.RoomRoleAdded.verify|verify} messages.
         * @param message RoomRoleAdded message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomRoleAdded, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomRoleAdded message, length delimited. Does not implicitly {@link chat.RoomRoleAdded.verify|verify} messages.
         * @param message RoomRoleAdded message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomRoleAdded, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomRoleAdded message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomRoleAdded
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomRoleAdded;

        /**
         * Decodes a RoomRoleAdded message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomRoleAdded
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomRoleAdded;

        /**
         * Verifies a RoomRoleAdded message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomRoleAdded message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomRoleAdded
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomRoleAdded;

        /**
         * Creates a plain object from a RoomRoleAdded message. Also converts values to other types if specified.
         * @param message RoomRoleAdded
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomRoleAdded, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomRoleAdded to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomRoleUpdated. */
    interface IRoomRoleUpdated {

        /** RoomRoleUpdated roomID */
        roomID?: (string|null);

        /** RoomRoleUpdated name */
        name?: (string|null);

        /** RoomRoleUpdated permissions */
        permissions?: (number|null);
    }

    /** Represents a RoomRoleUpdated. */
    class RoomRoleUpdated implements IRoomRoleUpdated {

        /**
         * Constructs a new RoomRoleUpdated.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomRoleUpdated);

        /** RoomRoleUpdated roomID. */
        public roomID: string;

        /** RoomRoleUpdated name. */
        public name: string;

        /** RoomRoleUpdated permissions. */
        public permissions: number;

        /**
         * Creates a new RoomRoleUpdated instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomRoleUpdated instance
         */
        public static create(properties?: chat.IRoomRoleUpdated): chat.RoomRoleUpdated;

        /**
         * Encodes the specified RoomRoleUpdated message. Does not implicitly {@link chat.RoomRoleUpdated.verify|verify} messages.
         * @param message RoomRoleUpdated message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomRoleUpdated, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomRoleUpdated message, length delimited. Does not implicitly {@link chat.RoomRoleUpdated.verify|verify} messages.
         * @param message RoomRoleUpdated message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomRoleUpdated, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomRoleUpdated message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomRoleUpdated
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomRoleUpdated;

        /**
         * Decodes a RoomRoleUpdated message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomRoleUpdated
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomRoleUpdated;

        /**
         * Verifies a RoomRoleUpdated message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomRoleUpdated message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomRoleUpdated
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomRoleUpdated;

        /**
         * Creates a plain object from a RoomRoleUpdated message. Also converts values to other types if specified.
         * @param message RoomRoleUpdated
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomRoleUpdated, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomRoleUpdated to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomRoleRemoved. */
    interface IRoomRoleRemoved {

        /** RoomRoleRemoved roomID */
        roomID?: (string|null);

        /** RoomRoleRemoved name */
        name?: (string|null);
    }

    /** Represents a RoomRoleRemoved. */
    class RoomRoleRemoved implements IRoomRoleRemoved {

        /**
         * Constructs a new RoomRoleRemoved.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomRoleRemoved);

        /** RoomRoleRemoved roomID. */
        public roomID: string;

        /** RoomRoleRemoved name. */
        public name: string;

        /**
         * Creates a new RoomRoleRemoved instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomRoleRemoved instance
         */
        public static create(properties?: chat.IRoomRoleRemoved): chat.RoomRoleRemoved;

        /**
         * Encodes the specified RoomRoleRemoved message. Does not implicitly {@link chat.RoomRoleRemoved.verify|verify} messages.
         * @param message RoomRoleRemoved message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomRoleRemoved, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomRoleRemoved message, length delimited. Does not implicitly {@link chat.RoomRoleRemoved.verify|verify} messages.
         * @param message RoomRoleRemoved message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomRoleRemoved, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomRoleRemoved message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomRoleRemoved
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomRoleRemoved;

        /**
         * Decodes a RoomRoleRemoved message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomRoleRemoved
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomRoleRemoved;

        /**
         * Verifies a RoomRoleRemoved message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomRoleRemoved message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomRoleRemoved
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomRoleRemoved;

        /**
         * Creates a plain object from a RoomRoleRemoved message. Also converts values to other types if specified.
         * @param message RoomRoleRemoved
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomRoleRemoved, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomRoleRemoved to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomRoleAssigned. */
    interface IRoomRoleAssigned {

        /** RoomRoleAssigned roomID */
        roomID?: (string|null);

        /** RoomRoleAssigned roleName */
        roleName?: (string|null);

        /** RoomRoleAssigned userID */
        userID?: (string|null);
    }

    /** Represents a RoomRoleAssigned. */
    class RoomRoleAssigned implements IRoomRoleAssigned {

        /**
         * Constructs a new RoomRoleAssigned.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomRoleAssigned);

        /** RoomRoleAssigned roomID. */
        public roomID: string;

        /** RoomRoleAssigned roleName. */
        public roleName: string;

        /** RoomRoleAssigned userID. */
        public userID: string;

        /**
         * Creates a new RoomRoleAssigned instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomRoleAssigned instance
         */
        public static create(properties?: chat.IRoomRoleAssigned): chat.RoomRoleAssigned;

        /**
         * Encodes the specified RoomRoleAssigned message. Does not implicitly {@link chat.RoomRoleAssigned.verify|verify} messages.
         * @param message RoomRoleAssigned message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomRoleAssigned, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomRoleAssigned message, length delimited. Does not implicitly {@link chat.RoomRoleAssigned.verify|verify} messages.
         * @param message RoomRoleAssigned message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomRoleAssigned, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomRoleAssigned message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomRoleAssigned
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomRoleAssigned;

        /**
         * Decodes a RoomRoleAssigned message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomRoleAssigned
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomRoleAssigned;

        /**
         * Verifies a RoomRoleAssigned message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomRoleAssigned message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomRoleAssigned
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomRoleAssigned;

        /**
         * Creates a plain object from a RoomRoleAssigned message. Also converts values to other types if specified.
         * @param message RoomRoleAssigned
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomRoleAssigned, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomRoleAssigned to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomInviteReceived. */
    interface IRoomInviteReceived {

        /** RoomInviteReceived roomID */
        roomID?: (string|null);

        /** RoomInviteReceived roomName */
        roomName?: (string|null);
    }

    /** Represents a RoomInviteReceived. */
    class RoomInviteReceived implements IRoomInviteReceived {

        /**
         * Constructs a new RoomInviteReceived.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomInviteReceived);

        /** RoomInviteReceived roomID. */
        public roomID: string;

        /** RoomInviteReceived roomName. */
        public roomName: string;

        /**
         * Creates a new RoomInviteReceived instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomInviteReceived instance
         */
        public static create(properties?: chat.IRoomInviteReceived): chat.RoomInviteReceived;

        /**
         * Encodes the specified RoomInviteReceived message. Does not implicitly {@link chat.RoomInviteReceived.verify|verify} messages.
         * @param message RoomInviteReceived message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomInviteReceived, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomInviteReceived message, length delimited. Does not implicitly {@link chat.RoomInviteReceived.verify|verify} messages.
         * @param message RoomInviteReceived message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomInviteReceived, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomInviteReceived message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomInviteReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomInviteReceived;

        /**
         * Decodes a RoomInviteReceived message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomInviteReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomInviteReceived;

        /**
         * Verifies a RoomInviteReceived message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomInviteReceived message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomInviteReceived
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomInviteReceived;

        /**
         * Creates a plain object from a RoomInviteReceived message. Also converts values to other types if specified.
         * @param message RoomInviteReceived
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomInviteReceived, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomInviteReceived to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomKickReceived. */
    interface IRoomKickReceived {

        /** RoomKickReceived roomID */
        roomID?: (string|null);
    }

    /** Represents a RoomKickReceived. */
    class RoomKickReceived implements IRoomKickReceived {

        /**
         * Constructs a new RoomKickReceived.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomKickReceived);

        /** RoomKickReceived roomID. */
        public roomID: string;

        /**
         * Creates a new RoomKickReceived instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomKickReceived instance
         */
        public static create(properties?: chat.IRoomKickReceived): chat.RoomKickReceived;

        /**
         * Encodes the specified RoomKickReceived message. Does not implicitly {@link chat.RoomKickReceived.verify|verify} messages.
         * @param message RoomKickReceived message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomKickReceived, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomKickReceived message, length delimited. Does not implicitly {@link chat.RoomKickReceived.verify|verify} messages.
         * @param message RoomKickReceived message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomKickReceived, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomKickReceived message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomKickReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomKickReceived;

        /**
         * Decodes a RoomKickReceived message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomKickReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomKickReceived;

        /**
         * Verifies a RoomKickReceived message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomKickReceived message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomKickReceived
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomKickReceived;

        /**
         * Creates a plain object from a RoomKickReceived message. Also converts values to other types if specified.
         * @param message RoomKickReceived
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomKickReceived, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomKickReceived to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomMuteReceived. */
    interface IRoomMuteReceived {

        /** RoomMuteReceived roomID */
        roomID?: (string|null);

        /** RoomMuteReceived expiration */
        expiration?: (google.protobuf.ITimestamp|null);
    }

    /** Represents a RoomMuteReceived. */
    class RoomMuteReceived implements IRoomMuteReceived {

        /**
         * Constructs a new RoomMuteReceived.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomMuteReceived);

        /** RoomMuteReceived roomID. */
        public roomID: string;

        /** RoomMuteReceived expiration. */
        public expiration?: (google.protobuf.ITimestamp|null);

        /**
         * Creates a new RoomMuteReceived instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomMuteReceived instance
         */
        public static create(properties?: chat.IRoomMuteReceived): chat.RoomMuteReceived;

        /**
         * Encodes the specified RoomMuteReceived message. Does not implicitly {@link chat.RoomMuteReceived.verify|verify} messages.
         * @param message RoomMuteReceived message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomMuteReceived, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomMuteReceived message, length delimited. Does not implicitly {@link chat.RoomMuteReceived.verify|verify} messages.
         * @param message RoomMuteReceived message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomMuteReceived, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomMuteReceived message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomMuteReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomMuteReceived;

        /**
         * Decodes a RoomMuteReceived message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomMuteReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomMuteReceived;

        /**
         * Verifies a RoomMuteReceived message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomMuteReceived message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomMuteReceived
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomMuteReceived;

        /**
         * Creates a plain object from a RoomMuteReceived message. Also converts values to other types if specified.
         * @param message RoomMuteReceived
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomMuteReceived, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomMuteReceived to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomBanReceived. */
    interface IRoomBanReceived {

        /** RoomBanReceived roomID */
        roomID?: (string|null);

        /** RoomBanReceived expiration */
        expiration?: (google.protobuf.ITimestamp|null);
    }

    /** Represents a RoomBanReceived. */
    class RoomBanReceived implements IRoomBanReceived {

        /**
         * Constructs a new RoomBanReceived.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomBanReceived);

        /** RoomBanReceived roomID. */
        public roomID: string;

        /** RoomBanReceived expiration. */
        public expiration?: (google.protobuf.ITimestamp|null);

        /**
         * Creates a new RoomBanReceived instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomBanReceived instance
         */
        public static create(properties?: chat.IRoomBanReceived): chat.RoomBanReceived;

        /**
         * Encodes the specified RoomBanReceived message. Does not implicitly {@link chat.RoomBanReceived.verify|verify} messages.
         * @param message RoomBanReceived message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomBanReceived, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomBanReceived message, length delimited. Does not implicitly {@link chat.RoomBanReceived.verify|verify} messages.
         * @param message RoomBanReceived message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomBanReceived, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomBanReceived message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomBanReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomBanReceived;

        /**
         * Decodes a RoomBanReceived message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomBanReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomBanReceived;

        /**
         * Verifies a RoomBanReceived message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomBanReceived message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomBanReceived
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomBanReceived;

        /**
         * Creates a plain object from a RoomBanReceived message. Also converts values to other types if specified.
         * @param message RoomBanReceived
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomBanReceived, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomBanReceived to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RoomOwnerChanged. */
    interface IRoomOwnerChanged {

        /** RoomOwnerChanged roomID */
        roomID?: (string|null);

        /** RoomOwnerChanged userID */
        userID?: (string|null);
    }

    /** Represents a RoomOwnerChanged. */
    class RoomOwnerChanged implements IRoomOwnerChanged {

        /**
         * Constructs a new RoomOwnerChanged.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IRoomOwnerChanged);

        /** RoomOwnerChanged roomID. */
        public roomID: string;

        /** RoomOwnerChanged userID. */
        public userID: string;

        /**
         * Creates a new RoomOwnerChanged instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RoomOwnerChanged instance
         */
        public static create(properties?: chat.IRoomOwnerChanged): chat.RoomOwnerChanged;

        /**
         * Encodes the specified RoomOwnerChanged message. Does not implicitly {@link chat.RoomOwnerChanged.verify|verify} messages.
         * @param message RoomOwnerChanged message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IRoomOwnerChanged, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RoomOwnerChanged message, length delimited. Does not implicitly {@link chat.RoomOwnerChanged.verify|verify} messages.
         * @param message RoomOwnerChanged message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IRoomOwnerChanged, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RoomOwnerChanged message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RoomOwnerChanged
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.RoomOwnerChanged;

        /**
         * Decodes a RoomOwnerChanged message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RoomOwnerChanged
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.RoomOwnerChanged;

        /**
         * Verifies a RoomOwnerChanged message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RoomOwnerChanged message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RoomOwnerChanged
         */
        public static fromObject(object: { [k: string]: any }): chat.RoomOwnerChanged;

        /**
         * Creates a plain object from a RoomOwnerChanged message. Also converts values to other types if specified.
         * @param message RoomOwnerChanged
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.RoomOwnerChanged, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RoomOwnerChanged to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChatMessage. */
    interface IChatMessage {

        /** ChatMessage type */
        type?: (chat.ChatMessage.MessageTypes|null);

        /** ChatMessage content */
        content?: (string|null);

        /** ChatMessage senderFlag */
        senderFlag?: (chat.ChatMessage.SenderFlag|null);

        /** ChatMessage senderID */
        senderID?: (string|null);

        /** ChatMessage senderName */
        senderName?: (string|null);

        /** ChatMessage targetID */
        targetID?: (string|null);

        /** ChatMessage targetName */
        targetName?: (string|null);

        /** ChatMessage senderAccountID */
        senderAccountID?: (string|null);
    }

    /** Represents a ChatMessage. */
    class ChatMessage implements IChatMessage {

        /**
         * Constructs a new ChatMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IChatMessage);

        /** ChatMessage type. */
        public type: chat.ChatMessage.MessageTypes;

        /** ChatMessage content. */
        public content: string;

        /** ChatMessage senderFlag. */
        public senderFlag: chat.ChatMessage.SenderFlag;

        /** ChatMessage senderID. */
        public senderID: string;

        /** ChatMessage senderName. */
        public senderName: string;

        /** ChatMessage targetID. */
        public targetID: string;

        /** ChatMessage targetName. */
        public targetName: string;

        /** ChatMessage senderAccountID. */
        public senderAccountID: string;

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatMessage instance
         */
        public static create(properties?: chat.IChatMessage): chat.ChatMessage;

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link chat.ChatMessage.verify|verify} messages.
         * @param message ChatMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link chat.ChatMessage.verify|verify} messages.
         * @param message ChatMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IChatMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.ChatMessage;

        /**
         * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.ChatMessage;

        /**
         * Verifies a ChatMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatMessage
         */
        public static fromObject(object: { [k: string]: any }): chat.ChatMessage;

        /**
         * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
         * @param message ChatMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.ChatMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ChatMessage {

        /** MessageTypes enum. */
        enum MessageTypes {
            Error = 0,
            Direct = 1,
            Room = 2,
            Announcement = 3
        }

        /** SenderFlag enum. */
        enum SenderFlag {
            PLAYER = 0,
            CSE = 1
        }
    }

    /** Properties of a PingPongMessage. */
    interface IPingPongMessage {

        /** PingPongMessage ping */
        ping?: (boolean|null);
    }

    /** Represents a PingPongMessage. */
    class PingPongMessage implements IPingPongMessage {

        /**
         * Constructs a new PingPongMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IPingPongMessage);

        /** PingPongMessage ping. */
        public ping: boolean;

        /**
         * Creates a new PingPongMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PingPongMessage instance
         */
        public static create(properties?: chat.IPingPongMessage): chat.PingPongMessage;

        /**
         * Encodes the specified PingPongMessage message. Does not implicitly {@link chat.PingPongMessage.verify|verify} messages.
         * @param message PingPongMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IPingPongMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PingPongMessage message, length delimited. Does not implicitly {@link chat.PingPongMessage.verify|verify} messages.
         * @param message PingPongMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IPingPongMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PingPongMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PingPongMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.PingPongMessage;

        /**
         * Decodes a PingPongMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PingPongMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.PingPongMessage;

        /**
         * Verifies a PingPongMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PingPongMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PingPongMessage
         */
        public static fromObject(object: { [k: string]: any }): chat.PingPongMessage;

        /**
         * Creates a plain object from a PingPongMessage message. Also converts values to other types if specified.
         * @param message PingPongMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.PingPongMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PingPongMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChatServerUnionMessage. */
    interface IChatServerUnionMessage {

        /** ChatServerUnionMessage messageType */
        messageType?: (chat.ChatServerUnionMessage.MessageTypes|null);

        /** ChatServerUnionMessage chat */
        chat?: (chat.IChatMessage|null);

        /** ChatServerUnionMessage pingPong */
        pingPong?: (chat.IPingPongMessage|null);

        /** ChatServerUnionMessage roomAction */
        roomAction?: (chat.IRoomActionRequest|null);
    }

    /** Represents a ChatServerUnionMessage. */
    class ChatServerUnionMessage implements IChatServerUnionMessage {

        /**
         * Constructs a new ChatServerUnionMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IChatServerUnionMessage);

        /** ChatServerUnionMessage messageType. */
        public messageType: chat.ChatServerUnionMessage.MessageTypes;

        /** ChatServerUnionMessage chat. */
        public chat?: (chat.IChatMessage|null);

        /** ChatServerUnionMessage pingPong. */
        public pingPong?: (chat.IPingPongMessage|null);

        /** ChatServerUnionMessage roomAction. */
        public roomAction?: (chat.IRoomActionRequest|null);

        /**
         * Creates a new ChatServerUnionMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatServerUnionMessage instance
         */
        public static create(properties?: chat.IChatServerUnionMessage): chat.ChatServerUnionMessage;

        /**
         * Encodes the specified ChatServerUnionMessage message. Does not implicitly {@link chat.ChatServerUnionMessage.verify|verify} messages.
         * @param message ChatServerUnionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IChatServerUnionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatServerUnionMessage message, length delimited. Does not implicitly {@link chat.ChatServerUnionMessage.verify|verify} messages.
         * @param message ChatServerUnionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IChatServerUnionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatServerUnionMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatServerUnionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.ChatServerUnionMessage;

        /**
         * Decodes a ChatServerUnionMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatServerUnionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.ChatServerUnionMessage;

        /**
         * Verifies a ChatServerUnionMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatServerUnionMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatServerUnionMessage
         */
        public static fromObject(object: { [k: string]: any }): chat.ChatServerUnionMessage;

        /**
         * Creates a plain object from a ChatServerUnionMessage message. Also converts values to other types if specified.
         * @param message ChatServerUnionMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.ChatServerUnionMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatServerUnionMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ChatServerUnionMessage {

        /** MessageTypes enum. */
        enum MessageTypes {
            NONE = 0,
            CHAT = 1,
            PINGPONG = 2,
            ROOMACTION = 3
        }
    }

    /** Properties of a ChatClientUnionMessage. */
    interface IChatClientUnionMessage {

        /** ChatClientUnionMessage type */
        type?: (chat.ChatClientUnionMessage.MessageTypes|null);

        /** ChatClientUnionMessage chat */
        chat?: (chat.IChatMessage|null);

        /** ChatClientUnionMessage pingPong */
        pingPong?: (chat.IPingPongMessage|null);

        /** ChatClientUnionMessage roomAction */
        roomAction?: (chat.IRoomActionResponse|null);

        /** ChatClientUnionMessage info */
        info?: (chat.IRoomInfo|null);

        /** ChatClientUnionMessage joined */
        joined?: (chat.IRoomJoined|null);

        /** ChatClientUnionMessage left */
        left?: (chat.IRoomLeft|null);

        /** ChatClientUnionMessage renamed */
        renamed?: (chat.IRoomRenamed|null);

        /** ChatClientUnionMessage roleAdded */
        roleAdded?: (chat.IRoomRoleAdded|null);

        /** ChatClientUnionMessage roleUpdated */
        roleUpdated?: (chat.IRoomRoleUpdated|null);

        /** ChatClientUnionMessage roleRemoved */
        roleRemoved?: (chat.IRoomRoleRemoved|null);

        /** ChatClientUnionMessage roleAssigned */
        roleAssigned?: (chat.IRoomRoleAssigned|null);

        /** ChatClientUnionMessage invited */
        invited?: (chat.IRoomInviteReceived|null);

        /** ChatClientUnionMessage kicked */
        kicked?: (chat.IRoomKickReceived|null);

        /** ChatClientUnionMessage muted */
        muted?: (chat.IRoomMuteReceived|null);

        /** ChatClientUnionMessage banned */
        banned?: (chat.IRoomBanReceived|null);

        /** ChatClientUnionMessage ownerChanged */
        ownerChanged?: (chat.IRoomOwnerChanged|null);

        /** ChatClientUnionMessage directory */
        directory?: (chat.IRoomDirectory|null);
    }

    /** Represents a ChatClientUnionMessage. */
    class ChatClientUnionMessage implements IChatClientUnionMessage {

        /**
         * Constructs a new ChatClientUnionMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IChatClientUnionMessage);

        /** ChatClientUnionMessage type. */
        public type: chat.ChatClientUnionMessage.MessageTypes;

        /** ChatClientUnionMessage chat. */
        public chat?: (chat.IChatMessage|null);

        /** ChatClientUnionMessage pingPong. */
        public pingPong?: (chat.IPingPongMessage|null);

        /** ChatClientUnionMessage roomAction. */
        public roomAction?: (chat.IRoomActionResponse|null);

        /** ChatClientUnionMessage info. */
        public info?: (chat.IRoomInfo|null);

        /** ChatClientUnionMessage joined. */
        public joined?: (chat.IRoomJoined|null);

        /** ChatClientUnionMessage left. */
        public left?: (chat.IRoomLeft|null);

        /** ChatClientUnionMessage renamed. */
        public renamed?: (chat.IRoomRenamed|null);

        /** ChatClientUnionMessage roleAdded. */
        public roleAdded?: (chat.IRoomRoleAdded|null);

        /** ChatClientUnionMessage roleUpdated. */
        public roleUpdated?: (chat.IRoomRoleUpdated|null);

        /** ChatClientUnionMessage roleRemoved. */
        public roleRemoved?: (chat.IRoomRoleRemoved|null);

        /** ChatClientUnionMessage roleAssigned. */
        public roleAssigned?: (chat.IRoomRoleAssigned|null);

        /** ChatClientUnionMessage invited. */
        public invited?: (chat.IRoomInviteReceived|null);

        /** ChatClientUnionMessage kicked. */
        public kicked?: (chat.IRoomKickReceived|null);

        /** ChatClientUnionMessage muted. */
        public muted?: (chat.IRoomMuteReceived|null);

        /** ChatClientUnionMessage banned. */
        public banned?: (chat.IRoomBanReceived|null);

        /** ChatClientUnionMessage ownerChanged. */
        public ownerChanged?: (chat.IRoomOwnerChanged|null);

        /** ChatClientUnionMessage directory. */
        public directory?: (chat.IRoomDirectory|null);

        /**
         * Creates a new ChatClientUnionMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatClientUnionMessage instance
         */
        public static create(properties?: chat.IChatClientUnionMessage): chat.ChatClientUnionMessage;

        /**
         * Encodes the specified ChatClientUnionMessage message. Does not implicitly {@link chat.ChatClientUnionMessage.verify|verify} messages.
         * @param message ChatClientUnionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IChatClientUnionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatClientUnionMessage message, length delimited. Does not implicitly {@link chat.ChatClientUnionMessage.verify|verify} messages.
         * @param message ChatClientUnionMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IChatClientUnionMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatClientUnionMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatClientUnionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.ChatClientUnionMessage;

        /**
         * Decodes a ChatClientUnionMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatClientUnionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.ChatClientUnionMessage;

        /**
         * Verifies a ChatClientUnionMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatClientUnionMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatClientUnionMessage
         */
        public static fromObject(object: { [k: string]: any }): chat.ChatClientUnionMessage;

        /**
         * Creates a plain object from a ChatClientUnionMessage message. Also converts values to other types if specified.
         * @param message ChatClientUnionMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.ChatClientUnionMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatClientUnionMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ChatClientUnionMessage {

        /** MessageTypes enum. */
        enum MessageTypes {
            NONE = 0,
            CHATMESSAGE = 1,
            PINGPONGMESSAGE = 2,
            ROOMACTION = 4,
            ROOMINFO = 5,
            JOINED = 6,
            LEFT = 7,
            RENAMED = 8,
            ROLEADDED = 9,
            ROLEUPDATED = 10,
            ROLEREMOVED = 11,
            ROLEASSIGNED = 12,
            INVITERECEIVED = 13,
            KICKED = 14,
            BANNED = 15,
            MUTED = 16,
            OWNERCHANGED = 17,
            DIRECTORY = 18
        }
    }

    /** Properties of a ProxyAuth. */
    interface IProxyAuth {

        /** ProxyAuth type */
        type?: (chat.ProxyAuth.UserTypes|null);

        /** ProxyAuth accountID */
        accountID?: (string|null);

        /** ProxyAuth sourceIPAddr */
        sourceIPAddr?: (number|Long|null);
    }

    /** Represents a ProxyAuth. */
    class ProxyAuth implements IProxyAuth {

        /**
         * Constructs a new ProxyAuth.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IProxyAuth);

        /** ProxyAuth type. */
        public type: chat.ProxyAuth.UserTypes;

        /** ProxyAuth accountID. */
        public accountID: string;

        /** ProxyAuth sourceIPAddr. */
        public sourceIPAddr: (number|Long);

        /**
         * Creates a new ProxyAuth instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProxyAuth instance
         */
        public static create(properties?: chat.IProxyAuth): chat.ProxyAuth;

        /**
         * Encodes the specified ProxyAuth message. Does not implicitly {@link chat.ProxyAuth.verify|verify} messages.
         * @param message ProxyAuth message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IProxyAuth, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProxyAuth message, length delimited. Does not implicitly {@link chat.ProxyAuth.verify|verify} messages.
         * @param message ProxyAuth message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IProxyAuth, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProxyAuth message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProxyAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.ProxyAuth;

        /**
         * Decodes a ProxyAuth message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProxyAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.ProxyAuth;

        /**
         * Verifies a ProxyAuth message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProxyAuth message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProxyAuth
         */
        public static fromObject(object: { [k: string]: any }): chat.ProxyAuth;

        /**
         * Creates a plain object from a ProxyAuth message. Also converts values to other types if specified.
         * @param message ProxyAuth
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.ProxyAuth, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProxyAuth to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ProxyAuth {

        /** UserTypes enum. */
        enum UserTypes {
            Player = 0,
            Bot = 1
        }
    }

    /** Properties of a ProxyMessage. */
    interface IProxyMessage {

        /** ProxyMessage type */
        type?: (chat.ProxyMessage.MessageTypes|null);

        /** ProxyMessage userID */
        userID?: (string|null);

        /** ProxyMessage auth */
        auth?: (chat.IProxyAuth|null);

        /** ProxyMessage pingPong */
        pingPong?: (chat.IPingPongMessage|null);

        /** ProxyMessage serverMessage */
        serverMessage?: (chat.IChatServerUnionMessage|null);

        /** ProxyMessage clientMessage */
        clientMessage?: (chat.IChatClientUnionMessage|null);
    }

    /** Represents a ProxyMessage. */
    class ProxyMessage implements IProxyMessage {

        /**
         * Constructs a new ProxyMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: chat.IProxyMessage);

        /** ProxyMessage type. */
        public type: chat.ProxyMessage.MessageTypes;

        /** ProxyMessage userID. */
        public userID: string;

        /** ProxyMessage auth. */
        public auth?: (chat.IProxyAuth|null);

        /** ProxyMessage pingPong. */
        public pingPong?: (chat.IPingPongMessage|null);

        /** ProxyMessage serverMessage. */
        public serverMessage?: (chat.IChatServerUnionMessage|null);

        /** ProxyMessage clientMessage. */
        public clientMessage?: (chat.IChatClientUnionMessage|null);

        /**
         * Creates a new ProxyMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ProxyMessage instance
         */
        public static create(properties?: chat.IProxyMessage): chat.ProxyMessage;

        /**
         * Encodes the specified ProxyMessage message. Does not implicitly {@link chat.ProxyMessage.verify|verify} messages.
         * @param message ProxyMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: chat.IProxyMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ProxyMessage message, length delimited. Does not implicitly {@link chat.ProxyMessage.verify|verify} messages.
         * @param message ProxyMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: chat.IProxyMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ProxyMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ProxyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): chat.ProxyMessage;

        /**
         * Decodes a ProxyMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ProxyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): chat.ProxyMessage;

        /**
         * Verifies a ProxyMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ProxyMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ProxyMessage
         */
        public static fromObject(object: { [k: string]: any }): chat.ProxyMessage;

        /**
         * Creates a plain object from a ProxyMessage message. Also converts values to other types if specified.
         * @param message ProxyMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: chat.ProxyMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ProxyMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ProxyMessage {

        /** MessageTypes enum. */
        enum MessageTypes {
            None = 0,
            Auth = 1,
            PingPong = 2,
            Server = 3,
            Client = 4,
            RemoveUser = 5
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
