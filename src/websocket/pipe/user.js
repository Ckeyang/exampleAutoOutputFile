function userInfo() {
  console.log('userInfo 链接')
  this.subscribe('/topic/projects.info', function(res) {
    // window.postMessage("test", res);
    // console.log(res);
  })
}
export { userInfo }
