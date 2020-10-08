/* disable-sort-imports */
/// <reference path="global.d.ts" />
import { Event } from 'global/Event'
import { EventTarget } from 'global/EventTarget'
import { XMLHttpRequest } from 'global/XMLHttpRequest'
import { XMLHttpRequestUpload } from 'global/XMLHttpRequestUpload'
import { WebSocket } from 'global/WebSocket'
import { Dezel } from './core/Dezel'

global.Event = Event
global.EventTarget = EventTarget
global.XMLHttpRequest = XMLHttpRequest
global.XMLHttpRequestUpload = XMLHttpRequestUpload
global.WebSocket = WebSocket