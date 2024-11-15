//const _ = require('loadsh');
const BaseModule = require('./baseModule');

const Loglevel = {
    ERROR:			0x00,
    WARNING:		0x01,
    DEBUG:			0x02,
    INFO:			0x03,
};

const NepesAICarEvent = {
    // Event Mask : 0x8000
    EVENT_CMD_STATUS:							0x8001,
    EVENT_CMD_VOICE_TO_TEXT : 					0x8002,
    EVENT_CMD_CDS:                  			0x8005, //새로
    EVENT_CMD_COLOR_DETECTED:       			0x8006,  //NEw
    EVENT_CMD_TOF_DETECTED:         			0x8007, // 적외선 거리센서
    EVENT_CMD_LINE_TRACE:           			0x8008,  //라인트레이싱 센서값

    ENTRY_NEPES_CAR_EVENT_LIGHT :				0x9A02,		// Read Light Value
    ENTRY_NEPES_CAR_EVENT_COLOR	:				0x9A03,		// Read Color Value
    ENTRY_NEPES_CAR_EVENT_TOF	:				0x9A04,		// Read Distance Value (mm)
    ENTRY_NEPES_CAR_EVENT_REFLECTIVE :			0x9A05,		// Read Reflective Optical Value

    ENTRY_NEPES_CAR_EVENT_OBJECT_DETECTED :		0x9A84,		// Object detected (< 8cm)
};

const Instruction = {
    // Voice Command
    VOICE_TRIGGER_PRESSED_CMD: 					0x0001,
    VOICE_TRIGGER_RELEASED_CMD: 				0x0002,
    VOICE_TRIGGER_CLICK_CMD:    				0x0003,
    VOICE_TO_TEXT_CMD: 							0x0004,
    TEXT_TO_VOICE_CMD: 							0x0005,
    ASK_AI_VIA_TEXT_CMD:						0x0008,
    VOICE_TRIGGER_STOP_CMD:     				0x0009, 	// Sound stop command

    // Volume Command
    VOLUME_CMD: 								0x0011,		// Volume control

    // External device command
    EXT_DEVICE_PRE_ACTION_CMD:					0x0100,
    EXT_DEVICE_MOTOR_CTRL_CMD:					0x0101,
    EXT_DEVICE_LINE_TRACE_CMD:					0x0102,
    EXT_DEVICE_LED_CTRL_CMD:					0x0103,
    EXT_DEVICE_SENSOR_CMD:						0x0104,
    EXT_DEVICE_TAG_DETECT:						0x0105,
    EXT_DEVICE_LEFT_LED_CMD:    				0x0106, // 새로 만든 것
    EXT_DEVICE_RIGHT_LED_CMD:   				0x0107, //새로
    EXT_DEVICE_MOTOR_SPEED_CMD: 				0x0108, // 모터 속도 조절
    EXT_DEVICE_BOTH_LED_CMD:    				0x0109, 

    ENTRY_NEPES_CAR_CMD_LED	:					0x1A01,		// LED control (RGB, on_off)
    ENTRY_NEPES_CAR_CMD_LIGHT :					0x1A02,		// Request Light Value
    ENTRY_NEPES_CAR_CMD_COLOR :					0x1A03,		// Request Color Value
    ENTRY_NEPES_CAR_CMD_TOF	:					0x1A04,		// Request Distance Value
    ENTRY_NEPES_CAR_CMD_REFLECTIVE :			0x1A05,		// Request Reflective Optical Value for Line Tracing

    ENTRY_NEPES_CAR_CMD_PLAY_SOUND :			0x1B01,		// Request Play noti-sound
    ENTRY_ENPES_CAR_CMD_STOP_SOUND :			0x1B02,		// Request Sound Top
    ENTRY_NEPES_CAR_CMD_LINE_TRACE :			0x1B03,		// Request Line trace (start = 0x01, stop = 0x00)

    ENTRY_NEPES_CAR_CMD_MOTOR_CTRL :			0x1C01,		// Request Motor Control (sub-command and param)

    // Genernal Request
    ENTRY_NEPES_CAR_GET_STATUS:					0xFFFE,

    // PING Request
    EXT_DEVICE_PING:							0xFFFF,
};

