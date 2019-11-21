import MathJax from 'MathJax';
export default function mathJax(id) {
  return MathJax.Hub.Queue(['Typeset', MathJax.Hub], id || document);
}
export function mathJaxConfig() {
  return MathJax.Hub.Config({
    showProcessingMessages: false, //关闭js加载过程信息
    messageStyle: 'none', //不显示信息
    extensions: ['tex2jax.js'],
    jax: ['input/TeX', 'output/HTML-CSS'],
    tex2jax: {
      inlineMath: [['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]'], ['$', '$']],
      processEscapes: true,
      skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a'], //避开某些标签
      ignoreClass: 'comment-content' //避开含该Class的标签
    },
    'HTML-CSS': {
      availableFonts: ['STIX', 'TeX'], //可选字体
      showMathMenu: true //关闭右击菜单显示
    }
  });
}
