export interface TrackConfig {
  // 应用ID
  appId: string;
  // 接口地址
  serverUrl?: string;
  // 是否开启调试模式
  debug?: boolean;
  // 是否自动上报错误信息，默认不上报
  autoReportError?: boolean;
  // 当前登录用户信息
  userProfile?: UserProfile;
  // 路由前缀
  base?: string;
}

// 埋点信息类型
export enum TrackTypeEnum {
  error = '错误信息',
  visit = '页面访问',
  event = '用户触发',
  api = '接口触发',
}

export type TrackType = keyof typeof TrackTypeEnum;

// 用户信息
export interface UserProfile {
  // 工号
  userId: string;
  // 用户名
  userName: string;
}

// 系统信息
export interface SystemProfile {
  // 自定义设备序列号
  IMEI: string;
  // 视口高度
  innerHeight: number;
  // 视口宽度
  innerWidth: number;
  // 当前页面地址
  href: string;
  // 当前时间
  systemTime: Date;
}

// 自定义埋点信息
export interface CustomizeProfile {
  // 操作内容
  content: string;
  // 模块
  module: string;
  // 其他信息
  [key: string]: any;
}

// 错误信息
export interface ErrorProfile {
  // 错误发生的文件名
  fileName: string;
  // 错误信息
  message: string;
}
