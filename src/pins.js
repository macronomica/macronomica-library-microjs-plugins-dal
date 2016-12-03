export const PIN_PLUGIN = { role: 'plugin', module: 'dal-common' };
export const PIN_OPTIONS = { ...PIN_PLUGIN, cmd: 'options' };
export const PIN_CONNECTION = { ...PIN_PLUGIN, cmd: 'connection' };

export const PIN_LIST = { ...PIN_PLUGIN, module: 'dal-list', schema: '*' };
export const PIN_TREE = { ...PIN_PLUGIN, module: 'dal-tree', schema: '*' };

export const PIN_LIST_FIND_ONE = { ...PIN_LIST, action: 'find-one', criteria: '*' };
export const PIN_LIST_FIND_LIST = { ...PIN_LIST, action: 'find-list' };
export const PIN_LIST_COUNTS = { ...PIN_LIST, action: 'count', criteria: '*' };
export const PIN_LIST_CREATE = { ...PIN_LIST, action: 'create', params: '*' };
export const PIN_LIST_UPDATE = { ...PIN_LIST, action: 'update', criteria: '*', params: '*' };
export const PIN_LIST_REMOVE = { ...PIN_LIST, action: 'remove', criteria: '*' };

export const PIN_TREE_FIND_PATH = { ...PIN_TREE, action: 'find-path', criteria: '*' };
export const PIN_TREE_FIND_PARENT_id = { ...PIN_TREE, action: 'find-parent-id', criteria: '*' };
export const PIN_TREE_CREATE = { ...PIN_TREE, action: 'create', params: '*' };
export const PIN_TREE_UPDATE = { ...PIN_TREE, action: 'update', criteria: '*', params: '*' };
export const PIN_TREE_REMOVE = { ...PIN_TREE, action: 'remove', criteria: '*' };
