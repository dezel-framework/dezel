import { $binaryType } from 'web/private/WebSocket'
import { $bufferedAmount } from 'web/private/WebSocket'
import { $extensions } from 'web/private/WebSocket'
import { $protocol } from 'web/private/WebSocket'
import { $readyState } from 'web/private/WebSocket'
import { $url } from 'web/private/WebSocket'
import { bridge } from 'native/bridge'
import { native } from 'native/native'
import { CloseEvent } from 'web/Event'
import { Event } from 'web/Event'
import { MessageEvent } from 'web/Event'
import { ProgressEvent } from 'web/Event'
import { EventTarget } from 'web/EventTarget'
import { Exception } from 'web/Exception'

@bridge('dezel.global.WebSocket')

/**
 * @class WebSocket
 * @super EventTarget
 * @since 0.1.0
 */
export class WebSocket extends EventTarget {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * @const CONNECTING
	 * @since 0.1.0
	 */
	public static readonly CONNECTING = 0

	/**
	 * @const OPEN
	 * @since 0.1.0
	 */
	public static readonly OPEN = 1

	/**
	 * @const CLOSING
	 * @since 0.1.0
	 */
	public static readonly CLOSING = 2

	/**
	 * @const CLOSED
	 * @since 0.1.0
	 */
	public static readonly CLOSED = 3

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * @property url
	 * @since 0.1.0
	 */
	public get url(): string {
		return this[$url]
	}

	/**
	 * @property protocol
	 * @since 0.1.0
	 */
	public get protocol(): string {
		return this[$protocol]
	}

	/**
	 * @property extensions
	 * @since 0.1.0
	 */
	public get extensions(): string {
		return this[$extensions]
	}

	/**
	 * @property protocol
	 * @since 0.1.0
	 */
	public get readyState(): number {
		return this[$readyState]
	}

	/**
	 * @property binaryType
	 * @since 0.1.0
	 */
	public get binaryType(): string {
		return this[$binaryType]
	}

	/**
	 * @property binaryType
	 * @since 0.1.0
	 */
	public set binaryType(value: string) {
		this[$binaryType] = value
	}

	/**
	 * @property bufferedAmount
	 * @since 0.1.0
	 */
	public get bufferedAmount(): number {
		return this[$bufferedAmount]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 0.1.0
	 */
	public constructor(url: string, protocols: string | Array<string> = '') {

		super()

		if (protocols) {
			protocols = Array.isArray(protocols) ? protocols : [protocols]
		}

		if (url.startsWith('ws') == false &&
			url.startsWith('wss') == false) {
			this[$readyState] = WebSocket.CLOSED
			throw Exception.create(Exception.Code.SyntaxError)
		}

		native(this).open(url, protocols)
	}

	/**
	 * @method send
	 * @since 0.1.0
	 */
	public send(data: string) {

		if (this.readyState == WebSocket.CONNECTING) {
			throw Exception.create(Exception.Code.InvalidStateError)
		}

		if (this.readyState == WebSocket.CLOSING ||
			this.readyState == WebSocket.CLOSED) {
			return
		}

		native(this).send(data)
	}

	/**
	 * @method send
	 * @since 0.1.0
	 */
	public close(code?: number, reason?: number) {

		if (this.readyState == WebSocket.CLOSING ||
			this.readyState == WebSocket.CLOSED) {
			return
		}

		if (this[$readyState] == WebSocket.CONNECTING) {
			this[$readyState] = WebSocket.CLOSING
			return
		}

		this[$readyState] = WebSocket.CLOSING

		native(this).close(code, reason)
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $url
	 * @since 0.1.0
	 * @hidden
	 */
	private [$url]: string = ''

	/**
	 * @property $protocol
	 * @since 0.1.0
	 * @hidden
	 */
	private [$protocol]: string = ''

	/**
	 * @property $extensions
	 * @since 0.1.0
	 * @hidden
	 */
	private [$extensions]: string = ''

	/**
	 * @property $readyState
	 * @since 0.1.0
	 * @hidden
	 */
	private [$readyState]: number = 0

	/**
	 * @property $binaryType
	 * @since 0.1.0
	 * @hidden
	 */
	private [$binaryType]: string = ''

	/**
	 * @property $bufferedAmount
	 * @since 0.1.0
	 * @hidden
	 */
	private [$bufferedAmount]: number = 0

	//--------------------------------------------------------------------------
	// Native API
	//--------------------------------------------------------------------------

	/**
	 * @method nativeOnConnect
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnConnect(protocol: string, extensions: string) {

		if (this.readyState != WebSocket.CONNECTING) {
			this.nativeOnDisconnect()
			return
		}

		this[$readyState] = WebSocket.OPEN

		this[$protocol] = protocol
		this[$extensions] = extensions

		this.dispatchEvent(new Event('open'))
	}

	/**
	 * @method nativeOnReceiveData
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnReceiveData(data: any) {

	}

	/**
	 * @method nativeOnReceiveMessage
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnReceiveMessage(message: string) {

		if (this.readyState != WebSocket.OPEN) {
			return
		}

		this.dispatchEvent(new MessageEvent('message', { data: message }))
	}

	/**
	 * @method nativeOnDisconnect
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnDisconnect() {
		if (this[$readyState] != WebSocket.CLOSED) {
			this[$readyState] = WebSocket.CLOSED
			this.dispatchEvent(new CloseEvent('close'))
		}
	}

	/**
	 * @method nativeOnError
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnError() {

	}
}

/*
 * Global Export
 */

; (global as any).WebSocket = WebSocket