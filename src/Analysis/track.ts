import Cookies from 'js-cookie';
import pako from 'pako';
import { generateRandomString } from '../Utils/common';

declare global {
  interface Window {
    [Track.key]: TrackConfig;
  }
}
export interface TrackConfig {
  // 接受埋点数据的接口地址
  serverUrl: string;
  // 是否开启调试模式
  debug?: boolean;
  // 是否自动上报错误信息，默认不上报
  autoReportError?: boolean;
  // 当前用户信息
  userProfile?: UserProfile;
}

// 用户信息
export interface UserProfile {
  // 工号
  id: string;
  // 用户名
  userName: string;
  // 邮箱
  email: string;
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
  time: number;
}

// 事件信息
export interface EventProfile {
  // 事件类型 click 点击事件 view 浏览事件
  type: 'click' | 'view';
  [key: string]: any;
}

// 错误信息
export interface ErrorProfile {
  // 错误发生的文件名
  filename: string;
  // 错误信息
  message: string;
}

export class Track {
  static readonly key = Symbol('track');

  // 获取Track Symbol Key
  static getKey() {
    return this.key;
  }

  // 检查必填配置项
  static checkConfig(config?: TrackConfig) {
    if (!config?.serverUrl) {
      throw new Error('serverUrl is required');
    }
  }

  // 发送埋点数据
  static async send(data: any = {}) {
    const config = window[Track.key];
    this.checkConfig(config);
    const compressed = pako.deflate(
      JSON.stringify({
        ...data,
        systemProfile: this.getSystemProfile(),
        userProfile: this.getUserProfile(),
      }),
    );
    await fetch(config.serverUrl, {
      method: 'POST',
      body: compressed,
      // headers: {
      //   Accept: 'application/x-raw',
      // },
    });
  }

  // 挂载初始配置
  static mountInitData(config: TrackConfig) {
    window[Track.key] = config;
  }

  // 挂载自动化任务
  static mountAutoTask() {
    const { autoReportError } = window[this.key];
    if (autoReportError) {
      // 短时间内推送超过10个错误，关闭监听
      window.addEventListener('error', (event) => {
        const { message, filename } = event;

        const errorProfile: ErrorProfile = {
          message,
          filename,
        };
        this.send({ errorProfile });
      });
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
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      href: location.href,
      time: Date.now(),
      IMEI: Cookies.get('__IMEI__')!,
    };
  }

  // 获取当前用户信息，返回格式化后的用户信息
  static getUserProfile(): UserProfile {
    let userProfile = (window[this.key].userProfile as UserProfile) || {};
    if (!userProfile?.id) {
      userProfile.id = '';
    }
    if (!userProfile?.userName) {
      userProfile.userName = '';
    }
    if (!userProfile?.email) {
      userProfile.email = '';
    }
    return userProfile;
  }

  // 设置当前用户信息
  static setUserProfile(userProfile: UserProfile) {
    window[this.key].userProfile = userProfile;
  }

  // 推送埋点信息
  static async push(data: EventProfile) {
    await this.send({
      eventProfile: data,
    });
  }

  static init(config: TrackConfig) {
    this.checkConfig(config);
    this.mountInitData(config);
    this.mountAutoTask();
  }
}
