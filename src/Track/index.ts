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

// 用户信息
export interface UserProfile {
  // 工号
  userId: string;
  // 用户名
  userName: string;
  // 邮箱
  // email: string;
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

export enum TrackEventTypeEnum {
  query = '查询',
  add = '新增',
  update = '修改',
  delete = '删除',
  export = '导出',
}

// 业务事件埋点信息
export interface TrackEventProfile {
  // 事件类型 click 点击事件 view 浏览事件
  eventType: keyof typeof TrackEventTypeEnum;
  // 操作内容
  content: string;
  // 模块
  module: string;
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
  static async send(data: any = {}) {
    const config = this.config;
    this.checkConfig(config);
    const reqData = {
      ...data,
      ...this.getSystemProfile(),
      ...this.getUserProfile(),
      appId: config.appId,
    };
    const compressed = pako.deflate(JSON.stringify(reqData));
    await fetch(config.serverUrl!, {
      method: 'POST',
      body: compressed,
    });
  }

  // 挂载初始配置
  static mountInitData(config: TrackConfig) {
    this.config = config;
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
        this.send({ errorInfo: JSON.stringify(errorInfo), type: 'error' });
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

  // 推送业务事件埋点信息
  static async push(eventData: TrackEventProfile) {
    await this.send({ eventData: JSON.stringify(eventData), type: 'event' });
  }

  static init(config: TrackConfig) {
    this.checkConfig(config);
    this.mountInitData(config);
    this.mountAutoTask();
  }
}

export default Track;
