var debugMd = true;
// 思来想去，与其自己做解析，还不如首行写上类型，然后提供一个按钮共用户选择是否粘贴该类型的模板
const Template = {
  bar: `option = {
title:{
    text: '这里是标题',
},
xAxis: {
  type: 'category',
  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  name: 'xAxis',
},
yAxis: {
  type: 'value',
  name: 'yAxis',
},
series: [
  {
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar'
  },
  {
    data: [50,130,120,160,80,150,90],
    type: 'bar'
  }
]
};`,
  line: ``,
  scatter: ``,
  pie: ``,
  polar: ``,
  bar_race: `
`
};
const metaProperty = ['title', 'xlabel', 'ylabel', 'xrange', 'yrange'];
const chartType = ['bar', 'scatter', 'function'];
if (!window.MDexport) { var MDexport = false; }
function nE(e, id = undefined, cla = undefined, html = '') {
  var ele = document.createElement(e);
  id && (ele.id = id);
  cla && (ele.className = cla);
  html && (ele.innerHTML = html);
  return ele;
}

function getTip(str) {
  str = str.split('\n');
  var opt = { title: {}, xAxis: {}, yAxis: {} };
  str.forEach((v) => {
    var t = v.split(':');
    switch (t[0]) {
      case 'title':
        opt.title = {};
        opt.title.text = t[1];
        break;
    }
    if (metaProperty.indexOf(t[0]) >= 0) {
      if (t[0].indexOf('range') >= 0) {
        eval('t[1] = ' + t[1]);
      }
      opt[t[0]] = t[1];
    }
  });
  return opt;
}
function parseCode(pre, nofocus = false) {
  var lines = pre.querySelector('.CodeMirror-code');
  if (!lines) { return; }
  pre.className = "md-fences md-end-block md-diagram md-fences-advanced ty-contain-cm modeLoaded" + (nofocus ? "" : " md-focus");
  var script = '';
  var metaLine;// = lines.children[0].textContent;
  lines.childNodes.forEach((v) => {
    script += v.textContent + '\n';
  });
  script = script.slice(0, -1);
  var ind = script.indexOf('\n');
  if (ind >= 0) {
    metaLine = script.substring(0, ind);
    script = script.substring(ind + 1);
  }
  else {
    debugMd && console.log('Echarts script:', script);
    return;
  }
  var classDiagram = 'option', size = ['100%', '400px'], mode = 'svg', theme = null;
  metaLine.split(' ').forEach((v) => {
    switch (true) {
      case /[ \t]+/.test(v): break;
      case /^\d+x\d+$/.test(v): size = v.split('x'); v[0] += 'px'; v[1] += 'px'; break;
      case /^\d+$/.test(v): size = ['100%', v + 'px']; break;
      case /^svg|canvas$/.test(v): mode = v; break;
      case /^dark$/.test(v): theme = v; break;
      default: break;
    }
  });
  if (size[0] == '100%') {
    size[0] = pre.clientWidth + 'px';
  }
  var diag = pre.querySelector('.md-diagram-panel');
  if (!diag) {
    var diag = nE('div', 0, "md-diagram-panel md-fences-adv-panel", '<div class="md-diagram-panel-header"></div><div class="md-diagram-panel-preview"></div><div class="md-diagram-panel-error"></div>');
    pre.append(diag);
  }
  var chart = diag.querySelector('.md-diagram-panel-preview');
  var error = diag.querySelector('.md-diagram-panel-error');
  chart.style.cssText = `height:${size[1]};width:${size[0]};`;
  var myChart = echarts.init(chart, theme, { renderer: mode, height: size[1] });
  var option;
  if (classDiagram === 'option') {
    // 添加对图例模板的解析代码
    debugMd && console.log(option);
  }
  try {
    eval(script);
    if (option) {
      if (MDexport) { option.animation = false; }
      myChart.setOption(option);
      if (MDexport) {
        pre.firstChild.style.display = 'none';
        pre.style.marginBottom = '0';
      }
      error.innerHTML = '';
    }
    else {
      error.innerHTML = 'ERROR(ECharts@5.4.1, mdEcharts@1.0.1)';
      chart.innerHTML = '';
    }
  }
  catch (err) {
    error.innerHTML = 'ERROR: ' + err + ' (ECharts@5.4.1, mdEcharts@1.0.1)';
  }
  if (!nofocus) {
    var h = 30;
    var d = pre.querySelector('.md-diagram-panel.md-fences-adv-panel');
    d && (h = d.clientHeight + 30);
    pre.style.marginBottom = h + 'px';
  }
}

