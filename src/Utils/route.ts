export type RouteItem = {
  access?: string;
  name?: string;
  parentPath?: string;
  path?: string;
  routes?: RouteItem[];
};

export type AccessItemType = {
  name: string;
  logAction: string;
  isMenu: boolean;
};

export type MenuItemType = {
  logAction: any;
  name: string;
  meta?: { title: string };
  permission?: string;
  children?: MenuItemType[];
  path?: string;
};

export class RouteUtil {
  // 路由信息映射 path -> RouteItem
  static routeMap: {
    [key: string]: RouteItem;
  } = {};

  // 权限信息映射 path -> AccessItemType
  static accessMap: {
    [key: string]: AccessItemType;
  } = {};

  static menuNameMap: {
    [key: string]: string;
  } = {};

  static setRoute(arr: RouteItem[], parentPath?: string) {
    arr.forEach((item) => {
      if (item.path) {
        this.routeMap[item.path] = {
          access: item.access,
          name: item.name,
          parentPath,
        };
      }
      if (item.routes) {
        this.setRoute(item.routes, item.path);
      }
    });
  }

  static setAccess(arr: MenuItemType[]) {
    arr.forEach((item: MenuItemType) => {
      if (item.permission) {
        this.accessMap[item.permission] = {
          name: item.name,
          logAction: item.logAction,
          isMenu: item.path !== undefined,
        };
      }
      if (item.children) {
        this.setAccess(item.children);
      }
    });
  }

  static setMenuNameMap(obj: { [key: string]: string }) {
    this.menuNameMap = obj;
  }

  // 通过当前路径获取页面名称
  static formatRouteNames(currentPath: string): string[] {
    let pageTitles: string[] = [];
    let flag = true;

    const findName = (path: string) => {
      const { name, parentPath } = this.routeMap[path] || {};
      pageTitles.unshift(name as string);
      if (parentPath) {
        currentPath = parentPath;
      } else {
        flag = false;
      }
    };
    do {
      findName(currentPath);
    } while (flag);

    // 翻译页面名称
    let nameNode = 'menu';
    pageTitles.forEach((item: any, index: number) => {
      nameNode += `.${item}`;
      pageTitles[index] =
        this.menuNameMap[nameNode as keyof typeof this.menuNameMap];
    });

    return pageTitles.filter((item) => item);
  }
}
