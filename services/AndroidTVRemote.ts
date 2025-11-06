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
            console.log('Connected to Android TV')
            this.connected = true
            resolve(true)
          }
        )

        this.socket.on('data', (data: any) => {
          console.log('Received:', data.toString())
        })

        this.socket.on('error', (error: any) => {
          console.error('Socket error:', error)
          this.connected = false
          reject(error)
        })

        this.socket.on('close', () => {
          console.log('Connection closed')
          this.connected = false
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.destroy()
      this.socket = null
      this.connected = false
    }
  }

  isConnected(): boolean {
    return this.connected
  }

  // Send key codes to Android TV
  // These match Android KeyEvent codes
  async sendKey(keyCode: string): Promise<void> {
    if (!this.connected || !this.socket) {
      throw new Error('Not connected to TV')
    }

    // Protocol: Send key event as protobuf message
    // This is a simplified version - full implementation requires protobuf
    const message = this.createKeyEventMessage(keyCode)
    this.socket.write(message)
  }

  private createKeyEventMessage(keyCode: string): Buffer {
    // Simplified message format
    // In production, you'd use protobuf to encode messages properly
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
    // Create a simple buffer with the key code
    return Buffer.from([code])
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