const Motor_sub_Instruction = {
    NEPES_CAR_MOTOR_CTRL_SPEED :				0x00000000,
    NEPES_CAR_MOTOR_CTRL_MOVE :					0x00000001,
    NEPES_CAR_NOTOR_CTRL_MOVE_TIME :			0x00000002,
    NEPES_CAR_MOTOR_CTRL_EACH_MOVE :			0x00000003,
};

const NEPES_CAR_PACKET_HEADER = 0xAA55;

class NepesAICarBase extends BaseModule {
    constructor() {
        super();
        this.sp = null;
        this._sendBuffers = [];
        this._receiveBuffer = [];
        this._pingpacket = [];
        this._stt_data = [];
        this._deviceid = 0x0000;
        this._loglevel = Loglevel.DEBUG;
        this._isConnected = false;
        this._sendEntry = false;

        this.state = {
            sensors: [],
            rfid: [],
        };
    }

    init(handler, config) {
        this._writeDebug(Loglevel.DEBUG, 'Initialize');
        this._lasttime = Date.now();
    }

    setSerialPort(sp) {
        this._writeDebug(Loglevel.DEBUG, 'setSerialPort');
        this.sp = sp;
    }

    requestInitialData() {
        this._writeDebug(Loglevel.DEBUG, 'requestInitialData Nepes AI Car');

        this._make_ext_device_ping_packet();

        return this._pingpacket;
    }

    checkInitialData(data, config) {
        this._writeDebug(Loglevel.DEBUG, 'checkInitialData Nepes AI Car');
        return true;
    }

    validateLocalData(data) {
        return true;
    }

    requestRemoteData(handler) {
        if (this._sendEntry) {
            this._writeDebug(Loglevel.DEBUG, 'requestRemoteData(send to browser)');
            handler.write('state', { sensors: this.state.sensors, rfid: this.state.rfid });
            handler.write('state', { sensors: this.state.sensors, rfid: this.state.rfid });
            this._sendEntry = false;
        }
    }

    handleRemoteData(handler) {
        const keys = Object.keys(handler.serverData);

        if (keys.length == 0) {
            return;
        }

        this._writeDebug(Loglevel.DEBUG, `handleRemoteData : ${keys}`);

        keys.forEach(key => this._processRequestData(key, handler.read(key)));
    }

    requestLocalData() {
        if (this.sp === null) {
            return null;
        }

        if (this._pingpacket.length === 0) {
            this._make_telliot_ping_packet();
        }

        //this._writeDebug(Loglevel.DEBUG, 'requestLocalData : Send Ping Data (size = ' + this._pingpacket.length + ')');

        this.sp.write(this._pingpacket);

        return null;
    }

    handleLocalData(data) {
        //this._writeDebug(Loglevel.DEBUG, 'handleLocalData (from device)');
        this.state.sensors = [];
        this.state.rfid = [];
        this._processReveivedData(data);
        //this._receiveBuffer.push(...data);

        //while(this._receiveBuffer.length > 0) {
        //	let length = this._receiveBuffer.length;
        //	this._processReveivedData(this._receiveBuffer);

        //	if (length == this._receiveBuffer.length)
        //		this._receiveBuffer.splice(0, 1);
        //}
    }

    disconnect(connector) {
        this._writeDebug(Loglevel.DEBUG, 'disconnect Nepes AI Car');
        connector.close();
        if (this.sp) {
            delete this.sp;
            this.sp = null;
        }
    }

    reset() {
        this._writeDebug(Loglevel.DEBUG, 'reset');
    }

    /*************************************************************************
	 * Name: checkLogLevel
	 *
	 * Description: Check Log Level
	 *
	 * Returned Value :
	 *************************************************************************/
    _checkLogLevel(level) {
        if (level > this._loglevel) {
            return false;
        } else {
            return true;
        }
    }

