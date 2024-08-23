// Generated by https://quicktype.io

export interface AppConfig {
  sucess: boolean;
  data: CompactJSON;
  compactJson: CompactJSON;
}

export interface CompactJSON {
  _declaration: Declaration;
  _comment: string;
  Project: Project;
}

export interface Project {
  Info: Info;
  Borders: Borders;
  Fonts: Fonts;
  Pages: Pages;
  Scenes: Borders;
  Schedules: Schedules;
  Irrigation: Irrigation;
  ExceptionDays: Borders;
  Logic: Logic;
  ErrorAppData: Borders;
  HVACData: Borders;
  MeasurementAppData: Borders;
  MonitorData: Borders;
  Locations: Locations;
  FunctionGroups: FunctionGroups;
  Widgets: Widgets;
  ProfileData: ProfileData;
  AppNos: AppNOS;
  Energy: Energy;
  LoadMonitors: Borders;
  ZigBee: ZigBee;
}

export interface AppNOS {
  AppNo: AppNo;
}

export interface AppNo {
  _text: string;
}

export type Borders = unknown;

export interface Energy {
  _attributes: EnergyAttributes;
  Tariffs: Tariffs;
}

export interface Tariffs {
  Tariff: Tariff;
}

export interface Tariff {
  _attributes: TariffAttributes;
}

export interface TariffAttributes {
  id: string;
  Name: string;
  Price: string;
}

export interface EnergyAttributes {
  CarbonFootprint: string;
}

export interface Fonts {
  Font: Font[];
}

export interface Font {
  _attributes: FontAttributes;
}

export interface FontAttributes {
  Index: string;
  CharSet: string;
  Size: string;
  FontStyle: string;
}

export interface FunctionGroups {
  FunctionGroup: FunctionGroup[];
}

export interface FunctionGroup {
  _attributes: FunctionGroupAttributes;
}

export interface FunctionGroupAttributes {
  id: string;
  Name: string;
  FileName: string;
}

export interface Info {
  FileVersion: AppNo;
  Created: AppNo;
  SoftwareName: AppNo;
  ProjectType: AppNo;
  Wiser2DNS: Wiser2DNS;
  ScreenWidth: AppNo;
  ScreenHeight: AppNo;
  ST: St;
  Plain: AppNo;
  CGateIPAddress: AppNo;
  CommandPortNumber: AppNo;
  StatusChangePortNumber: AppNo;
  CGateTest: AppNo;
  CGateTree: AppNo;
  CBusProjectName: AppNo;
  Grid: AppNo;
  Site: Site;
  Installer: { [key: string]: AppNo };
  StartupPage: DarkTimeOut;
  TimeOut: DarkTimeOut;
  DarkTimeOut: DarkTimeOut;
  TimeOutDuration: AppNo;
  TimerPriority: AppNo;
  RampThenOff: AppNo;
  NudgeOnlyOnGroups: AppNo;
  AutoDelSpecialDay: AppNo;
  AutoDelSchedule: AppNo;
  PageTransition: AppNo;
  SubPageTransition: AppNo;
  PageTransitionSpeed: AppNo;
  StartiPodServer: AppNo;
  MediaSkinName: AppNo;
  SlimServer: SlimServer;
  UseIndicatorKill: AppNo;
  PFR: AppNo;
  UnitNo: AppNo;
  Transferred: AppNo;
  RefreshReminder: AppNo;
  Wiser: Wiser;
  ZigBeeProject: ZigBeeProject;
  Profile: AppNo;
  IndependentNetworks: AppNo;
  AppConnectEnabled: AppNo;
  UseTimeSync: AppNo;
  Network: AppNo;
  AppNo: AppNo;
  Bias: AppNo;
  DaylightBias: AppNo;
  StandardDate: DaylightDateClass;
  DaylightDate: DaylightDateClass;
  LocationCountry: AppNo;
  LocationCity: AppNo;
  Longitude: AppNo;
  Latitide: AppNo;
  LockComponents: AppNo;
  AlarmPeriod: AppNo;
  AlarmDuration: AppNo;
  AlarmSnooze: AppNo;
  AlarmSound: Borders;
  AlarmPage: AppNo;
  Metric: AppNo;
  MasterUnit: AppNo;
  EnablePopupEditor: AppNo;
  RemoteAccess: RemoteAccess;
  Networks: Networks;
  TimeFormat: TimeFormat;
}