var write = document.querySelector('div#write');
write.addEventListener("input", (e) => {
  var pre = e.path[3] || {};
  if (pre && pre.lang === 'echarts') {
    parseCode(pre);
  }
});
// click事件被Typora给阻止冒泡了
write.addEventListener("mousedown", (e) => {
  var pre;
  for (let i = 0; i < e.path.length; i++) {
    if (e.path[i].lang === 'echarts') {
      pre = e.path[i];
      // parseCode(pre);
      var h = 30;
      var d = pre.querySelector('.md-diagram-panel.md-fences-adv-panel');
      d && (h = d.clientHeight + 30);
      pre.style.marginBottom = h + 'px';
      break;
    }
  }
});
var styleCustom = nE('style', 'custom', 0);
document.head.appendChild(styleCustom);
// 暂未找到更好的方法确定打开另一个文件
var firstChildText = '·。·';
var intervalFileChange = setInterval(() => {
  if (write.children[0].textContent !== firstChildText) {
    if (write.textContent === '') {
      // 如果是新文档，则默认加上meta信息和自定义style
      // 注入html或者元素都无效（能看到，但是md里面没有），只能模拟系统粘贴或者给用户点击复制然后自行粘贴
      let button = nE('button', 0, 0, '复制meta信息和style样式');
      button.onclick = () => {
        copyStr(`---
title: Typora Note
author: YXP
creator: YXP
subject: Note
keywords: [Typora, Note, Latex, Diagram]
---

\`\`\`style
/* style代码添加css样式，在切换文件时应用，导出时自动隐藏
#write * {
  font-family:SimSun;
  font-size:11pt;
}
*/
\`\`\``);
        button.remove();
      }
      write.appendChild(button);
    }
    // 额外的功能：对```style自主添加样式的支持, 在切换文件时生效
    let sty = write.querySelector('.md-fences.md-end-block[lang=style]');
    if (sty) {
      styleCustom.innerHTML = sty.querySelector('.CodeMirror-code').textContent;
      sty.style.color = '#777';
    } else { styleCustom.innerHTML = ''; }
    firstChildText = write.children[0].textContent;
    var chartCode = write.querySelectorAll('.md-fences.md-end-block[lang=echarts]');
    chartCode.forEach((v) => {
      console.log('Render charts: ', v);
      parseCode(v, nofocus = true);
    });
  }
}, 2000);
if (MDexport) {
  let sty = write.querySelector('.md-fences.md-end-block[lang=style]');
  if (sty) {
    styleCustom.innerHTML = sty.querySelector('.CodeMirror-code').textContent;
    sty.style.display = 'none';
  } else { styleCustom.innerHTML = ''; }
  var chartCode = document.querySelectorAll('.md-fences.md-end-block[lang=echarts]');
  chartCode.forEach((v) => {
    console.log('Render charts: ', v);
    parseCode(v, nofocus = true);
  });
}
var style = nE('style', 0, 0);
style.innerHTML = `
#copyTemp>ul>li:hover {font-weight:bold;background-color:aqua;}
#copyTemp>ul>li {padding:2px 4px 2px 16px;}
`;
document.head.append(style);

var div = nE('div', 'copyTemp', 0, '复制示例代码');
var list = nE('ul', 0, 0, `
<li type="bar">柱形图</li>
<li type="line">折线图</li>
<li type="scatter">散点图</li>
<li type="pie">饼图</li>
<li type="polar">极坐标</li>
<li type="bar_race">柱形追赶图</li>
`);
div.append(list);
list.style.cssText = `
display:none;
border-top:solid 2px #ccc;
text-align:left;
list-style: none;
padding: 0;
margin: 0;
`;
div.style.cssText = `position: fixed;
right: 20px;
top: 10px;
z-index: 999;
border: solid 2px #ccc;
padding: 0;
border-radius: 5px;
background-color: #f8f8f8;
text-align: center;
width:130px;
cursor: pointer;display: none;`;
document.body.append(div);
div.mouseout = true;
// 点击事件
div.onclick = (e) => {
  if (e.target.tagName !== 'LI') { return; }
  copyStr(Template[e.target.type]);
  div.style.display = 'none';

}
div.addEventListener('mouseenter', (e) => {
  div.style.backgroundColor = '#ded';
  div.mouseout = false;
  list.style.display = "block";
})
div.addEventListener('mouseleave', () => {
  div.mouseout = true;
  div.style.backgroundColor = '#f8f8f8';
  list.style.display = "none";
  setTimeout(() => {
    if (div.mouseout) {
      div.style.display = 'none';
    }
  }, 2000)
})
write.addEventListener('click', (e) => {
  // 检查有无正在输入的获得焦点的echarts pre
  if (write.querySelector('pre.md-fences.md-end-block.md-focus[lang=echarts]') && div.style.display !== 'block') {
    // 显示按钮
    div.style.display = 'block';
    div.style.left = (e.screenX + 200) + 'px';
    div.style.top = (e.screenY - 80) + 'px';
    setTimeout(() => {
      if (div.mouseout) {
        div.style.display = 'none';
      }
    }, 2000);
  }
});

function copyStr(str) {
  // 粘贴示例代码，textarea可以多行，input不行
  var input = document.createElement('textarea');
  // 不能设置display none，只能脱离文档流、全透明
  input.style.cssText = 'opacity:0;position:absolute;z-index:-1;';
  document.body.appendChild(input);
  input.value = str;
  input.select();
  document.execCommand("Copy");
  input.remove();
}


