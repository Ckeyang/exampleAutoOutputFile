export default {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.querySelector('input').focus();
  },
  update: function (el, binding) {
    if (binding.value && !binding.oldValue) {
      el.children[0].focus()
    }
  }
}