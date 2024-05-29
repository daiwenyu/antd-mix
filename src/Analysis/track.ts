declare global {
  interface Window {
    [Track.key]: TrackConfig;
    Track?: Track;
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
  // 当前操作系统及浏览器信息
  // userAgent: string;
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
    await fetch(config.serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        ...data,
        systemProfile: this.getSystemProfile(),
        userProfile: this.getUserProfile(),
      }),
    });
  }

  // 挂载初始配置
  static mountInitData(config: TrackConfig) {
    const { debug } = config;
    window[Track.key] = config;
    if (debug) {
      window.Track = this;
    }
  }

  // 挂载自动化任务
  static mountAutoTask() {
    const { autoReportError } = window[this.key];
    if (autoReportError) {
      // 短时间内推送超过10个错误，关闭监听
      window.addEventListener('error', (event) => {
        console.log('error', event);
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
    return {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth,
      // userAgent: navigator.userAgent,
      href: location.href,
      time: Date.now(),
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