export interface DarkTimeOut {
  _attributes: DarkTimeOutAttributes;
}

export interface DarkTimeOutAttributes {
  Default: string;
}

export interface DaylightDateClass {
  _attributes: DaylightDateAttributes;
}

export interface DaylightDateAttributes {
  Year: string;
  Month: string;
  Day: string;
  DayOfWeek: string;
  Hour: string;
  Minute: string;
  Second: string;
  MilliSecond: string;
}

export interface Networks {
  Net: Net;
}

export interface Net {
  _attributes: NetAttributes;
}

export interface NetAttributes {
  id: string;
  Network: string;
}

export interface RemoteAccess {
  IPAddress: Borders;
  Port: AppNo;
}

export interface St {
  _attributes: STAttributes;
}

export interface STAttributes {
  Enabled: string;
}

export interface Site {
  ProjName: AppNo;
  ProjLocation: AppNo;
  ProjOwner: AppNo;
}

export interface SlimServer {
  Start: AppNo;
  IPAddress: AppNo;
  Port: AppNo;
  User: Borders;
  PW: Borders;
  MACAddress: Borders;
}

export interface TimeFormat {
  _attributes: TimeFormatAttributes;
}

export interface TimeFormatAttributes {
  Hour: string;
  Day: string;
}

export interface Wiser {
  PGIPAddress: AppNo;
  CBus: St;
  CNI: AppNo;
  PGCNIIPAddress: AppNo;
  PGCNIPort: AppNo;
  PGSubNetMask: AppNo;
  Name: AppNo;
  PGSkinName: AppNo;
  remote: AppNo;
  PGFullScreen: AppNo;
  LEDs: St;
  ExternalHTTPPort: ExternalHTTPPort;
  PGSimIPAddress: AppNo;
  NTP: NTP;
  Portal: Borders;
  PGGatewayAddress: AppNo;
  DNS: AppNo;
  PGRemoteCNI: AppNo;
  PGRemoteProjector: AppNo;
  PGRemoteProject: AppNo;
  User: AppNo;
  PGPW: Borders;
  PGToolsPW: Borders;
  WiFi: WiFi;
  DDNS: Ddns;
  SAMBAClient: SAMBAClient;
  SAMBAServer: SAMBAServer;
  Ripple: Ripple;
  FirmwareURL: Borders;
  DHCP: AppNo;
  language: Language;
}

export interface Ddns {
  _attributes: DDNSAttributes;
}

export interface DDNSAttributes {
  Enabled: string;
  Server: string;
  Host: string;
  User: string;
  PW: string;
}

export interface ExternalHTTPPort {
  _attributes: ExternalHTTPPortAttributes;
}

export interface ExternalHTTPPortAttributes {
  Port: string;
}

export interface NTP {
  _attributes: NTPAttributes;
}

export interface NTPAttributes {
  UseNTP: string;
  URL: string;
  Server: string;
}

export interface Ripple {
  _attributes: RippleAttributes;
}

export interface RippleAttributes {
  Enabled: string;
  RippleMatrixIP: string;
}

export interface SAMBAClient {
  _attributes: SAMBAClientAttributes;
}

export interface SAMBAClientAttributes {
  Enabled: string;
  User: string;
  PW: string;
  Domain: string;
  Host: string;
  Folder: string;
}

export interface SAMBAServer {
  _attributes: SAMBAServerAttributes;
}

export interface SAMBAServerAttributes {
  Enabled: string;
  WorkGroup: string;
}

export interface WiFi {
  _attributes: WiFiAttributes;
}

export interface WiFiAttributes {
  Enabled: string;
  Name: string;
  Sec: string;
  PW: string;
}

export interface Language {
  _attributes: LanguageAttributes;
}

export interface LanguageAttributes {
  id: string;
  name: string;
  shortcode: string;
}

export interface Wiser2DNS {
  _attributes: Wiser2DNSAttributes;
}

export interface Wiser2DNSAttributes {
  Name: string;
}

export interface ZigBeeProject {
  _attributes: ZigBeeProjectAttributes;
}

export interface ZigBeeProjectAttributes {
  Enabled: string;
  ProjectName: string;
  DefaultNetwork: string;
}

