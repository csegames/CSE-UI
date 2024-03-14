/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const chat = $root.chat = (() => {

    /**
     * Namespace chat.
     * @exports chat
     * @namespace
     */
    const chat = {};

    chat.RoomActionRequest = (function() {

        /**
         * Properties of a RoomActionRequest.
         * @memberof chat
         * @interface IRoomActionRequest
         * @property {chat.RoomActionRequest.ActionType|null} [action] RoomActionRequest action
         * @property {chat.RoomActionRequest.ICreateRoom|null} [create] RoomActionRequest create
         * @property {chat.RoomActionRequest.IDeleteRoom|null} ["delete"] RoomActionRequest delete
         * @property {chat.RoomActionRequest.IRenameRoom|null} [rename] RoomActionRequest rename
         * @property {chat.RoomActionRequest.IJoinRoom|null} [join] RoomActionRequest join
         * @property {chat.RoomActionRequest.ILeaveRoom|null} [leave] RoomActionRequest leave
         * @property {chat.RoomActionRequest.ICreateRole|null} [createRole] RoomActionRequest createRole
         * @property {chat.RoomActionRequest.IUpdateRole|null} [updateRole] RoomActionRequest updateRole
         * @property {chat.RoomActionRequest.IDeleteRole|null} [deleteRole] RoomActionRequest deleteRole
         * @property {chat.RoomActionRequest.IAssignRole|null} [assignRole] RoomActionRequest assignRole
         * @property {chat.RoomActionRequest.IInviteUser|null} [inviteUser] RoomActionRequest inviteUser
         * @property {chat.RoomActionRequest.IKickUser|null} [kickUser] RoomActionRequest kickUser
         * @property {chat.RoomActionRequest.IBanUser|null} [banUser] RoomActionRequest banUser
         * @property {chat.RoomActionRequest.IMuteUser|null} [muteUser] RoomActionRequest muteUser
         * @property {chat.RoomActionRequest.ITransferOwnership|null} [transferOwner] RoomActionRequest transferOwner
         */

        /**
         * Constructs a new RoomActionRequest.
         * @memberof chat
         * @classdesc Represents a RoomActionRequest.
         * @implements IRoomActionRequest
         * @constructor
         * @param {chat.IRoomActionRequest=} [properties] Properties to set
         */
        function RoomActionRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomActionRequest action.
         * @member {chat.RoomActionRequest.ActionType} action
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.action = 0;

        /**
         * RoomActionRequest create.
         * @member {chat.RoomActionRequest.ICreateRoom|null|undefined} create
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.create = null;

        /**
         * RoomActionRequest delete.
         * @member {chat.RoomActionRequest.IDeleteRoom|null|undefined} delete
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype["delete"] = null;

        /**
         * RoomActionRequest rename.
         * @member {chat.RoomActionRequest.IRenameRoom|null|undefined} rename
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.rename = null;

        /**
         * RoomActionRequest join.
         * @member {chat.RoomActionRequest.IJoinRoom|null|undefined} join
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.join = null;

        /**
         * RoomActionRequest leave.
         * @member {chat.RoomActionRequest.ILeaveRoom|null|undefined} leave
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.leave = null;

        /**
         * RoomActionRequest createRole.
         * @member {chat.RoomActionRequest.ICreateRole|null|undefined} createRole
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.createRole = null;

        /**
         * RoomActionRequest updateRole.
         * @member {chat.RoomActionRequest.IUpdateRole|null|undefined} updateRole
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.updateRole = null;

        /**
         * RoomActionRequest deleteRole.
         * @member {chat.RoomActionRequest.IDeleteRole|null|undefined} deleteRole
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.deleteRole = null;

        /**
         * RoomActionRequest assignRole.
         * @member {chat.RoomActionRequest.IAssignRole|null|undefined} assignRole
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.assignRole = null;

        /**
         * RoomActionRequest inviteUser.
         * @member {chat.RoomActionRequest.IInviteUser|null|undefined} inviteUser
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.inviteUser = null;

        /**
         * RoomActionRequest kickUser.
         * @member {chat.RoomActionRequest.IKickUser|null|undefined} kickUser
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.kickUser = null;

        /**
         * RoomActionRequest banUser.
         * @member {chat.RoomActionRequest.IBanUser|null|undefined} banUser
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.banUser = null;

        /**
         * RoomActionRequest muteUser.
         * @member {chat.RoomActionRequest.IMuteUser|null|undefined} muteUser
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.muteUser = null;

        /**
         * RoomActionRequest transferOwner.
         * @member {chat.RoomActionRequest.ITransferOwnership|null|undefined} transferOwner
         * @memberof chat.RoomActionRequest
         * @instance
         */
        RoomActionRequest.prototype.transferOwner = null;

        /**
         * Creates a new RoomActionRequest instance using the specified properties.
         * @function create
         * @memberof chat.RoomActionRequest
         * @static
         * @param {chat.IRoomActionRequest=} [properties] Properties to set
         * @returns {chat.RoomActionRequest} RoomActionRequest instance
         */
        RoomActionRequest.create = function create(properties) {
            return new RoomActionRequest(properties);
        };

        /**
         * Encodes the specified RoomActionRequest message. Does not implicitly {@link chat.RoomActionRequest.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomActionRequest
         * @static
         * @param {chat.IRoomActionRequest} message RoomActionRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomActionRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
            if (message.create != null && Object.hasOwnProperty.call(message, "create"))
                $root.chat.RoomActionRequest.CreateRoom.encode(message.create, writer.uint32(/* id 51, wireType 2 =*/410).fork()).ldelim();
            if (message["delete"] != null && Object.hasOwnProperty.call(message, "delete"))
                $root.chat.RoomActionRequest.DeleteRoom.encode(message["delete"], writer.uint32(/* id 52, wireType 2 =*/418).fork()).ldelim();
            if (message.rename != null && Object.hasOwnProperty.call(message, "rename"))
                $root.chat.RoomActionRequest.RenameRoom.encode(message.rename, writer.uint32(/* id 53, wireType 2 =*/426).fork()).ldelim();
            if (message.join != null && Object.hasOwnProperty.call(message, "join"))
                $root.chat.RoomActionRequest.JoinRoom.encode(message.join, writer.uint32(/* id 54, wireType 2 =*/434).fork()).ldelim();
            if (message.leave != null && Object.hasOwnProperty.call(message, "leave"))
                $root.chat.RoomActionRequest.LeaveRoom.encode(message.leave, writer.uint32(/* id 55, wireType 2 =*/442).fork()).ldelim();
            if (message.createRole != null && Object.hasOwnProperty.call(message, "createRole"))
                $root.chat.RoomActionRequest.CreateRole.encode(message.createRole, writer.uint32(/* id 56, wireType 2 =*/450).fork()).ldelim();
            if (message.updateRole != null && Object.hasOwnProperty.call(message, "updateRole"))
                $root.chat.RoomActionRequest.UpdateRole.encode(message.updateRole, writer.uint32(/* id 57, wireType 2 =*/458).fork()).ldelim();
            if (message.deleteRole != null && Object.hasOwnProperty.call(message, "deleteRole"))
                $root.chat.RoomActionRequest.DeleteRole.encode(message.deleteRole, writer.uint32(/* id 58, wireType 2 =*/466).fork()).ldelim();
            if (message.assignRole != null && Object.hasOwnProperty.call(message, "assignRole"))
                $root.chat.RoomActionRequest.AssignRole.encode(message.assignRole, writer.uint32(/* id 59, wireType 2 =*/474).fork()).ldelim();
            if (message.inviteUser != null && Object.hasOwnProperty.call(message, "inviteUser"))
                $root.chat.RoomActionRequest.InviteUser.encode(message.inviteUser, writer.uint32(/* id 60, wireType 2 =*/482).fork()).ldelim();
            if (message.kickUser != null && Object.hasOwnProperty.call(message, "kickUser"))
                $root.chat.RoomActionRequest.KickUser.encode(message.kickUser, writer.uint32(/* id 61, wireType 2 =*/490).fork()).ldelim();
            if (message.banUser != null && Object.hasOwnProperty.call(message, "banUser"))
                $root.chat.RoomActionRequest.BanUser.encode(message.banUser, writer.uint32(/* id 62, wireType 2 =*/498).fork()).ldelim();
            if (message.muteUser != null && Object.hasOwnProperty.call(message, "muteUser"))
                $root.chat.RoomActionRequest.MuteUser.encode(message.muteUser, writer.uint32(/* id 63, wireType 2 =*/506).fork()).ldelim();
            if (message.transferOwner != null && Object.hasOwnProperty.call(message, "transferOwner"))
                $root.chat.RoomActionRequest.TransferOwnership.encode(message.transferOwner, writer.uint32(/* id 64, wireType 2 =*/514).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RoomActionRequest message, length delimited. Does not implicitly {@link chat.RoomActionRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomActionRequest
         * @static
         * @param {chat.IRoomActionRequest} message RoomActionRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomActionRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomActionRequest message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomActionRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomActionRequest} RoomActionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomActionRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.action = reader.int32();
                    break;
                case 51:
                    message.create = $root.chat.RoomActionRequest.CreateRoom.decode(reader, reader.uint32());
                    break;
                case 52:
                    message["delete"] = $root.chat.RoomActionRequest.DeleteRoom.decode(reader, reader.uint32());
                    break;
                case 53:
                    message.rename = $root.chat.RoomActionRequest.RenameRoom.decode(reader, reader.uint32());
                    break;
                case 54:
                    message.join = $root.chat.RoomActionRequest.JoinRoom.decode(reader, reader.uint32());
                    break;
                case 55:
                    message.leave = $root.chat.RoomActionRequest.LeaveRoom.decode(reader, reader.uint32());
                    break;
                case 56:
                    message.createRole = $root.chat.RoomActionRequest.CreateRole.decode(reader, reader.uint32());
                    break;
                case 57:
                    message.updateRole = $root.chat.RoomActionRequest.UpdateRole.decode(reader, reader.uint32());
                    break;
                case 58:
                    message.deleteRole = $root.chat.RoomActionRequest.DeleteRole.decode(reader, reader.uint32());
                    break;
                case 59:
                    message.assignRole = $root.chat.RoomActionRequest.AssignRole.decode(reader, reader.uint32());
                    break;
                case 60:
                    message.inviteUser = $root.chat.RoomActionRequest.InviteUser.decode(reader, reader.uint32());
                    break;
                case 61:
                    message.kickUser = $root.chat.RoomActionRequest.KickUser.decode(reader, reader.uint32());
                    break;
                case 62:
                    message.banUser = $root.chat.RoomActionRequest.BanUser.decode(reader, reader.uint32());
                    break;
                case 63:
                    message.muteUser = $root.chat.RoomActionRequest.MuteUser.decode(reader, reader.uint32());
                    break;
                case 64:
                    message.transferOwner = $root.chat.RoomActionRequest.TransferOwnership.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomActionRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomActionRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomActionRequest} RoomActionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomActionRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomActionRequest message.
         * @function verify
         * @memberof chat.RoomActionRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomActionRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.action != null && message.hasOwnProperty("action"))
                switch (message.action) {
                default:
                    return "action: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    break;
                }
            if (message.create != null && message.hasOwnProperty("create")) {
                let error = $root.chat.RoomActionRequest.CreateRoom.verify(message.create);
                if (error)
                    return "create." + error;
            }
            if (message["delete"] != null && message.hasOwnProperty("delete")) {
                let error = $root.chat.RoomActionRequest.DeleteRoom.verify(message["delete"]);
                if (error)
                    return "delete." + error;
            }
            if (message.rename != null && message.hasOwnProperty("rename")) {
                let error = $root.chat.RoomActionRequest.RenameRoom.verify(message.rename);
                if (error)
                    return "rename." + error;
            }
            if (message.join != null && message.hasOwnProperty("join")) {
                let error = $root.chat.RoomActionRequest.JoinRoom.verify(message.join);
                if (error)
                    return "join." + error;
            }
            if (message.leave != null && message.hasOwnProperty("leave")) {
                let error = $root.chat.RoomActionRequest.LeaveRoom.verify(message.leave);
                if (error)
                    return "leave." + error;
            }
            if (message.createRole != null && message.hasOwnProperty("createRole")) {
                let error = $root.chat.RoomActionRequest.CreateRole.verify(message.createRole);
                if (error)
                    return "createRole." + error;
            }
            if (message.updateRole != null && message.hasOwnProperty("updateRole")) {
                let error = $root.chat.RoomActionRequest.UpdateRole.verify(message.updateRole);
                if (error)
                    return "updateRole." + error;
            }
            if (message.deleteRole != null && message.hasOwnProperty("deleteRole")) {
                let error = $root.chat.RoomActionRequest.DeleteRole.verify(message.deleteRole);
                if (error)
                    return "deleteRole." + error;
            }
            if (message.assignRole != null && message.hasOwnProperty("assignRole")) {
                let error = $root.chat.RoomActionRequest.AssignRole.verify(message.assignRole);
                if (error)
                    return "assignRole." + error;
            }
            if (message.inviteUser != null && message.hasOwnProperty("inviteUser")) {
                let error = $root.chat.RoomActionRequest.InviteUser.verify(message.inviteUser);
                if (error)
                    return "inviteUser." + error;
            }
            if (message.kickUser != null && message.hasOwnProperty("kickUser")) {
                let error = $root.chat.RoomActionRequest.KickUser.verify(message.kickUser);
                if (error)
                    return "kickUser." + error;
            }
            if (message.banUser != null && message.hasOwnProperty("banUser")) {
                let error = $root.chat.RoomActionRequest.BanUser.verify(message.banUser);
                if (error)
                    return "banUser." + error;
            }
            if (message.muteUser != null && message.hasOwnProperty("muteUser")) {
                let error = $root.chat.RoomActionRequest.MuteUser.verify(message.muteUser);
                if (error)
                    return "muteUser." + error;
            }
            if (message.transferOwner != null && message.hasOwnProperty("transferOwner")) {
                let error = $root.chat.RoomActionRequest.TransferOwnership.verify(message.transferOwner);
                if (error)
                    return "transferOwner." + error;
            }
            return null;
        };

        /**
         * Creates a RoomActionRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomActionRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomActionRequest} RoomActionRequest
         */
        RoomActionRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomActionRequest)
                return object;
            let message = new $root.chat.RoomActionRequest();
            switch (object.action) {
            case "CREATE":
            case 0:
                message.action = 0;
                break;
            case "DELETE":
            case 1:
                message.action = 1;
                break;
            case "RENAME":
            case 2:
                message.action = 2;
                break;
            case "JOIN":
            case 3:
                message.action = 3;
                break;
            case "LEAVE":
            case 4:
                message.action = 4;
                break;
            case "CREATEROLE":
            case 5:
                message.action = 5;
                break;
            case "UPDATEROLE":
            case 6:
                message.action = 6;
                break;
            case "DELETEROLE":
            case 7:
                message.action = 7;
                break;
            case "ASSIGNROLE":
            case 8:
                message.action = 8;
                break;
            case "INVITEUSER":
            case 9:
                message.action = 9;
                break;
            case "KICKUSER":
            case 10:
                message.action = 10;
                break;
            case "BANUSER":
            case 11:
                message.action = 11;
                break;
            case "MUTEUSER":
            case 12:
                message.action = 12;
                break;
            case "TRANSFEROWNERSHIP":
            case 13:
                message.action = 13;
                break;
            case "DIRECTORY":
            case 14:
                message.action = 14;
                break;
            }
            if (object.create != null) {
                if (typeof object.create !== "object")
                    throw TypeError(".chat.RoomActionRequest.create: object expected");
                message.create = $root.chat.RoomActionRequest.CreateRoom.fromObject(object.create);
            }
            if (object["delete"] != null) {
                if (typeof object["delete"] !== "object")
                    throw TypeError(".chat.RoomActionRequest.delete: object expected");
                message["delete"] = $root.chat.RoomActionRequest.DeleteRoom.fromObject(object["delete"]);
            }
            if (object.rename != null) {
                if (typeof object.rename !== "object")
                    throw TypeError(".chat.RoomActionRequest.rename: object expected");
                message.rename = $root.chat.RoomActionRequest.RenameRoom.fromObject(object.rename);
            }
            if (object.join != null) {
                if (typeof object.join !== "object")
                    throw TypeError(".chat.RoomActionRequest.join: object expected");
                message.join = $root.chat.RoomActionRequest.JoinRoom.fromObject(object.join);
            }
            if (object.leave != null) {
                if (typeof object.leave !== "object")
                    throw TypeError(".chat.RoomActionRequest.leave: object expected");
                message.leave = $root.chat.RoomActionRequest.LeaveRoom.fromObject(object.leave);
            }
            if (object.createRole != null) {
                if (typeof object.createRole !== "object")
                    throw TypeError(".chat.RoomActionRequest.createRole: object expected");
                message.createRole = $root.chat.RoomActionRequest.CreateRole.fromObject(object.createRole);
            }
            if (object.updateRole != null) {
                if (typeof object.updateRole !== "object")
                    throw TypeError(".chat.RoomActionRequest.updateRole: object expected");
                message.updateRole = $root.chat.RoomActionRequest.UpdateRole.fromObject(object.updateRole);
            }
            if (object.deleteRole != null) {
                if (typeof object.deleteRole !== "object")
                    throw TypeError(".chat.RoomActionRequest.deleteRole: object expected");
                message.deleteRole = $root.chat.RoomActionRequest.DeleteRole.fromObject(object.deleteRole);
            }
            if (object.assignRole != null) {
                if (typeof object.assignRole !== "object")
                    throw TypeError(".chat.RoomActionRequest.assignRole: object expected");
                message.assignRole = $root.chat.RoomActionRequest.AssignRole.fromObject(object.assignRole);
            }
            if (object.inviteUser != null) {
                if (typeof object.inviteUser !== "object")
                    throw TypeError(".chat.RoomActionRequest.inviteUser: object expected");
                message.inviteUser = $root.chat.RoomActionRequest.InviteUser.fromObject(object.inviteUser);
            }
            if (object.kickUser != null) {
                if (typeof object.kickUser !== "object")
                    throw TypeError(".chat.RoomActionRequest.kickUser: object expected");
                message.kickUser = $root.chat.RoomActionRequest.KickUser.fromObject(object.kickUser);
            }
            if (object.banUser != null) {
                if (typeof object.banUser !== "object")
                    throw TypeError(".chat.RoomActionRequest.banUser: object expected");
                message.banUser = $root.chat.RoomActionRequest.BanUser.fromObject(object.banUser);
            }
            if (object.muteUser != null) {
                if (typeof object.muteUser !== "object")
                    throw TypeError(".chat.RoomActionRequest.muteUser: object expected");
                message.muteUser = $root.chat.RoomActionRequest.MuteUser.fromObject(object.muteUser);
            }
            if (object.transferOwner != null) {
                if (typeof object.transferOwner !== "object")
                    throw TypeError(".chat.RoomActionRequest.transferOwner: object expected");
                message.transferOwner = $root.chat.RoomActionRequest.TransferOwnership.fromObject(object.transferOwner);
            }
            return message;
        };

        /**
         * Creates a plain object from a RoomActionRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomActionRequest
         * @static
         * @param {chat.RoomActionRequest} message RoomActionRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomActionRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.action = options.enums === String ? "CREATE" : 0;
                object.create = null;
                object["delete"] = null;
                object.rename = null;
                object.join = null;
                object.leave = null;
                object.createRole = null;
                object.updateRole = null;
                object.deleteRole = null;
                object.assignRole = null;
                object.inviteUser = null;
                object.kickUser = null;
                object.banUser = null;
                object.muteUser = null;
                object.transferOwner = null;
            }
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.chat.RoomActionRequest.ActionType[message.action] : message.action;
            if (message.create != null && message.hasOwnProperty("create"))
                object.create = $root.chat.RoomActionRequest.CreateRoom.toObject(message.create, options);
            if (message["delete"] != null && message.hasOwnProperty("delete"))
                object["delete"] = $root.chat.RoomActionRequest.DeleteRoom.toObject(message["delete"], options);
            if (message.rename != null && message.hasOwnProperty("rename"))
                object.rename = $root.chat.RoomActionRequest.RenameRoom.toObject(message.rename, options);
            if (message.join != null && message.hasOwnProperty("join"))
                object.join = $root.chat.RoomActionRequest.JoinRoom.toObject(message.join, options);
            if (message.leave != null && message.hasOwnProperty("leave"))
                object.leave = $root.chat.RoomActionRequest.LeaveRoom.toObject(message.leave, options);
            if (message.createRole != null && message.hasOwnProperty("createRole"))
                object.createRole = $root.chat.RoomActionRequest.CreateRole.toObject(message.createRole, options);
            if (message.updateRole != null && message.hasOwnProperty("updateRole"))
                object.updateRole = $root.chat.RoomActionRequest.UpdateRole.toObject(message.updateRole, options);
            if (message.deleteRole != null && message.hasOwnProperty("deleteRole"))
                object.deleteRole = $root.chat.RoomActionRequest.DeleteRole.toObject(message.deleteRole, options);
            if (message.assignRole != null && message.hasOwnProperty("assignRole"))
                object.assignRole = $root.chat.RoomActionRequest.AssignRole.toObject(message.assignRole, options);
            if (message.inviteUser != null && message.hasOwnProperty("inviteUser"))
                object.inviteUser = $root.chat.RoomActionRequest.InviteUser.toObject(message.inviteUser, options);
            if (message.kickUser != null && message.hasOwnProperty("kickUser"))
                object.kickUser = $root.chat.RoomActionRequest.KickUser.toObject(message.kickUser, options);
            if (message.banUser != null && message.hasOwnProperty("banUser"))
                object.banUser = $root.chat.RoomActionRequest.BanUser.toObject(message.banUser, options);
            if (message.muteUser != null && message.hasOwnProperty("muteUser"))
                object.muteUser = $root.chat.RoomActionRequest.MuteUser.toObject(message.muteUser, options);
            if (message.transferOwner != null && message.hasOwnProperty("transferOwner"))
                object.transferOwner = $root.chat.RoomActionRequest.TransferOwnership.toObject(message.transferOwner, options);
            return object;
        };

        /**
         * Converts this RoomActionRequest to JSON.
         * @function toJSON
         * @memberof chat.RoomActionRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomActionRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * ActionType enum.
         * @name chat.RoomActionRequest.ActionType
         * @enum {number}
         * @property {number} CREATE=0 CREATE value
         * @property {number} DELETE=1 DELETE value
         * @property {number} RENAME=2 RENAME value
         * @property {number} JOIN=3 JOIN value
         * @property {number} LEAVE=4 LEAVE value
         * @property {number} CREATEROLE=5 CREATEROLE value
         * @property {number} UPDATEROLE=6 UPDATEROLE value
         * @property {number} DELETEROLE=7 DELETEROLE value
         * @property {number} ASSIGNROLE=8 ASSIGNROLE value
         * @property {number} INVITEUSER=9 INVITEUSER value
         * @property {number} KICKUSER=10 KICKUSER value
         * @property {number} BANUSER=11 BANUSER value
         * @property {number} MUTEUSER=12 MUTEUSER value
         * @property {number} TRANSFEROWNERSHIP=13 TRANSFEROWNERSHIP value
         * @property {number} DIRECTORY=14 DIRECTORY value
         */
        RoomActionRequest.ActionType = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CREATE"] = 0;
            values[valuesById[1] = "DELETE"] = 1;
            values[valuesById[2] = "RENAME"] = 2;
            values[valuesById[3] = "JOIN"] = 3;
            values[valuesById[4] = "LEAVE"] = 4;
            values[valuesById[5] = "CREATEROLE"] = 5;
            values[valuesById[6] = "UPDATEROLE"] = 6;
            values[valuesById[7] = "DELETEROLE"] = 7;
            values[valuesById[8] = "ASSIGNROLE"] = 8;
            values[valuesById[9] = "INVITEUSER"] = 9;
            values[valuesById[10] = "KICKUSER"] = 10;
            values[valuesById[11] = "BANUSER"] = 11;
            values[valuesById[12] = "MUTEUSER"] = 12;
            values[valuesById[13] = "TRANSFEROWNERSHIP"] = 13;
            values[valuesById[14] = "DIRECTORY"] = 14;
            return values;
        })();

        RoomActionRequest.CreateRoom = (function() {

            /**
             * Properties of a CreateRoom.
             * @memberof chat.RoomActionRequest
             * @interface ICreateRoom
             * @property {string|null} [name] CreateRoom name
             * @property {boolean|null} [isPublic] CreateRoom isPublic
             * @property {string|null} [forGroupID] CreateRoom forGroupID
             */

            /**
             * Constructs a new CreateRoom.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a CreateRoom.
             * @implements ICreateRoom
             * @constructor
             * @param {chat.RoomActionRequest.ICreateRoom=} [properties] Properties to set
             */
            function CreateRoom(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateRoom name.
             * @member {string} name
             * @memberof chat.RoomActionRequest.CreateRoom
             * @instance
             */
            CreateRoom.prototype.name = "";

            /**
             * CreateRoom isPublic.
             * @member {boolean} isPublic
             * @memberof chat.RoomActionRequest.CreateRoom
             * @instance
             */
            CreateRoom.prototype.isPublic = false;

            /**
             * CreateRoom forGroupID.
             * @member {string} forGroupID
             * @memberof chat.RoomActionRequest.CreateRoom
             * @instance
             */
            CreateRoom.prototype.forGroupID = "";

            /**
             * Creates a new CreateRoom instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.CreateRoom
             * @static
             * @param {chat.RoomActionRequest.ICreateRoom=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.CreateRoom} CreateRoom instance
             */
            CreateRoom.create = function create(properties) {
                return new CreateRoom(properties);
            };

            /**
             * Encodes the specified CreateRoom message. Does not implicitly {@link chat.RoomActionRequest.CreateRoom.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.CreateRoom
             * @static
             * @param {chat.RoomActionRequest.ICreateRoom} message CreateRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateRoom.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                if (message.isPublic != null && Object.hasOwnProperty.call(message, "isPublic"))
                    writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isPublic);
                if (message.forGroupID != null && Object.hasOwnProperty.call(message, "forGroupID"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.forGroupID);
                return writer;
            };

            /**
             * Encodes the specified CreateRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.CreateRoom.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.CreateRoom
             * @static
             * @param {chat.RoomActionRequest.ICreateRoom} message CreateRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateRoom.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateRoom message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.CreateRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.CreateRoom} CreateRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateRoom.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.CreateRoom();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.name = reader.string();
                        break;
                    case 2:
                        message.isPublic = reader.bool();
                        break;
                    case 3:
                        message.forGroupID = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CreateRoom message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.CreateRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.CreateRoom} CreateRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateRoom.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateRoom message.
             * @function verify
             * @memberof chat.RoomActionRequest.CreateRoom
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateRoom.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.isPublic != null && message.hasOwnProperty("isPublic"))
                    if (typeof message.isPublic !== "boolean")
                        return "isPublic: boolean expected";
                if (message.forGroupID != null && message.hasOwnProperty("forGroupID"))
                    if (!$util.isString(message.forGroupID))
                        return "forGroupID: string expected";
                return null;
            };

            /**
             * Creates a CreateRoom message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.CreateRoom
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.CreateRoom} CreateRoom
             */
            CreateRoom.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.CreateRoom)
                    return object;
                let message = new $root.chat.RoomActionRequest.CreateRoom();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.isPublic != null)
                    message.isPublic = Boolean(object.isPublic);
                if (object.forGroupID != null)
                    message.forGroupID = String(object.forGroupID);
                return message;
            };

            /**
             * Creates a plain object from a CreateRoom message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.CreateRoom
             * @static
             * @param {chat.RoomActionRequest.CreateRoom} message CreateRoom
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateRoom.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.name = "";
                    object.isPublic = false;
                    object.forGroupID = "";
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.isPublic != null && message.hasOwnProperty("isPublic"))
                    object.isPublic = message.isPublic;
                if (message.forGroupID != null && message.hasOwnProperty("forGroupID"))
                    object.forGroupID = message.forGroupID;
                return object;
            };

            /**
             * Converts this CreateRoom to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.CreateRoom
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateRoom.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return CreateRoom;
        })();

        RoomActionRequest.DeleteRoom = (function() {

            /**
             * Properties of a DeleteRoom.
             * @memberof chat.RoomActionRequest
             * @interface IDeleteRoom
             * @property {string|null} [roomID] DeleteRoom roomID
             */

            /**
             * Constructs a new DeleteRoom.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a DeleteRoom.
             * @implements IDeleteRoom
             * @constructor
             * @param {chat.RoomActionRequest.IDeleteRoom=} [properties] Properties to set
             */
            function DeleteRoom(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteRoom roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @instance
             */
            DeleteRoom.prototype.roomID = "";

            /**
             * Creates a new DeleteRoom instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @static
             * @param {chat.RoomActionRequest.IDeleteRoom=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.DeleteRoom} DeleteRoom instance
             */
            DeleteRoom.create = function create(properties) {
                return new DeleteRoom(properties);
            };

            /**
             * Encodes the specified DeleteRoom message. Does not implicitly {@link chat.RoomActionRequest.DeleteRoom.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @static
             * @param {chat.RoomActionRequest.IDeleteRoom} message DeleteRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteRoom.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                return writer;
            };

            /**
             * Encodes the specified DeleteRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.DeleteRoom.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @static
             * @param {chat.RoomActionRequest.IDeleteRoom} message DeleteRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteRoom.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteRoom message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.DeleteRoom} DeleteRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteRoom.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.DeleteRoom();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DeleteRoom message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.DeleteRoom} DeleteRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteRoom.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteRoom message.
             * @function verify
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteRoom.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                return null;
            };

            /**
             * Creates a DeleteRoom message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.DeleteRoom} DeleteRoom
             */
            DeleteRoom.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.DeleteRoom)
                    return object;
                let message = new $root.chat.RoomActionRequest.DeleteRoom();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                return message;
            };

            /**
             * Creates a plain object from a DeleteRoom message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @static
             * @param {chat.RoomActionRequest.DeleteRoom} message DeleteRoom
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteRoom.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.roomID = "";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                return object;
            };

            /**
             * Converts this DeleteRoom to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.DeleteRoom
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteRoom.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DeleteRoom;
        })();

        RoomActionRequest.RenameRoom = (function() {

            /**
             * Properties of a RenameRoom.
             * @memberof chat.RoomActionRequest
             * @interface IRenameRoom
             * @property {string|null} [roomID] RenameRoom roomID
             * @property {string|null} [name] RenameRoom name
             */

            /**
             * Constructs a new RenameRoom.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a RenameRoom.
             * @implements IRenameRoom
             * @constructor
             * @param {chat.RoomActionRequest.IRenameRoom=} [properties] Properties to set
             */
            function RenameRoom(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RenameRoom roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.RenameRoom
             * @instance
             */
            RenameRoom.prototype.roomID = "";

            /**
             * RenameRoom name.
             * @member {string} name
             * @memberof chat.RoomActionRequest.RenameRoom
             * @instance
             */
            RenameRoom.prototype.name = "";

            /**
             * Creates a new RenameRoom instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.RenameRoom
             * @static
             * @param {chat.RoomActionRequest.IRenameRoom=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.RenameRoom} RenameRoom instance
             */
            RenameRoom.create = function create(properties) {
                return new RenameRoom(properties);
            };

            /**
             * Encodes the specified RenameRoom message. Does not implicitly {@link chat.RoomActionRequest.RenameRoom.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.RenameRoom
             * @static
             * @param {chat.RoomActionRequest.IRenameRoom} message RenameRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RenameRoom.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified RenameRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.RenameRoom.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.RenameRoom
             * @static
             * @param {chat.RoomActionRequest.IRenameRoom} message RenameRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RenameRoom.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RenameRoom message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.RenameRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.RenameRoom} RenameRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RenameRoom.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.RenameRoom();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a RenameRoom message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.RenameRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.RenameRoom} RenameRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RenameRoom.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RenameRoom message.
             * @function verify
             * @memberof chat.RoomActionRequest.RenameRoom
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RenameRoom.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates a RenameRoom message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.RenameRoom
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.RenameRoom} RenameRoom
             */
            RenameRoom.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.RenameRoom)
                    return object;
                let message = new $root.chat.RoomActionRequest.RenameRoom();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates a plain object from a RenameRoom message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.RenameRoom
             * @static
             * @param {chat.RoomActionRequest.RenameRoom} message RenameRoom
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RenameRoom.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.name = "";
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Converts this RenameRoom to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.RenameRoom
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RenameRoom.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return RenameRoom;
        })();

        RoomActionRequest.JoinRoom = (function() {

            /**
             * Properties of a JoinRoom.
             * @memberof chat.RoomActionRequest
             * @interface IJoinRoom
             * @property {string|null} [roomID] JoinRoom roomID
             * @property {string|null} [inviteToken] JoinRoom inviteToken
             */

            /**
             * Constructs a new JoinRoom.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a JoinRoom.
             * @implements IJoinRoom
             * @constructor
             * @param {chat.RoomActionRequest.IJoinRoom=} [properties] Properties to set
             */
            function JoinRoom(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * JoinRoom roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.JoinRoom
             * @instance
             */
            JoinRoom.prototype.roomID = "";

            /**
             * JoinRoom inviteToken.
             * @member {string} inviteToken
             * @memberof chat.RoomActionRequest.JoinRoom
             * @instance
             */
            JoinRoom.prototype.inviteToken = "";

            /**
             * Creates a new JoinRoom instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.JoinRoom
             * @static
             * @param {chat.RoomActionRequest.IJoinRoom=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.JoinRoom} JoinRoom instance
             */
            JoinRoom.create = function create(properties) {
                return new JoinRoom(properties);
            };

            /**
             * Encodes the specified JoinRoom message. Does not implicitly {@link chat.RoomActionRequest.JoinRoom.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.JoinRoom
             * @static
             * @param {chat.RoomActionRequest.IJoinRoom} message JoinRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JoinRoom.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.inviteToken != null && Object.hasOwnProperty.call(message, "inviteToken"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.inviteToken);
                return writer;
            };

            /**
             * Encodes the specified JoinRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.JoinRoom.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.JoinRoom
             * @static
             * @param {chat.RoomActionRequest.IJoinRoom} message JoinRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            JoinRoom.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a JoinRoom message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.JoinRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.JoinRoom} JoinRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JoinRoom.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.JoinRoom();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.inviteToken = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a JoinRoom message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.JoinRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.JoinRoom} JoinRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            JoinRoom.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a JoinRoom message.
             * @function verify
             * @memberof chat.RoomActionRequest.JoinRoom
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            JoinRoom.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.inviteToken != null && message.hasOwnProperty("inviteToken"))
                    if (!$util.isString(message.inviteToken))
                        return "inviteToken: string expected";
                return null;
            };

            /**
             * Creates a JoinRoom message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.JoinRoom
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.JoinRoom} JoinRoom
             */
            JoinRoom.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.JoinRoom)
                    return object;
                let message = new $root.chat.RoomActionRequest.JoinRoom();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.inviteToken != null)
                    message.inviteToken = String(object.inviteToken);
                return message;
            };

            /**
             * Creates a plain object from a JoinRoom message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.JoinRoom
             * @static
             * @param {chat.RoomActionRequest.JoinRoom} message JoinRoom
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            JoinRoom.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.inviteToken = "";
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.inviteToken != null && message.hasOwnProperty("inviteToken"))
                    object.inviteToken = message.inviteToken;
                return object;
            };

            /**
             * Converts this JoinRoom to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.JoinRoom
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            JoinRoom.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return JoinRoom;
        })();

        RoomActionRequest.LeaveRoom = (function() {

            /**
             * Properties of a LeaveRoom.
             * @memberof chat.RoomActionRequest
             * @interface ILeaveRoom
             * @property {string|null} [roomID] LeaveRoom roomID
             */

            /**
             * Constructs a new LeaveRoom.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a LeaveRoom.
             * @implements ILeaveRoom
             * @constructor
             * @param {chat.RoomActionRequest.ILeaveRoom=} [properties] Properties to set
             */
            function LeaveRoom(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LeaveRoom roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @instance
             */
            LeaveRoom.prototype.roomID = "";

            /**
             * Creates a new LeaveRoom instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @static
             * @param {chat.RoomActionRequest.ILeaveRoom=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.LeaveRoom} LeaveRoom instance
             */
            LeaveRoom.create = function create(properties) {
                return new LeaveRoom(properties);
            };

            /**
             * Encodes the specified LeaveRoom message. Does not implicitly {@link chat.RoomActionRequest.LeaveRoom.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @static
             * @param {chat.RoomActionRequest.ILeaveRoom} message LeaveRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LeaveRoom.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                return writer;
            };

            /**
             * Encodes the specified LeaveRoom message, length delimited. Does not implicitly {@link chat.RoomActionRequest.LeaveRoom.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @static
             * @param {chat.RoomActionRequest.ILeaveRoom} message LeaveRoom message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LeaveRoom.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LeaveRoom message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.LeaveRoom} LeaveRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LeaveRoom.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.LeaveRoom();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a LeaveRoom message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.LeaveRoom} LeaveRoom
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LeaveRoom.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LeaveRoom message.
             * @function verify
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LeaveRoom.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                return null;
            };

            /**
             * Creates a LeaveRoom message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.LeaveRoom} LeaveRoom
             */
            LeaveRoom.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.LeaveRoom)
                    return object;
                let message = new $root.chat.RoomActionRequest.LeaveRoom();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                return message;
            };

            /**
             * Creates a plain object from a LeaveRoom message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @static
             * @param {chat.RoomActionRequest.LeaveRoom} message LeaveRoom
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LeaveRoom.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.roomID = "";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                return object;
            };

            /**
             * Converts this LeaveRoom to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.LeaveRoom
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LeaveRoom.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return LeaveRoom;
        })();

        RoomActionRequest.CreateRole = (function() {

            /**
             * Properties of a CreateRole.
             * @memberof chat.RoomActionRequest
             * @interface ICreateRole
             * @property {string|null} [roomID] CreateRole roomID
             * @property {string|null} [name] CreateRole name
             * @property {number|null} [permissions] CreateRole permissions
             */

            /**
             * Constructs a new CreateRole.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a CreateRole.
             * @implements ICreateRole
             * @constructor
             * @param {chat.RoomActionRequest.ICreateRole=} [properties] Properties to set
             */
            function CreateRole(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CreateRole roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.CreateRole
             * @instance
             */
            CreateRole.prototype.roomID = "";

            /**
             * CreateRole name.
             * @member {string} name
             * @memberof chat.RoomActionRequest.CreateRole
             * @instance
             */
            CreateRole.prototype.name = "";

            /**
             * CreateRole permissions.
             * @member {number} permissions
             * @memberof chat.RoomActionRequest.CreateRole
             * @instance
             */
            CreateRole.prototype.permissions = 0;

            /**
             * Creates a new CreateRole instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.CreateRole
             * @static
             * @param {chat.RoomActionRequest.ICreateRole=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.CreateRole} CreateRole instance
             */
            CreateRole.create = function create(properties) {
                return new CreateRole(properties);
            };

            /**
             * Encodes the specified CreateRole message. Does not implicitly {@link chat.RoomActionRequest.CreateRole.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.CreateRole
             * @static
             * @param {chat.RoomActionRequest.ICreateRole} message CreateRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateRole.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.permissions != null && Object.hasOwnProperty.call(message, "permissions"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.permissions);
                return writer;
            };

            /**
             * Encodes the specified CreateRole message, length delimited. Does not implicitly {@link chat.RoomActionRequest.CreateRole.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.CreateRole
             * @static
             * @param {chat.RoomActionRequest.ICreateRole} message CreateRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CreateRole.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CreateRole message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.CreateRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.CreateRole} CreateRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateRole.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.CreateRole();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.permissions = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CreateRole message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.CreateRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.CreateRole} CreateRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CreateRole.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CreateRole message.
             * @function verify
             * @memberof chat.RoomActionRequest.CreateRole
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CreateRole.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.permissions != null && message.hasOwnProperty("permissions"))
                    if (!$util.isInteger(message.permissions))
                        return "permissions: integer expected";
                return null;
            };

            /**
             * Creates a CreateRole message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.CreateRole
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.CreateRole} CreateRole
             */
            CreateRole.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.CreateRole)
                    return object;
                let message = new $root.chat.RoomActionRequest.CreateRole();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.permissions != null)
                    message.permissions = object.permissions | 0;
                return message;
            };

            /**
             * Creates a plain object from a CreateRole message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.CreateRole
             * @static
             * @param {chat.RoomActionRequest.CreateRole} message CreateRole
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CreateRole.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.name = "";
                    object.permissions = 0;
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.permissions != null && message.hasOwnProperty("permissions"))
                    object.permissions = message.permissions;
                return object;
            };

            /**
             * Converts this CreateRole to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.CreateRole
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CreateRole.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return CreateRole;
        })();

        RoomActionRequest.UpdateRole = (function() {

            /**
             * Properties of an UpdateRole.
             * @memberof chat.RoomActionRequest
             * @interface IUpdateRole
             * @property {string|null} [roomID] UpdateRole roomID
             * @property {string|null} [name] UpdateRole name
             * @property {number|null} [permissions] UpdateRole permissions
             * @property {string|null} [rename] UpdateRole rename
             */

            /**
             * Constructs a new UpdateRole.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents an UpdateRole.
             * @implements IUpdateRole
             * @constructor
             * @param {chat.RoomActionRequest.IUpdateRole=} [properties] Properties to set
             */
            function UpdateRole(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UpdateRole roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.UpdateRole
             * @instance
             */
            UpdateRole.prototype.roomID = "";

            /**
             * UpdateRole name.
             * @member {string} name
             * @memberof chat.RoomActionRequest.UpdateRole
             * @instance
             */
            UpdateRole.prototype.name = "";

            /**
             * UpdateRole permissions.
             * @member {number} permissions
             * @memberof chat.RoomActionRequest.UpdateRole
             * @instance
             */
            UpdateRole.prototype.permissions = 0;

            /**
             * UpdateRole rename.
             * @member {string} rename
             * @memberof chat.RoomActionRequest.UpdateRole
             * @instance
             */
            UpdateRole.prototype.rename = "";

            /**
             * Creates a new UpdateRole instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.UpdateRole
             * @static
             * @param {chat.RoomActionRequest.IUpdateRole=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.UpdateRole} UpdateRole instance
             */
            UpdateRole.create = function create(properties) {
                return new UpdateRole(properties);
            };

            /**
             * Encodes the specified UpdateRole message. Does not implicitly {@link chat.RoomActionRequest.UpdateRole.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.UpdateRole
             * @static
             * @param {chat.RoomActionRequest.IUpdateRole} message UpdateRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateRole.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.permissions != null && Object.hasOwnProperty.call(message, "permissions"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.permissions);
                if (message.rename != null && Object.hasOwnProperty.call(message, "rename"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.rename);
                return writer;
            };

            /**
             * Encodes the specified UpdateRole message, length delimited. Does not implicitly {@link chat.RoomActionRequest.UpdateRole.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.UpdateRole
             * @static
             * @param {chat.RoomActionRequest.IUpdateRole} message UpdateRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UpdateRole.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an UpdateRole message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.UpdateRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.UpdateRole} UpdateRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateRole.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.UpdateRole();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.permissions = reader.int32();
                        break;
                    case 4:
                        message.rename = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an UpdateRole message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.UpdateRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.UpdateRole} UpdateRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UpdateRole.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an UpdateRole message.
             * @function verify
             * @memberof chat.RoomActionRequest.UpdateRole
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UpdateRole.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.permissions != null && message.hasOwnProperty("permissions"))
                    if (!$util.isInteger(message.permissions))
                        return "permissions: integer expected";
                if (message.rename != null && message.hasOwnProperty("rename"))
                    if (!$util.isString(message.rename))
                        return "rename: string expected";
                return null;
            };

            /**
             * Creates an UpdateRole message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.UpdateRole
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.UpdateRole} UpdateRole
             */
            UpdateRole.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.UpdateRole)
                    return object;
                let message = new $root.chat.RoomActionRequest.UpdateRole();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.name != null)
                    message.name = String(object.name);
                if (object.permissions != null)
                    message.permissions = object.permissions | 0;
                if (object.rename != null)
                    message.rename = String(object.rename);
                return message;
            };

            /**
             * Creates a plain object from an UpdateRole message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.UpdateRole
             * @static
             * @param {chat.RoomActionRequest.UpdateRole} message UpdateRole
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UpdateRole.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.name = "";
                    object.permissions = 0;
                    object.rename = "";
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.permissions != null && message.hasOwnProperty("permissions"))
                    object.permissions = message.permissions;
                if (message.rename != null && message.hasOwnProperty("rename"))
                    object.rename = message.rename;
                return object;
            };

            /**
             * Converts this UpdateRole to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.UpdateRole
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UpdateRole.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return UpdateRole;
        })();

        RoomActionRequest.DeleteRole = (function() {

            /**
             * Properties of a DeleteRole.
             * @memberof chat.RoomActionRequest
             * @interface IDeleteRole
             * @property {string|null} [roomID] DeleteRole roomID
             * @property {string|null} [name] DeleteRole name
             */

            /**
             * Constructs a new DeleteRole.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a DeleteRole.
             * @implements IDeleteRole
             * @constructor
             * @param {chat.RoomActionRequest.IDeleteRole=} [properties] Properties to set
             */
            function DeleteRole(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DeleteRole roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.DeleteRole
             * @instance
             */
            DeleteRole.prototype.roomID = "";

            /**
             * DeleteRole name.
             * @member {string} name
             * @memberof chat.RoomActionRequest.DeleteRole
             * @instance
             */
            DeleteRole.prototype.name = "";

            /**
             * Creates a new DeleteRole instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.DeleteRole
             * @static
             * @param {chat.RoomActionRequest.IDeleteRole=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.DeleteRole} DeleteRole instance
             */
            DeleteRole.create = function create(properties) {
                return new DeleteRole(properties);
            };

            /**
             * Encodes the specified DeleteRole message. Does not implicitly {@link chat.RoomActionRequest.DeleteRole.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.DeleteRole
             * @static
             * @param {chat.RoomActionRequest.IDeleteRole} message DeleteRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteRole.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                return writer;
            };

            /**
             * Encodes the specified DeleteRole message, length delimited. Does not implicitly {@link chat.RoomActionRequest.DeleteRole.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.DeleteRole
             * @static
             * @param {chat.RoomActionRequest.IDeleteRole} message DeleteRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DeleteRole.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DeleteRole message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.DeleteRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.DeleteRole} DeleteRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteRole.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.DeleteRole();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.name = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DeleteRole message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.DeleteRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.DeleteRole} DeleteRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DeleteRole.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DeleteRole message.
             * @function verify
             * @memberof chat.RoomActionRequest.DeleteRole
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DeleteRole.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };

            /**
             * Creates a DeleteRole message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.DeleteRole
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.DeleteRole} DeleteRole
             */
            DeleteRole.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.DeleteRole)
                    return object;
                let message = new $root.chat.RoomActionRequest.DeleteRole();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };

            /**
             * Creates a plain object from a DeleteRole message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.DeleteRole
             * @static
             * @param {chat.RoomActionRequest.DeleteRole} message DeleteRole
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DeleteRole.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.name = "";
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                return object;
            };

            /**
             * Converts this DeleteRole to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.DeleteRole
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DeleteRole.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return DeleteRole;
        })();

        RoomActionRequest.AssignRole = (function() {

            /**
             * Properties of an AssignRole.
             * @memberof chat.RoomActionRequest
             * @interface IAssignRole
             * @property {string|null} [roomID] AssignRole roomID
             * @property {string|null} [role] AssignRole role
             * @property {string|null} [userID] AssignRole userID
             */

            /**
             * Constructs a new AssignRole.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents an AssignRole.
             * @implements IAssignRole
             * @constructor
             * @param {chat.RoomActionRequest.IAssignRole=} [properties] Properties to set
             */
            function AssignRole(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * AssignRole roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.AssignRole
             * @instance
             */
            AssignRole.prototype.roomID = "";

            /**
             * AssignRole role.
             * @member {string} role
             * @memberof chat.RoomActionRequest.AssignRole
             * @instance
             */
            AssignRole.prototype.role = "";

            /**
             * AssignRole userID.
             * @member {string} userID
             * @memberof chat.RoomActionRequest.AssignRole
             * @instance
             */
            AssignRole.prototype.userID = "";

            /**
             * Creates a new AssignRole instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.AssignRole
             * @static
             * @param {chat.RoomActionRequest.IAssignRole=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.AssignRole} AssignRole instance
             */
            AssignRole.create = function create(properties) {
                return new AssignRole(properties);
            };

            /**
             * Encodes the specified AssignRole message. Does not implicitly {@link chat.RoomActionRequest.AssignRole.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.AssignRole
             * @static
             * @param {chat.RoomActionRequest.IAssignRole} message AssignRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AssignRole.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.role != null && Object.hasOwnProperty.call(message, "role"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.role);
                if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.userID);
                return writer;
            };

            /**
             * Encodes the specified AssignRole message, length delimited. Does not implicitly {@link chat.RoomActionRequest.AssignRole.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.AssignRole
             * @static
             * @param {chat.RoomActionRequest.IAssignRole} message AssignRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            AssignRole.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an AssignRole message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.AssignRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.AssignRole} AssignRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AssignRole.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.AssignRole();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.role = reader.string();
                        break;
                    case 3:
                        message.userID = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an AssignRole message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.AssignRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.AssignRole} AssignRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            AssignRole.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an AssignRole message.
             * @function verify
             * @memberof chat.RoomActionRequest.AssignRole
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            AssignRole.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.role != null && message.hasOwnProperty("role"))
                    if (!$util.isString(message.role))
                        return "role: string expected";
                if (message.userID != null && message.hasOwnProperty("userID"))
                    if (!$util.isString(message.userID))
                        return "userID: string expected";
                return null;
            };

            /**
             * Creates an AssignRole message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.AssignRole
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.AssignRole} AssignRole
             */
            AssignRole.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.AssignRole)
                    return object;
                let message = new $root.chat.RoomActionRequest.AssignRole();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.role != null)
                    message.role = String(object.role);
                if (object.userID != null)
                    message.userID = String(object.userID);
                return message;
            };

            /**
             * Creates a plain object from an AssignRole message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.AssignRole
             * @static
             * @param {chat.RoomActionRequest.AssignRole} message AssignRole
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            AssignRole.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.role = "";
                    object.userID = "";
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.role != null && message.hasOwnProperty("role"))
                    object.role = message.role;
                if (message.userID != null && message.hasOwnProperty("userID"))
                    object.userID = message.userID;
                return object;
            };

            /**
             * Converts this AssignRole to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.AssignRole
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            AssignRole.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return AssignRole;
        })();

        RoomActionRequest.InviteUser = (function() {

            /**
             * Properties of an InviteUser.
             * @memberof chat.RoomActionRequest
             * @interface IInviteUser
             * @property {string|null} [roomID] InviteUser roomID
             * @property {string|null} [userID] InviteUser userID
             * @property {string|null} [characterName] InviteUser characterName
             */

            /**
             * Constructs a new InviteUser.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents an InviteUser.
             * @implements IInviteUser
             * @constructor
             * @param {chat.RoomActionRequest.IInviteUser=} [properties] Properties to set
             */
            function InviteUser(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * InviteUser roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.InviteUser
             * @instance
             */
            InviteUser.prototype.roomID = "";

            /**
             * InviteUser userID.
             * @member {string} userID
             * @memberof chat.RoomActionRequest.InviteUser
             * @instance
             */
            InviteUser.prototype.userID = "";

            /**
             * InviteUser characterName.
             * @member {string} characterName
             * @memberof chat.RoomActionRequest.InviteUser
             * @instance
             */
            InviteUser.prototype.characterName = "";

            /**
             * Creates a new InviteUser instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.InviteUser
             * @static
             * @param {chat.RoomActionRequest.IInviteUser=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.InviteUser} InviteUser instance
             */
            InviteUser.create = function create(properties) {
                return new InviteUser(properties);
            };

            /**
             * Encodes the specified InviteUser message. Does not implicitly {@link chat.RoomActionRequest.InviteUser.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.InviteUser
             * @static
             * @param {chat.RoomActionRequest.IInviteUser} message InviteUser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InviteUser.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userID);
                if (message.characterName != null && Object.hasOwnProperty.call(message, "characterName"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.characterName);
                return writer;
            };

            /**
             * Encodes the specified InviteUser message, length delimited. Does not implicitly {@link chat.RoomActionRequest.InviteUser.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.InviteUser
             * @static
             * @param {chat.RoomActionRequest.IInviteUser} message InviteUser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InviteUser.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an InviteUser message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.InviteUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.InviteUser} InviteUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InviteUser.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.InviteUser();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.userID = reader.string();
                        break;
                    case 3:
                        message.characterName = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an InviteUser message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.InviteUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.InviteUser} InviteUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InviteUser.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an InviteUser message.
             * @function verify
             * @memberof chat.RoomActionRequest.InviteUser
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            InviteUser.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.userID != null && message.hasOwnProperty("userID"))
                    if (!$util.isString(message.userID))
                        return "userID: string expected";
                if (message.characterName != null && message.hasOwnProperty("characterName"))
                    if (!$util.isString(message.characterName))
                        return "characterName: string expected";
                return null;
            };

            /**
             * Creates an InviteUser message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.InviteUser
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.InviteUser} InviteUser
             */
            InviteUser.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.InviteUser)
                    return object;
                let message = new $root.chat.RoomActionRequest.InviteUser();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.userID != null)
                    message.userID = String(object.userID);
                if (object.characterName != null)
                    message.characterName = String(object.characterName);
                return message;
            };

            /**
             * Creates a plain object from an InviteUser message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.InviteUser
             * @static
             * @param {chat.RoomActionRequest.InviteUser} message InviteUser
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            InviteUser.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.userID = "";
                    object.characterName = "";
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.userID != null && message.hasOwnProperty("userID"))
                    object.userID = message.userID;
                if (message.characterName != null && message.hasOwnProperty("characterName"))
                    object.characterName = message.characterName;
                return object;
            };

            /**
             * Converts this InviteUser to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.InviteUser
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            InviteUser.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return InviteUser;
        })();

        RoomActionRequest.KickUser = (function() {

            /**
             * Properties of a KickUser.
             * @memberof chat.RoomActionRequest
             * @interface IKickUser
             * @property {string|null} [roomID] KickUser roomID
             * @property {string|null} [userID] KickUser userID
             */

            /**
             * Constructs a new KickUser.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a KickUser.
             * @implements IKickUser
             * @constructor
             * @param {chat.RoomActionRequest.IKickUser=} [properties] Properties to set
             */
            function KickUser(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * KickUser roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.KickUser
             * @instance
             */
            KickUser.prototype.roomID = "";

            /**
             * KickUser userID.
             * @member {string} userID
             * @memberof chat.RoomActionRequest.KickUser
             * @instance
             */
            KickUser.prototype.userID = "";

            /**
             * Creates a new KickUser instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.KickUser
             * @static
             * @param {chat.RoomActionRequest.IKickUser=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.KickUser} KickUser instance
             */
            KickUser.create = function create(properties) {
                return new KickUser(properties);
            };

            /**
             * Encodes the specified KickUser message. Does not implicitly {@link chat.RoomActionRequest.KickUser.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.KickUser
             * @static
             * @param {chat.RoomActionRequest.IKickUser} message KickUser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KickUser.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userID);
                return writer;
            };

            /**
             * Encodes the specified KickUser message, length delimited. Does not implicitly {@link chat.RoomActionRequest.KickUser.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.KickUser
             * @static
             * @param {chat.RoomActionRequest.IKickUser} message KickUser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            KickUser.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a KickUser message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.KickUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.KickUser} KickUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KickUser.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.KickUser();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.userID = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a KickUser message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.KickUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.KickUser} KickUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            KickUser.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a KickUser message.
             * @function verify
             * @memberof chat.RoomActionRequest.KickUser
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            KickUser.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.userID != null && message.hasOwnProperty("userID"))
                    if (!$util.isString(message.userID))
                        return "userID: string expected";
                return null;
            };

            /**
             * Creates a KickUser message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.KickUser
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.KickUser} KickUser
             */
            KickUser.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.KickUser)
                    return object;
                let message = new $root.chat.RoomActionRequest.KickUser();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.userID != null)
                    message.userID = String(object.userID);
                return message;
            };

            /**
             * Creates a plain object from a KickUser message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.KickUser
             * @static
             * @param {chat.RoomActionRequest.KickUser} message KickUser
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            KickUser.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.userID = "";
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.userID != null && message.hasOwnProperty("userID"))
                    object.userID = message.userID;
                return object;
            };

            /**
             * Converts this KickUser to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.KickUser
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            KickUser.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return KickUser;
        })();

        RoomActionRequest.BanUser = (function() {

            /**
             * Properties of a BanUser.
             * @memberof chat.RoomActionRequest
             * @interface IBanUser
             * @property {string|null} [roomID] BanUser roomID
             * @property {string|null} [userID] BanUser userID
             * @property {number|null} [seconds] BanUser seconds
             */

            /**
             * Constructs a new BanUser.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a BanUser.
             * @implements IBanUser
             * @constructor
             * @param {chat.RoomActionRequest.IBanUser=} [properties] Properties to set
             */
            function BanUser(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BanUser roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.BanUser
             * @instance
             */
            BanUser.prototype.roomID = "";

            /**
             * BanUser userID.
             * @member {string} userID
             * @memberof chat.RoomActionRequest.BanUser
             * @instance
             */
            BanUser.prototype.userID = "";

            /**
             * BanUser seconds.
             * @member {number} seconds
             * @memberof chat.RoomActionRequest.BanUser
             * @instance
             */
            BanUser.prototype.seconds = 0;

            /**
             * Creates a new BanUser instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.BanUser
             * @static
             * @param {chat.RoomActionRequest.IBanUser=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.BanUser} BanUser instance
             */
            BanUser.create = function create(properties) {
                return new BanUser(properties);
            };

            /**
             * Encodes the specified BanUser message. Does not implicitly {@link chat.RoomActionRequest.BanUser.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.BanUser
             * @static
             * @param {chat.RoomActionRequest.IBanUser} message BanUser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BanUser.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userID);
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.seconds);
                return writer;
            };

            /**
             * Encodes the specified BanUser message, length delimited. Does not implicitly {@link chat.RoomActionRequest.BanUser.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.BanUser
             * @static
             * @param {chat.RoomActionRequest.IBanUser} message BanUser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BanUser.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BanUser message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.BanUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.BanUser} BanUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BanUser.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.BanUser();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.userID = reader.string();
                        break;
                    case 3:
                        message.seconds = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BanUser message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.BanUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.BanUser} BanUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BanUser.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BanUser message.
             * @function verify
             * @memberof chat.RoomActionRequest.BanUser
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BanUser.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.userID != null && message.hasOwnProperty("userID"))
                    if (!$util.isString(message.userID))
                        return "userID: string expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds))
                        return "seconds: integer expected";
                return null;
            };

            /**
             * Creates a BanUser message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.BanUser
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.BanUser} BanUser
             */
            BanUser.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.BanUser)
                    return object;
                let message = new $root.chat.RoomActionRequest.BanUser();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.userID != null)
                    message.userID = String(object.userID);
                if (object.seconds != null)
                    message.seconds = object.seconds | 0;
                return message;
            };

            /**
             * Creates a plain object from a BanUser message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.BanUser
             * @static
             * @param {chat.RoomActionRequest.BanUser} message BanUser
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BanUser.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.userID = "";
                    object.seconds = 0;
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.userID != null && message.hasOwnProperty("userID"))
                    object.userID = message.userID;
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    object.seconds = message.seconds;
                return object;
            };

            /**
             * Converts this BanUser to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.BanUser
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BanUser.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return BanUser;
        })();

        RoomActionRequest.MuteUser = (function() {

            /**
             * Properties of a MuteUser.
             * @memberof chat.RoomActionRequest
             * @interface IMuteUser
             * @property {string|null} [roomID] MuteUser roomID
             * @property {string|null} [userID] MuteUser userID
             * @property {number|null} [seconds] MuteUser seconds
             */

            /**
             * Constructs a new MuteUser.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a MuteUser.
             * @implements IMuteUser
             * @constructor
             * @param {chat.RoomActionRequest.IMuteUser=} [properties] Properties to set
             */
            function MuteUser(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * MuteUser roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.MuteUser
             * @instance
             */
            MuteUser.prototype.roomID = "";

            /**
             * MuteUser userID.
             * @member {string} userID
             * @memberof chat.RoomActionRequest.MuteUser
             * @instance
             */
            MuteUser.prototype.userID = "";

            /**
             * MuteUser seconds.
             * @member {number} seconds
             * @memberof chat.RoomActionRequest.MuteUser
             * @instance
             */
            MuteUser.prototype.seconds = 0;

            /**
             * Creates a new MuteUser instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.MuteUser
             * @static
             * @param {chat.RoomActionRequest.IMuteUser=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.MuteUser} MuteUser instance
             */
            MuteUser.create = function create(properties) {
                return new MuteUser(properties);
            };

            /**
             * Encodes the specified MuteUser message. Does not implicitly {@link chat.RoomActionRequest.MuteUser.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.MuteUser
             * @static
             * @param {chat.RoomActionRequest.IMuteUser} message MuteUser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MuteUser.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.userID);
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.seconds);
                return writer;
            };

            /**
             * Encodes the specified MuteUser message, length delimited. Does not implicitly {@link chat.RoomActionRequest.MuteUser.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.MuteUser
             * @static
             * @param {chat.RoomActionRequest.IMuteUser} message MuteUser message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            MuteUser.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a MuteUser message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.MuteUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.MuteUser} MuteUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MuteUser.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.MuteUser();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.userID = reader.string();
                        break;
                    case 3:
                        message.seconds = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a MuteUser message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.MuteUser
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.MuteUser} MuteUser
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            MuteUser.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a MuteUser message.
             * @function verify
             * @memberof chat.RoomActionRequest.MuteUser
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            MuteUser.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.userID != null && message.hasOwnProperty("userID"))
                    if (!$util.isString(message.userID))
                        return "userID: string expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds))
                        return "seconds: integer expected";
                return null;
            };

            /**
             * Creates a MuteUser message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.MuteUser
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.MuteUser} MuteUser
             */
            MuteUser.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.MuteUser)
                    return object;
                let message = new $root.chat.RoomActionRequest.MuteUser();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.userID != null)
                    message.userID = String(object.userID);
                if (object.seconds != null)
                    message.seconds = object.seconds | 0;
                return message;
            };

            /**
             * Creates a plain object from a MuteUser message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.MuteUser
             * @static
             * @param {chat.RoomActionRequest.MuteUser} message MuteUser
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            MuteUser.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.userID = "";
                    object.seconds = 0;
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.userID != null && message.hasOwnProperty("userID"))
                    object.userID = message.userID;
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    object.seconds = message.seconds;
                return object;
            };

            /**
             * Converts this MuteUser to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.MuteUser
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            MuteUser.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return MuteUser;
        })();

        RoomActionRequest.TransferOwnership = (function() {

            /**
             * Properties of a TransferOwnership.
             * @memberof chat.RoomActionRequest
             * @interface ITransferOwnership
             * @property {string|null} [roomID] TransferOwnership roomID
             * @property {string|null} [newOwnerID] TransferOwnership newOwnerID
             */

            /**
             * Constructs a new TransferOwnership.
             * @memberof chat.RoomActionRequest
             * @classdesc Represents a TransferOwnership.
             * @implements ITransferOwnership
             * @constructor
             * @param {chat.RoomActionRequest.ITransferOwnership=} [properties] Properties to set
             */
            function TransferOwnership(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TransferOwnership roomID.
             * @member {string} roomID
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @instance
             */
            TransferOwnership.prototype.roomID = "";

            /**
             * TransferOwnership newOwnerID.
             * @member {string} newOwnerID
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @instance
             */
            TransferOwnership.prototype.newOwnerID = "";

            /**
             * Creates a new TransferOwnership instance using the specified properties.
             * @function create
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @static
             * @param {chat.RoomActionRequest.ITransferOwnership=} [properties] Properties to set
             * @returns {chat.RoomActionRequest.TransferOwnership} TransferOwnership instance
             */
            TransferOwnership.create = function create(properties) {
                return new TransferOwnership(properties);
            };

            /**
             * Encodes the specified TransferOwnership message. Does not implicitly {@link chat.RoomActionRequest.TransferOwnership.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @static
             * @param {chat.RoomActionRequest.ITransferOwnership} message TransferOwnership message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransferOwnership.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
                if (message.newOwnerID != null && Object.hasOwnProperty.call(message, "newOwnerID"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.newOwnerID);
                return writer;
            };

            /**
             * Encodes the specified TransferOwnership message, length delimited. Does not implicitly {@link chat.RoomActionRequest.TransferOwnership.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @static
             * @param {chat.RoomActionRequest.ITransferOwnership} message TransferOwnership message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TransferOwnership.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a TransferOwnership message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomActionRequest.TransferOwnership} TransferOwnership
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransferOwnership.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionRequest.TransferOwnership();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.roomID = reader.string();
                        break;
                    case 2:
                        message.newOwnerID = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a TransferOwnership message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomActionRequest.TransferOwnership} TransferOwnership
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TransferOwnership.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TransferOwnership message.
             * @function verify
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TransferOwnership.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    if (!$util.isString(message.roomID))
                        return "roomID: string expected";
                if (message.newOwnerID != null && message.hasOwnProperty("newOwnerID"))
                    if (!$util.isString(message.newOwnerID))
                        return "newOwnerID: string expected";
                return null;
            };

            /**
             * Creates a TransferOwnership message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomActionRequest.TransferOwnership} TransferOwnership
             */
            TransferOwnership.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomActionRequest.TransferOwnership)
                    return object;
                let message = new $root.chat.RoomActionRequest.TransferOwnership();
                if (object.roomID != null)
                    message.roomID = String(object.roomID);
                if (object.newOwnerID != null)
                    message.newOwnerID = String(object.newOwnerID);
                return message;
            };

            /**
             * Creates a plain object from a TransferOwnership message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @static
             * @param {chat.RoomActionRequest.TransferOwnership} message TransferOwnership
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TransferOwnership.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.roomID = "";
                    object.newOwnerID = "";
                }
                if (message.roomID != null && message.hasOwnProperty("roomID"))
                    object.roomID = message.roomID;
                if (message.newOwnerID != null && message.hasOwnProperty("newOwnerID"))
                    object.newOwnerID = message.newOwnerID;
                return object;
            };

            /**
             * Converts this TransferOwnership to JSON.
             * @function toJSON
             * @memberof chat.RoomActionRequest.TransferOwnership
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TransferOwnership.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return TransferOwnership;
        })();

        return RoomActionRequest;
    })();

    chat.RoomActionResponse = (function() {

        /**
         * Properties of a RoomActionResponse.
         * @memberof chat
         * @interface IRoomActionResponse
         * @property {chat.RoomActionResponse.ActionResponseType|null} [action] RoomActionResponse action
         * @property {boolean|null} [success] RoomActionResponse success
         * @property {string|null} [message] RoomActionResponse message
         */

        /**
         * Constructs a new RoomActionResponse.
         * @memberof chat
         * @classdesc Represents a RoomActionResponse.
         * @implements IRoomActionResponse
         * @constructor
         * @param {chat.IRoomActionResponse=} [properties] Properties to set
         */
        function RoomActionResponse(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomActionResponse action.
         * @member {chat.RoomActionResponse.ActionResponseType} action
         * @memberof chat.RoomActionResponse
         * @instance
         */
        RoomActionResponse.prototype.action = 0;

        /**
         * RoomActionResponse success.
         * @member {boolean} success
         * @memberof chat.RoomActionResponse
         * @instance
         */
        RoomActionResponse.prototype.success = false;

        /**
         * RoomActionResponse message.
         * @member {string} message
         * @memberof chat.RoomActionResponse
         * @instance
         */
        RoomActionResponse.prototype.message = "";

        /**
         * Creates a new RoomActionResponse instance using the specified properties.
         * @function create
         * @memberof chat.RoomActionResponse
         * @static
         * @param {chat.IRoomActionResponse=} [properties] Properties to set
         * @returns {chat.RoomActionResponse} RoomActionResponse instance
         */
        RoomActionResponse.create = function create(properties) {
            return new RoomActionResponse(properties);
        };

        /**
         * Encodes the specified RoomActionResponse message. Does not implicitly {@link chat.RoomActionResponse.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomActionResponse
         * @static
         * @param {chat.IRoomActionResponse} message RoomActionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomActionResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.action != null && Object.hasOwnProperty.call(message, "action"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
            if (message.success != null && Object.hasOwnProperty.call(message, "success"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.success);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified RoomActionResponse message, length delimited. Does not implicitly {@link chat.RoomActionResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomActionResponse
         * @static
         * @param {chat.IRoomActionResponse} message RoomActionResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomActionResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomActionResponse message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomActionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomActionResponse} RoomActionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomActionResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomActionResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.action = reader.int32();
                    break;
                case 2:
                    message.success = reader.bool();
                    break;
                case 3:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomActionResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomActionResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomActionResponse} RoomActionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomActionResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomActionResponse message.
         * @function verify
         * @memberof chat.RoomActionResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomActionResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.action != null && message.hasOwnProperty("action"))
                switch (message.action) {
                default:
                    return "action: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                    break;
                }
            if (message.success != null && message.hasOwnProperty("success"))
                if (typeof message.success !== "boolean")
                    return "success: boolean expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a RoomActionResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomActionResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomActionResponse} RoomActionResponse
         */
        RoomActionResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomActionResponse)
                return object;
            let message = new $root.chat.RoomActionResponse();
            switch (object.action) {
            case "CREATE":
            case 0:
                message.action = 0;
                break;
            case "DELETE":
            case 1:
                message.action = 1;
                break;
            case "RENAME":
            case 2:
                message.action = 2;
                break;
            case "JOIN":
            case 3:
                message.action = 3;
                break;
            case "LEAVE":
            case 4:
                message.action = 4;
                break;
            case "CREATEROLE":
            case 5:
                message.action = 5;
                break;
            case "UPDATEROLE":
            case 6:
                message.action = 6;
                break;
            case "DELETEROLE":
            case 7:
                message.action = 7;
                break;
            case "ASSIGNROLE":
            case 8:
                message.action = 8;
                break;
            case "INVITE":
            case 9:
                message.action = 9;
                break;
            case "KICKUSER":
            case 10:
                message.action = 10;
                break;
            case "BANUSER":
            case 11:
                message.action = 11;
                break;
            case "MUTEUSER":
            case 12:
                message.action = 12;
                break;
            case "TRANSFEROWNERSHIP":
            case 13:
                message.action = 13;
                break;
            }
            if (object.success != null)
                message.success = Boolean(object.success);
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a RoomActionResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomActionResponse
         * @static
         * @param {chat.RoomActionResponse} message RoomActionResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomActionResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.action = options.enums === String ? "CREATE" : 0;
                object.success = false;
                object.message = "";
            }
            if (message.action != null && message.hasOwnProperty("action"))
                object.action = options.enums === String ? $root.chat.RoomActionResponse.ActionResponseType[message.action] : message.action;
            if (message.success != null && message.hasOwnProperty("success"))
                object.success = message.success;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this RoomActionResponse to JSON.
         * @function toJSON
         * @memberof chat.RoomActionResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomActionResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * ActionResponseType enum.
         * @name chat.RoomActionResponse.ActionResponseType
         * @enum {number}
         * @property {number} CREATE=0 CREATE value
         * @property {number} DELETE=1 DELETE value
         * @property {number} RENAME=2 RENAME value
         * @property {number} JOIN=3 JOIN value
         * @property {number} LEAVE=4 LEAVE value
         * @property {number} CREATEROLE=5 CREATEROLE value
         * @property {number} UPDATEROLE=6 UPDATEROLE value
         * @property {number} DELETEROLE=7 DELETEROLE value
         * @property {number} ASSIGNROLE=8 ASSIGNROLE value
         * @property {number} INVITE=9 INVITE value
         * @property {number} KICKUSER=10 KICKUSER value
         * @property {number} BANUSER=11 BANUSER value
         * @property {number} MUTEUSER=12 MUTEUSER value
         * @property {number} TRANSFEROWNERSHIP=13 TRANSFEROWNERSHIP value
         */
        RoomActionResponse.ActionResponseType = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CREATE"] = 0;
            values[valuesById[1] = "DELETE"] = 1;
            values[valuesById[2] = "RENAME"] = 2;
            values[valuesById[3] = "JOIN"] = 3;
            values[valuesById[4] = "LEAVE"] = 4;
            values[valuesById[5] = "CREATEROLE"] = 5;
            values[valuesById[6] = "UPDATEROLE"] = 6;
            values[valuesById[7] = "DELETEROLE"] = 7;
            values[valuesById[8] = "ASSIGNROLE"] = 8;
            values[valuesById[9] = "INVITE"] = 9;
            values[valuesById[10] = "KICKUSER"] = 10;
            values[valuesById[11] = "BANUSER"] = 11;
            values[valuesById[12] = "MUTEUSER"] = 12;
            values[valuesById[13] = "TRANSFEROWNERSHIP"] = 13;
            return values;
        })();

        return RoomActionResponse;
    })();

    chat.RoomInfo = (function() {

        /**
         * Properties of a RoomInfo.
         * @memberof chat
         * @interface IRoomInfo
         * @property {string|null} [roomID] RoomInfo roomID
         * @property {string|null} [name] RoomInfo name
         * @property {chat.RoomInfo.RoomCategory|null} [category] RoomInfo category
         * @property {Array.<chat.RoomInfo.IRoomRole>|null} [roles] RoomInfo roles
         */

        /**
         * Constructs a new RoomInfo.
         * @memberof chat
         * @classdesc Represents a RoomInfo.
         * @implements IRoomInfo
         * @constructor
         * @param {chat.IRoomInfo=} [properties] Properties to set
         */
        function RoomInfo(properties) {
            this.roles = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomInfo roomID.
         * @member {string} roomID
         * @memberof chat.RoomInfo
         * @instance
         */
        RoomInfo.prototype.roomID = "";

        /**
         * RoomInfo name.
         * @member {string} name
         * @memberof chat.RoomInfo
         * @instance
         */
        RoomInfo.prototype.name = "";

        /**
         * RoomInfo category.
         * @member {chat.RoomInfo.RoomCategory} category
         * @memberof chat.RoomInfo
         * @instance
         */
        RoomInfo.prototype.category = 0;

        /**
         * RoomInfo roles.
         * @member {Array.<chat.RoomInfo.IRoomRole>} roles
         * @memberof chat.RoomInfo
         * @instance
         */
        RoomInfo.prototype.roles = $util.emptyArray;

        /**
         * Creates a new RoomInfo instance using the specified properties.
         * @function create
         * @memberof chat.RoomInfo
         * @static
         * @param {chat.IRoomInfo=} [properties] Properties to set
         * @returns {chat.RoomInfo} RoomInfo instance
         */
        RoomInfo.create = function create(properties) {
            return new RoomInfo(properties);
        };

        /**
         * Encodes the specified RoomInfo message. Does not implicitly {@link chat.RoomInfo.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomInfo
         * @static
         * @param {chat.IRoomInfo} message RoomInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.category != null && Object.hasOwnProperty.call(message, "category"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.category);
            if (message.roles != null && message.roles.length)
                for (let i = 0; i < message.roles.length; ++i)
                    $root.chat.RoomInfo.RoomRole.encode(message.roles[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RoomInfo message, length delimited. Does not implicitly {@link chat.RoomInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomInfo
         * @static
         * @param {chat.IRoomInfo} message RoomInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomInfo message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomInfo} RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.category = reader.int32();
                    break;
                case 4:
                    if (!(message.roles && message.roles.length))
                        message.roles = [];
                    message.roles.push($root.chat.RoomInfo.RoomRole.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomInfo} RoomInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomInfo message.
         * @function verify
         * @memberof chat.RoomInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.category != null && message.hasOwnProperty("category"))
                switch (message.category) {
                default:
                    return "category: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.roles != null && message.hasOwnProperty("roles")) {
                if (!Array.isArray(message.roles))
                    return "roles: array expected";
                for (let i = 0; i < message.roles.length; ++i) {
                    let error = $root.chat.RoomInfo.RoomRole.verify(message.roles[i]);
                    if (error)
                        return "roles." + error;
                }
            }
            return null;
        };

        /**
         * Creates a RoomInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomInfo} RoomInfo
         */
        RoomInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomInfo)
                return object;
            let message = new $root.chat.RoomInfo();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.name != null)
                message.name = String(object.name);
            switch (object.category) {
            case "GENERAL":
            case 0:
                message.category = 0;
                break;
            case "WARBAND":
            case 1:
                message.category = 1;
                break;
            case "ORDER":
            case 2:
                message.category = 2;
                break;
            case "CAMPAIGN":
            case 3:
                message.category = 3;
                break;
            case "CUSTOM":
            case 4:
                message.category = 4;
                break;
            }
            if (object.roles) {
                if (!Array.isArray(object.roles))
                    throw TypeError(".chat.RoomInfo.roles: array expected");
                message.roles = [];
                for (let i = 0; i < object.roles.length; ++i) {
                    if (typeof object.roles[i] !== "object")
                        throw TypeError(".chat.RoomInfo.roles: object expected");
                    message.roles[i] = $root.chat.RoomInfo.RoomRole.fromObject(object.roles[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a RoomInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomInfo
         * @static
         * @param {chat.RoomInfo} message RoomInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.roles = [];
            if (options.defaults) {
                object.roomID = "";
                object.name = "";
                object.category = options.enums === String ? "GENERAL" : 0;
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.category != null && message.hasOwnProperty("category"))
                object.category = options.enums === String ? $root.chat.RoomInfo.RoomCategory[message.category] : message.category;
            if (message.roles && message.roles.length) {
                object.roles = [];
                for (let j = 0; j < message.roles.length; ++j)
                    object.roles[j] = $root.chat.RoomInfo.RoomRole.toObject(message.roles[j], options);
            }
            return object;
        };

        /**
         * Converts this RoomInfo to JSON.
         * @function toJSON
         * @memberof chat.RoomInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * RoomCategory enum.
         * @name chat.RoomInfo.RoomCategory
         * @enum {number}
         * @property {number} GENERAL=0 GENERAL value
         * @property {number} WARBAND=1 WARBAND value
         * @property {number} ORDER=2 ORDER value
         * @property {number} CAMPAIGN=3 CAMPAIGN value
         * @property {number} CUSTOM=4 CUSTOM value
         */
        RoomInfo.RoomCategory = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "GENERAL"] = 0;
            values[valuesById[1] = "WARBAND"] = 1;
            values[valuesById[2] = "ORDER"] = 2;
            values[valuesById[3] = "CAMPAIGN"] = 3;
            values[valuesById[4] = "CUSTOM"] = 4;
            return values;
        })();

        RoomInfo.RoomRole = (function() {

            /**
             * Properties of a RoomRole.
             * @memberof chat.RoomInfo
             * @interface IRoomRole
             * @property {string|null} [name] RoomRole name
             * @property {number|null} [permissions] RoomRole permissions
             */

            /**
             * Constructs a new RoomRole.
             * @memberof chat.RoomInfo
             * @classdesc Represents a RoomRole.
             * @implements IRoomRole
             * @constructor
             * @param {chat.RoomInfo.IRoomRole=} [properties] Properties to set
             */
            function RoomRole(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RoomRole name.
             * @member {string} name
             * @memberof chat.RoomInfo.RoomRole
             * @instance
             */
            RoomRole.prototype.name = "";

            /**
             * RoomRole permissions.
             * @member {number} permissions
             * @memberof chat.RoomInfo.RoomRole
             * @instance
             */
            RoomRole.prototype.permissions = 0;

            /**
             * Creates a new RoomRole instance using the specified properties.
             * @function create
             * @memberof chat.RoomInfo.RoomRole
             * @static
             * @param {chat.RoomInfo.IRoomRole=} [properties] Properties to set
             * @returns {chat.RoomInfo.RoomRole} RoomRole instance
             */
            RoomRole.create = function create(properties) {
                return new RoomRole(properties);
            };

            /**
             * Encodes the specified RoomRole message. Does not implicitly {@link chat.RoomInfo.RoomRole.verify|verify} messages.
             * @function encode
             * @memberof chat.RoomInfo.RoomRole
             * @static
             * @param {chat.RoomInfo.IRoomRole} message RoomRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RoomRole.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                if (message.permissions != null && Object.hasOwnProperty.call(message, "permissions"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.permissions);
                return writer;
            };

            /**
             * Encodes the specified RoomRole message, length delimited. Does not implicitly {@link chat.RoomInfo.RoomRole.verify|verify} messages.
             * @function encodeDelimited
             * @memberof chat.RoomInfo.RoomRole
             * @static
             * @param {chat.RoomInfo.IRoomRole} message RoomRole message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RoomRole.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RoomRole message from the specified reader or buffer.
             * @function decode
             * @memberof chat.RoomInfo.RoomRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {chat.RoomInfo.RoomRole} RoomRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RoomRole.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomInfo.RoomRole();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 2:
                        message.name = reader.string();
                        break;
                    case 3:
                        message.permissions = reader.uint32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a RoomRole message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof chat.RoomInfo.RoomRole
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {chat.RoomInfo.RoomRole} RoomRole
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RoomRole.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RoomRole message.
             * @function verify
             * @memberof chat.RoomInfo.RoomRole
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RoomRole.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                if (message.permissions != null && message.hasOwnProperty("permissions"))
                    if (!$util.isInteger(message.permissions))
                        return "permissions: integer expected";
                return null;
            };

            /**
             * Creates a RoomRole message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof chat.RoomInfo.RoomRole
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {chat.RoomInfo.RoomRole} RoomRole
             */
            RoomRole.fromObject = function fromObject(object) {
                if (object instanceof $root.chat.RoomInfo.RoomRole)
                    return object;
                let message = new $root.chat.RoomInfo.RoomRole();
                if (object.name != null)
                    message.name = String(object.name);
                if (object.permissions != null)
                    message.permissions = object.permissions >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a RoomRole message. Also converts values to other types if specified.
             * @function toObject
             * @memberof chat.RoomInfo.RoomRole
             * @static
             * @param {chat.RoomInfo.RoomRole} message RoomRole
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RoomRole.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.name = "";
                    object.permissions = 0;
                }
                if (message.name != null && message.hasOwnProperty("name"))
                    object.name = message.name;
                if (message.permissions != null && message.hasOwnProperty("permissions"))
                    object.permissions = message.permissions;
                return object;
            };

            /**
             * Converts this RoomRole to JSON.
             * @function toJSON
             * @memberof chat.RoomInfo.RoomRole
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RoomRole.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return RoomRole;
        })();

        return RoomInfo;
    })();

    chat.RoomDirectory = (function() {

        /**
         * Properties of a RoomDirectory.
         * @memberof chat
         * @interface IRoomDirectory
         * @property {Array.<chat.IRoomInfo>|null} [rooms] RoomDirectory rooms
         */

        /**
         * Constructs a new RoomDirectory.
         * @memberof chat
         * @classdesc Represents a RoomDirectory.
         * @implements IRoomDirectory
         * @constructor
         * @param {chat.IRoomDirectory=} [properties] Properties to set
         */
        function RoomDirectory(properties) {
            this.rooms = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomDirectory rooms.
         * @member {Array.<chat.IRoomInfo>} rooms
         * @memberof chat.RoomDirectory
         * @instance
         */
        RoomDirectory.prototype.rooms = $util.emptyArray;

        /**
         * Creates a new RoomDirectory instance using the specified properties.
         * @function create
         * @memberof chat.RoomDirectory
         * @static
         * @param {chat.IRoomDirectory=} [properties] Properties to set
         * @returns {chat.RoomDirectory} RoomDirectory instance
         */
        RoomDirectory.create = function create(properties) {
            return new RoomDirectory(properties);
        };

        /**
         * Encodes the specified RoomDirectory message. Does not implicitly {@link chat.RoomDirectory.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomDirectory
         * @static
         * @param {chat.IRoomDirectory} message RoomDirectory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomDirectory.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.rooms != null && message.rooms.length)
                for (let i = 0; i < message.rooms.length; ++i)
                    $root.chat.RoomInfo.encode(message.rooms[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RoomDirectory message, length delimited. Does not implicitly {@link chat.RoomDirectory.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomDirectory
         * @static
         * @param {chat.IRoomDirectory} message RoomDirectory message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomDirectory.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomDirectory message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomDirectory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomDirectory} RoomDirectory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomDirectory.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomDirectory();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.rooms && message.rooms.length))
                        message.rooms = [];
                    message.rooms.push($root.chat.RoomInfo.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomDirectory message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomDirectory
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomDirectory} RoomDirectory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomDirectory.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomDirectory message.
         * @function verify
         * @memberof chat.RoomDirectory
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomDirectory.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.rooms != null && message.hasOwnProperty("rooms")) {
                if (!Array.isArray(message.rooms))
                    return "rooms: array expected";
                for (let i = 0; i < message.rooms.length; ++i) {
                    let error = $root.chat.RoomInfo.verify(message.rooms[i]);
                    if (error)
                        return "rooms." + error;
                }
            }
            return null;
        };

        /**
         * Creates a RoomDirectory message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomDirectory
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomDirectory} RoomDirectory
         */
        RoomDirectory.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomDirectory)
                return object;
            let message = new $root.chat.RoomDirectory();
            if (object.rooms) {
                if (!Array.isArray(object.rooms))
                    throw TypeError(".chat.RoomDirectory.rooms: array expected");
                message.rooms = [];
                for (let i = 0; i < object.rooms.length; ++i) {
                    if (typeof object.rooms[i] !== "object")
                        throw TypeError(".chat.RoomDirectory.rooms: object expected");
                    message.rooms[i] = $root.chat.RoomInfo.fromObject(object.rooms[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a RoomDirectory message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomDirectory
         * @static
         * @param {chat.RoomDirectory} message RoomDirectory
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomDirectory.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.rooms = [];
            if (message.rooms && message.rooms.length) {
                object.rooms = [];
                for (let j = 0; j < message.rooms.length; ++j)
                    object.rooms[j] = $root.chat.RoomInfo.toObject(message.rooms[j], options);
            }
            return object;
        };

        /**
         * Converts this RoomDirectory to JSON.
         * @function toJSON
         * @memberof chat.RoomDirectory
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomDirectory.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomDirectory;
    })();

    chat.RoomJoined = (function() {

        /**
         * Properties of a RoomJoined.
         * @memberof chat
         * @interface IRoomJoined
         * @property {string|null} [roomID] RoomJoined roomID
         * @property {string|null} [userID] RoomJoined userID
         * @property {string|null} [name] RoomJoined name
         * @property {string|null} [role] RoomJoined role
         */

        /**
         * Constructs a new RoomJoined.
         * @memberof chat
         * @classdesc Represents a RoomJoined.
         * @implements IRoomJoined
         * @constructor
         * @param {chat.IRoomJoined=} [properties] Properties to set
         */
        function RoomJoined(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomJoined roomID.
         * @member {string} roomID
         * @memberof chat.RoomJoined
         * @instance
         */
        RoomJoined.prototype.roomID = "";

        /**
         * RoomJoined userID.
         * @member {string} userID
         * @memberof chat.RoomJoined
         * @instance
         */
        RoomJoined.prototype.userID = "";

        /**
         * RoomJoined name.
         * @member {string} name
         * @memberof chat.RoomJoined
         * @instance
         */
        RoomJoined.prototype.name = "";

        /**
         * RoomJoined role.
         * @member {string} role
         * @memberof chat.RoomJoined
         * @instance
         */
        RoomJoined.prototype.role = "";

        /**
         * Creates a new RoomJoined instance using the specified properties.
         * @function create
         * @memberof chat.RoomJoined
         * @static
         * @param {chat.IRoomJoined=} [properties] Properties to set
         * @returns {chat.RoomJoined} RoomJoined instance
         */
        RoomJoined.create = function create(properties) {
            return new RoomJoined(properties);
        };

        /**
         * Encodes the specified RoomJoined message. Does not implicitly {@link chat.RoomJoined.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomJoined
         * @static
         * @param {chat.IRoomJoined} message RoomJoined message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomJoined.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.userID);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            if (message.role != null && Object.hasOwnProperty.call(message, "role"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.role);
            return writer;
        };

        /**
         * Encodes the specified RoomJoined message, length delimited. Does not implicitly {@link chat.RoomJoined.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomJoined
         * @static
         * @param {chat.IRoomJoined} message RoomJoined message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomJoined.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomJoined message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomJoined
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomJoined} RoomJoined
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomJoined.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomJoined();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.userID = reader.string();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                case 4:
                    message.role = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomJoined message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomJoined
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomJoined} RoomJoined
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomJoined.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomJoined message.
         * @function verify
         * @memberof chat.RoomJoined
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomJoined.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.userID != null && message.hasOwnProperty("userID"))
                if (!$util.isString(message.userID))
                    return "userID: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.role != null && message.hasOwnProperty("role"))
                if (!$util.isString(message.role))
                    return "role: string expected";
            return null;
        };

        /**
         * Creates a RoomJoined message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomJoined
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomJoined} RoomJoined
         */
        RoomJoined.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomJoined)
                return object;
            let message = new $root.chat.RoomJoined();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.userID != null)
                message.userID = String(object.userID);
            if (object.name != null)
                message.name = String(object.name);
            if (object.role != null)
                message.role = String(object.role);
            return message;
        };

        /**
         * Creates a plain object from a RoomJoined message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomJoined
         * @static
         * @param {chat.RoomJoined} message RoomJoined
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomJoined.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.userID = "";
                object.name = "";
                object.role = "";
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.userID != null && message.hasOwnProperty("userID"))
                object.userID = message.userID;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.role != null && message.hasOwnProperty("role"))
                object.role = message.role;
            return object;
        };

        /**
         * Converts this RoomJoined to JSON.
         * @function toJSON
         * @memberof chat.RoomJoined
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomJoined.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomJoined;
    })();

    chat.RoomLeft = (function() {

        /**
         * Properties of a RoomLeft.
         * @memberof chat
         * @interface IRoomLeft
         * @property {string|null} [roomID] RoomLeft roomID
         * @property {string|null} [userID] RoomLeft userID
         * @property {string|null} [name] RoomLeft name
         */

        /**
         * Constructs a new RoomLeft.
         * @memberof chat
         * @classdesc Represents a RoomLeft.
         * @implements IRoomLeft
         * @constructor
         * @param {chat.IRoomLeft=} [properties] Properties to set
         */
        function RoomLeft(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomLeft roomID.
         * @member {string} roomID
         * @memberof chat.RoomLeft
         * @instance
         */
        RoomLeft.prototype.roomID = "";

        /**
         * RoomLeft userID.
         * @member {string} userID
         * @memberof chat.RoomLeft
         * @instance
         */
        RoomLeft.prototype.userID = "";

        /**
         * RoomLeft name.
         * @member {string} name
         * @memberof chat.RoomLeft
         * @instance
         */
        RoomLeft.prototype.name = "";

        /**
         * Creates a new RoomLeft instance using the specified properties.
         * @function create
         * @memberof chat.RoomLeft
         * @static
         * @param {chat.IRoomLeft=} [properties] Properties to set
         * @returns {chat.RoomLeft} RoomLeft instance
         */
        RoomLeft.create = function create(properties) {
            return new RoomLeft(properties);
        };

        /**
         * Encodes the specified RoomLeft message. Does not implicitly {@link chat.RoomLeft.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomLeft
         * @static
         * @param {chat.IRoomLeft} message RoomLeft message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomLeft.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.userID);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified RoomLeft message, length delimited. Does not implicitly {@link chat.RoomLeft.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomLeft
         * @static
         * @param {chat.IRoomLeft} message RoomLeft message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomLeft.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomLeft message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomLeft
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomLeft} RoomLeft
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomLeft.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomLeft();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.userID = reader.string();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomLeft message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomLeft
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomLeft} RoomLeft
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomLeft.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomLeft message.
         * @function verify
         * @memberof chat.RoomLeft
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomLeft.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.userID != null && message.hasOwnProperty("userID"))
                if (!$util.isString(message.userID))
                    return "userID: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a RoomLeft message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomLeft
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomLeft} RoomLeft
         */
        RoomLeft.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomLeft)
                return object;
            let message = new $root.chat.RoomLeft();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.userID != null)
                message.userID = String(object.userID);
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a RoomLeft message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomLeft
         * @static
         * @param {chat.RoomLeft} message RoomLeft
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomLeft.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.userID = "";
                object.name = "";
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.userID != null && message.hasOwnProperty("userID"))
                object.userID = message.userID;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this RoomLeft to JSON.
         * @function toJSON
         * @memberof chat.RoomLeft
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomLeft.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomLeft;
    })();

    chat.RoomRenamed = (function() {

        /**
         * Properties of a RoomRenamed.
         * @memberof chat
         * @interface IRoomRenamed
         * @property {string|null} [roomID] RoomRenamed roomID
         * @property {string|null} [name] RoomRenamed name
         */

        /**
         * Constructs a new RoomRenamed.
         * @memberof chat
         * @classdesc Represents a RoomRenamed.
         * @implements IRoomRenamed
         * @constructor
         * @param {chat.IRoomRenamed=} [properties] Properties to set
         */
        function RoomRenamed(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomRenamed roomID.
         * @member {string} roomID
         * @memberof chat.RoomRenamed
         * @instance
         */
        RoomRenamed.prototype.roomID = "";

        /**
         * RoomRenamed name.
         * @member {string} name
         * @memberof chat.RoomRenamed
         * @instance
         */
        RoomRenamed.prototype.name = "";

        /**
         * Creates a new RoomRenamed instance using the specified properties.
         * @function create
         * @memberof chat.RoomRenamed
         * @static
         * @param {chat.IRoomRenamed=} [properties] Properties to set
         * @returns {chat.RoomRenamed} RoomRenamed instance
         */
        RoomRenamed.create = function create(properties) {
            return new RoomRenamed(properties);
        };

        /**
         * Encodes the specified RoomRenamed message. Does not implicitly {@link chat.RoomRenamed.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomRenamed
         * @static
         * @param {chat.IRoomRenamed} message RoomRenamed message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRenamed.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified RoomRenamed message, length delimited. Does not implicitly {@link chat.RoomRenamed.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomRenamed
         * @static
         * @param {chat.IRoomRenamed} message RoomRenamed message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRenamed.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomRenamed message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomRenamed
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomRenamed} RoomRenamed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRenamed.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomRenamed();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomRenamed message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomRenamed
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomRenamed} RoomRenamed
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRenamed.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomRenamed message.
         * @function verify
         * @memberof chat.RoomRenamed
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomRenamed.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a RoomRenamed message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomRenamed
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomRenamed} RoomRenamed
         */
        RoomRenamed.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomRenamed)
                return object;
            let message = new $root.chat.RoomRenamed();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a RoomRenamed message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomRenamed
         * @static
         * @param {chat.RoomRenamed} message RoomRenamed
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomRenamed.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.name = "";
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this RoomRenamed to JSON.
         * @function toJSON
         * @memberof chat.RoomRenamed
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomRenamed.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomRenamed;
    })();

    chat.RoomRoleAdded = (function() {

        /**
         * Properties of a RoomRoleAdded.
         * @memberof chat
         * @interface IRoomRoleAdded
         * @property {string|null} [roomID] RoomRoleAdded roomID
         * @property {string|null} [name] RoomRoleAdded name
         * @property {number|null} [permissions] RoomRoleAdded permissions
         */

        /**
         * Constructs a new RoomRoleAdded.
         * @memberof chat
         * @classdesc Represents a RoomRoleAdded.
         * @implements IRoomRoleAdded
         * @constructor
         * @param {chat.IRoomRoleAdded=} [properties] Properties to set
         */
        function RoomRoleAdded(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomRoleAdded roomID.
         * @member {string} roomID
         * @memberof chat.RoomRoleAdded
         * @instance
         */
        RoomRoleAdded.prototype.roomID = "";

        /**
         * RoomRoleAdded name.
         * @member {string} name
         * @memberof chat.RoomRoleAdded
         * @instance
         */
        RoomRoleAdded.prototype.name = "";

        /**
         * RoomRoleAdded permissions.
         * @member {number} permissions
         * @memberof chat.RoomRoleAdded
         * @instance
         */
        RoomRoleAdded.prototype.permissions = 0;

        /**
         * Creates a new RoomRoleAdded instance using the specified properties.
         * @function create
         * @memberof chat.RoomRoleAdded
         * @static
         * @param {chat.IRoomRoleAdded=} [properties] Properties to set
         * @returns {chat.RoomRoleAdded} RoomRoleAdded instance
         */
        RoomRoleAdded.create = function create(properties) {
            return new RoomRoleAdded(properties);
        };

        /**
         * Encodes the specified RoomRoleAdded message. Does not implicitly {@link chat.RoomRoleAdded.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomRoleAdded
         * @static
         * @param {chat.IRoomRoleAdded} message RoomRoleAdded message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRoleAdded.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.permissions != null && Object.hasOwnProperty.call(message, "permissions"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.permissions);
            return writer;
        };

        /**
         * Encodes the specified RoomRoleAdded message, length delimited. Does not implicitly {@link chat.RoomRoleAdded.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomRoleAdded
         * @static
         * @param {chat.IRoomRoleAdded} message RoomRoleAdded message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRoleAdded.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomRoleAdded message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomRoleAdded
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomRoleAdded} RoomRoleAdded
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRoleAdded.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomRoleAdded();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.permissions = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomRoleAdded message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomRoleAdded
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomRoleAdded} RoomRoleAdded
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRoleAdded.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomRoleAdded message.
         * @function verify
         * @memberof chat.RoomRoleAdded
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomRoleAdded.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.permissions != null && message.hasOwnProperty("permissions"))
                if (!$util.isInteger(message.permissions))
                    return "permissions: integer expected";
            return null;
        };

        /**
         * Creates a RoomRoleAdded message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomRoleAdded
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomRoleAdded} RoomRoleAdded
         */
        RoomRoleAdded.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomRoleAdded)
                return object;
            let message = new $root.chat.RoomRoleAdded();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.name != null)
                message.name = String(object.name);
            if (object.permissions != null)
                message.permissions = object.permissions | 0;
            return message;
        };

        /**
         * Creates a plain object from a RoomRoleAdded message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomRoleAdded
         * @static
         * @param {chat.RoomRoleAdded} message RoomRoleAdded
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomRoleAdded.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.name = "";
                object.permissions = 0;
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.permissions != null && message.hasOwnProperty("permissions"))
                object.permissions = message.permissions;
            return object;
        };

        /**
         * Converts this RoomRoleAdded to JSON.
         * @function toJSON
         * @memberof chat.RoomRoleAdded
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomRoleAdded.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomRoleAdded;
    })();

    chat.RoomRoleUpdated = (function() {

        /**
         * Properties of a RoomRoleUpdated.
         * @memberof chat
         * @interface IRoomRoleUpdated
         * @property {string|null} [roomID] RoomRoleUpdated roomID
         * @property {string|null} [name] RoomRoleUpdated name
         * @property {number|null} [permissions] RoomRoleUpdated permissions
         */

        /**
         * Constructs a new RoomRoleUpdated.
         * @memberof chat
         * @classdesc Represents a RoomRoleUpdated.
         * @implements IRoomRoleUpdated
         * @constructor
         * @param {chat.IRoomRoleUpdated=} [properties] Properties to set
         */
        function RoomRoleUpdated(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomRoleUpdated roomID.
         * @member {string} roomID
         * @memberof chat.RoomRoleUpdated
         * @instance
         */
        RoomRoleUpdated.prototype.roomID = "";

        /**
         * RoomRoleUpdated name.
         * @member {string} name
         * @memberof chat.RoomRoleUpdated
         * @instance
         */
        RoomRoleUpdated.prototype.name = "";

        /**
         * RoomRoleUpdated permissions.
         * @member {number} permissions
         * @memberof chat.RoomRoleUpdated
         * @instance
         */
        RoomRoleUpdated.prototype.permissions = 0;

        /**
         * Creates a new RoomRoleUpdated instance using the specified properties.
         * @function create
         * @memberof chat.RoomRoleUpdated
         * @static
         * @param {chat.IRoomRoleUpdated=} [properties] Properties to set
         * @returns {chat.RoomRoleUpdated} RoomRoleUpdated instance
         */
        RoomRoleUpdated.create = function create(properties) {
            return new RoomRoleUpdated(properties);
        };

        /**
         * Encodes the specified RoomRoleUpdated message. Does not implicitly {@link chat.RoomRoleUpdated.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomRoleUpdated
         * @static
         * @param {chat.IRoomRoleUpdated} message RoomRoleUpdated message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRoleUpdated.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            if (message.permissions != null && Object.hasOwnProperty.call(message, "permissions"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.permissions);
            return writer;
        };

        /**
         * Encodes the specified RoomRoleUpdated message, length delimited. Does not implicitly {@link chat.RoomRoleUpdated.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomRoleUpdated
         * @static
         * @param {chat.IRoomRoleUpdated} message RoomRoleUpdated message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRoleUpdated.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomRoleUpdated message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomRoleUpdated
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomRoleUpdated} RoomRoleUpdated
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRoleUpdated.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomRoleUpdated();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                case 3:
                    message.permissions = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomRoleUpdated message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomRoleUpdated
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomRoleUpdated} RoomRoleUpdated
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRoleUpdated.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomRoleUpdated message.
         * @function verify
         * @memberof chat.RoomRoleUpdated
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomRoleUpdated.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.permissions != null && message.hasOwnProperty("permissions"))
                if (!$util.isInteger(message.permissions))
                    return "permissions: integer expected";
            return null;
        };

        /**
         * Creates a RoomRoleUpdated message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomRoleUpdated
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomRoleUpdated} RoomRoleUpdated
         */
        RoomRoleUpdated.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomRoleUpdated)
                return object;
            let message = new $root.chat.RoomRoleUpdated();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.name != null)
                message.name = String(object.name);
            if (object.permissions != null)
                message.permissions = object.permissions | 0;
            return message;
        };

        /**
         * Creates a plain object from a RoomRoleUpdated message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomRoleUpdated
         * @static
         * @param {chat.RoomRoleUpdated} message RoomRoleUpdated
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomRoleUpdated.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.name = "";
                object.permissions = 0;
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.permissions != null && message.hasOwnProperty("permissions"))
                object.permissions = message.permissions;
            return object;
        };

        /**
         * Converts this RoomRoleUpdated to JSON.
         * @function toJSON
         * @memberof chat.RoomRoleUpdated
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomRoleUpdated.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomRoleUpdated;
    })();

    chat.RoomRoleRemoved = (function() {

        /**
         * Properties of a RoomRoleRemoved.
         * @memberof chat
         * @interface IRoomRoleRemoved
         * @property {string|null} [roomID] RoomRoleRemoved roomID
         * @property {string|null} [name] RoomRoleRemoved name
         */

        /**
         * Constructs a new RoomRoleRemoved.
         * @memberof chat
         * @classdesc Represents a RoomRoleRemoved.
         * @implements IRoomRoleRemoved
         * @constructor
         * @param {chat.IRoomRoleRemoved=} [properties] Properties to set
         */
        function RoomRoleRemoved(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomRoleRemoved roomID.
         * @member {string} roomID
         * @memberof chat.RoomRoleRemoved
         * @instance
         */
        RoomRoleRemoved.prototype.roomID = "";

        /**
         * RoomRoleRemoved name.
         * @member {string} name
         * @memberof chat.RoomRoleRemoved
         * @instance
         */
        RoomRoleRemoved.prototype.name = "";

        /**
         * Creates a new RoomRoleRemoved instance using the specified properties.
         * @function create
         * @memberof chat.RoomRoleRemoved
         * @static
         * @param {chat.IRoomRoleRemoved=} [properties] Properties to set
         * @returns {chat.RoomRoleRemoved} RoomRoleRemoved instance
         */
        RoomRoleRemoved.create = function create(properties) {
            return new RoomRoleRemoved(properties);
        };

        /**
         * Encodes the specified RoomRoleRemoved message. Does not implicitly {@link chat.RoomRoleRemoved.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomRoleRemoved
         * @static
         * @param {chat.IRoomRoleRemoved} message RoomRoleRemoved message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRoleRemoved.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified RoomRoleRemoved message, length delimited. Does not implicitly {@link chat.RoomRoleRemoved.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomRoleRemoved
         * @static
         * @param {chat.IRoomRoleRemoved} message RoomRoleRemoved message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRoleRemoved.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomRoleRemoved message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomRoleRemoved
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomRoleRemoved} RoomRoleRemoved
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRoleRemoved.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomRoleRemoved();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomRoleRemoved message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomRoleRemoved
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomRoleRemoved} RoomRoleRemoved
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRoleRemoved.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomRoleRemoved message.
         * @function verify
         * @memberof chat.RoomRoleRemoved
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomRoleRemoved.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a RoomRoleRemoved message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomRoleRemoved
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomRoleRemoved} RoomRoleRemoved
         */
        RoomRoleRemoved.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomRoleRemoved)
                return object;
            let message = new $root.chat.RoomRoleRemoved();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a RoomRoleRemoved message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomRoleRemoved
         * @static
         * @param {chat.RoomRoleRemoved} message RoomRoleRemoved
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomRoleRemoved.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.name = "";
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this RoomRoleRemoved to JSON.
         * @function toJSON
         * @memberof chat.RoomRoleRemoved
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomRoleRemoved.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomRoleRemoved;
    })();

    chat.RoomRoleAssigned = (function() {

        /**
         * Properties of a RoomRoleAssigned.
         * @memberof chat
         * @interface IRoomRoleAssigned
         * @property {string|null} [roomID] RoomRoleAssigned roomID
         * @property {string|null} [roleName] RoomRoleAssigned roleName
         * @property {string|null} [userID] RoomRoleAssigned userID
         */

        /**
         * Constructs a new RoomRoleAssigned.
         * @memberof chat
         * @classdesc Represents a RoomRoleAssigned.
         * @implements IRoomRoleAssigned
         * @constructor
         * @param {chat.IRoomRoleAssigned=} [properties] Properties to set
         */
        function RoomRoleAssigned(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomRoleAssigned roomID.
         * @member {string} roomID
         * @memberof chat.RoomRoleAssigned
         * @instance
         */
        RoomRoleAssigned.prototype.roomID = "";

        /**
         * RoomRoleAssigned roleName.
         * @member {string} roleName
         * @memberof chat.RoomRoleAssigned
         * @instance
         */
        RoomRoleAssigned.prototype.roleName = "";

        /**
         * RoomRoleAssigned userID.
         * @member {string} userID
         * @memberof chat.RoomRoleAssigned
         * @instance
         */
        RoomRoleAssigned.prototype.userID = "";

        /**
         * Creates a new RoomRoleAssigned instance using the specified properties.
         * @function create
         * @memberof chat.RoomRoleAssigned
         * @static
         * @param {chat.IRoomRoleAssigned=} [properties] Properties to set
         * @returns {chat.RoomRoleAssigned} RoomRoleAssigned instance
         */
        RoomRoleAssigned.create = function create(properties) {
            return new RoomRoleAssigned(properties);
        };

        /**
         * Encodes the specified RoomRoleAssigned message. Does not implicitly {@link chat.RoomRoleAssigned.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomRoleAssigned
         * @static
         * @param {chat.IRoomRoleAssigned} message RoomRoleAssigned message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRoleAssigned.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.roleName != null && Object.hasOwnProperty.call(message, "roleName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.roleName);
            if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.userID);
            return writer;
        };

        /**
         * Encodes the specified RoomRoleAssigned message, length delimited. Does not implicitly {@link chat.RoomRoleAssigned.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomRoleAssigned
         * @static
         * @param {chat.IRoomRoleAssigned} message RoomRoleAssigned message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomRoleAssigned.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomRoleAssigned message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomRoleAssigned
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomRoleAssigned} RoomRoleAssigned
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRoleAssigned.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomRoleAssigned();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.roleName = reader.string();
                    break;
                case 3:
                    message.userID = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomRoleAssigned message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomRoleAssigned
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomRoleAssigned} RoomRoleAssigned
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomRoleAssigned.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomRoleAssigned message.
         * @function verify
         * @memberof chat.RoomRoleAssigned
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomRoleAssigned.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.roleName != null && message.hasOwnProperty("roleName"))
                if (!$util.isString(message.roleName))
                    return "roleName: string expected";
            if (message.userID != null && message.hasOwnProperty("userID"))
                if (!$util.isString(message.userID))
                    return "userID: string expected";
            return null;
        };

        /**
         * Creates a RoomRoleAssigned message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomRoleAssigned
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomRoleAssigned} RoomRoleAssigned
         */
        RoomRoleAssigned.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomRoleAssigned)
                return object;
            let message = new $root.chat.RoomRoleAssigned();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.roleName != null)
                message.roleName = String(object.roleName);
            if (object.userID != null)
                message.userID = String(object.userID);
            return message;
        };

        /**
         * Creates a plain object from a RoomRoleAssigned message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomRoleAssigned
         * @static
         * @param {chat.RoomRoleAssigned} message RoomRoleAssigned
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomRoleAssigned.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.roleName = "";
                object.userID = "";
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.roleName != null && message.hasOwnProperty("roleName"))
                object.roleName = message.roleName;
            if (message.userID != null && message.hasOwnProperty("userID"))
                object.userID = message.userID;
            return object;
        };

        /**
         * Converts this RoomRoleAssigned to JSON.
         * @function toJSON
         * @memberof chat.RoomRoleAssigned
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomRoleAssigned.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomRoleAssigned;
    })();

    chat.RoomInviteReceived = (function() {

        /**
         * Properties of a RoomInviteReceived.
         * @memberof chat
         * @interface IRoomInviteReceived
         * @property {string|null} [roomID] RoomInviteReceived roomID
         * @property {string|null} [roomName] RoomInviteReceived roomName
         */

        /**
         * Constructs a new RoomInviteReceived.
         * @memberof chat
         * @classdesc Represents a RoomInviteReceived.
         * @implements IRoomInviteReceived
         * @constructor
         * @param {chat.IRoomInviteReceived=} [properties] Properties to set
         */
        function RoomInviteReceived(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomInviteReceived roomID.
         * @member {string} roomID
         * @memberof chat.RoomInviteReceived
         * @instance
         */
        RoomInviteReceived.prototype.roomID = "";

        /**
         * RoomInviteReceived roomName.
         * @member {string} roomName
         * @memberof chat.RoomInviteReceived
         * @instance
         */
        RoomInviteReceived.prototype.roomName = "";

        /**
         * Creates a new RoomInviteReceived instance using the specified properties.
         * @function create
         * @memberof chat.RoomInviteReceived
         * @static
         * @param {chat.IRoomInviteReceived=} [properties] Properties to set
         * @returns {chat.RoomInviteReceived} RoomInviteReceived instance
         */
        RoomInviteReceived.create = function create(properties) {
            return new RoomInviteReceived(properties);
        };

        /**
         * Encodes the specified RoomInviteReceived message. Does not implicitly {@link chat.RoomInviteReceived.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomInviteReceived
         * @static
         * @param {chat.IRoomInviteReceived} message RoomInviteReceived message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomInviteReceived.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.roomName != null && Object.hasOwnProperty.call(message, "roomName"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.roomName);
            return writer;
        };

        /**
         * Encodes the specified RoomInviteReceived message, length delimited. Does not implicitly {@link chat.RoomInviteReceived.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomInviteReceived
         * @static
         * @param {chat.IRoomInviteReceived} message RoomInviteReceived message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomInviteReceived.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomInviteReceived message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomInviteReceived
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomInviteReceived} RoomInviteReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomInviteReceived.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomInviteReceived();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.roomName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomInviteReceived message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomInviteReceived
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomInviteReceived} RoomInviteReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomInviteReceived.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomInviteReceived message.
         * @function verify
         * @memberof chat.RoomInviteReceived
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomInviteReceived.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.roomName != null && message.hasOwnProperty("roomName"))
                if (!$util.isString(message.roomName))
                    return "roomName: string expected";
            return null;
        };

        /**
         * Creates a RoomInviteReceived message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomInviteReceived
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomInviteReceived} RoomInviteReceived
         */
        RoomInviteReceived.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomInviteReceived)
                return object;
            let message = new $root.chat.RoomInviteReceived();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.roomName != null)
                message.roomName = String(object.roomName);
            return message;
        };

        /**
         * Creates a plain object from a RoomInviteReceived message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomInviteReceived
         * @static
         * @param {chat.RoomInviteReceived} message RoomInviteReceived
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomInviteReceived.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.roomName = "";
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.roomName != null && message.hasOwnProperty("roomName"))
                object.roomName = message.roomName;
            return object;
        };

        /**
         * Converts this RoomInviteReceived to JSON.
         * @function toJSON
         * @memberof chat.RoomInviteReceived
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomInviteReceived.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomInviteReceived;
    })();

    chat.RoomKickReceived = (function() {

        /**
         * Properties of a RoomKickReceived.
         * @memberof chat
         * @interface IRoomKickReceived
         * @property {string|null} [roomID] RoomKickReceived roomID
         */

        /**
         * Constructs a new RoomKickReceived.
         * @memberof chat
         * @classdesc Represents a RoomKickReceived.
         * @implements IRoomKickReceived
         * @constructor
         * @param {chat.IRoomKickReceived=} [properties] Properties to set
         */
        function RoomKickReceived(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomKickReceived roomID.
         * @member {string} roomID
         * @memberof chat.RoomKickReceived
         * @instance
         */
        RoomKickReceived.prototype.roomID = "";

        /**
         * Creates a new RoomKickReceived instance using the specified properties.
         * @function create
         * @memberof chat.RoomKickReceived
         * @static
         * @param {chat.IRoomKickReceived=} [properties] Properties to set
         * @returns {chat.RoomKickReceived} RoomKickReceived instance
         */
        RoomKickReceived.create = function create(properties) {
            return new RoomKickReceived(properties);
        };

        /**
         * Encodes the specified RoomKickReceived message. Does not implicitly {@link chat.RoomKickReceived.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomKickReceived
         * @static
         * @param {chat.IRoomKickReceived} message RoomKickReceived message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomKickReceived.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            return writer;
        };

        /**
         * Encodes the specified RoomKickReceived message, length delimited. Does not implicitly {@link chat.RoomKickReceived.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomKickReceived
         * @static
         * @param {chat.IRoomKickReceived} message RoomKickReceived message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomKickReceived.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomKickReceived message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomKickReceived
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomKickReceived} RoomKickReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomKickReceived.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomKickReceived();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomKickReceived message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomKickReceived
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomKickReceived} RoomKickReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomKickReceived.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomKickReceived message.
         * @function verify
         * @memberof chat.RoomKickReceived
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomKickReceived.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            return null;
        };

        /**
         * Creates a RoomKickReceived message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomKickReceived
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomKickReceived} RoomKickReceived
         */
        RoomKickReceived.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomKickReceived)
                return object;
            let message = new $root.chat.RoomKickReceived();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            return message;
        };

        /**
         * Creates a plain object from a RoomKickReceived message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomKickReceived
         * @static
         * @param {chat.RoomKickReceived} message RoomKickReceived
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomKickReceived.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.roomID = "";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            return object;
        };

        /**
         * Converts this RoomKickReceived to JSON.
         * @function toJSON
         * @memberof chat.RoomKickReceived
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomKickReceived.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomKickReceived;
    })();

    chat.RoomMuteReceived = (function() {

        /**
         * Properties of a RoomMuteReceived.
         * @memberof chat
         * @interface IRoomMuteReceived
         * @property {string|null} [roomID] RoomMuteReceived roomID
         * @property {google.protobuf.ITimestamp|null} [expiration] RoomMuteReceived expiration
         */

        /**
         * Constructs a new RoomMuteReceived.
         * @memberof chat
         * @classdesc Represents a RoomMuteReceived.
         * @implements IRoomMuteReceived
         * @constructor
         * @param {chat.IRoomMuteReceived=} [properties] Properties to set
         */
        function RoomMuteReceived(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomMuteReceived roomID.
         * @member {string} roomID
         * @memberof chat.RoomMuteReceived
         * @instance
         */
        RoomMuteReceived.prototype.roomID = "";

        /**
         * RoomMuteReceived expiration.
         * @member {google.protobuf.ITimestamp|null|undefined} expiration
         * @memberof chat.RoomMuteReceived
         * @instance
         */
        RoomMuteReceived.prototype.expiration = null;

        /**
         * Creates a new RoomMuteReceived instance using the specified properties.
         * @function create
         * @memberof chat.RoomMuteReceived
         * @static
         * @param {chat.IRoomMuteReceived=} [properties] Properties to set
         * @returns {chat.RoomMuteReceived} RoomMuteReceived instance
         */
        RoomMuteReceived.create = function create(properties) {
            return new RoomMuteReceived(properties);
        };

        /**
         * Encodes the specified RoomMuteReceived message. Does not implicitly {@link chat.RoomMuteReceived.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomMuteReceived
         * @static
         * @param {chat.IRoomMuteReceived} message RoomMuteReceived message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomMuteReceived.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.expiration != null && Object.hasOwnProperty.call(message, "expiration"))
                $root.google.protobuf.Timestamp.encode(message.expiration, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RoomMuteReceived message, length delimited. Does not implicitly {@link chat.RoomMuteReceived.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomMuteReceived
         * @static
         * @param {chat.IRoomMuteReceived} message RoomMuteReceived message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomMuteReceived.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomMuteReceived message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomMuteReceived
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomMuteReceived} RoomMuteReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomMuteReceived.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomMuteReceived();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.expiration = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomMuteReceived message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomMuteReceived
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomMuteReceived} RoomMuteReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomMuteReceived.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomMuteReceived message.
         * @function verify
         * @memberof chat.RoomMuteReceived
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomMuteReceived.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.expiration != null && message.hasOwnProperty("expiration")) {
                let error = $root.google.protobuf.Timestamp.verify(message.expiration);
                if (error)
                    return "expiration." + error;
            }
            return null;
        };

        /**
         * Creates a RoomMuteReceived message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomMuteReceived
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomMuteReceived} RoomMuteReceived
         */
        RoomMuteReceived.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomMuteReceived)
                return object;
            let message = new $root.chat.RoomMuteReceived();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.expiration != null) {
                if (typeof object.expiration !== "object")
                    throw TypeError(".chat.RoomMuteReceived.expiration: object expected");
                message.expiration = $root.google.protobuf.Timestamp.fromObject(object.expiration);
            }
            return message;
        };

        /**
         * Creates a plain object from a RoomMuteReceived message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomMuteReceived
         * @static
         * @param {chat.RoomMuteReceived} message RoomMuteReceived
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomMuteReceived.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.expiration = null;
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.expiration != null && message.hasOwnProperty("expiration"))
                object.expiration = $root.google.protobuf.Timestamp.toObject(message.expiration, options);
            return object;
        };

        /**
         * Converts this RoomMuteReceived to JSON.
         * @function toJSON
         * @memberof chat.RoomMuteReceived
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomMuteReceived.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomMuteReceived;
    })();

    chat.RoomBanReceived = (function() {

        /**
         * Properties of a RoomBanReceived.
         * @memberof chat
         * @interface IRoomBanReceived
         * @property {string|null} [roomID] RoomBanReceived roomID
         * @property {google.protobuf.ITimestamp|null} [expiration] RoomBanReceived expiration
         */

        /**
         * Constructs a new RoomBanReceived.
         * @memberof chat
         * @classdesc Represents a RoomBanReceived.
         * @implements IRoomBanReceived
         * @constructor
         * @param {chat.IRoomBanReceived=} [properties] Properties to set
         */
        function RoomBanReceived(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomBanReceived roomID.
         * @member {string} roomID
         * @memberof chat.RoomBanReceived
         * @instance
         */
        RoomBanReceived.prototype.roomID = "";

        /**
         * RoomBanReceived expiration.
         * @member {google.protobuf.ITimestamp|null|undefined} expiration
         * @memberof chat.RoomBanReceived
         * @instance
         */
        RoomBanReceived.prototype.expiration = null;

        /**
         * Creates a new RoomBanReceived instance using the specified properties.
         * @function create
         * @memberof chat.RoomBanReceived
         * @static
         * @param {chat.IRoomBanReceived=} [properties] Properties to set
         * @returns {chat.RoomBanReceived} RoomBanReceived instance
         */
        RoomBanReceived.create = function create(properties) {
            return new RoomBanReceived(properties);
        };

        /**
         * Encodes the specified RoomBanReceived message. Does not implicitly {@link chat.RoomBanReceived.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomBanReceived
         * @static
         * @param {chat.IRoomBanReceived} message RoomBanReceived message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomBanReceived.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.expiration != null && Object.hasOwnProperty.call(message, "expiration"))
                $root.google.protobuf.Timestamp.encode(message.expiration, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RoomBanReceived message, length delimited. Does not implicitly {@link chat.RoomBanReceived.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomBanReceived
         * @static
         * @param {chat.IRoomBanReceived} message RoomBanReceived message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomBanReceived.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomBanReceived message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomBanReceived
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomBanReceived} RoomBanReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomBanReceived.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomBanReceived();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.expiration = $root.google.protobuf.Timestamp.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomBanReceived message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomBanReceived
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomBanReceived} RoomBanReceived
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomBanReceived.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomBanReceived message.
         * @function verify
         * @memberof chat.RoomBanReceived
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomBanReceived.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.expiration != null && message.hasOwnProperty("expiration")) {
                let error = $root.google.protobuf.Timestamp.verify(message.expiration);
                if (error)
                    return "expiration." + error;
            }
            return null;
        };

        /**
         * Creates a RoomBanReceived message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomBanReceived
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomBanReceived} RoomBanReceived
         */
        RoomBanReceived.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomBanReceived)
                return object;
            let message = new $root.chat.RoomBanReceived();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.expiration != null) {
                if (typeof object.expiration !== "object")
                    throw TypeError(".chat.RoomBanReceived.expiration: object expected");
                message.expiration = $root.google.protobuf.Timestamp.fromObject(object.expiration);
            }
            return message;
        };

        /**
         * Creates a plain object from a RoomBanReceived message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomBanReceived
         * @static
         * @param {chat.RoomBanReceived} message RoomBanReceived
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomBanReceived.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.expiration = null;
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.expiration != null && message.hasOwnProperty("expiration"))
                object.expiration = $root.google.protobuf.Timestamp.toObject(message.expiration, options);
            return object;
        };

        /**
         * Converts this RoomBanReceived to JSON.
         * @function toJSON
         * @memberof chat.RoomBanReceived
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomBanReceived.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomBanReceived;
    })();

    chat.RoomOwnerChanged = (function() {

        /**
         * Properties of a RoomOwnerChanged.
         * @memberof chat
         * @interface IRoomOwnerChanged
         * @property {string|null} [roomID] RoomOwnerChanged roomID
         * @property {string|null} [userID] RoomOwnerChanged userID
         */

        /**
         * Constructs a new RoomOwnerChanged.
         * @memberof chat
         * @classdesc Represents a RoomOwnerChanged.
         * @implements IRoomOwnerChanged
         * @constructor
         * @param {chat.IRoomOwnerChanged=} [properties] Properties to set
         */
        function RoomOwnerChanged(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoomOwnerChanged roomID.
         * @member {string} roomID
         * @memberof chat.RoomOwnerChanged
         * @instance
         */
        RoomOwnerChanged.prototype.roomID = "";

        /**
         * RoomOwnerChanged userID.
         * @member {string} userID
         * @memberof chat.RoomOwnerChanged
         * @instance
         */
        RoomOwnerChanged.prototype.userID = "";

        /**
         * Creates a new RoomOwnerChanged instance using the specified properties.
         * @function create
         * @memberof chat.RoomOwnerChanged
         * @static
         * @param {chat.IRoomOwnerChanged=} [properties] Properties to set
         * @returns {chat.RoomOwnerChanged} RoomOwnerChanged instance
         */
        RoomOwnerChanged.create = function create(properties) {
            return new RoomOwnerChanged(properties);
        };

        /**
         * Encodes the specified RoomOwnerChanged message. Does not implicitly {@link chat.RoomOwnerChanged.verify|verify} messages.
         * @function encode
         * @memberof chat.RoomOwnerChanged
         * @static
         * @param {chat.IRoomOwnerChanged} message RoomOwnerChanged message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomOwnerChanged.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomID != null && Object.hasOwnProperty.call(message, "roomID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.roomID);
            if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.userID);
            return writer;
        };

        /**
         * Encodes the specified RoomOwnerChanged message, length delimited. Does not implicitly {@link chat.RoomOwnerChanged.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.RoomOwnerChanged
         * @static
         * @param {chat.IRoomOwnerChanged} message RoomOwnerChanged message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoomOwnerChanged.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoomOwnerChanged message from the specified reader or buffer.
         * @function decode
         * @memberof chat.RoomOwnerChanged
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.RoomOwnerChanged} RoomOwnerChanged
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomOwnerChanged.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.RoomOwnerChanged();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.roomID = reader.string();
                    break;
                case 2:
                    message.userID = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoomOwnerChanged message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.RoomOwnerChanged
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.RoomOwnerChanged} RoomOwnerChanged
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoomOwnerChanged.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoomOwnerChanged message.
         * @function verify
         * @memberof chat.RoomOwnerChanged
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoomOwnerChanged.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                if (!$util.isString(message.roomID))
                    return "roomID: string expected";
            if (message.userID != null && message.hasOwnProperty("userID"))
                if (!$util.isString(message.userID))
                    return "userID: string expected";
            return null;
        };

        /**
         * Creates a RoomOwnerChanged message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.RoomOwnerChanged
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.RoomOwnerChanged} RoomOwnerChanged
         */
        RoomOwnerChanged.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.RoomOwnerChanged)
                return object;
            let message = new $root.chat.RoomOwnerChanged();
            if (object.roomID != null)
                message.roomID = String(object.roomID);
            if (object.userID != null)
                message.userID = String(object.userID);
            return message;
        };

        /**
         * Creates a plain object from a RoomOwnerChanged message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.RoomOwnerChanged
         * @static
         * @param {chat.RoomOwnerChanged} message RoomOwnerChanged
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoomOwnerChanged.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.roomID = "";
                object.userID = "";
            }
            if (message.roomID != null && message.hasOwnProperty("roomID"))
                object.roomID = message.roomID;
            if (message.userID != null && message.hasOwnProperty("userID"))
                object.userID = message.userID;
            return object;
        };

        /**
         * Converts this RoomOwnerChanged to JSON.
         * @function toJSON
         * @memberof chat.RoomOwnerChanged
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoomOwnerChanged.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RoomOwnerChanged;
    })();

    chat.ChatMessage = (function() {

        /**
         * Properties of a ChatMessage.
         * @memberof chat
         * @interface IChatMessage
         * @property {chat.ChatMessage.MessageTypes|null} [type] ChatMessage type
         * @property {string|null} [content] ChatMessage content
         * @property {chat.ChatMessage.SenderFlag|null} [senderFlag] ChatMessage senderFlag
         * @property {string|null} [senderID] ChatMessage senderID
         * @property {string|null} [senderName] ChatMessage senderName
         * @property {string|null} [targetID] ChatMessage targetID
         * @property {string|null} [targetName] ChatMessage targetName
         * @property {string|null} [senderAccountID] ChatMessage senderAccountID
         */

        /**
         * Constructs a new ChatMessage.
         * @memberof chat
         * @classdesc Represents a ChatMessage.
         * @implements IChatMessage
         * @constructor
         * @param {chat.IChatMessage=} [properties] Properties to set
         */
        function ChatMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatMessage type.
         * @member {chat.ChatMessage.MessageTypes} type
         * @memberof chat.ChatMessage
         * @instance
         */
        ChatMessage.prototype.type = 0;

        /**
         * ChatMessage content.
         * @member {string} content
         * @memberof chat.ChatMessage
         * @instance
         */
        ChatMessage.prototype.content = "";

        /**
         * ChatMessage senderFlag.
         * @member {chat.ChatMessage.SenderFlag} senderFlag
         * @memberof chat.ChatMessage
         * @instance
         */
        ChatMessage.prototype.senderFlag = 0;

        /**
         * ChatMessage senderID.
         * @member {string} senderID
         * @memberof chat.ChatMessage
         * @instance
         */
        ChatMessage.prototype.senderID = "";

        /**
         * ChatMessage senderName.
         * @member {string} senderName
         * @memberof chat.ChatMessage
         * @instance
         */
        ChatMessage.prototype.senderName = "";

        /**
         * ChatMessage targetID.
         * @member {string} targetID
         * @memberof chat.ChatMessage
         * @instance
         */
        ChatMessage.prototype.targetID = "";

        /**
         * ChatMessage targetName.
         * @member {string} targetName
         * @memberof chat.ChatMessage
         * @instance
         */
        ChatMessage.prototype.targetName = "";

        /**
         * ChatMessage senderAccountID.
         * @member {string} senderAccountID
         * @memberof chat.ChatMessage
         * @instance
         */
        ChatMessage.prototype.senderAccountID = "";

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @function create
         * @memberof chat.ChatMessage
         * @static
         * @param {chat.IChatMessage=} [properties] Properties to set
         * @returns {chat.ChatMessage} ChatMessage instance
         */
        ChatMessage.create = function create(properties) {
            return new ChatMessage(properties);
        };

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link chat.ChatMessage.verify|verify} messages.
         * @function encode
         * @memberof chat.ChatMessage
         * @static
         * @param {chat.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.content);
            if (message.senderFlag != null && Object.hasOwnProperty.call(message, "senderFlag"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.senderFlag);
            if (message.senderID != null && Object.hasOwnProperty.call(message, "senderID"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.senderID);
            if (message.senderName != null && Object.hasOwnProperty.call(message, "senderName"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.senderName);
            if (message.targetID != null && Object.hasOwnProperty.call(message, "targetID"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.targetID);
            if (message.targetName != null && Object.hasOwnProperty.call(message, "targetName"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.targetName);
            if (message.senderAccountID != null && Object.hasOwnProperty.call(message, "senderAccountID"))
                writer.uint32(/* id 8, wireType 2 =*/58).string(message.senderAccountID);
            return writer;
        };

        /**
         * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link chat.ChatMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.ChatMessage
         * @static
         * @param {chat.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @function decode
         * @memberof chat.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.ChatMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.content = reader.string();
                    break;
                case 3:
                    message.senderFlag = reader.int32();
                    break;
                case 4:
                    message.senderID = reader.string();
                    break;
                case 5:
                    message.senderName = reader.string();
                    break;
                case 6:
                    message.targetID = reader.string();
                    break;
                case 7:
                    message.targetName = reader.string();
                    break;
                case 8:
                    message.senderAccountID = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatMessage message.
         * @function verify
         * @memberof chat.ChatMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.content != null && message.hasOwnProperty("content"))
                if (!$util.isString(message.content))
                    return "content: string expected";
            if (message.senderFlag != null && message.hasOwnProperty("senderFlag"))
                switch (message.senderFlag) {
                default:
                    return "senderFlag: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.senderID != null && message.hasOwnProperty("senderID"))
                if (!$util.isString(message.senderID))
                    return "senderID: string expected";
            if (message.senderName != null && message.hasOwnProperty("senderName"))
                if (!$util.isString(message.senderName))
                    return "senderName: string expected";
            if (message.targetID != null && message.hasOwnProperty("targetID"))
                if (!$util.isString(message.targetID))
                    return "targetID: string expected";
            if (message.targetName != null && message.hasOwnProperty("targetName"))
                if (!$util.isString(message.targetName))
                    return "targetName: string expected";
            if (message.senderAccountID != null && message.hasOwnProperty("senderAccountID"))
                if (!$util.isString(message.senderAccountID))
                    return "senderAccountID: string expected";
            return null;
        };

        /**
         * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.ChatMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.ChatMessage} ChatMessage
         */
        ChatMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.ChatMessage)
                return object;
            let message = new $root.chat.ChatMessage();
            switch (object.type) {
            case "Error":
            case 0:
                message.type = 0;
                break;
            case "Direct":
            case 1:
                message.type = 1;
                break;
            case "Room":
            case 2:
                message.type = 2;
                break;
            case "Announcement":
            case 3:
                message.type = 3;
                break;
            }
            if (object.content != null)
                message.content = String(object.content);
            switch (object.senderFlag) {
            case "PLAYER":
            case 0:
                message.senderFlag = 0;
                break;
            case "CSE":
            case 1:
                message.senderFlag = 1;
                break;
            }
            if (object.senderID != null)
                message.senderID = String(object.senderID);
            if (object.senderName != null)
                message.senderName = String(object.senderName);
            if (object.targetID != null)
                message.targetID = String(object.targetID);
            if (object.targetName != null)
                message.targetName = String(object.targetName);
            if (object.senderAccountID != null)
                message.senderAccountID = String(object.senderAccountID);
            return message;
        };

        /**
         * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.ChatMessage
         * @static
         * @param {chat.ChatMessage} message ChatMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "Error" : 0;
                object.content = "";
                object.senderFlag = options.enums === String ? "PLAYER" : 0;
                object.senderID = "";
                object.senderName = "";
                object.targetID = "";
                object.targetName = "";
                object.senderAccountID = "";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.chat.ChatMessage.MessageTypes[message.type] : message.type;
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = message.content;
            if (message.senderFlag != null && message.hasOwnProperty("senderFlag"))
                object.senderFlag = options.enums === String ? $root.chat.ChatMessage.SenderFlag[message.senderFlag] : message.senderFlag;
            if (message.senderID != null && message.hasOwnProperty("senderID"))
                object.senderID = message.senderID;
            if (message.senderName != null && message.hasOwnProperty("senderName"))
                object.senderName = message.senderName;
            if (message.targetID != null && message.hasOwnProperty("targetID"))
                object.targetID = message.targetID;
            if (message.targetName != null && message.hasOwnProperty("targetName"))
                object.targetName = message.targetName;
            if (message.senderAccountID != null && message.hasOwnProperty("senderAccountID"))
                object.senderAccountID = message.senderAccountID;
            return object;
        };

        /**
         * Converts this ChatMessage to JSON.
         * @function toJSON
         * @memberof chat.ChatMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * MessageTypes enum.
         * @name chat.ChatMessage.MessageTypes
         * @enum {number}
         * @property {number} Error=0 Error value
         * @property {number} Direct=1 Direct value
         * @property {number} Room=2 Room value
         * @property {number} Announcement=3 Announcement value
         */
        ChatMessage.MessageTypes = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "Error"] = 0;
            values[valuesById[1] = "Direct"] = 1;
            values[valuesById[2] = "Room"] = 2;
            values[valuesById[3] = "Announcement"] = 3;
            return values;
        })();

        /**
         * SenderFlag enum.
         * @name chat.ChatMessage.SenderFlag
         * @enum {number}
         * @property {number} PLAYER=0 PLAYER value
         * @property {number} CSE=1 CSE value
         */
        ChatMessage.SenderFlag = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "PLAYER"] = 0;
            values[valuesById[1] = "CSE"] = 1;
            return values;
        })();

        return ChatMessage;
    })();

    chat.PingPongMessage = (function() {

        /**
         * Properties of a PingPongMessage.
         * @memberof chat
         * @interface IPingPongMessage
         * @property {boolean|null} [ping] PingPongMessage ping
         */

        /**
         * Constructs a new PingPongMessage.
         * @memberof chat
         * @classdesc Represents a PingPongMessage.
         * @implements IPingPongMessage
         * @constructor
         * @param {chat.IPingPongMessage=} [properties] Properties to set
         */
        function PingPongMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PingPongMessage ping.
         * @member {boolean} ping
         * @memberof chat.PingPongMessage
         * @instance
         */
        PingPongMessage.prototype.ping = false;

        /**
         * Creates a new PingPongMessage instance using the specified properties.
         * @function create
         * @memberof chat.PingPongMessage
         * @static
         * @param {chat.IPingPongMessage=} [properties] Properties to set
         * @returns {chat.PingPongMessage} PingPongMessage instance
         */
        PingPongMessage.create = function create(properties) {
            return new PingPongMessage(properties);
        };

        /**
         * Encodes the specified PingPongMessage message. Does not implicitly {@link chat.PingPongMessage.verify|verify} messages.
         * @function encode
         * @memberof chat.PingPongMessage
         * @static
         * @param {chat.IPingPongMessage} message PingPongMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingPongMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ping != null && Object.hasOwnProperty.call(message, "ping"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.ping);
            return writer;
        };

        /**
         * Encodes the specified PingPongMessage message, length delimited. Does not implicitly {@link chat.PingPongMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.PingPongMessage
         * @static
         * @param {chat.IPingPongMessage} message PingPongMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PingPongMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PingPongMessage message from the specified reader or buffer.
         * @function decode
         * @memberof chat.PingPongMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.PingPongMessage} PingPongMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingPongMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.PingPongMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.ping = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PingPongMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.PingPongMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.PingPongMessage} PingPongMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PingPongMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PingPongMessage message.
         * @function verify
         * @memberof chat.PingPongMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PingPongMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ping != null && message.hasOwnProperty("ping"))
                if (typeof message.ping !== "boolean")
                    return "ping: boolean expected";
            return null;
        };

        /**
         * Creates a PingPongMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.PingPongMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.PingPongMessage} PingPongMessage
         */
        PingPongMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.PingPongMessage)
                return object;
            let message = new $root.chat.PingPongMessage();
            if (object.ping != null)
                message.ping = Boolean(object.ping);
            return message;
        };

        /**
         * Creates a plain object from a PingPongMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.PingPongMessage
         * @static
         * @param {chat.PingPongMessage} message PingPongMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PingPongMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.ping = false;
            if (message.ping != null && message.hasOwnProperty("ping"))
                object.ping = message.ping;
            return object;
        };

        /**
         * Converts this PingPongMessage to JSON.
         * @function toJSON
         * @memberof chat.PingPongMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PingPongMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PingPongMessage;
    })();

    chat.ChatServerUnionMessage = (function() {

        /**
         * Properties of a ChatServerUnionMessage.
         * @memberof chat
         * @interface IChatServerUnionMessage
         * @property {chat.ChatServerUnionMessage.MessageTypes|null} [messageType] ChatServerUnionMessage messageType
         * @property {chat.IChatMessage|null} [chat] ChatServerUnionMessage chat
         * @property {chat.IPingPongMessage|null} [pingPong] ChatServerUnionMessage pingPong
         * @property {chat.IRoomActionRequest|null} [roomAction] ChatServerUnionMessage roomAction
         */

        /**
         * Constructs a new ChatServerUnionMessage.
         * @memberof chat
         * @classdesc Represents a ChatServerUnionMessage.
         * @implements IChatServerUnionMessage
         * @constructor
         * @param {chat.IChatServerUnionMessage=} [properties] Properties to set
         */
        function ChatServerUnionMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatServerUnionMessage messageType.
         * @member {chat.ChatServerUnionMessage.MessageTypes} messageType
         * @memberof chat.ChatServerUnionMessage
         * @instance
         */
        ChatServerUnionMessage.prototype.messageType = 0;

        /**
         * ChatServerUnionMessage chat.
         * @member {chat.IChatMessage|null|undefined} chat
         * @memberof chat.ChatServerUnionMessage
         * @instance
         */
        ChatServerUnionMessage.prototype.chat = null;

        /**
         * ChatServerUnionMessage pingPong.
         * @member {chat.IPingPongMessage|null|undefined} pingPong
         * @memberof chat.ChatServerUnionMessage
         * @instance
         */
        ChatServerUnionMessage.prototype.pingPong = null;

        /**
         * ChatServerUnionMessage roomAction.
         * @member {chat.IRoomActionRequest|null|undefined} roomAction
         * @memberof chat.ChatServerUnionMessage
         * @instance
         */
        ChatServerUnionMessage.prototype.roomAction = null;

        /**
         * Creates a new ChatServerUnionMessage instance using the specified properties.
         * @function create
         * @memberof chat.ChatServerUnionMessage
         * @static
         * @param {chat.IChatServerUnionMessage=} [properties] Properties to set
         * @returns {chat.ChatServerUnionMessage} ChatServerUnionMessage instance
         */
        ChatServerUnionMessage.create = function create(properties) {
            return new ChatServerUnionMessage(properties);
        };

        /**
         * Encodes the specified ChatServerUnionMessage message. Does not implicitly {@link chat.ChatServerUnionMessage.verify|verify} messages.
         * @function encode
         * @memberof chat.ChatServerUnionMessage
         * @static
         * @param {chat.IChatServerUnionMessage} message ChatServerUnionMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatServerUnionMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.messageType != null && Object.hasOwnProperty.call(message, "messageType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.messageType);
            if (message.chat != null && Object.hasOwnProperty.call(message, "chat"))
                $root.chat.ChatMessage.encode(message.chat, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.pingPong != null && Object.hasOwnProperty.call(message, "pingPong"))
                $root.chat.PingPongMessage.encode(message.pingPong, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.roomAction != null && Object.hasOwnProperty.call(message, "roomAction"))
                $root.chat.RoomActionRequest.encode(message.roomAction, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ChatServerUnionMessage message, length delimited. Does not implicitly {@link chat.ChatServerUnionMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.ChatServerUnionMessage
         * @static
         * @param {chat.IChatServerUnionMessage} message ChatServerUnionMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatServerUnionMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatServerUnionMessage message from the specified reader or buffer.
         * @function decode
         * @memberof chat.ChatServerUnionMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.ChatServerUnionMessage} ChatServerUnionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatServerUnionMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.ChatServerUnionMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.messageType = reader.int32();
                    break;
                case 2:
                    message.chat = $root.chat.ChatMessage.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.pingPong = $root.chat.PingPongMessage.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.roomAction = $root.chat.RoomActionRequest.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ChatServerUnionMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.ChatServerUnionMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.ChatServerUnionMessage} ChatServerUnionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatServerUnionMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatServerUnionMessage message.
         * @function verify
         * @memberof chat.ChatServerUnionMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatServerUnionMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.messageType != null && message.hasOwnProperty("messageType"))
                switch (message.messageType) {
                default:
                    return "messageType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.chat != null && message.hasOwnProperty("chat")) {
                let error = $root.chat.ChatMessage.verify(message.chat);
                if (error)
                    return "chat." + error;
            }
            if (message.pingPong != null && message.hasOwnProperty("pingPong")) {
                let error = $root.chat.PingPongMessage.verify(message.pingPong);
                if (error)
                    return "pingPong." + error;
            }
            if (message.roomAction != null && message.hasOwnProperty("roomAction")) {
                let error = $root.chat.RoomActionRequest.verify(message.roomAction);
                if (error)
                    return "roomAction." + error;
            }
            return null;
        };

        /**
         * Creates a ChatServerUnionMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.ChatServerUnionMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.ChatServerUnionMessage} ChatServerUnionMessage
         */
        ChatServerUnionMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.ChatServerUnionMessage)
                return object;
            let message = new $root.chat.ChatServerUnionMessage();
            switch (object.messageType) {
            case "NONE":
            case 0:
                message.messageType = 0;
                break;
            case "CHAT":
            case 1:
                message.messageType = 1;
                break;
            case "PINGPONG":
            case 2:
                message.messageType = 2;
                break;
            case "ROOMACTION":
            case 3:
                message.messageType = 3;
                break;
            }
            if (object.chat != null) {
                if (typeof object.chat !== "object")
                    throw TypeError(".chat.ChatServerUnionMessage.chat: object expected");
                message.chat = $root.chat.ChatMessage.fromObject(object.chat);
            }
            if (object.pingPong != null) {
                if (typeof object.pingPong !== "object")
                    throw TypeError(".chat.ChatServerUnionMessage.pingPong: object expected");
                message.pingPong = $root.chat.PingPongMessage.fromObject(object.pingPong);
            }
            if (object.roomAction != null) {
                if (typeof object.roomAction !== "object")
                    throw TypeError(".chat.ChatServerUnionMessage.roomAction: object expected");
                message.roomAction = $root.chat.RoomActionRequest.fromObject(object.roomAction);
            }
            return message;
        };

        /**
         * Creates a plain object from a ChatServerUnionMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.ChatServerUnionMessage
         * @static
         * @param {chat.ChatServerUnionMessage} message ChatServerUnionMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatServerUnionMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.messageType = options.enums === String ? "NONE" : 0;
                object.chat = null;
                object.pingPong = null;
                object.roomAction = null;
            }
            if (message.messageType != null && message.hasOwnProperty("messageType"))
                object.messageType = options.enums === String ? $root.chat.ChatServerUnionMessage.MessageTypes[message.messageType] : message.messageType;
            if (message.chat != null && message.hasOwnProperty("chat"))
                object.chat = $root.chat.ChatMessage.toObject(message.chat, options);
            if (message.pingPong != null && message.hasOwnProperty("pingPong"))
                object.pingPong = $root.chat.PingPongMessage.toObject(message.pingPong, options);
            if (message.roomAction != null && message.hasOwnProperty("roomAction"))
                object.roomAction = $root.chat.RoomActionRequest.toObject(message.roomAction, options);
            return object;
        };

        /**
         * Converts this ChatServerUnionMessage to JSON.
         * @function toJSON
         * @memberof chat.ChatServerUnionMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatServerUnionMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * MessageTypes enum.
         * @name chat.ChatServerUnionMessage.MessageTypes
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} CHAT=1 CHAT value
         * @property {number} PINGPONG=2 PINGPONG value
         * @property {number} ROOMACTION=3 ROOMACTION value
         */
        ChatServerUnionMessage.MessageTypes = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "CHAT"] = 1;
            values[valuesById[2] = "PINGPONG"] = 2;
            values[valuesById[3] = "ROOMACTION"] = 3;
            return values;
        })();

        return ChatServerUnionMessage;
    })();

    chat.ChatClientUnionMessage = (function() {

        /**
         * Properties of a ChatClientUnionMessage.
         * @memberof chat
         * @interface IChatClientUnionMessage
         * @property {chat.ChatClientUnionMessage.MessageTypes|null} [type] ChatClientUnionMessage type
         * @property {chat.IChatMessage|null} [chat] ChatClientUnionMessage chat
         * @property {chat.IPingPongMessage|null} [pingPong] ChatClientUnionMessage pingPong
         * @property {chat.IRoomActionResponse|null} [roomAction] ChatClientUnionMessage roomAction
         * @property {chat.IRoomInfo|null} [info] ChatClientUnionMessage info
         * @property {chat.IRoomJoined|null} [joined] ChatClientUnionMessage joined
         * @property {chat.IRoomLeft|null} [left] ChatClientUnionMessage left
         * @property {chat.IRoomRenamed|null} [renamed] ChatClientUnionMessage renamed
         * @property {chat.IRoomRoleAdded|null} [roleAdded] ChatClientUnionMessage roleAdded
         * @property {chat.IRoomRoleUpdated|null} [roleUpdated] ChatClientUnionMessage roleUpdated
         * @property {chat.IRoomRoleRemoved|null} [roleRemoved] ChatClientUnionMessage roleRemoved
         * @property {chat.IRoomRoleAssigned|null} [roleAssigned] ChatClientUnionMessage roleAssigned
         * @property {chat.IRoomInviteReceived|null} [invited] ChatClientUnionMessage invited
         * @property {chat.IRoomKickReceived|null} [kicked] ChatClientUnionMessage kicked
         * @property {chat.IRoomMuteReceived|null} [muted] ChatClientUnionMessage muted
         * @property {chat.IRoomBanReceived|null} [banned] ChatClientUnionMessage banned
         * @property {chat.IRoomOwnerChanged|null} [ownerChanged] ChatClientUnionMessage ownerChanged
         * @property {chat.IRoomDirectory|null} [directory] ChatClientUnionMessage directory
         */

        /**
         * Constructs a new ChatClientUnionMessage.
         * @memberof chat
         * @classdesc Represents a ChatClientUnionMessage.
         * @implements IChatClientUnionMessage
         * @constructor
         * @param {chat.IChatClientUnionMessage=} [properties] Properties to set
         */
        function ChatClientUnionMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatClientUnionMessage type.
         * @member {chat.ChatClientUnionMessage.MessageTypes} type
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.type = 0;

        /**
         * ChatClientUnionMessage chat.
         * @member {chat.IChatMessage|null|undefined} chat
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.chat = null;

        /**
         * ChatClientUnionMessage pingPong.
         * @member {chat.IPingPongMessage|null|undefined} pingPong
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.pingPong = null;

        /**
         * ChatClientUnionMessage roomAction.
         * @member {chat.IRoomActionResponse|null|undefined} roomAction
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.roomAction = null;

        /**
         * ChatClientUnionMessage info.
         * @member {chat.IRoomInfo|null|undefined} info
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.info = null;

        /**
         * ChatClientUnionMessage joined.
         * @member {chat.IRoomJoined|null|undefined} joined
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.joined = null;

        /**
         * ChatClientUnionMessage left.
         * @member {chat.IRoomLeft|null|undefined} left
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.left = null;

        /**
         * ChatClientUnionMessage renamed.
         * @member {chat.IRoomRenamed|null|undefined} renamed
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.renamed = null;

        /**
         * ChatClientUnionMessage roleAdded.
         * @member {chat.IRoomRoleAdded|null|undefined} roleAdded
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.roleAdded = null;

        /**
         * ChatClientUnionMessage roleUpdated.
         * @member {chat.IRoomRoleUpdated|null|undefined} roleUpdated
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.roleUpdated = null;

        /**
         * ChatClientUnionMessage roleRemoved.
         * @member {chat.IRoomRoleRemoved|null|undefined} roleRemoved
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.roleRemoved = null;

        /**
         * ChatClientUnionMessage roleAssigned.
         * @member {chat.IRoomRoleAssigned|null|undefined} roleAssigned
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.roleAssigned = null;

        /**
         * ChatClientUnionMessage invited.
         * @member {chat.IRoomInviteReceived|null|undefined} invited
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.invited = null;

        /**
         * ChatClientUnionMessage kicked.
         * @member {chat.IRoomKickReceived|null|undefined} kicked
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.kicked = null;

        /**
         * ChatClientUnionMessage muted.
         * @member {chat.IRoomMuteReceived|null|undefined} muted
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.muted = null;

        /**
         * ChatClientUnionMessage banned.
         * @member {chat.IRoomBanReceived|null|undefined} banned
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.banned = null;

        /**
         * ChatClientUnionMessage ownerChanged.
         * @member {chat.IRoomOwnerChanged|null|undefined} ownerChanged
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.ownerChanged = null;

        /**
         * ChatClientUnionMessage directory.
         * @member {chat.IRoomDirectory|null|undefined} directory
         * @memberof chat.ChatClientUnionMessage
         * @instance
         */
        ChatClientUnionMessage.prototype.directory = null;

        /**
         * Creates a new ChatClientUnionMessage instance using the specified properties.
         * @function create
         * @memberof chat.ChatClientUnionMessage
         * @static
         * @param {chat.IChatClientUnionMessage=} [properties] Properties to set
         * @returns {chat.ChatClientUnionMessage} ChatClientUnionMessage instance
         */
        ChatClientUnionMessage.create = function create(properties) {
            return new ChatClientUnionMessage(properties);
        };

        /**
         * Encodes the specified ChatClientUnionMessage message. Does not implicitly {@link chat.ChatClientUnionMessage.verify|verify} messages.
         * @function encode
         * @memberof chat.ChatClientUnionMessage
         * @static
         * @param {chat.IChatClientUnionMessage} message ChatClientUnionMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatClientUnionMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.chat != null && Object.hasOwnProperty.call(message, "chat"))
                $root.chat.ChatMessage.encode(message.chat, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.pingPong != null && Object.hasOwnProperty.call(message, "pingPong"))
                $root.chat.PingPongMessage.encode(message.pingPong, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.roomAction != null && Object.hasOwnProperty.call(message, "roomAction"))
                $root.chat.RoomActionResponse.encode(message.roomAction, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.info != null && Object.hasOwnProperty.call(message, "info"))
                $root.chat.RoomInfo.encode(message.info, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.joined != null && Object.hasOwnProperty.call(message, "joined"))
                $root.chat.RoomJoined.encode(message.joined, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.left != null && Object.hasOwnProperty.call(message, "left"))
                $root.chat.RoomLeft.encode(message.left, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.renamed != null && Object.hasOwnProperty.call(message, "renamed"))
                $root.chat.RoomRenamed.encode(message.renamed, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.roleAdded != null && Object.hasOwnProperty.call(message, "roleAdded"))
                $root.chat.RoomRoleAdded.encode(message.roleAdded, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.roleUpdated != null && Object.hasOwnProperty.call(message, "roleUpdated"))
                $root.chat.RoomRoleUpdated.encode(message.roleUpdated, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.roleRemoved != null && Object.hasOwnProperty.call(message, "roleRemoved"))
                $root.chat.RoomRoleRemoved.encode(message.roleRemoved, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.roleAssigned != null && Object.hasOwnProperty.call(message, "roleAssigned"))
                $root.chat.RoomRoleAssigned.encode(message.roleAssigned, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.invited != null && Object.hasOwnProperty.call(message, "invited"))
                $root.chat.RoomInviteReceived.encode(message.invited, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.kicked != null && Object.hasOwnProperty.call(message, "kicked"))
                $root.chat.RoomKickReceived.encode(message.kicked, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.muted != null && Object.hasOwnProperty.call(message, "muted"))
                $root.chat.RoomMuteReceived.encode(message.muted, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
            if (message.banned != null && Object.hasOwnProperty.call(message, "banned"))
                $root.chat.RoomBanReceived.encode(message.banned, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.ownerChanged != null && Object.hasOwnProperty.call(message, "ownerChanged"))
                $root.chat.RoomOwnerChanged.encode(message.ownerChanged, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
            if (message.directory != null && Object.hasOwnProperty.call(message, "directory"))
                $root.chat.RoomDirectory.encode(message.directory, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ChatClientUnionMessage message, length delimited. Does not implicitly {@link chat.ChatClientUnionMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.ChatClientUnionMessage
         * @static
         * @param {chat.IChatClientUnionMessage} message ChatClientUnionMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatClientUnionMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatClientUnionMessage message from the specified reader or buffer.
         * @function decode
         * @memberof chat.ChatClientUnionMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.ChatClientUnionMessage} ChatClientUnionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatClientUnionMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.ChatClientUnionMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.chat = $root.chat.ChatMessage.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.pingPong = $root.chat.PingPongMessage.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.roomAction = $root.chat.RoomActionResponse.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.info = $root.chat.RoomInfo.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.joined = $root.chat.RoomJoined.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.left = $root.chat.RoomLeft.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.renamed = $root.chat.RoomRenamed.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.roleAdded = $root.chat.RoomRoleAdded.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.roleUpdated = $root.chat.RoomRoleUpdated.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.roleRemoved = $root.chat.RoomRoleRemoved.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.roleAssigned = $root.chat.RoomRoleAssigned.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.invited = $root.chat.RoomInviteReceived.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.kicked = $root.chat.RoomKickReceived.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.muted = $root.chat.RoomMuteReceived.decode(reader, reader.uint32());
                    break;
                case 17:
                    message.banned = $root.chat.RoomBanReceived.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.ownerChanged = $root.chat.RoomOwnerChanged.decode(reader, reader.uint32());
                    break;
                case 19:
                    message.directory = $root.chat.RoomDirectory.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ChatClientUnionMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.ChatClientUnionMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.ChatClientUnionMessage} ChatClientUnionMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatClientUnionMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatClientUnionMessage message.
         * @function verify
         * @memberof chat.ChatClientUnionMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatClientUnionMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                    break;
                }
            if (message.chat != null && message.hasOwnProperty("chat")) {
                let error = $root.chat.ChatMessage.verify(message.chat);
                if (error)
                    return "chat." + error;
            }
            if (message.pingPong != null && message.hasOwnProperty("pingPong")) {
                let error = $root.chat.PingPongMessage.verify(message.pingPong);
                if (error)
                    return "pingPong." + error;
            }
            if (message.roomAction != null && message.hasOwnProperty("roomAction")) {
                let error = $root.chat.RoomActionResponse.verify(message.roomAction);
                if (error)
                    return "roomAction." + error;
            }
            if (message.info != null && message.hasOwnProperty("info")) {
                let error = $root.chat.RoomInfo.verify(message.info);
                if (error)
                    return "info." + error;
            }
            if (message.joined != null && message.hasOwnProperty("joined")) {
                let error = $root.chat.RoomJoined.verify(message.joined);
                if (error)
                    return "joined." + error;
            }
            if (message.left != null && message.hasOwnProperty("left")) {
                let error = $root.chat.RoomLeft.verify(message.left);
                if (error)
                    return "left." + error;
            }
            if (message.renamed != null && message.hasOwnProperty("renamed")) {
                let error = $root.chat.RoomRenamed.verify(message.renamed);
                if (error)
                    return "renamed." + error;
            }
            if (message.roleAdded != null && message.hasOwnProperty("roleAdded")) {
                let error = $root.chat.RoomRoleAdded.verify(message.roleAdded);
                if (error)
                    return "roleAdded." + error;
            }
            if (message.roleUpdated != null && message.hasOwnProperty("roleUpdated")) {
                let error = $root.chat.RoomRoleUpdated.verify(message.roleUpdated);
                if (error)
                    return "roleUpdated." + error;
            }
            if (message.roleRemoved != null && message.hasOwnProperty("roleRemoved")) {
                let error = $root.chat.RoomRoleRemoved.verify(message.roleRemoved);
                if (error)
                    return "roleRemoved." + error;
            }
            if (message.roleAssigned != null && message.hasOwnProperty("roleAssigned")) {
                let error = $root.chat.RoomRoleAssigned.verify(message.roleAssigned);
                if (error)
                    return "roleAssigned." + error;
            }
            if (message.invited != null && message.hasOwnProperty("invited")) {
                let error = $root.chat.RoomInviteReceived.verify(message.invited);
                if (error)
                    return "invited." + error;
            }
            if (message.kicked != null && message.hasOwnProperty("kicked")) {
                let error = $root.chat.RoomKickReceived.verify(message.kicked);
                if (error)
                    return "kicked." + error;
            }
            if (message.muted != null && message.hasOwnProperty("muted")) {
                let error = $root.chat.RoomMuteReceived.verify(message.muted);
                if (error)
                    return "muted." + error;
            }
            if (message.banned != null && message.hasOwnProperty("banned")) {
                let error = $root.chat.RoomBanReceived.verify(message.banned);
                if (error)
                    return "banned." + error;
            }
            if (message.ownerChanged != null && message.hasOwnProperty("ownerChanged")) {
                let error = $root.chat.RoomOwnerChanged.verify(message.ownerChanged);
                if (error)
                    return "ownerChanged." + error;
            }
            if (message.directory != null && message.hasOwnProperty("directory")) {
                let error = $root.chat.RoomDirectory.verify(message.directory);
                if (error)
                    return "directory." + error;
            }
            return null;
        };

        /**
         * Creates a ChatClientUnionMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.ChatClientUnionMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.ChatClientUnionMessage} ChatClientUnionMessage
         */
        ChatClientUnionMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.ChatClientUnionMessage)
                return object;
            let message = new $root.chat.ChatClientUnionMessage();
            switch (object.type) {
            case "NONE":
            case 0:
                message.type = 0;
                break;
            case "CHATMESSAGE":
            case 1:
                message.type = 1;
                break;
            case "PINGPONGMESSAGE":
            case 2:
                message.type = 2;
                break;
            case "ROOMACTION":
            case 4:
                message.type = 4;
                break;
            case "ROOMINFO":
            case 5:
                message.type = 5;
                break;
            case "JOINED":
            case 6:
                message.type = 6;
                break;
            case "LEFT":
            case 7:
                message.type = 7;
                break;
            case "RENAMED":
            case 8:
                message.type = 8;
                break;
            case "ROLEADDED":
            case 9:
                message.type = 9;
                break;
            case "ROLEUPDATED":
            case 10:
                message.type = 10;
                break;
            case "ROLEREMOVED":
            case 11:
                message.type = 11;
                break;
            case "ROLEASSIGNED":
            case 12:
                message.type = 12;
                break;
            case "INVITERECEIVED":
            case 13:
                message.type = 13;
                break;
            case "KICKED":
            case 14:
                message.type = 14;
                break;
            case "BANNED":
            case 15:
                message.type = 15;
                break;
            case "MUTED":
            case 16:
                message.type = 16;
                break;
            case "OWNERCHANGED":
            case 17:
                message.type = 17;
                break;
            case "DIRECTORY":
            case 18:
                message.type = 18;
                break;
            }
            if (object.chat != null) {
                if (typeof object.chat !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.chat: object expected");
                message.chat = $root.chat.ChatMessage.fromObject(object.chat);
            }
            if (object.pingPong != null) {
                if (typeof object.pingPong !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.pingPong: object expected");
                message.pingPong = $root.chat.PingPongMessage.fromObject(object.pingPong);
            }
            if (object.roomAction != null) {
                if (typeof object.roomAction !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.roomAction: object expected");
                message.roomAction = $root.chat.RoomActionResponse.fromObject(object.roomAction);
            }
            if (object.info != null) {
                if (typeof object.info !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.info: object expected");
                message.info = $root.chat.RoomInfo.fromObject(object.info);
            }
            if (object.joined != null) {
                if (typeof object.joined !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.joined: object expected");
                message.joined = $root.chat.RoomJoined.fromObject(object.joined);
            }
            if (object.left != null) {
                if (typeof object.left !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.left: object expected");
                message.left = $root.chat.RoomLeft.fromObject(object.left);
            }
            if (object.renamed != null) {
                if (typeof object.renamed !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.renamed: object expected");
                message.renamed = $root.chat.RoomRenamed.fromObject(object.renamed);
            }
            if (object.roleAdded != null) {
                if (typeof object.roleAdded !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.roleAdded: object expected");
                message.roleAdded = $root.chat.RoomRoleAdded.fromObject(object.roleAdded);
            }
            if (object.roleUpdated != null) {
                if (typeof object.roleUpdated !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.roleUpdated: object expected");
                message.roleUpdated = $root.chat.RoomRoleUpdated.fromObject(object.roleUpdated);
            }
            if (object.roleRemoved != null) {
                if (typeof object.roleRemoved !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.roleRemoved: object expected");
                message.roleRemoved = $root.chat.RoomRoleRemoved.fromObject(object.roleRemoved);
            }
            if (object.roleAssigned != null) {
                if (typeof object.roleAssigned !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.roleAssigned: object expected");
                message.roleAssigned = $root.chat.RoomRoleAssigned.fromObject(object.roleAssigned);
            }
            if (object.invited != null) {
                if (typeof object.invited !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.invited: object expected");
                message.invited = $root.chat.RoomInviteReceived.fromObject(object.invited);
            }
            if (object.kicked != null) {
                if (typeof object.kicked !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.kicked: object expected");
                message.kicked = $root.chat.RoomKickReceived.fromObject(object.kicked);
            }
            if (object.muted != null) {
                if (typeof object.muted !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.muted: object expected");
                message.muted = $root.chat.RoomMuteReceived.fromObject(object.muted);
            }
            if (object.banned != null) {
                if (typeof object.banned !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.banned: object expected");
                message.banned = $root.chat.RoomBanReceived.fromObject(object.banned);
            }
            if (object.ownerChanged != null) {
                if (typeof object.ownerChanged !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.ownerChanged: object expected");
                message.ownerChanged = $root.chat.RoomOwnerChanged.fromObject(object.ownerChanged);
            }
            if (object.directory != null) {
                if (typeof object.directory !== "object")
                    throw TypeError(".chat.ChatClientUnionMessage.directory: object expected");
                message.directory = $root.chat.RoomDirectory.fromObject(object.directory);
            }
            return message;
        };

        /**
         * Creates a plain object from a ChatClientUnionMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.ChatClientUnionMessage
         * @static
         * @param {chat.ChatClientUnionMessage} message ChatClientUnionMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatClientUnionMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "NONE" : 0;
                object.chat = null;
                object.pingPong = null;
                object.roomAction = null;
                object.info = null;
                object.joined = null;
                object.left = null;
                object.renamed = null;
                object.roleAdded = null;
                object.roleUpdated = null;
                object.roleRemoved = null;
                object.roleAssigned = null;
                object.invited = null;
                object.kicked = null;
                object.muted = null;
                object.banned = null;
                object.ownerChanged = null;
                object.directory = null;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.chat.ChatClientUnionMessage.MessageTypes[message.type] : message.type;
            if (message.chat != null && message.hasOwnProperty("chat"))
                object.chat = $root.chat.ChatMessage.toObject(message.chat, options);
            if (message.pingPong != null && message.hasOwnProperty("pingPong"))
                object.pingPong = $root.chat.PingPongMessage.toObject(message.pingPong, options);
            if (message.roomAction != null && message.hasOwnProperty("roomAction"))
                object.roomAction = $root.chat.RoomActionResponse.toObject(message.roomAction, options);
            if (message.info != null && message.hasOwnProperty("info"))
                object.info = $root.chat.RoomInfo.toObject(message.info, options);
            if (message.joined != null && message.hasOwnProperty("joined"))
                object.joined = $root.chat.RoomJoined.toObject(message.joined, options);
            if (message.left != null && message.hasOwnProperty("left"))
                object.left = $root.chat.RoomLeft.toObject(message.left, options);
            if (message.renamed != null && message.hasOwnProperty("renamed"))
                object.renamed = $root.chat.RoomRenamed.toObject(message.renamed, options);
            if (message.roleAdded != null && message.hasOwnProperty("roleAdded"))
                object.roleAdded = $root.chat.RoomRoleAdded.toObject(message.roleAdded, options);
            if (message.roleUpdated != null && message.hasOwnProperty("roleUpdated"))
                object.roleUpdated = $root.chat.RoomRoleUpdated.toObject(message.roleUpdated, options);
            if (message.roleRemoved != null && message.hasOwnProperty("roleRemoved"))
                object.roleRemoved = $root.chat.RoomRoleRemoved.toObject(message.roleRemoved, options);
            if (message.roleAssigned != null && message.hasOwnProperty("roleAssigned"))
                object.roleAssigned = $root.chat.RoomRoleAssigned.toObject(message.roleAssigned, options);
            if (message.invited != null && message.hasOwnProperty("invited"))
                object.invited = $root.chat.RoomInviteReceived.toObject(message.invited, options);
            if (message.kicked != null && message.hasOwnProperty("kicked"))
                object.kicked = $root.chat.RoomKickReceived.toObject(message.kicked, options);
            if (message.muted != null && message.hasOwnProperty("muted"))
                object.muted = $root.chat.RoomMuteReceived.toObject(message.muted, options);
            if (message.banned != null && message.hasOwnProperty("banned"))
                object.banned = $root.chat.RoomBanReceived.toObject(message.banned, options);
            if (message.ownerChanged != null && message.hasOwnProperty("ownerChanged"))
                object.ownerChanged = $root.chat.RoomOwnerChanged.toObject(message.ownerChanged, options);
            if (message.directory != null && message.hasOwnProperty("directory"))
                object.directory = $root.chat.RoomDirectory.toObject(message.directory, options);
            return object;
        };

        /**
         * Converts this ChatClientUnionMessage to JSON.
         * @function toJSON
         * @memberof chat.ChatClientUnionMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatClientUnionMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * MessageTypes enum.
         * @name chat.ChatClientUnionMessage.MessageTypes
         * @enum {number}
         * @property {number} NONE=0 NONE value
         * @property {number} CHATMESSAGE=1 CHATMESSAGE value
         * @property {number} PINGPONGMESSAGE=2 PINGPONGMESSAGE value
         * @property {number} ROOMACTION=4 ROOMACTION value
         * @property {number} ROOMINFO=5 ROOMINFO value
         * @property {number} JOINED=6 JOINED value
         * @property {number} LEFT=7 LEFT value
         * @property {number} RENAMED=8 RENAMED value
         * @property {number} ROLEADDED=9 ROLEADDED value
         * @property {number} ROLEUPDATED=10 ROLEUPDATED value
         * @property {number} ROLEREMOVED=11 ROLEREMOVED value
         * @property {number} ROLEASSIGNED=12 ROLEASSIGNED value
         * @property {number} INVITERECEIVED=13 INVITERECEIVED value
         * @property {number} KICKED=14 KICKED value
         * @property {number} BANNED=15 BANNED value
         * @property {number} MUTED=16 MUTED value
         * @property {number} OWNERCHANGED=17 OWNERCHANGED value
         * @property {number} DIRECTORY=18 DIRECTORY value
         */
        ChatClientUnionMessage.MessageTypes = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[1] = "CHATMESSAGE"] = 1;
            values[valuesById[2] = "PINGPONGMESSAGE"] = 2;
            values[valuesById[4] = "ROOMACTION"] = 4;
            values[valuesById[5] = "ROOMINFO"] = 5;
            values[valuesById[6] = "JOINED"] = 6;
            values[valuesById[7] = "LEFT"] = 7;
            values[valuesById[8] = "RENAMED"] = 8;
            values[valuesById[9] = "ROLEADDED"] = 9;
            values[valuesById[10] = "ROLEUPDATED"] = 10;
            values[valuesById[11] = "ROLEREMOVED"] = 11;
            values[valuesById[12] = "ROLEASSIGNED"] = 12;
            values[valuesById[13] = "INVITERECEIVED"] = 13;
            values[valuesById[14] = "KICKED"] = 14;
            values[valuesById[15] = "BANNED"] = 15;
            values[valuesById[16] = "MUTED"] = 16;
            values[valuesById[17] = "OWNERCHANGED"] = 17;
            values[valuesById[18] = "DIRECTORY"] = 18;
            return values;
        })();

        return ChatClientUnionMessage;
    })();

    chat.ProxyAuth = (function() {

        /**
         * Properties of a ProxyAuth.
         * @memberof chat
         * @interface IProxyAuth
         * @property {chat.ProxyAuth.UserTypes|null} [type] ProxyAuth type
         * @property {string|null} [accountID] ProxyAuth accountID
         * @property {number|Long|null} [sourceIPAddr] ProxyAuth sourceIPAddr
         */

        /**
         * Constructs a new ProxyAuth.
         * @memberof chat
         * @classdesc Represents a ProxyAuth.
         * @implements IProxyAuth
         * @constructor
         * @param {chat.IProxyAuth=} [properties] Properties to set
         */
        function ProxyAuth(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProxyAuth type.
         * @member {chat.ProxyAuth.UserTypes} type
         * @memberof chat.ProxyAuth
         * @instance
         */
        ProxyAuth.prototype.type = 0;

        /**
         * ProxyAuth accountID.
         * @member {string} accountID
         * @memberof chat.ProxyAuth
         * @instance
         */
        ProxyAuth.prototype.accountID = "";

        /**
         * ProxyAuth sourceIPAddr.
         * @member {number|Long} sourceIPAddr
         * @memberof chat.ProxyAuth
         * @instance
         */
        ProxyAuth.prototype.sourceIPAddr = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new ProxyAuth instance using the specified properties.
         * @function create
         * @memberof chat.ProxyAuth
         * @static
         * @param {chat.IProxyAuth=} [properties] Properties to set
         * @returns {chat.ProxyAuth} ProxyAuth instance
         */
        ProxyAuth.create = function create(properties) {
            return new ProxyAuth(properties);
        };

        /**
         * Encodes the specified ProxyAuth message. Does not implicitly {@link chat.ProxyAuth.verify|verify} messages.
         * @function encode
         * @memberof chat.ProxyAuth
         * @static
         * @param {chat.IProxyAuth} message ProxyAuth message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProxyAuth.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.accountID != null && Object.hasOwnProperty.call(message, "accountID"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.accountID);
            if (message.sourceIPAddr != null && Object.hasOwnProperty.call(message, "sourceIPAddr"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.sourceIPAddr);
            return writer;
        };

        /**
         * Encodes the specified ProxyAuth message, length delimited. Does not implicitly {@link chat.ProxyAuth.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.ProxyAuth
         * @static
         * @param {chat.IProxyAuth} message ProxyAuth message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProxyAuth.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProxyAuth message from the specified reader or buffer.
         * @function decode
         * @memberof chat.ProxyAuth
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.ProxyAuth} ProxyAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProxyAuth.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.ProxyAuth();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.accountID = reader.string();
                    break;
                case 3:
                    message.sourceIPAddr = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProxyAuth message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.ProxyAuth
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.ProxyAuth} ProxyAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProxyAuth.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProxyAuth message.
         * @function verify
         * @memberof chat.ProxyAuth
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProxyAuth.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.accountID != null && message.hasOwnProperty("accountID"))
                if (!$util.isString(message.accountID))
                    return "accountID: string expected";
            if (message.sourceIPAddr != null && message.hasOwnProperty("sourceIPAddr"))
                if (!$util.isInteger(message.sourceIPAddr) && !(message.sourceIPAddr && $util.isInteger(message.sourceIPAddr.low) && $util.isInteger(message.sourceIPAddr.high)))
                    return "sourceIPAddr: integer|Long expected";
            return null;
        };

        /**
         * Creates a ProxyAuth message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.ProxyAuth
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.ProxyAuth} ProxyAuth
         */
        ProxyAuth.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.ProxyAuth)
                return object;
            let message = new $root.chat.ProxyAuth();
            switch (object.type) {
            case "Player":
            case 0:
                message.type = 0;
                break;
            case "Bot":
            case 1:
                message.type = 1;
                break;
            }
            if (object.accountID != null)
                message.accountID = String(object.accountID);
            if (object.sourceIPAddr != null)
                if ($util.Long)
                    (message.sourceIPAddr = $util.Long.fromValue(object.sourceIPAddr)).unsigned = false;
                else if (typeof object.sourceIPAddr === "string")
                    message.sourceIPAddr = parseInt(object.sourceIPAddr, 10);
                else if (typeof object.sourceIPAddr === "number")
                    message.sourceIPAddr = object.sourceIPAddr;
                else if (typeof object.sourceIPAddr === "object")
                    message.sourceIPAddr = new $util.LongBits(object.sourceIPAddr.low >>> 0, object.sourceIPAddr.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a ProxyAuth message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.ProxyAuth
         * @static
         * @param {chat.ProxyAuth} message ProxyAuth
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProxyAuth.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "Player" : 0;
                object.accountID = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.sourceIPAddr = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sourceIPAddr = options.longs === String ? "0" : 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.chat.ProxyAuth.UserTypes[message.type] : message.type;
            if (message.accountID != null && message.hasOwnProperty("accountID"))
                object.accountID = message.accountID;
            if (message.sourceIPAddr != null && message.hasOwnProperty("sourceIPAddr"))
                if (typeof message.sourceIPAddr === "number")
                    object.sourceIPAddr = options.longs === String ? String(message.sourceIPAddr) : message.sourceIPAddr;
                else
                    object.sourceIPAddr = options.longs === String ? $util.Long.prototype.toString.call(message.sourceIPAddr) : options.longs === Number ? new $util.LongBits(message.sourceIPAddr.low >>> 0, message.sourceIPAddr.high >>> 0).toNumber() : message.sourceIPAddr;
            return object;
        };

        /**
         * Converts this ProxyAuth to JSON.
         * @function toJSON
         * @memberof chat.ProxyAuth
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProxyAuth.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * UserTypes enum.
         * @name chat.ProxyAuth.UserTypes
         * @enum {number}
         * @property {number} Player=0 Player value
         * @property {number} Bot=1 Bot value
         */
        ProxyAuth.UserTypes = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "Player"] = 0;
            values[valuesById[1] = "Bot"] = 1;
            return values;
        })();

        return ProxyAuth;
    })();

    chat.ProxyMessage = (function() {

        /**
         * Properties of a ProxyMessage.
         * @memberof chat
         * @interface IProxyMessage
         * @property {chat.ProxyMessage.MessageTypes|null} [type] ProxyMessage type
         * @property {string|null} [userID] ProxyMessage userID
         * @property {chat.IProxyAuth|null} [auth] ProxyMessage auth
         * @property {chat.IPingPongMessage|null} [pingPong] ProxyMessage pingPong
         * @property {chat.IChatServerUnionMessage|null} [serverMessage] ProxyMessage serverMessage
         * @property {chat.IChatClientUnionMessage|null} [clientMessage] ProxyMessage clientMessage
         */

        /**
         * Constructs a new ProxyMessage.
         * @memberof chat
         * @classdesc Represents a ProxyMessage.
         * @implements IProxyMessage
         * @constructor
         * @param {chat.IProxyMessage=} [properties] Properties to set
         */
        function ProxyMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ProxyMessage type.
         * @member {chat.ProxyMessage.MessageTypes} type
         * @memberof chat.ProxyMessage
         * @instance
         */
        ProxyMessage.prototype.type = 0;

        /**
         * ProxyMessage userID.
         * @member {string} userID
         * @memberof chat.ProxyMessage
         * @instance
         */
        ProxyMessage.prototype.userID = "";

        /**
         * ProxyMessage auth.
         * @member {chat.IProxyAuth|null|undefined} auth
         * @memberof chat.ProxyMessage
         * @instance
         */
        ProxyMessage.prototype.auth = null;

        /**
         * ProxyMessage pingPong.
         * @member {chat.IPingPongMessage|null|undefined} pingPong
         * @memberof chat.ProxyMessage
         * @instance
         */
        ProxyMessage.prototype.pingPong = null;

        /**
         * ProxyMessage serverMessage.
         * @member {chat.IChatServerUnionMessage|null|undefined} serverMessage
         * @memberof chat.ProxyMessage
         * @instance
         */
        ProxyMessage.prototype.serverMessage = null;

        /**
         * ProxyMessage clientMessage.
         * @member {chat.IChatClientUnionMessage|null|undefined} clientMessage
         * @memberof chat.ProxyMessage
         * @instance
         */
        ProxyMessage.prototype.clientMessage = null;

        /**
         * Creates a new ProxyMessage instance using the specified properties.
         * @function create
         * @memberof chat.ProxyMessage
         * @static
         * @param {chat.IProxyMessage=} [properties] Properties to set
         * @returns {chat.ProxyMessage} ProxyMessage instance
         */
        ProxyMessage.create = function create(properties) {
            return new ProxyMessage(properties);
        };

        /**
         * Encodes the specified ProxyMessage message. Does not implicitly {@link chat.ProxyMessage.verify|verify} messages.
         * @function encode
         * @memberof chat.ProxyMessage
         * @static
         * @param {chat.IProxyMessage} message ProxyMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProxyMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.userID != null && Object.hasOwnProperty.call(message, "userID"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.userID);
            if (message.auth != null && Object.hasOwnProperty.call(message, "auth"))
                $root.chat.ProxyAuth.encode(message.auth, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.pingPong != null && Object.hasOwnProperty.call(message, "pingPong"))
                $root.chat.PingPongMessage.encode(message.pingPong, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.serverMessage != null && Object.hasOwnProperty.call(message, "serverMessage"))
                $root.chat.ChatServerUnionMessage.encode(message.serverMessage, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.clientMessage != null && Object.hasOwnProperty.call(message, "clientMessage"))
                $root.chat.ChatClientUnionMessage.encode(message.clientMessage, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ProxyMessage message, length delimited. Does not implicitly {@link chat.ProxyMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof chat.ProxyMessage
         * @static
         * @param {chat.IProxyMessage} message ProxyMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ProxyMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ProxyMessage message from the specified reader or buffer.
         * @function decode
         * @memberof chat.ProxyMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {chat.ProxyMessage} ProxyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProxyMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.chat.ProxyMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.userID = reader.string();
                    break;
                case 3:
                    message.auth = $root.chat.ProxyAuth.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.pingPong = $root.chat.PingPongMessage.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.serverMessage = $root.chat.ChatServerUnionMessage.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.clientMessage = $root.chat.ChatClientUnionMessage.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ProxyMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof chat.ProxyMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {chat.ProxyMessage} ProxyMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ProxyMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ProxyMessage message.
         * @function verify
         * @memberof chat.ProxyMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ProxyMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.userID != null && message.hasOwnProperty("userID"))
                if (!$util.isString(message.userID))
                    return "userID: string expected";
            if (message.auth != null && message.hasOwnProperty("auth")) {
                let error = $root.chat.ProxyAuth.verify(message.auth);
                if (error)
                    return "auth." + error;
            }
            if (message.pingPong != null && message.hasOwnProperty("pingPong")) {
                let error = $root.chat.PingPongMessage.verify(message.pingPong);
                if (error)
                    return "pingPong." + error;
            }
            if (message.serverMessage != null && message.hasOwnProperty("serverMessage")) {
                let error = $root.chat.ChatServerUnionMessage.verify(message.serverMessage);
                if (error)
                    return "serverMessage." + error;
            }
            if (message.clientMessage != null && message.hasOwnProperty("clientMessage")) {
                let error = $root.chat.ChatClientUnionMessage.verify(message.clientMessage);
                if (error)
                    return "clientMessage." + error;
            }
            return null;
        };

        /**
         * Creates a ProxyMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof chat.ProxyMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {chat.ProxyMessage} ProxyMessage
         */
        ProxyMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.chat.ProxyMessage)
                return object;
            let message = new $root.chat.ProxyMessage();
            switch (object.type) {
            case "None":
            case 0:
                message.type = 0;
                break;
            case "Auth":
            case 1:
                message.type = 1;
                break;
            case "PingPong":
            case 2:
                message.type = 2;
                break;
            case "Server":
            case 3:
                message.type = 3;
                break;
            case "Client":
            case 4:
                message.type = 4;
                break;
            case "RemoveUser":
            case 5:
                message.type = 5;
                break;
            }
            if (object.userID != null)
                message.userID = String(object.userID);
            if (object.auth != null) {
                if (typeof object.auth !== "object")
                    throw TypeError(".chat.ProxyMessage.auth: object expected");
                message.auth = $root.chat.ProxyAuth.fromObject(object.auth);
            }
            if (object.pingPong != null) {
                if (typeof object.pingPong !== "object")
                    throw TypeError(".chat.ProxyMessage.pingPong: object expected");
                message.pingPong = $root.chat.PingPongMessage.fromObject(object.pingPong);
            }
            if (object.serverMessage != null) {
                if (typeof object.serverMessage !== "object")
                    throw TypeError(".chat.ProxyMessage.serverMessage: object expected");
                message.serverMessage = $root.chat.ChatServerUnionMessage.fromObject(object.serverMessage);
            }
            if (object.clientMessage != null) {
                if (typeof object.clientMessage !== "object")
                    throw TypeError(".chat.ProxyMessage.clientMessage: object expected");
                message.clientMessage = $root.chat.ChatClientUnionMessage.fromObject(object.clientMessage);
            }
            return message;
        };

        /**
         * Creates a plain object from a ProxyMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof chat.ProxyMessage
         * @static
         * @param {chat.ProxyMessage} message ProxyMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ProxyMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "None" : 0;
                object.userID = "";
                object.auth = null;
                object.pingPong = null;
                object.serverMessage = null;
                object.clientMessage = null;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.chat.ProxyMessage.MessageTypes[message.type] : message.type;
            if (message.userID != null && message.hasOwnProperty("userID"))
                object.userID = message.userID;
            if (message.auth != null && message.hasOwnProperty("auth"))
                object.auth = $root.chat.ProxyAuth.toObject(message.auth, options);
            if (message.pingPong != null && message.hasOwnProperty("pingPong"))
                object.pingPong = $root.chat.PingPongMessage.toObject(message.pingPong, options);
            if (message.serverMessage != null && message.hasOwnProperty("serverMessage"))
                object.serverMessage = $root.chat.ChatServerUnionMessage.toObject(message.serverMessage, options);
            if (message.clientMessage != null && message.hasOwnProperty("clientMessage"))
                object.clientMessage = $root.chat.ChatClientUnionMessage.toObject(message.clientMessage, options);
            return object;
        };

        /**
         * Converts this ProxyMessage to JSON.
         * @function toJSON
         * @memberof chat.ProxyMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ProxyMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * MessageTypes enum.
         * @name chat.ProxyMessage.MessageTypes
         * @enum {number}
         * @property {number} None=0 None value
         * @property {number} Auth=1 Auth value
         * @property {number} PingPong=2 PingPong value
         * @property {number} Server=3 Server value
         * @property {number} Client=4 Client value
         * @property {number} RemoveUser=5 RemoveUser value
         */
        ProxyMessage.MessageTypes = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "None"] = 0;
            values[valuesById[1] = "Auth"] = 1;
            values[valuesById[2] = "PingPong"] = 2;
            values[valuesById[3] = "Server"] = 3;
            values[valuesById[4] = "Client"] = 4;
            values[valuesById[5] = "RemoveUser"] = 5;
            return values;
        })();

        return ProxyMessage;
    })();

    return chat;
})();

export const google = $root.google = (() => {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    const google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        const protobuf = {};

        protobuf.Timestamp = (function() {

            /**
             * Properties of a Timestamp.
             * @memberof google.protobuf
             * @interface ITimestamp
             * @property {number|Long|null} [seconds] Timestamp seconds
             * @property {number|null} [nanos] Timestamp nanos
             */

            /**
             * Constructs a new Timestamp.
             * @memberof google.protobuf
             * @classdesc Represents a Timestamp.
             * @implements ITimestamp
             * @constructor
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             */
            function Timestamp(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Timestamp seconds.
             * @member {number|Long} seconds
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.seconds = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Timestamp nanos.
             * @member {number} nanos
             * @memberof google.protobuf.Timestamp
             * @instance
             */
            Timestamp.prototype.nanos = 0;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp=} [properties] Properties to set
             * @returns {google.protobuf.Timestamp} Timestamp instance
             */
            Timestamp.create = function create(properties) {
                return new Timestamp(properties);
            };

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.seconds != null && Object.hasOwnProperty.call(message, "seconds"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.seconds);
                if (message.nanos != null && Object.hasOwnProperty.call(message, "nanos"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.nanos);
                return writer;
            };

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.ITimestamp} message Timestamp message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Timestamp.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Timestamp();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.seconds = reader.int64();
                        break;
                    case 2:
                        message.nanos = reader.int32();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Timestamp} Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Timestamp.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Timestamp message.
             * @function verify
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Timestamp.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (!$util.isInteger(message.seconds) && !(message.seconds && $util.isInteger(message.seconds.low) && $util.isInteger(message.seconds.high)))
                        return "seconds: integer|Long expected";
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    if (!$util.isInteger(message.nanos))
                        return "nanos: integer expected";
                return null;
            };

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Timestamp} Timestamp
             */
            Timestamp.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Timestamp)
                    return object;
                let message = new $root.google.protobuf.Timestamp();
                if (object.seconds != null)
                    if ($util.Long)
                        (message.seconds = $util.Long.fromValue(object.seconds)).unsigned = false;
                    else if (typeof object.seconds === "string")
                        message.seconds = parseInt(object.seconds, 10);
                    else if (typeof object.seconds === "number")
                        message.seconds = object.seconds;
                    else if (typeof object.seconds === "object")
                        message.seconds = new $util.LongBits(object.seconds.low >>> 0, object.seconds.high >>> 0).toNumber();
                if (object.nanos != null)
                    message.nanos = object.nanos | 0;
                return message;
            };

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Timestamp
             * @static
             * @param {google.protobuf.Timestamp} message Timestamp
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Timestamp.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.seconds = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.seconds = options.longs === String ? "0" : 0;
                    object.nanos = 0;
                }
                if (message.seconds != null && message.hasOwnProperty("seconds"))
                    if (typeof message.seconds === "number")
                        object.seconds = options.longs === String ? String(message.seconds) : message.seconds;
                    else
                        object.seconds = options.longs === String ? $util.Long.prototype.toString.call(message.seconds) : options.longs === Number ? new $util.LongBits(message.seconds.low >>> 0, message.seconds.high >>> 0).toNumber() : message.seconds;
                if (message.nanos != null && message.hasOwnProperty("nanos"))
                    object.nanos = message.nanos;
                return object;
            };

            /**
             * Converts this Timestamp to JSON.
             * @function toJSON
             * @memberof google.protobuf.Timestamp
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Timestamp.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Timestamp;
        })();

        return protobuf;
    })();

    return google;
})();

export { $root as default };
