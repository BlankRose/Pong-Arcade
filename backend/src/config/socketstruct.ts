import { Socket } from "socket.io";

/**
 * SocketStruct:
 * 
 * Extends the base Socket class from socket.io to add user and data properties.
 * The structure is mainly used in event calls by websockets and extended with
 * the required information by the WsGuard class.
 * 
 * @extends		Socket
 * @property	{number} user - The user id of the socket.
 * @property	{string} data - The data of the socket.
 * */
class SocketStruct extends Socket {
	user: number;
	data: string;
}

export { SocketStruct };
