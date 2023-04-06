// 创建提示面板
const Tips = document.createElement("div");
Tips.id = "snippets";
Tips.style.cssText = `
position: absolute;
display: none;
max-width:250px;
max-height:500px;
background-color: #F0F0F0;
`;
Tips.innerHTML = `
<div><span>类型图标</span><span>内容</span><span>全部内容</span></div>
`;
Tips.display = false;
var Instream = ""; // 输入流
var Selected = ""; // 选择的snippet入口名

// 绑定点击事件
write.addEventListener("click", Tips.Latex);
// 提示条
const latexSnippets = {
  keyword: {
    mathrm: {
      icon: "",
      snip: "",
    },
  },
};
Tips.keydown = (e) => {
  let tar = e.originalTarget;
  let key = e.key;
  let a = key.charCodeAt(0);
  if (key.length == 1 && !e.metaKey && !e.altKey && !e.shiftKey && (isA(a)||key.indexOf('Left')>0||key.indexOf('Right')>0)) {
    // 输入了字母，开始确定左右符号间隔内的文字
    Instream = '';
    let i = tar.selectionStart;
    a = tar.value;
    while (i >= 0 && isA(a[i])) {
      Instream = a[i--] + Instream;
    }
    i = tar.selectionStart + 1;
    while (i < a.length && isA(a[i])) {
      Instream += a[i++];
    }
    if (Instream) {
      // 输入指针周围存在英文，搜索提示
      Tips.freshTip(Instream);
    }
    else{Tips.clear();}
  }
  if (Tips.display) {
    // Tips显示了，且按下上下方向键或Enter
    if (key.indexOf('Down')>0 || key.indexOf('Up')>0 || key==='Enter') {
      if (key.indexOf("Down") > 0) { Tips.nextTip(); }
      else if (key.indexOf("Up") > 0) { Tips.prevTip(); }
      else {Tips.enterHint();}
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
  }
};
Tips.Latex = () => {
  let math = document.querySelector("div.mathjax-block.md-math-block.md-focus");
  // 如果点击使得存在focus的latex语段，且之前未绑定过事件，则绑定keydown事件
  if (math && !math.binded) {
    math.addEventListener("keydown", keydown);
    math.binded = true;
  } else {
    Instream = "";
  }
};
function isA(s) {
  return /^[a-zA-Z]$/.test(s);
}
Tips.freshTip = (k) =>{}
Tips.newTip = (o) => {
  let d = document.createElement("div");
  d.innerHTML = `<span>${o.icon}</span><span>${o.snip}</span><span>${o.text}</span>`;
  Tips.append(d);
};
Tips.nextTip = () => {};
Tips.prevTip = () => {};
Tips.enterHint = () =>{};
Tips.clear = ()=>{}