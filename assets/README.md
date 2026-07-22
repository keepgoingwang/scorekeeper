# assets 静态资源

存放图片、图标等静态资源。按用途分子目录：

```
assets/
  tabbar/      底部 Tab 图标（home.png / home-active.png / profile.png / profile-active.png）
  icons/       通用图标
  images/      页面配图、品牌 Logo
  skins/       牌桌皮肤背景图（可选，亦可用纯色变量）
```

> 当前 `app.json` 的 tabBar 未配置图标（仅文字），如需图标请将图片放入 `assets/tabbar/` 并在 `app.json` 的 `tabBar.list` 各项补充 `iconPath` 与 `selectedIconPath`。