export interface Irrigation {
  _attributes: IrrigationAttributes;
  ManualProgram: ManualProgram;
}

export interface ManualProgram {
  _attributes: ManualProgramAttributes;
}

export interface ManualProgramAttributes {
  id: string;
  Name: string;
  Network: string;
  AppNo: string;
  GroupAdd: string;
  Level: string;
  ZoneTimes: string;
}

export interface IrrigationAttributes {
  ZoneOverlap: string;
  MasterOverlap: string;
  PulseDuration: string;
  Network: string;
  EnableAppNo: string;
  EnableGroupAdd: string;
  EnableLevel: string;
  TimeFormat: string;
}

export interface Locations {
  Location: Page[];
}

export interface Page {
  _attributes: PageAttributes;
}

export interface PageAttributes {
  id: string;
  Name: string;
}

export interface Logic {
  Options: Options;
  Const: Const;
  Type: Const;
  Var: Const;
  Init: Const;
}

export interface Const {
  Code: AppNo;
}

export interface Options {
  AutoRestartLogic: AppNo;
  IgnoreLevel0RunTimeErrors: AppNo;
  MaxLogicInstructions: AppNo;
  MaxLogicCBusLoops: AppNo;
  WaitForCBus: AppNo;
}

export interface Pages {
  Page: Page;
}

export interface ProfileData {
  Profiles: Profiles;
  ProfileGroups: Borders;
}

export interface Profiles {
  Profile: Profile;
}

export interface Profile {
  _attributes: ProfileAttributes;
}

export interface ProfileAttributes {
  id: string;
  Name: string;
  User: string;
  PW: string;
  ST: string;
  Admin: string;
  Tools: string;
  Time: string;
  EditPW: string;
  Scenes: string;
  Schedules: string;
  Project: string;
  Enabled: string;
  Locations: string;
  Location: string;
  FunctionGroup: string;
}

export interface Schedules {
  Schedule: Schedule[];
}

export interface Schedule {
  _attributes: ScheduleAttributes;
}

export interface ScheduleAttributes {
  id: string;
  Name: string;
  EnableAppNo: string;
  EnableGroupAdd: string;
  EnableLevel: string;
  Time: string;
  DayOfWeek: string;
  Day: string;
  Month: string;
  Year: string;
  CBusType: string;
  Network: string;
  AppNo: string;
  GroupAdd: string;
  Level: string;
  SpecialFunction: string;
}

export interface Widgets {
  widget: Widget[];
}

export interface Widget {
  _attributes: WidgetAttributes;
  params: Params;
}

export interface WidgetAttributes {
  id: string;
  Service: string;
  type: string;
  name: PurpleName;
  filename: Filename;
  location: string;
  functiongroup: string;
  Template: string;
}

export enum Filename {
  DimmerWidgetPNG = 'dimmer_widget.png',
  RelayWidgetPNG = 'relay_widget.png',
  ShutterRelayWidgetPNG = 'shutter_relay_widget.png',
}

export enum PurpleName {
  GeneralLightingDimmer = 'General Lighting Dimmer',
  GeneralLightingRelay = 'General Lighting Relay',
  ShutterRelay = 'Shutter Relay',
}

export interface Params {
  _attributes: ParamsAttributes;
  param: Param[];
}

export interface ParamsAttributes {
  network: string;
  app: string;
  ga: string;
  label: string;
  icon?: Icon;
  ramprate?: string;
  type?: string;
  speeds?: string;
  button1label?: string;
  button2label?: string;
  button3label?: string;
}

export enum Icon {
  Albums = 'albums',
  LightBulb = 'light_bulb',
}

export interface Param {
  _attributes: ParamAttributes;
}

export interface ParamAttributes {
  name: FluffyName;
  type: string;
  value: string;
}

export enum FluffyName {
  App = 'app',
  Button1Label = 'button1label',
  Button2Label = 'button2label',
  Button3Label = 'button3label',
  Ga = 'ga',
  Icon = 'icon',
  Label = 'label',
  Network = 'network',
  Ramprate = 'ramprate',
  Type = 'type',
}

export interface ZigBee {
  Mappings: Borders;
  Monitorings: Borders;
}

export interface Declaration {
  _attributes: DeclarationAttributes;
}

export interface DeclarationAttributes {
  version: string;
}