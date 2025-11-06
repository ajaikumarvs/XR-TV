import { Buffer } from 'buffer'
import TcpSocket from 'react-native-tcp-socket'

// Android TV Remote Service Protocol
// Uses port 6466 for the remote control protocol
const ANDROID_TV_PORT = 6466

export interface TVDevice {
  name: string
  host: string
  port: number
}

export class AndroidTVRemote {
  private socket: any = null
  private connected: boolean = false
  private host: string
  private port: number
  private authenticated: boolean = false
  private pairingCode: string | null = null

  constructor(host: string, port: number = ANDROID_TV_PORT) {
    this.host = host
    this.port = port
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = TcpSocket.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            console.log('TCP connection established to Android TV')
            this.connected = true
            // Send pairing request
            this.sendPairingRequest()
            resolve(true)
          }
        )

        this.socket.on('data', (data: Buffer) => {
          console.log('Received from TV (hex):', data.toString('hex'))
          console.log('Received from TV (length):', data.length)
          this.handleResponse(data)
        })

        this.socket.on('error', (error: any) => {
          console.error('Socket error:', error)
          this.connected = false
          reject(error)
        })

        this.socket.on('close', () => {
          console.log('Connection closed by TV')
          this.connected = false
          this.authenticated = false
        })

        this.socket.on('timeout', () => {
          console.log('Connection timeout')
          this.socket.destroy()
          reject(new Error('Connection timeout'))
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  private sendPairingRequest() {
    // Import the protocol encoder
     
    const { AndroidTVProtocol } = require('./AndroidTVProtocol')
    
    // Send pairing request with proper protocol buffer encoding
    const clientName = 'XR-TV Remote'
    const message = AndroidTVProtocol.encodePairingRequest(clientName, 2)
    
    console.log('Sending pairing request:', message.toString('hex'))
    this.socket.write(message)
  }

  private handleResponse(data: Buffer) {
    // Parse response from TV
    if (data.length === 0) return
    
     
    const { AndroidTVProtocol } = require('./AndroidTVProtocol')
    
    console.log('Parsing response...')
    const parsed = AndroidTVProtocol.parseResponse(data)
    console.log('Parsed response:', JSON.stringify(parsed, null, 2))
    
    // Check for pairing response (field 2) or pairing secret (field 3)
    if (parsed.field_2 || parsed.field_3) {
      console.log('Pairing response received')
      this.authenticated = true
      
      // Check for pairing code in the response
      if (parsed.field_1_str) {
        this.pairingCode = parsed.field_1_str
        console.log('Pairing code:', this.pairingCode)
      }
    }
    
    // Check for success message (field 4)
    if (parsed.field_4) {
      console.log('Connection successful')
      this.authenticated = true
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.destroy()
      this.socket = null
      this.connected = false
      this.authenticated = false
    }
  }

  isConnected(): boolean {
    return this.connected && this.authenticated
  }

  getPairingCode(): string | null {
    return this.pairingCode
  }

  // Send key codes to Android TV
  async sendKey(keyCode: string): Promise<void> {
    if (!this.connected || !this.socket) {
      throw new Error('Not connected to TV')
    }

    if (!this.authenticated) {
      throw new Error('Not authenticated with TV. Pairing may be required.')
    }

    console.log(`Sending key: ${keyCode}`)
    
    // Send key event (SHORT press)
    const keyMessage = this.createKeyEventMessage(keyCode, 'short')
    this.socket.write(keyMessage)
  }

  private createKeyEventMessage(keyCode: string, _action: string): Buffer {
     
    const { AndroidTVProtocol } = require('./AndroidTVProtocol')
    
    // Android KeyEvent codes
    const keyCodeMap: { [key: string]: number } = {
      DPAD_UP: 19,
      DPAD_DOWN: 20,
      DPAD_LEFT: 21,
      DPAD_RIGHT: 22,
      DPAD_CENTER: 23,
      BACK: 4,
      HOME: 3,
      MENU: 82,
      VOLUME_UP: 24,
      VOLUME_DOWN: 25,
      VOLUME_MUTE: 164,
      POWER: 26,
      MEDIA_PLAY_PAUSE: 85,
      MEDIA_PLAY: 126,
      MEDIA_PAUSE: 127,
      MEDIA_NEXT: 87,
      MEDIA_PREVIOUS: 88,
    }

    const code = keyCodeMap[keyCode] || 0
    // Direction: 0 = START_LONG, 1 = END_LONG, 2 = SHORT
    // For simple press, we use SHORT (2)
    const direction = 2
    
    const message = AndroidTVProtocol.encodeKeyEvent(code, direction)
    console.log(`Key event message (${keyCode}):`, message.toString('hex'))
    return message
  }

  // Convenience methods for common actions
  async up() { return this.sendKey('DPAD_UP') }
  async down() { return this.sendKey('DPAD_DOWN') }
  async left() { return this.sendKey('DPAD_LEFT') }
  async right() { return this.sendKey('DPAD_RIGHT') }
  async select() { return this.sendKey('DPAD_CENTER') }
  async back() { return this.sendKey('BACK') }
  async home() { return this.sendKey('HOME') }
  async menu() { return this.sendKey('MENU') }
  async volumeUp() { return this.sendKey('VOLUME_UP') }
  async volumeDown() { return this.sendKey('VOLUME_DOWN') }
  async volumeMute() { return this.sendKey('VOLUME_MUTE') }
  async power() { return this.sendKey('POWER') }
  async playPause() { return this.sendKey('MEDIA_PLAY_PAUSE') }
  async next() { return this.sendKey('MEDIA_NEXT') }
  async previous() { return this.sendKey('MEDIA_PREVIOUS') }
}
