import { Buffer } from 'buffer'

// Android TV Remote Protocol v2 Message Encoder
// Based on the official Android TV Remote Protocol

export class AndroidTVProtocol {
  // Encode a pairing request message
  static encodePairingRequest(clientName: string, serviceVersion: number = 2): Buffer {
    // PairingRequest message structure:
    // message PairingRequest {
    //   optional string client_name = 1;
    //   optional int32 service_version = 2;
    // }
    
    const clientNameBytes = Buffer.from(clientName, 'utf8')
    const parts: Buffer[] = []
    
    // Field 1: client_name (tag: 0x0A = field 1, wire type 2 = length-delimited)
    parts.push(Buffer.from([0x0A]))
    parts.push(this.encodeVarint(clientNameBytes.length))
    parts.push(clientNameBytes)
    
    // Field 2: service_version (tag: 0x10 = field 2, wire type 0 = varint)
    parts.push(Buffer.from([0x10]))
    parts.push(this.encodeVarint(serviceVersion))
    
    const message = Buffer.concat(parts)
    
    // Wrap in outer message with tag 0x0A (field 1, wire type 2)
    const wrapped = Buffer.concat([
      Buffer.from([0x0A]),
      this.encodeVarint(message.length),
      message
    ])
    
    return wrapped
  }

  // Encode a key event message
  static encodeKeyEvent(keyCode: number, direction: number): Buffer {
    // RemoteKeyCode message structure:
    // message RemoteKeyCode {
    //   optional int32 keycode = 1;
    //   optional Direction direction = 2;
    // }
    // enum Direction {
    //   START_LONG = 0;
    //   END_LONG = 1;
    //   SHORT = 2;
    // }
    
    const parts: Buffer[] = []
    
    // Field 1: keycode (tag: 0x08 = field 1, wire type 0 = varint)
    parts.push(Buffer.from([0x08]))
    parts.push(this.encodeVarint(keyCode))
    
    // Field 2: direction (tag: 0x10 = field 2, wire type 0 = varint)
    parts.push(Buffer.from([0x10]))
    parts.push(this.encodeVarint(direction))
    
    const message = Buffer.concat(parts)
    
    // Wrap in outer message with tag 0x12 (field 2, wire type 2)
    const wrapped = Buffer.concat([
      Buffer.from([0x12]),
      this.encodeVarint(message.length),
      message
    ])
    
    return wrapped
  }

  // Encode a pairing secret message
  static encodePairingSecret(secret: string): Buffer {
    const secretBytes = Buffer.from(secret, 'utf8')
    const parts: Buffer[] = []
    
    // Field 1: secret (tag: 0x0A = field 1, wire type 2 = length-delimited)
    parts.push(Buffer.from([0x0A]))
    parts.push(this.encodeVarint(secretBytes.length))
    parts.push(secretBytes)
    
    const message = Buffer.concat(parts)
    
    // Wrap in outer message with tag 0x1A (field 3, wire type 2)
    const wrapped = Buffer.concat([
      Buffer.from([0x1A]),
      this.encodeVarint(message.length),
      message
    ])
    
    return wrapped
  }

  // Encode varint (variable-length integer)
  private static encodeVarint(value: number): Buffer {
    const bytes: number[] = []
    while (value > 0x7F) {
      bytes.push((value & 0x7F) | 0x80)
      value >>>= 7
    }
    bytes.push(value & 0x7F)
    return Buffer.from(bytes)
  }

  // Decode varint
  static decodeVarint(buffer: Buffer, offset: number = 0): { value: number; length: number } {
    let value = 0
    let shift = 0
    let length = 0
    
    while (offset + length < buffer.length) {
      const byte = buffer[offset + length]
      length++
      
      value |= (byte & 0x7F) << shift
      
      if ((byte & 0x80) === 0) {
        return { value, length }
      }
      
      shift += 7
    }
    
    return { value: 0, length: 0 }
  }

  // Parse a response message
  static parseResponse(buffer: Buffer): any {
    if (buffer.length === 0) return null
    
    const result: any = {}
    let offset = 0
    
    while (offset < buffer.length) {
      // Read field tag
      const tagResult = this.decodeVarint(buffer, offset)
      if (tagResult.length === 0) break
      
      const tag = tagResult.value
      offset += tagResult.length
      
      const fieldNumber = tag >>> 3
      const wireType = tag & 0x07
      
      if (wireType === 2) { // Length-delimited
        const lengthResult = this.decodeVarint(buffer, offset)
        offset += lengthResult.length
        
        const fieldData = buffer.slice(offset, offset + lengthResult.value)
        offset += lengthResult.value
        
        result[`field_${fieldNumber}`] = fieldData
        
        // Try to parse as string
        try {
          result[`field_${fieldNumber}_str`] = fieldData.toString('utf8')
        } catch {
          // Not a valid string
        }
      } else if (wireType === 0) { // Varint
        const valueResult = this.decodeVarint(buffer, offset)
        offset += valueResult.length
        result[`field_${fieldNumber}`] = valueResult.value
      }
    }
    
    return result
  }
}
