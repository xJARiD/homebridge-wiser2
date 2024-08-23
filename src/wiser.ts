'use strict';

import { EventEmitter } from 'events';
import { Logging } from 'homebridge';
import crypto from 'crypto';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
import pkg from 'websocket';
import { AppConfig, Project } from './interface.js';
import {
  AccessoryAddress,
  DeviceType,
  GroupSetEvent,
  WiserProjectGroup,
} from './models.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { client: WebSocketClient, connection } = pkg;
type WebSocketConnection = InstanceType<typeof connection>;

export class Wiser extends EventEmitter {
  private wiserURL: string;
  private socketURL: string;
  private wiserAuth: string;
  private socket: WebSocketConnection | null = null;
  private initialRetryDelay = 5000;
  private retryDelay = this.initialRetryDelay;

  constructor(
    public address: string,
    public port: number = 443,
    public username: string,
    public password: string,
    public log: Logging,
  ) {
    super();

    this.wiserURL = `https://${this.address}:${this.port}`;
    this.socketURL = this.wiserURL.startsWith('https')
      ? `wss://${this.address}`
      : `ws://${this.address}`;

    const hashedPassword = crypto
      .createHash('sha256')
      .update(this.password, 'utf8')
      .digest('hex');
    this.wiserAuth = Buffer.from(
      `${this.username}:${hashedPassword}`,
      'utf8',
    ).toString('base64');

    this.log.debug('hashedPassword', hashedPassword);
    this.log.debug('wiserAuth', this.wiserAuth);
  }

  async start() {
    try {
      this.log.debug('***Connecting***');
      const wsConnect = await this.connectSocket();
      this.socket = wsConnect;
      this.log.debug('***Connected***');
      this.getLevels();

      this.socket.on('message', (message) => {
        if (message.type === 'utf8') {
          this.log.debug(`Received: ${message.utf8Data}`);

          const xmlString = message.utf8Data as string;

          type ParsedDataType = {
            [key: string]: { [x: string]: string; command: string };
          };

          const parser = new XMLParser();
          const parsedData: ParsedDataType = parser.parse(xmlString);
          this.log.debug(`Parsed data: ${JSON.stringify(parsedData)}`);

          for (const [name, attrs] of Object.entries(parsedData)) {
            this.handleWiserData(name, attrs);
          }
        }
      });

      this.socket.on('close', () => {
        this.log.warn('Wiser socket closed');
        this.socket = null;
        this.handleConnectFailure('Socket closed');
      });

      try {
        const projectGroups = await this.getProject();
        this.emit('retrievedProject', projectGroups);
      } catch (error) {
        this.log.error('Failed to retrieve project', error);
        this.handleConnectFailure('Failed to retrieve project');
      }
    } catch (error) {
      this.log.error('Failed to connect socket', error);
      this.handleConnectFailure('Connection error');
    }
  }

  handleConnectFailure(error: string) {
    this.log.error(
      `Error connecting to wiser - ${error}. Will retry in ${
        this.retryDelay / 1000
      }s`,
    );
    setTimeout(() => {
      this.start();
    }, this.retryDelay);
    this.retryDelay = this.retryDelay * 2;
  }

  async connectSocket(): Promise<WebSocketConnection> {
    return new Promise((resolve, reject) => {
      const wsClient = new WebSocketClient();

      wsClient.on('connectFailed', (error) => {
        this.log.error('Connect Error: ' + error.toString());
        reject(error);
      });

      wsClient.on('connect', (connection) => {
        this.log.debug('WebSocket Client Connected');
        resolve(connection);

        connection.on('error', (error) => {
          this.log.error('Connection Error: ' + error.toString());
        });
      });

      // Connect with custom headers
      wsClient.connect(this.socketURL, undefined, this.wiserURL, {
        'sec-websocket-protocol': this.wiserAuth.replaceAll('=', ''),
      });
    });
  }

  async getProject(): Promise<WiserProjectGroup[]> {
    const url = `${this.wiserURL}/picedXml/appConfig`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${this.wiserAuth}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseBody = (await response.json()) as AppConfig;
    return this.parseProject(responseBody.data.Project);
  }

  private parseProject(project: Project): WiserProjectGroup[] {
    this.log.debug('project', project);
    const widgets = project.Widgets.widget;
    this.log.debug('widgets', widgets);

    const groups: WiserProjectGroup[] = [];

    for (const widget of widgets) {
      const params = widget.params;
      const app = params._attributes.app;
      const ga = params._attributes.ga;
      const name = params._attributes.label;
      const network = params._attributes.network;

      if (
        typeof app !== 'undefined' &&
        typeof ga !== 'undefined' &&
        typeof name !== 'undefined' &&
        typeof network !== 'undefined'
      ) {
        const deviceTypeMap: { [key: string]: DeviceType } = {
          '1': DeviceType.dimmer,
          '16': DeviceType.blind,
          '25': DeviceType.fan,
        };

        const deviceType: DeviceType =
          deviceTypeMap[widget._attributes.type] || DeviceType.switch;

        const fanSpeeds: number[] = [];
        if (deviceType === DeviceType.fan) {
          const speeds = params._attributes.speeds?.split('|');

          if (speeds) {
            for (const speed of speeds) {
              fanSpeeds.push(parseInt(speed));
              fanSpeeds.sort();
            }
          }
        }

        const group = new WiserProjectGroup(
          name,
          new AccessoryAddress(parseInt(network), parseInt(ga)),
          deviceType,
          fanSpeeds,
          app,
        );

        this.log.debug(
          `New group ${group.address.network}:${group.address.groupAddress} of type ${group.deviceType}`,
        );

        groups.push(group);
      }
    }

    return groups;
  }

  handleWiserData(
    name: string,
    attrs: { [x: string]: string; command: string },
  ) {
    if ('cbus_event' === name && 'cbusSetLevel' === attrs.name) {
      const group = parseInt(attrs.group);
      const level = parseInt(attrs.level);
      this.log.debug(`Setting ${group} to ${level}`);
      this.emit('groupSet', new GroupSetEvent(group, level));
    } else if ('cbus_resp' === name && 'cbusGetLevel' === attrs.command) {
      const levels = attrs.level.split(',');
      for (let i = 0; i < levels.length - 1; i++) {
        const level = parseInt(levels[i]);
        this.log.debug(`Setting level ${level} for ${i}`);
        this.emit('groupSetScan', new GroupSetEvent(i, level));
      }
    }
  }

  setGroupLevel(address: AccessoryAddress, level: number, ramp = 0) {
    const url = `${this.wiserURL}/socketEvents`;
    // eslint-disable-next-line max-len
    const cmd = `<cbus_cmd app="56" command="cbusSetLevel" network="${address.network}" numaddresses="1" addresses="${address.groupAddress}" levels="${level}" ramps="${ramp}"/>`;
    this.log.debug(cmd);
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.wiserAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cmd: cmd }),
    });
  }

  private getLevels() {
    const url = `${this.wiserURL}/socketEvents`;
    const cmd =
      '<cbus_cmd app="0x38" command="cbusGetLevel" numaddresses="256" />';
    this.log.debug(cmd);
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.wiserAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cmd: cmd }),
    });
  }
}