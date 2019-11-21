// function handleErr(msg,url,l)
// {
// txt="There was an error on this page.\n\n"
// txt+="Error: " + msg + "\n"
// txt+="URL: " + url + "\n"
// txt+="Line: " + l + "\n\n"
// txt+="Click OK to continue.\n\n"
// alert(txt)
// return true
// }
export default class errorListener {
  constructor() {
    this.error = window.onerror;
  }
  init() {
    this.error = this.handlerErr;
  }
  handlerErr(msg, url, l) {
    let txt = `代码错误信息:\n\n`;
    txt += `Error:` + msg + `\n`;
    txt += `URL:` + url + `\n`;
    txt += `line:` + l + `\n`;
    console.log(txt);
    return true;
  }
}
