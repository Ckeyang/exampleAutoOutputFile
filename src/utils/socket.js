const SockJS = window.SockJS;
const stomp = window.Stomp;

let socketService = {
  client: null,
  createClient(url, any = {}, options = {}) {
    this.client = null;
    let socket = new SockJS(url, any, options);
    this.client = stomp.over(socket);
    return this;
  },
  connect(callback, reConnect) {
    this.client.connect({ "X-Auth-Token": sessionStorage.getItem("token") }, callback.bind(this), reConnect);
  },
  removeClient() {
    this.client.disconnect();
    // this.client = null;
  }
};
export default socketService;