    /*************************************************************************
	 * Name: checkLogLevel
	 *
	 * Description: Check Log Level
	 *
	 * Returned Value :
	 *************************************************************************/
    _writeDebug(level, message) {
        if (this._checkLogLevel(level) == true) {
            console.log('[', level, '] : ', message);
        }
    }

    /*************************************************************************
	 * Name: writeArrayData
	 *
	 * Description: Debugging Log Function
	 *
	 * Returned Value :
	 *************************************************************************/
    _writeArrayData(level, buffer, iscommand) {
        if (this._checkLogLevel(level) == true) {
            const messages = Array.from(buffer, (byte) => (`0${(byte & 0xff).toString(16)}`).slice(-2)).join(' ');
            if (iscommand) {
                console.log(`    [ command ] : ${messages}`);
            } else {
                console.log(`    [  event  ] : ${messages}`);
            }
        }
    }

    /*************************************************************************
	 * Name: _isNepesCarPacket
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _isNepesCarPacket(data) {
        if (data[0] == 0xAA && data[1] == 0x55) {
            return true;
        } else {
            return false;
        }
    }

    /*************************************************************************
	 * Name: makeCRCdata
	 *
	 * Description:
	 *
	 * buffer - Command buffer data
	 *
	 * Returned Value :
	 *************************************************************************/
    _add_CRC_data(buffer) {
        const crcdata = [0x00, 0x00];
        let crc = 0;
        const len = buffer.length;

        //this._writeDebug(Loglevel.DEBUG, '_add_CRC_data : buffer length = ' + len);

        for (let index = 0; index < len; index++) {
            crc += buffer[index];
        }

        crc += 1;

        //this._writeDebug(Loglevel.DEBUG, '_add_CRC_data : CRC Data = ' + crc);

        crcdata[0] = crc;
        crcdata[1] = crc >> 8;

        buffer.push(...crcdata);

        return;
    }

