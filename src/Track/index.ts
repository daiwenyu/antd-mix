import Cookies from 'js-cookie';
import pako from 'pako';
import CurrentUser from '../CurrentUser';
import { generateRandomString } from '../Utils';
import {
  CustomizeProfile,
  ErrorProfile,
  SystemProfile,
  TrackConfig,
  TrackType,
  UserProfile,
} from '../interfaces/track.interface';

class Track {
  static config = {} as TrackConfig;
  static userProfile = {} as UserProfile;

  // 埋点队列
  static trackQueue: any[] = [];

  // 检查必填配置项
  static checkConfig(config?: TrackConfig) {
    if (!config) {
      throw new Error('Track config is required');
    }
    if (!config.appId) {
      throw new Error('Track config appId is required');
    }
    if (CurrentUser.profile === null) {
      throw new Error('请先调用CurrentUser对象设置系统信息');
    }
    this.config = config;
  }

  // 发送埋点数据
  static async send() {
    const data = this.trackQueue.splice(0, this.trackQueue.length);
    const compressed = pako.deflate(JSON.stringify(data));
    if (data.length) {
      navigator.sendBeacon(this.config.serverUrl!, compressed);
    }
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

    //关闭页面时，发送剩余的埋点数据
    addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.send();
      }
    });
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
  static init({ userProfile, ...restConfig }: TrackConfig) {
    this.checkConfig(restConfig);
    this.config = restConfig;
    if (userProfile) {
      this.setUserProfile(userProfile);
    } else {
      this.setUserProfile({
        userId: CurrentUser.profile?.email!,
        userName: CurrentUser.profile?.name!,
      });
    }
    this.mountAutoTask();
  }

  // 推送埋点信息进入队列
  static pushQueue({
    type,
    log,
  }: {
    type: TrackType;
    log: ErrorProfile | CustomizeProfile;
  }) {
    const config = this.config;
    this.checkConfig(config);
    const reqData = {
      ...this.getSystemProfile(),
      ...this.getUserProfile(),
      type,
      appId: config.appId,
      log: JSON.stringify(log),
    };

    this.trackQueue.push(reqData);
    if (this.trackQueue.length > 4) {
      this.send();
    }
  }

  // 获取格式化base后的路径
  static getFormatBasePath() {
    const { base = '/' } = this.config;
    const { pathname } = location;
    return pathname.replace(base, '/');
  }

  // 获取模块名称
  static getPageModuleName(): string[] {
    let routeNames: string[] = [];
    const { pathMap } = CurrentUser;
    if (pathMap) {
      routeNames = pathMap[this.getFormatBasePath()].module || [];
    }
    return routeNames;
  }

  // 推送错误日志
  static errorLog(errorLog: ErrorProfile) {
    this.pushQueue({
      log: errorLog,
      type: 'error',
    });
  }

  // 推送用户触发日志
  static eventLog(eventLog: CustomizeProfile | string) {
    if (typeof eventLog === 'string') {
      const routeNames: string[] = this.getPageModuleName();
      eventLog = {
        module: routeNames.join('-'),
        content:
          '触发: ' +
          CurrentUser.pathMap[this.getFormatBasePath()]?.options?.[eventLog!]
            ?.logAction,
      };
    }
    this.pushQueue({
      log: eventLog as CustomizeProfile,
      type: 'event',
    });
  }

  // 推送页面访问日志
  static visitLog(visitLog?: CustomizeProfile) {
    if (visitLog === undefined) {
      visitLog = { module: '', content: '' };
      const routeNames = this.getPageModuleName();
      Object.assign(visitLog, {
        module: routeNames.join('-'),
        content: `访问页面: ${[...routeNames].pop()}`,
      });
    }
    this.pushQueue({
      log: visitLog,
      type: 'visit',
    });
  }

  // 推送接口访问日志
  static apiLog(apiLog: any) {
    this.pushQueue({
      log: apiLog,
      type: 'api',
    });
  }
}

export default Track;
