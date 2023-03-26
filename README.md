# mdECharts

`<font color="blue">在Typora中实现输入代码通过ECharts解析成图表的功能</font>`

## 安装

1. 下载 `echarts.min.js`和 `parsecharts`文件，保存至Typora安装目录下或其他合适位置
2. 打开 `C:\Program Files\Typora\resources\window.html`（或者你的自定义安装目录下的该文件），在文件末尾 `</html>`前添加如下语句（前后顺序不能换，注意 `file://`以及路径分隔符用 `/`）

   ```html
   <script src="file://D:/yourSavePath/echarts.min.js"></script>
   <script src="file://D:/yourSavePath/parsecharts.js"></script>
   ```
3. 重新启动Typora即可输入相关语法。

或者您也可以编辑 `D:\Program Files\Typora\resources\appsrc\window\frame.js`，在最后加入下载的两个文件的内容。

### 导出PDF、HTML

文件->偏好设置->导出->PDF->插入额外内容

```html
<style>
body {margin:0 !important;padding:0 24px !important;} /*个人设置，可以去除*/
.md-diagram-panel-preview, svg {page-break-inside: avoid;} /*防止图像被分隔在两页*/
</style>
<script src="file://D:/Infinate/Project/mdECharts/echarts.min.js"></script>
<script>var MDexport = true;// 导出时需要立即绘制、禁用动画</script>
<script src="file://D:/Infinate/Project/mdECharts/parsecharts.js"></script>
```

## 开发说明