    /*************************************************************************
	 * Name: _request_nepes_car_command
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _request_nepes_car_command(cmd, param, param_length = 0) {
        let len = 0;
        const buffer = []; //Buffer.alloc(8);

        len = param_length + 2; // length + CRC

        this._writeDebug(Loglevel.DEBUG, `make_Command : CMD = ${cmd}`);

        buffer.push(NEPES_CAR_PACKET_HEADER, NEPES_CAR_PACKET_HEADER >> 8);
        buffer.push(this._deviceid, this._deviceid >> 8);
        buffer.push(cmd, cmd >> 8);
        buffer.push(len, len >> 8);
        if (param_length > 0) {
            this._writeDebug(Loglevel.DEBUG, `make_Command : param length = ${param_length}`);
            buffer.push(...param);
        }

        this._sendBuffers.length = 0;
        this._sendBuffers.push(...buffer);

        this._add_CRC_data(this._sendBuffers);

        this.sp.write(this._sendBuffers);
    }

    /*************************************************************************
	 * Name: _make_ext_device_ping_packet
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _make_ext_device_ping_packet() {
        let len = 0;
        const buffer = Buffer.alloc(8);

        len = 2; // CRC

        buffer[0] = NEPES_CAR_PACKET_HEADER;
        buffer[1] = NEPES_CAR_PACKET_HEADER >> 8;
        buffer[2] = this._deviceid;
        buffer[3] = this._deviceid >> 8;
        buffer[4] = Instruction.EXT_DEVICE_PING;
        buffer[5] = Instruction.EXT_DEVICE_PING >> 8;
        buffer[6] = len;
        buffer[7] = len >> 8;

        this._pingpacket.length = 0;
        this._pingpacket.push(...buffer);

        this._add_CRC_data(this._pingpacket);
    }

    _getIntData(data) {
        const intdata = data[0] + data[1] << 8 + data[2] << 16 + data[3] << 24;
        data.slice(0, 4);

        return intdata;
    }

    _getUint16Data(data) {
        const intdata = data[0] + data[1] << 8;
        data.slice(0, 2);

        return intdata;
    }

    /*************************************************************************
	 * Name: _processReveivedData
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _processReveivedData(data) {
        const received_data = data.slice();

        if (this._isNepesCarPacket(received_data) === true) {
            const nepes_car_event = received_data[4] | received_data[5] << 8;
            const len = received_data[6] | received_data[7] << 8;

            if (nepes_car_event != 0xFFFF) {
                this._writeArrayData(Loglevel.DEBUG, received_data, false);
                this._writeDebug(Loglevel.DEBUG, `Event : ${nepes_car_event}  len : ${len}`);
            }

            data.slice(0, 8);
            switch (nepes_car_event) {
                case NepesAICarEvent.EVENT_CMD_STATUS :
                    this._writeDebug(Loglevel.DEBUG, 'Received the EVENT_CMD_STATUS');
                    break;
                case NepesAICarEvent.EVENT_CMD_VOICE_TO_TEXT :
                    this._stt_data = [];
                    this._stt_data.push(data.slice(8, len - 2));
                    break;

                case NepesAICarEvent.ENTRY_NEPES_CAR_EVENT_LIGHT :
                    this._writeDebug(Loglevel.DEBUG, 'Received the ENTRY_NEPES_CAR_EVENT_LIGHT');
                    this.state.sensors.light.sensor_direction = this._getIntData(data);
                    this.state.sensors.light.left_value = this._getUint16Data(data);
                    this.state.sensors.light.right_value = this._get_Uint16Data(data);
                    this._writeDebug(Loglevel.DEBUG, `Received : direction : ${this.state.sensors.light.sensor_direction}`);
                    this._writeDebug(Loglevel.DEBUG, `           left : ${this.state.sensors.light.left_value}`);
                    this._writeDebug(Loglevel.DEBUG, `           right : ${this.state.sensors.light.right_value}`);
                    break;

                case NepesAICarEvent.ENTRY_NEPES_CAR_EVENT_COLOR :
                    this._writeDebug(Loglevel.DEBUG, 'Received the ENTRY_NEPES_CAR_EVENT_COLOR');
                    this.state.sensors.color.red_value = data[0];
                    this.state.sensors.color.green_value = data[1];
                    this.state.sensors.color.blue_value = data[2];
                    data.slice(0, 4);
                    this._writeDebug(Loglevel.DEBUG, `Red : ${this.state.sensors.color.red_value}`);
                    this._writeDebug(Loglevel.DEBUG, `Green : ${this.state.sensors.color.green_value}`);
                    this._writeDebug(Loglevel.DEBUG, `Blue : ${this.state.sensors.color.blue_value}`);
                    break;

                case NepesAICarEvent.ENTRY_NEPES_CAR_EVENT_TOF :
                    this._writeDebug(Loglevel.DEBUG, 'Received the ENTRY_NEPES_CAR_EVENT_TOF');
                    this.state.sensors.distance.value = this._getIntData(data);
                    this._writeDebug(Loglevel.DEBUG, `Distance : ${this.state.sensors.distance.value}`);
                    break;

                case NepesAICarEvent.ENTRY_NEPES_CAR_EVENT_REFLECTIVE :
                    this._writeDebug(Loglevel.DEBUG, 'Received the ENTRY_NEPES_CAR_EVENT_REFLECTIVE');
                    this.state.sensors.reflective.sensor_direction = this._getIntData(data);
                    this.state.sensors.reflective.left_value = this._getUint16Data(data);
                    this.state.sensors.reflective.right_value = this._get_Uint16Data(data);
                    this._writeDebug(Loglevel.DEBUG, `Received : direction : ${this.state.sensors.reflective.sensor_direction}`);
                    this._writeDebug(Loglevel.DEBUG, `           left : ${this.state.sensors.reflective.left_value}`);
                    this._writeDebug(Loglevel.DEBUG, `           right : ${this.state.sensors.reflective.right_value}`);
                    break;

                case NepesAICarEvent.ENTRY_NEPES_CAR_EVENT_OBJECT_DETECTED :
                    this._writeDebug(Loglevel.DEBUG, 'Received the ENTRY_NEPES_CAR_EVENT_OBJECT_DETECTED');
                    this.state.sensors.distance.value = this._getIntData(data);
                    if (this.state.sensors.distance.value < 80) {
                        this.state.sensors.distance.object_detected = true;
                    } else {
                        this.state.sensors.distance.object_detected = false;
                    }
                    break;


                default :
                    break;
            }
        } else {
            data.slice(0,1);
        }
    }

    _toUTF8Array(str) {
        const utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) {
                utf8.push(charcode);
            } else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
						  0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
						  0x80 | ((charcode >> 6) & 0x3f),
						  0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10)
						  | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18),
						  0x80 | ((charcode >> 12) & 0x3f),
						  0x80 | ((charcode >> 6) & 0x3f),
						  0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

    /*************************************************************************
	 * Name: _predefined_action
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _predefined_action(action_id, action_value) {
        const param = { action_id, action_value };

        this._writeDebug(Loglevel.DEBUG, `data : ${action_id}  ${action_value}`);
        //this._request_telliot_command(Instruction.EXT_DEVICE_PRE_ACTION_CMD, param, param.length);
    }

    /*************************************************************************
	 * Name: _requestLightData
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _requestLightData() {
        const	direction = 0x000000FF;		// NEPES_CAR_SENSOR_ALL

        this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_LIGHT, direction, direction.length);
    }

    /*************************************************************************
	 * Name: _requestColorData
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _requestColorData() {
        this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_COLOR, null, 0);
    }

    /*************************************************************************
	 * Name: _requestDistanceData
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _requestDistanceData() {
        this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_TOF, null, 0);
    }

    /*************************************************************************
	 * Name: _requestRefectiveData
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _requestRefectiveData() {
        const	direction = 0x000000FF;		// NEPES_CAR_SENSOR_ALL

        this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_REFLECTIVE, direction, direction.length);
    }

    /*************************************************************************
	 * Name: _setMotor
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _setMotor(sub_cmd, data) {
        const param = [];

        console.log(sub_cmd);
        console.log(data);



        if (sub_cmd === 'speed') {
            param.push(Motor_sub_Instruction.NEPES_CAR_MOTOR_CTRL_SPEED);
            keys.forEach(key => {
                const value = parseInt(data[key], 10);  // extract speed value
                param.push(value);
            });

            this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_MOTOR_CTRL, param, param.length);
        } else if (sub_cmd === 'action') {
            param.push(Motor_sub_Instruction.NEPES_CAR_MOTOR_CTRL_MOVE);
            keys.forEach(key => {
                const value = data[key];  // extract speed value
                param.push(value);
            });

            this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_MOTOR_CTRL, param, param.length);
        } else if (sub_cmd === 'action_time') {
            param.push(Motor_sub_Instruction.NEPES_CAR_NOTOR_CTRL_MOVE_TIME);
            keys.forEach(key => {
                const { time, value } = data[key];  // extract speed value
                param.push(time, value);
            });
            this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_MOTOR_CTRL, param, param.length);
        } else if (sub_cmd === 'control') {
            param.push(Motor_sub_Instruction.NEPES_CAR_MOTOR_CTRL_EACH_MOVE);
            keys.forEach(key => {
                const { left_dir, left_sp, right_dir, right_sp } = data[key];  // extract speed value
                param.push(left_dir, left_sp, right_dir, right_sp);
            });
            this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_MOTOR_CTRL, param, param.length);
        } else {
            this._writeDebug(Loglevel.ERROR, `Unknown direction: ${motor_cmd}`);
        }
    }

    /*************************************************************************
	 * Name: _processRequestData
	 *
	 * Description:
	 *
	 * Returned Value :
	 *************************************************************************/
    _processRequestData(command, data) {
        const keys = data ? Object.keys(data) : [];

        this._writeDebug(Loglevel.DEBUG, `command : ${command}`);

        switch (command) {
            case 'rfid_detect' :
                this._writeDebug(Loglevel.DEBUG, `data : ${keys}`);
                this._request_nepes_car_command(Instruction.VOICE_TRIGGER_CLICK_CMD, keys, keys.length);
                break;

                // for nepes
            case 'sensor_read' :
                {
                    const sensor_type = data.type;

                    switch (sensor_type) {
                        case 'light' :		_requestLightData(); 	break;
                        case 'color' :		_requestColorData();	break;
                        case 'distance' :	_requestDistanceData();	break;
                        case 'reflective' :	_requestRefectiveData();	break;
                        default :
                            this._writeDebug(Loglevel.DEBUG, `Unknown Sensor type : ${sensor_type}`);
                            break;
                    }
                }
                break;
            case 'motor' :
                {
                    console.log(keys);
                    keys.forEach(key => this._setMotor(key, data[key]));
                }
                break;
            case 'line_trace' :
                {
                    const bstart = data.cmd;

                    this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_LINE_TRACE, bstart, bstart.length);
                }
                break;

            case 'led_ctrl' :
                {
                    const direction = data ? Object.keys(data) : [];

                    const led_color = [];

                    keys.forEach(key => {
                        const { r, g, b, onoff } = data[key];  // data[key]에서 r, g, b 값을 추출
                        led_color.push(r, g, b, onoff);        // r, g, b 값을 led_color 배열에 추가
                    });

                    this._writeDebug(Loglevel.DEBUG, `LED Color Data: ${led_color.join(', ')}`);

                    // direction 값에 따라 명령어 및 데이터 전송
                    if (direction === 'left') {
                        // 왼쪽 LED 변경 명령어 호출
                        this._request_nepes_car_command(Instruction.EXT_DEVICE_LEFT_LED_CMD, led_color, led_color.length);
                    } else if (direction === 'right') {
                        // 오른쪽 LED 변경 명령어 호출
                        this._request_nepes_car_command(Instruction.EXT_DEVICE_RIGHT_LED_CMD, led_color, led_color.length);
                    } else if (direction === 'both') {
                        // 양쪽 LED 변경 명령어 호출
                        this._request_nepes_car_command(Instruction.EXT_DEVICE_BOTH_LED_CMD, led_color, led_color.length);
                    } else {
                        this._writeDebug(Loglevel.ERROR, `Unknown direction: ${direction}`);
                    }
                }
                break;

            case 'req_voice_trigger_click' :
                {
                    this._request_nepes_car_command(Instruction.VOICE_TRIGGER_CLICK_CMD, null, 0);
                }
                break;

            case 'req_tts' :
                {
                    const str = unescape(data.toString());
                    const arr = this._toUTF8Array(str);

                    this._writeDebug(Loglevel.DEBUG, `data : ${str}`);
                    this._writeArrayData(Loglevel.DEBUG, arr, true);

                    this._request_nepes_car_command(Instruction.TEXT_TO_VOICE_CMD, arr, arr.length);
                }
                break;

            case 'req_stop_sound' :
                {
                    this._request_nepes_car_command(Instruction.ENTRY_ENPES_CAR_CMD_STOP_SOUND, null, 0);
                }
                break;

            case 'req_volume' :
                {
                    const vol = data.volume;

                    this._writeDebug(Loglevel.DEBUG, `set volume: ${vol}`);

                    this._request_nepes_car_command(Instruction.VOLUME_CMD, vol, vol.length);
                }
                break;
            case 'req_play_alert' :
                {
                    const alert_id = data.idx;

                    this._writeDebug(Loglevel.DEBUG, `alert id : ${alert_id}`);

                    this._request_nepes_car_command(Instruction.ENTRY_NEPES_CAR_CMD_PLAY_SOUND, alert_id, alert_id.length);
                }
                break;
            default :
                break;
        }
    }

    /*************************************************************************
	 * Name: _request_telliot_status
	 *
	 * Description: Make command to check port status & values
	 *
	 * Returned Value :
	 *************************************************************************/
    _request_telliot_status() {
        this._writeDebug(Loglevel.DEBUG, '_request_telliot_status');

        this._request_telliot_command(Instruction.GET_STATUS, null);

        //this.sp.write(this._sendBuffers);
        this._sendBuffers = [];
    }
}

module.exports = { NepesAICarBase,	Loglevel, NepesAICarEvent };
