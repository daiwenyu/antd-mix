import Cookies from 'js-cookie';
import pako from 'pako';
import { generateRandomString } from '../Utils';

export interface TrackConfig {
  // 应用ID
  appId: string;
  // 接口地址
  serverUrl?: string;
  // 是否开启调试模式
  debug?: boolean;
  // 是否自动上报错误信息，默认不上报
  autoReportError?: boolean;
}

// 埋点信息类型
enum TrackTypeEnum {
  // 错误
  error = 'error',
  // 页面访问
  visit = 'visit',
  // 用户页面触发
  event = 'event',
  // 接口触发
  api = 'api',
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

class Track {
  static config = {} as TrackConfig;
  static userProfile = {} as UserProfile;

  // 检查必填配置项
  static checkConfig(config?: TrackConfig) {
    if (!config) {
      throw new Error('Track config is required');
    }
    if (!config.appId) {
      throw new Error('Track config appId is required');
    }
    this.config = config;
  }

  // 发送埋点数据
  static async send({
    type,
    data,
  }: {
    type: TrackType;
    data: ErrorProfile | CustomizeProfile;
  }) {
    const config = this.config;
    this.checkConfig(config);
    const reqData = {
      ...this.getSystemProfile(),
      ...this.getUserProfile(),
      type,
      appId: config.appId,
      data: JSON.stringify(data),
    };
    const compressed = pako.deflate(JSON.stringify(reqData));
    await fetch(config.serverUrl!, {
      method: 'POST',
      body: compressed,
    });
  }

  // 挂载自动化任务
  static mountAutoTask() {
    const { autoReportError } = this.config;
    if (autoReportError) {
      // TODO 短时间内推送超过10个错误，关闭监听
      addEventListener('error', (event) => {
        const { message, filename } = event;
        const errorInfo: ErrorProfile = {
          message: message,
          fileName: filename,
        };
        this.errorLog(errorInfo);
      });

      // 监听点击事件
      // addEventListener(
      //   'click',
      //   (event) => {
      //     const { target } = event;
      //     console.log(target.parentElement);
      //   },
      //   true
      // );
    }
  }

  // 获取系统信息
  static getSystemProfile(): SystemProfile {
    const IMEI = Cookies.get('__IMEI__');
    if (!IMEI) {
      Cookies.set('__IMEI__', generateRandomString(16), {
        expires: 90,
      });
    }
    return {
      innerHeight: innerHeight,
      innerWidth: innerWidth,
      href: location.href,
      systemTime: new Date(),
      IMEI: Cookies.get('__IMEI__')!,
    };
  }

  // 获取当前用户信息，返回格式化后的用户信息
  static getUserProfile(): UserProfile {
    let userProfile = this.userProfile;
    if (!userProfile?.userId) {
      userProfile.userId = '';
    }
    if (!userProfile?.userName) {
      userProfile.userName = '';
    }
    return userProfile;
  }

  // 设置当前用户信息
  static setUserProfile(userProfile: UserProfile) {
    this.userProfile = userProfile;
  }

  // 挂载初始配置
  static init(config: TrackConfig) {
    this.checkConfig(config);
    this.config = config;
    this.mountAutoTask();
  }

  // 推送错误日志
  static async errorLog(errorLog: ErrorProfile) {
    await this.send({
      data: errorLog,
      type: 'error',
    });
  }

  // 推送用户触发日志
  static async eventLog(eventLog: CustomizeProfile) {
    await this.send({
      data: eventLog,
      type: 'event',
    });
  }

  // 推送页面访问日志
  static async visitLog(visitLog: CustomizeProfile) {
    await this.send({
      data: visitLog,
      type: 'visit',
    });
  }

  // 推送接口访问日志
  static async apiLog(apiLog: any) {
    await this.send({
      data: apiLog,
      type: 'api',
    });
  }
}

export default Track;
