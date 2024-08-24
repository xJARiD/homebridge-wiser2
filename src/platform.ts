'use strict';

import type {
  API,
  Characteristic,
  DynamicPlatformPlugin,
  Logging,
  PlatformAccessory,
  PlatformConfig,
  Service,
} from 'homebridge';
import { PLATFORM_NAME, PLUGIN_NAME } from './settings.js';
import {
  GroupSetEvent,
  WiserDevice,
  WiserProjectGroup,
  DeviceType,
  AccessoryAddress,
} from './models.js';
import { Wiser } from './wiser.js';
import { WiserAccessory } from './wiseraccessory.js';
import { WiserBlind } from './wiserblind.js';
import { WiserBulb } from './wiserbulb.js';
import { WiserFan } from './wiserfan.js';
import { WiserSwitch } from './wiserswitch.js';

export class WiserPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  private wiserAddress: string;
  private wiserPort: number;
  private username: string;
  private password: string;
  private wiser: Wiser;
  private wiserGroups: Record<number, WiserAccessory> = {};
  private ignoredAddresses: AccessoryAddress[] = [];

  constructor(
    public readonly log: Logging,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;

    this.log.debug('Finished initializing platform:', this.config.name);

    this.wiserAddress = this.config.wiserAddress;
    this.wiserPort = this.config.wiserPort;
    this.username = this.config.wiserUsername;
    this.password = this.config.wiserPassword;

    if (undefined !== this.config.ignoredGAs) {
      for (const address of this.config.ignoredGAs) {
        const ignore = new AccessoryAddress(address.network, address.ga);
        this.log.debug(`Adding ${ignore} to ignore list`);
        this.ignoredAddresses.push(ignore);
      }
    }

    this.wiser = new Wiser(
      this.wiserAddress,
      this.wiserPort,
      this.username,
      this.password,
      log,
    );

    // When this event is fired it means Homebridge has restored all cached accessories from disk.
    // Dynamic Platform plugins should only register new accessories after this event was fired,
    // in order to ensure they weren't added to homebridge already. This event can also be used
    // to start discovery of new accessories.
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      this.wiser.start();

      this.wiser.on(
        'retrievedProject',
        (projectGroups: WiserProjectGroup[]) => {
          for (const group of projectGroups) {
            const ignored = this.isIgnored(group.address);
            if (ignored) {
              this.log.info(`Ignoring ${group.name}(${group.address})`);
            } else {
              this.addDevice(group);
            }
          }
        },
      );

      this.wiser.on('groupSet', (groupSetEvent: GroupSetEvent) => {
        this.setGroup(groupSetEvent);
      });

      this.wiser.on('groupSetScan', (groupSetEvent: GroupSetEvent) => {
        this.setGroup(groupSetEvent, false);
      });
    });
  }

  setGroup(groupSetEvent: GroupSetEvent, missingGroupIsError = true) {
    const accessory = this.wiserGroups[groupSetEvent.groupAddress];
    if (undefined !== accessory) {
      this.log.debug(
        `Setting ${accessory.name}(${accessory.id}) to ${groupSetEvent.level}`,
      );
      accessory.setStatusFromEvent(groupSetEvent);
    } else {
      if (missingGroupIsError) {
        if (
          !this.isIgnored(new AccessoryAddress(254, groupSetEvent.groupAddress))
        ) {
          this.log.warn(
            `Could not find accessory to handle event for ${groupSetEvent.groupAddress}`,
          );
          this.log.warn(
            `Consider adding \n{\n"network":254,\n"ga":${groupSetEvent.groupAddress}\n}\n to the "ignoredGAs" config`,
          );
        }
      }
    }
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  addDevice(group: WiserProjectGroup) {
    const device = new WiserDevice(
      group.name,
      group.name,
      group.address.groupAddress,
      group,
      this.wiser,
    );

    if (undefined !== this.wiserGroups[device.id]) {
      // this.log.warn(`Ignoring duplicate device for group address ${device.id}`);
      return;
    }

    this.log.debug(`Adding group ${device.id}`);

    const uuid = this.api.hap.uuid.generate(
      `${group.address.network}-${group.application}-${device.id}`,
    );
    const existingAccessory = this.accessories.find(
      (accessory) => accessory.UUID === uuid,
    );

    let wiserAccessory;

    if (existingAccessory) {
      // the accessory already exists
      this.log.info(
        'Restoring existing accessory from cache:',
        existingAccessory.displayName,
      );
      existingAccessory.context.device = device;
      wiserAccessory = this.createAccessory(device, existingAccessory);
    } else {
      this.log.info('Adding new accessory:', device.displayName);
      const accessory = new this.api.platformAccessory(
        device.displayName,
        uuid,
      );
      accessory.context.device = device;
      wiserAccessory = this.createAccessory(device, accessory);
      // link the accessory to your platform
      this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [
        accessory,
      ]);
    }
    this.wiserGroups[device.id] = wiserAccessory;
  }

  createAccessory(
    device: WiserDevice,
    accessory: PlatformAccessory,
  ): WiserAccessory {
    const deviceTypeMap = new Map<
      DeviceType,
      new (
        platform: WiserPlatform,
        accessory: PlatformAccessory,
      ) => WiserAccessory
        >([
          [DeviceType.switch, WiserSwitch],
          [DeviceType.dimmer, WiserBulb],
          [DeviceType.fan, WiserFan],
          [DeviceType.blind, WiserBlind],
        ]);

    const AccessoryClass = deviceTypeMap.get(
      device.wiserProjectGroup.deviceType,
    );

    if (AccessoryClass) {
      return new AccessoryClass(this, accessory);
    } else {
      this.log.error(
        `Unknown device type ${device.wiserProjectGroup.deviceType}`,
      );
      return new WiserSwitch(this, accessory); // Fallback to default
    }
  }

  private isIgnored(checkAddress: AccessoryAddress): boolean {
    let ignored = false;
    for (const address of this.ignoredAddresses) {
      if (
        address.network === checkAddress.network &&
        address.groupAddress === checkAddress.groupAddress
      ) {
        ignored = true;
      }
    }
    return ignored;
  }
}
