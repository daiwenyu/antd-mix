export type LocalRouteItemType = {
  access?: string;
  name?: string;
  parentPath?: string;
  path?: string;
  routes?: LocalRouteItemType[];
};

export type AuthMenuItemType = {
  logAction: any;
  name: string;
  meta?: { title: string };
  permission?: string;
  children?: AuthMenuItemType[];
  path?: string;
  builtIn?: boolean;
};

type MenuNameMapType = { [key: string]: string };

export interface CurrentUserConfig {
  // 获取当前用户权限
  getAuth?: () => Promise<any>;
  // 获取当前用户菜单
  menuBuild?: () => Promise<AuthMenuItemType[]>;
  // 菜单名称映射-国际化(未接入权限中心时传入)
  menuNameMap: MenuNameMapType;
  // 本地菜单配置(未接入权限中心时传入)
  routes: LocalRouteItemType[];
}

// 初始化后个人信息
export interface CurrentUserInfo {
  name: string; // 用户名
  email: string; // 用户邮箱
  roles: string[]; // 当前用户的所有权限
  isAdmin: boolean; // 是否是管理员
  accessPage: string[]; // 当前用户有权限的页面
}

type PathMapItemType = {
  // 翻译本地路由配置模块名称
  module?: string[];
  // 本地配置中的权限标识
  access?: string;
  // 根据权限中心配置的权限标识判断是否有权限
  hasAccess?: boolean;
  // 按钮权限标识
  options: {
    [key: string]: {
      logAction: string;
    };
  };
};

export default class CurrentUser {
  // 当前用户信息
  static profile: CurrentUserInfo | null = null;

  // 路径信息映射
  static pathMap: { [key: string]: PathMapItemType } = {};

  // 格式化权限中心菜单、按钮数据
  static formatAuthMenu(authMenuData: AuthMenuItemType[]) {
    const ergodicAuthMenu = (
      amd: AuthMenuItemType[],
      pathArr: string[] = [],
    ) => {
      amd.forEach((menu) => {
        const { path, permission, name, logAction, children } = menu;
        const currPathArr = [...pathArr];
        if (path) {
          currPathArr.push(path?.replaceAll('/', '')!);
        }
        const currPathObj = this.pathMap[`/${currPathArr.join('/')}`];
        if (currPathObj) {
          currPathObj.hasAccess = true;
        }
        if (path === undefined && currPathObj) {
          // 按钮权限
          currPathObj.options[permission!] = {
            logAction: logAction || name,
          };
        }
        if (Array.isArray(children) && children.length > 0) {
          ergodicAuthMenu(children, [...currPathArr]);
        }
      });
    };
    ergodicAuthMenu(authMenuData);
  }

  // 格式化本地菜单权限数据
  static formatLocalMenu(
    routes: LocalRouteItemType[],
    menuNameMap: MenuNameMapType,
  ) {
    const ergodicLocalMenu = (
      rs: LocalRouteItemType[],
      parentMenu?: { path?: string; name?: string[]; module?: string[] },
    ) => {
      rs.forEach((route) => {
        const { path, access, name, routes } = route;
        const nameArr: string[] = [...(parentMenu?.name || [])];
        const moduleArr: string[] = [...(parentMenu?.module || [])];
        if (name) {
          nameArr.push(name);
          const menuKey = ['menu', ...nameArr].join('.');
          moduleArr.push(menuNameMap[menuKey]);
        }
        if (path) {
          this.pathMap[path] = {
            module: [...moduleArr],
            access,
            options: {},
          };
        }
        if (routes) {
          ergodicLocalMenu(routes, {
            path,
            name: nameArr,
            module: moduleArr,
          });
        }
      });
    };
    ergodicLocalMenu(routes);
  }

  static async init({
    getAuth,
    menuBuild,
    menuNameMap,
    routes,
  }: CurrentUserConfig): Promise<CurrentUserInfo> {
    const [authInfo = {}, menuData = []] = await Promise.all(
      [
        getAuth, // 获取用户权限
        menuBuild, // 获取权限中心配置的菜单及按钮
      ].map((v) => {
        if (v) {
          return v();
        } else {
          return Promise.resolve();
        }
      }),
    );

    const { user = {}, roles = [] } = authInfo || {};
    const isAdmin = roles.includes('admin');

    this.formatLocalMenu(routes, menuNameMap);
    this.formatAuthMenu(menuData);

    const accessPage: string[] = [];
    Object.keys(this.pathMap).forEach((path) => {
      const currObj = this.pathMap[path];
      if (currObj.access) {
        if (isAdmin) {
          accessPage.push(currObj.access);
        } else {
          currObj.hasAccess && accessPage.push(currObj.access);
        }
      }
    });
    this.profile = {
      name: user.userName || 'system',
      email: user.email || 'system',
      roles,
      isAdmin,
      accessPage,
    };

    return this.profile;
  }
}
