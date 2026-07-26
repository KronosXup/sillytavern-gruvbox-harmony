# 字体/图标 CDN 备选（国内直连）

主题默认用 `cdn.jsdelivr.net` 加载字体。如果没梯子加载慢或超时，换下面任一镜像：

## npm 包镜像（替换 `cdn.jsdelivr.net`）

| 镜像 | 示例用法（把 cdn.jsdelivr.net 换成下面域名） | 稳定性 |
|------|------------------------------------------|--------|
| `fastly.jsdelivr.net` | jsdelivr 官方 Fastly 节点，国内时通时不通 | 一般 |
| `unpkg.zhimg.com` | 知乎前端公共库，覆盖主流 npm 包 | 稳 |
| `cdn.baomitu.com` | 75CDN / 360 前端公共库 | 稳 |
| `jsd.cdn.zzko.cn` | 个人维护的 jsdelivr 反代 | 还行 |

## 用法

把主题 CSS 开头的 @import 里的 `cdn.jsdelivr.net` 域名替换成上面任何一个。

比如换霞鹜文楷：
```
原：https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-web@latest/style.css
改：https://unpkg.zhimg.com/lxgw-wenkai-screen-web@latest/style.css
```

## 注意事项

- **`unpkg.zhimg.com`** 对 npm 包覆盖最全，优先推荐
- **`cdn.baomitu.com`** 同步比 mirror 慢半拍，刚发的 npm 包可能没缓存
- 只改字体 @import 那几行，主题其他东西不动
- 如果梯子一直开着就不用折腾

## Online 版图标

Online 版的图标走 `api.iconify.design`，国内一般能直连（没被墙）。如果也加载慢，换 Harmony 版用本地图标即可。
