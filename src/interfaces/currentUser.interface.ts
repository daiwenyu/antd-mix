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

export type MenuNameMapType = { [key: string]: string };
