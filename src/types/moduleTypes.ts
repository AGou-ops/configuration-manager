
export interface ModuleData {
  id: string;
  name: string;
  icon: string;
  version: string;
}

export interface Module {
  id: string;
  name: string;
  icon: string;
  items: ModuleData[];
}
