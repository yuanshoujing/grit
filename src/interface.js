/**
 * @namespace
 *
 * @property {string} [name]  - 名称
 * @property {boolean} [reactive=true] - 自动响应模式
 * @property {!Object} data 数据对象
 * @property {!function} template 模板函数
 * @property {Object} [children] 子组件集合
 * @property {Object} [events] 事件集合
 * @property {function} prepare 预备
 * @property {function} mounted 挂载后
 *
 */
const grit = {
  name: "名称",
  reactive: true,

  data: {},
  template(data) {
    // 返回使用 data 渲染的 HTML 片断
  },

  children: {
    "grit-1": grit,
    "grit-2": grit,
  },

  events: {
    ".btn": {
      click: "clickHandle",
      keypress: "keypressHandle",
    },
  },

  clickHandle() {},

  keypressHandle() {},

  prepare() {
    return Promise.resolve();
  },

  mounted() {},
};
