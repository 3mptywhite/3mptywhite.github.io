---
layout: default
date: 2026-07-27
title: Midjourney 官方生图参数整理
parent: "[[aigc/midjourney/index|Midjourney]]"
grand_parent: "[[aigc/index|AIGC]]"
nav_order: 1
---

整理当前静态图片生成中常用的 Midjourney 参数、版本兼容性和网页功能。

> 更新日期：2026-07-23
>
> 资料范围：仅使用 Midjourney 官方文档与官方更新日志。
>
> 范围：只包含静态图片生成；不包含视频参数。
>
> 当前默认模型：Midjourney V8.1。
>
> 重要：官方的 Parameter List 会同时列出多个模型版本的参数，并不代表每个参数都能在 V8.1 中使用。

官方依据：[Parameter List](https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List) · [Version / Compatibility](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version) · [Legacy Features](https://docs.midjourney.com/hc/en-us/articles/33329788681101-Legacy-Features)

---

## 参数书写规则

所有内置参数都放在提示词正文末尾：

```text
a red fox walking through a snowy forest --ar 3:2 --chaos 10 --stylize 200 --raw
```

规则：

- 正文和第一个参数之间要有空格。
- 参数以两个连续短横线 `--` 开头。
- 参数名和数值之间要有空格。
- 参数区后面不要再写正文。
- 参数后不要带句号、中文逗号等标点。
- 同一个参数通常只写一次；重复出现时不要依赖其行为。

---

## 当前静态生图参数总表

### 构图、审美和随机性

| 完整参数 | 缩写 | 作用 | 取值与默认值 | 版本 | 示例与重要限制 |
| --- | --- | --- | --- | --- | --- |
| --aspect W:H | --ar W:H | 设置宽高比 | 默认 1:1；不能写小数 | V6、V7、V8.1 | --ar 16:9；最大约 14:1，V8.1 HD 最大约 4:1；极端比例可能不稳定 |
| --chaos N | --c N | 控制同一批结果之间的差异程度 | 0–100，默认 0 | V6、V7、V8.1 | --chaos 20；越高，四张图差异越大，也越可能偏离提示词 |
| --stylize N | --s N | 控制 Midjourney 默认艺术美学的介入强度 | 0–1000，默认 100 | V6、V7、V8.1 | --s 500；低值更听正文，高值更艺术化但可能不够准确 |
| --weird N | --w N | 增加古怪、非常规、实验性结果 | 0–3000，默认 0 | V5 及以后 | --weird 800；与 seed 不完全兼容 |
| --exp N | 无 | 实验性美学强度，增加细节、动态感、创造性和 tone-mapped 观感 | 0–100，默认 0；官方建议重点试 5/10/25/50/100 | V7、V8.1 | --exp 25；越高可能越不听提示词，并压过 --s、--p |
| --raw | 无 | 减少模型自动添加的默认风格，让正文拥有更直接的控制权 | 开关型，无数值 | V5.1 及以后 | --raw；常用于写实、产品图、精确风格描述 |
| --no 内容 | 无 | 排除不需要的内容 | 无固定范围 | V6、V7、V8.1 | --no text, watermark, fruit；系统会独立理解每个词，不要写容易被拆错的词组 |
| --tile | 无 | 生成边缘可无缝衔接的单张纹理图块 | 开关型 | V6、V7、V8.1 | floral fabric pattern --tile；Upscale 可能破坏无缝边缘 |
| --seed N | 无 | 固定初始噪声，方便做参数 A/B 测试 | 整数 0–4294967295；未指定时随机 | V6、V7、V8.1 | --seed 12345；V8.1 官方称相同 seed 约 99% 一致；不能用来保存角色或风格 |

官方依据：[Aspect Ratio](https://docs.midjourney.com/hc/en-us/articles/31894244298125-Aspect-Ratio) · [Chaos](https://docs.midjourney.com/hc/en-us/articles/32099348346765-Chaos-Variety) · [Stylize](https://docs.midjourney.com/hc/en-us/articles/32196176868109-Stylize) · [Weird](https://docs.midjourney.com/hc/en-us/articles/32390120435085-Weird) · [Raw](https://docs.midjourney.com/hc/en-us/articles/32634113811853-Raw) · [No](https://docs.midjourney.com/hc/en-us/articles/32173351982093-No) · [Tile](https://docs.midjourney.com/hc/en-us/articles/32197978340109-Tile) · [Seeds](https://docs.midjourney.com/hc/en-us/articles/32604356340877-Seeds) · [官方 `--exp` 更新](https://updates.midjourney.com/v7-update-editor-and-exp/)

### 模型、分辨率和生成质量

| 完整参数 | 缩写 | 作用 | 取值与默认值 | 版本 | 示例与重要限制 |
| --- | --- | --- | --- | --- | --- |
| --version N | --v N | 选择 Midjourney 主模型 | 当前默认 8.1 | 多版本 | --v 8.1、--v 7、--v 6.1；不同版本的参数兼容性不同 |
| --niji N | 无 | 使用偏动漫、东方美学和插画的 Niji 模型 | 当前 --niji 7；旧版 --niji 6 | Niji | --niji 7；Niji 7 对提示词更直接，细节与线条更清晰 |
| --hd | 无 | V8.1 原生生成约 2048px 的 2K 图片 | 开关型 | V8.1 | 默认 1:1 为 2048×2048；约 1.3 GPU 分钟；最大比例约 4:1；当前不能继续 Upscale |
| --sd | 无 | V8.1 标准分辨率图片 | 开关型；当前常规默认 | V8.1 | 默认 1:1 为 1024×1024；约 0.8 GPU 分钟；可使用 Subtle/Creative Upscale |
| --quality N | --q N | 控制初始生成的处理量和 GPU 消耗 | V7：1/2/4，默认 1；V6：0.5/1/2 | V6、V7；V8.1 不支持 | --q 2 --v 7；V7 没有 3，写 3 会转为 4；--q 4 不兼容 Omni Reference |
| --draft | 无 | 快速探索大量草图 | V8.1：一次 24 张 512px，约 0.4 GPU 分钟；V7：一次 4 张，约标准成本一半 | V7、V8.1 | --draft；V8.1 Draft 当前只在 [http://midjourney.com](http://midjourney.com) 使用，不在 Discord 使用 |

官方依据：[Version](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version) · [Quality](https://docs.midjourney.com/hc/en-us/articles/32176522101773-Quality) · [Draft & Conversational Modes](https://docs.midjourney.com/hc/en-us/articles/35577175650957-Draft-Conversational-Modes) · [Image Size & Resolution](https://docs.midjourney.com/hc/en-us/articles/33329374594957-Image-Size-Resolution)

### 图片提示词、风格和人物/物体参考

| 完整参数 | 缩写 | 配合什么使用 | 作用 | 取值与默认值 | 版本与限制 |
| --- | --- | --- | --- | --- | --- |
| --iw N | 无 | Image Prompt | 控制普通图片提示词对内容、构图、颜色等的影响 | V8.1/V7：0–3，默认 1；Niji 7：0–2，默认 1 | 图片 URL 在 Discord 中放正文最前面；网页把图放入 Image Prompt 区 |
| --sref URL/代码 | 无 | Style Reference | 引用图片画风或 Midjourney Style Code | 可用一张、多张、数字代码或 random | V6 及以后；控制颜色、媒介、纹理、光线和视觉气质，不负责复制人物或物体 |
| --sw N | 无 | --sref | Style Reference 总体影响强度 | 0–1000，默认 100 | 不兼容 Moodboard；V7 中对 Style Code 的影响通常比对上传图片更明显 |
| --sv N | 无 | --sref | 选择 Style Reference 算法版本 | V7 默认 6；旧 V7 常用 4；V6 默认 4，可用 1/2/3/4 | 不兼容 Moodboard；旧 Style Code 可尝试 --sv 4 |
| --oref URL | 无 | Omni Reference | 保持人物、物体、车辆或非人类生物的外形一致性 | 只能使用一张参考图 | V7；在当前 V8.1 工作流中添加 Omni 会运行 V7；需要文字提示词 |
| --ow N | 无 | --oref | Omni Reference 影响强度 | 1–1000，默认 100；官方通常建议低于 400 | 高 --s、高 --exp 会与它竞争；--q 4 不兼容 |
| --cref URL | 无 | Character Reference | 旧版角色一致性参考 | 可放一张或多张同一角色图片 | 仅 V6 / Niji 6；V7 由 --oref 替代 |
| --cw N | 无 | --cref | 控制参考角色包含多少特征 | 0–100，默认 100 | 0 更偏脸；100 同时参考脸、头发和服装；仅 V6 / Niji 6 |

普通 Image Prompt 本身没有 `--image` 参数：

- Discord：把图片 URL 放在正文最前面。
- 网页：把图片拖入 Image Prompt 区。
- 一张图片必须配文字；两张或更多图片可以不配文字，进行纯图片混合。

多张 Style Reference 可以单独分配相对权重：

```text
--sref URL_A::2 URL_B::1 URL_C::1
```

官方依据：[Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts) · [Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference) · [Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference) · [Character Reference](https://docs.midjourney.com/hc/en-us/articles/32162917505293-Character-Reference)

### Personalization 与 Moodboard

| 完整参数 | 缩写 | 作用 | 写法 | 版本与限制 |
| --- | --- | --- | --- | --- |
| --profile | --p | 应用默认或指定的 Personalization Profile / Moodboard | --p、--p PROFILE_ID、--p MOODBOARD_ID、--p CODE | V6、V7、V8.1；必须先解锁 Global Profile |

含义：

- `--p`：使用当前在网页 Personalization 菜单中选中的默认档案。
- `--p pID`：使用某个 Personalization Profile 的最新版本。
- `--p mID`：使用某个 Moodboard 的最新版本。
- `--p code`：使用保存下来的固定版本代码，便于复现。
- Moodboard 可以选择一个或多个。
- Moodboard 的影响主要用 `--stylize` 调节。
- Moodboard 不兼容 `--sw` 和 `--sv`。

三者不要混淆：

| 功能 | 学习来源 | 最适合 |
| --- | --- | --- |
| Personalization | 你长期选择和喜欢的图片 | “我通常喜欢什么” |
| Moodboard | 你主动收集的一组项目参考图 | “这个项目整体往哪里走” |
| --sref | 当前提示词的一张或几张风格图 | “这一次具体采用什么画风” |

官方依据：[Personalization](https://docs.midjourney.com/hc/en-us/articles/32433330574221-Personalization) · [Moodboards](https://docs.midjourney.com/hc/en-us/articles/39193335040013-Moodboards)

### 批量运行、速度和可见性

| 完整参数 | 缩写 | 作用 | 取值与默认值 | 限制 |
| --- | --- | --- | --- | --- |
| --repeat N | --r N | 同一提示词连续运行多次 | Basic：2–4；Standard：2–10；Pro/Mega：2–40 | 仅 Fast/Turbo；不支持 Relax；每次单独消耗 GPU 时间；完成后参数会从成品信息中移除 |
| --fast | 无 | 只让本次任务使用 Fast Mode | 开关型 | V8.1 支持；消耗套餐 Fast GPU 时间 |
| --relax | 无 | 只让本次任务使用 Relax Mode | 开关型 | 图片 Relax 需 Standard/Pro/Mega；等待更久；不支持 Repeat 和 Permutation |
| --turbo | 无 | 只让本次任务使用 Turbo Mode | 开关型 | 约可达 Fast 的 4 倍速度、使用约 2 倍 Fast 时间；V8.1 当前不支持 |
| --stealth | 无 | 只让本次任务在网站保持私密 | 开关型 | 仅 Pro/Mega；在公开 Discord 频道生成仍会被频道成员看到 |
| --public | 无 | 只让本次任务公开 | 开关型 | 与 --stealth 相反 |

官方依据：[Repeat](https://docs.midjourney.com/hc/en-us/articles/32757107922061-Repeat) · [GPU Speed](https://docs.midjourney.com/hc/en-us/articles/32016412137741-GPU-Speed-Fast-Relax-Turbo) · [Stealth Mode](https://docs.midjourney.com/hc/en-us/articles/32019750070669-Stealth-Mode)

---

## 当前参数按版本速查

符号：`✓` 原生支持；`转 V7` 表示功能会调用 V7；`—` 不支持。

| 参数 / 功能 | V6 / 6.1 | V7 | V8.1 |
| --- | --- | --- | --- |
| --ar | ✓ | ✓ | ✓ |
| --chaos | ✓ | ✓ | ✓ |
| --stylize | ✓ | ✓ | ✓ |
| --weird | ✓ | ✓ | ✓ |
| --exp | — | ✓ | ✓ |
| --raw | ✓ | ✓ | ✓ |
| --no | ✓ | ✓ | ✓ |
| --tile | ✓ | ✓ | ✓ |
| --seed | ✓ | ✓ | ✓ |
| --q | 0.5/1/2 | 1/2/4 | — |
| --draft | — | ✓ | ✓，仅网页 |
| --hd 原生 2K | — | — | ✓ |
| --sd | — | — | ✓ |
| Image Prompt / --iw | ✓ | ✓ | ✓ |
| --sref / --sw | ✓ | ✓ | ✓ |
| --p | ✓ | ✓ | ✓ |
| --cref / --cw | ✓ | — | — |
| --oref / --ow | — | ✓ | 转 V7 |
| Multi-Prompt :: | ✓ | — | — |
| --niji | Niji 6 | Niji 7 | — |
| Turbo | ✓ | ✓ | — |

---

## 不以 `--` 开头，但属于提示词语法

| 语法 | 作用 | 示例 | 版本与限制 |
| --- | --- | --- | --- |
| {A, B, C} | Permutation，一次批量运行多个变量 | a {red, blue} bird --ar {1:1, 2:3} | 仅 Fast/Turbo；不支持 Relax；每个组合单独计费 |
| 概念A:: 概念B | 把正文拆成独立概念再组合 | space:: ship --v 6.1 | 仅 V6.1 及更早版本 |
| 概念A::2 概念B::1 | 给 Multi-Prompt 分配相对权重 | space::2 ship::1 --v 6.1 | 总权重必须为正；仅 V6.1 及更早版本 |
| "文字" | 尝试在图片中生成指定文字 | a sign with the words "OPEN LATE" | V6 及以后；必须用英文双引号；短英文词组成功率更高 |
| URL::2 | 给多张 Style Reference 分配相对权重 | --sref URL_A::2 URL_B::1 | 这是 SREF 权重，不等同于正文 Multi-Prompt |

官方依据：[Permutations](https://docs.midjourney.com/hc/en-us/articles/32761322355597-Permutations) · [Multi-Prompts & Weights](https://docs.midjourney.com/hc/en-us/articles/32658968492557-Multi-Prompts-Weights) · [Text Generation](https://docs.midjourney.com/hc/en-us/articles/32502277092109-Text-Generation)

---

## Midjourney 网页生图功能总表

### 创建和参考图功能

| 网页功能 | 在哪里 | 做什么 | 关键区别 / 限制 |
| --- | --- | --- | --- |
| Imagine Bar | Create 页顶部，以及多个网页页面 | 输入正文、参数和参考图并生成图片 | 按 Enter 提交；Ctrl/Cmd + Enter 可提交并保留文字 |
| Settings | Imagine Bar 的设置图标 | 设置默认版本、SD/HD、Raw、宽高比、Stylize、Weird、Variety、GPU 速度、Stealth 等 | 是全局默认；单个提示词末尾的参数可覆盖默认值 |
| Images Menu | Imagine Bar 的图片图标 | 上传图片或调用上传库 | 单文件最大 10MB |
| Image Prompt 区 | Images Menu / Imagine Bar | 用图片影响内容、构图、颜色和部分风格 | 可多张；强度用 --iw |
| Style Reference 区 | Images Menu / Imagine Bar | 用图片影响颜色、媒介、纹理、光线和画风 | 可多张；强度用 --sw |
| Omni Reference 区 | Images Menu / Imagine Bar | 维持人物或物体外形 | 只能一张；会运行 V7；强度用 --ow |
| Lock Image | 参考图旁的锁定图标 | 让参考图保留在 Imagine Bar，连续用于多条提示词 | 适合系列化生成 |
| Personalization 菜单 | Imagine Bar 旁的 p 图标 | 开关并选择默认 Personalization Profile / Moodboard | 对以后提交的提示词自动加入 --p |
| Draft Mode | Imagine Bar 旁 Draft 按钮 | V8.1 一次快速生成 24 张低分辨率方向稿 | 512px；约 0.4 GPU 分钟；适合选方向，不适合最终成品 |
| Conversational Mode | Imagine Bar 旁对话按钮 | 用自然语言或语音让 AI 代写提示词和生成图片 | 支持中文；文字可独立使用；语音需要 Draft Mode |
| Create in Folder | Create 页文件夹按钮 | 直接把新图片生成到指定文件夹 | 主要是组织功能，但适合项目化创作 |

官方依据：[Creating on Web](https://docs.midjourney.com/hc/en-us/articles/33390732264589-Creating-on-Web) · [Draft & Conversational Modes](https://docs.midjourney.com/hc/en-us/articles/35577175650957-Draft-Conversational-Modes)

### 生成后的变化、编辑和扩图

| 网页功能 | 做什么 | 适合什么时候 | 模型 / 分辨率注意事项 |
| --- | --- | --- | --- |
| Rerun | 重新运行同一提示词 | 对当前四张都不满意，想要全新随机结果 | 会重新消耗 GPU 时间 |
| Vary Subtle | 生成与原图接近的小变化 | 构图已经满意，只想微调细节 | 保留原图程度较高 |
| Vary Strong | 生成幅度更大的变化 | 喜欢主题，但想探索新的构图和细节 | 变化大于 Subtle |
| Remix Subtle / Strong | 以原图为基础，同时修改提示词和兼容参数 | 想保留原图方向但换主体、环境或部分描述 | 只改 --ar 会拉伸，不会真正补画 |
| Editor | 把 Remix、Erase、Pan、Zoom Out 放进同一画布 | 需要多种编辑同时完成 | V8.1 图片可编辑，但当前编辑生成使用 V6.1 |
| Erase / Inpainting | 擦除选区并局部重绘 | 修手、换道具、改服装、清除瑕疵 | 选区太小可能融合不好；建议一次修改一个区域 |
| Pan | 向左、右、上或下扩展画布 | 横向或纵向增加空间、改变比例 | V7/V8.1 当前扩图使用 V6.1 |
| Zoom Out | 在四周扩展场景 | 保留中心画面并增加环境上下文 | 1.0–2.0；不增加最终像素，只让原图在画布中变小 |
| Make Square | 自动补画非方图缺少的方向 | 快速把横图或竖图变成正方形 | 属于 Zoom Out 类操作 |
| Use as Image Prompt | 把当前作品作为下一张图的普通图片提示词 | 延续构图、颜色或画面元素 | 后续用 --iw 控制 |
| Use as Style Reference | 把当前作品作为下一张图的风格参考 | 换内容但保留画风 | 后续用 --sw 控制 |
| Use Prompt | 把原提示词和参考图重新放入 Imagine Bar | 修改旧提示词继续生成 | 比手工复制完整参数更安全 |

重要：对 V8.1 HD 图执行 Pan、Zoom Out、Erase / Vary Region 等编辑会生成 SD 结果，之后可再 Upscale。

官方依据：[Modifying Your Creations](https://docs.midjourney.com/hc/en-us/articles/33329329805581-Modifying-Your-Creations) · [Variations](https://docs.midjourney.com/hc/en-us/articles/32692978437005-Variations) · [Remix](https://docs.midjourney.com/hc/en-us/articles/32799074515213-Remix) · [Editor](https://docs.midjourney.com/hc/en-us/articles/32764383466893-Editor) · [Pan](https://docs.midjourney.com/hc/en-us/articles/32570788043405-Pan) · [Zoom Out](https://docs.midjourney.com/hc/en-us/articles/32595476770957-Zoom-Out)

### 分辨率与放大

| 功能 | 结果 | 是否改变细节 | 适用 |
| --- | --- | --- | --- |
| --sd | V8.1 默认约 1024px | 正常生成 | 日常试图和编辑工作流 |
| --hd | V8.1 原生约 2048px | 从一开始就以 2K 生成 | 最终成品；成本高于 SD |
| Upscale Subtle | 把 SD 放大到约 2048px | 尽量少改变 | 构图和细节已经满意 |
| Upscale Creative | 把 SD 放大到约 2048px | 会轻微重做和补充细节 | 希望放大时顺便改善细节 |
| Run batch as HD | 锁定 seed，把原 SD 提示词整批重新生成成 HD | 是重新生成，不是单张普通放大 | 想比较同一批 SD 与原生 HD |

官方依据：[Upscalers](https://docs.midjourney.com/hc/en-us/articles/32804058614669-Upscalers) · [Image Size & Resolution](https://docs.midjourney.com/hc/en-us/articles/33329374594957-Image-Size-Resolution)

### 风格、提示词分析和探索

| 网页功能 | 作用 | 关键点 |
| --- | --- | --- |
| Style Explorer | 浏览随机、热门和可搜索的 Style Codes | Copy 会加入 --sref 代码；可搜索相似代码；收藏 Style Code 不影响 Personalization |
| Style Creator | 通过连续选择图片训练自己的 Style Code | 当前使用 V7；一般 5–10 轮趋于稳定；每轮消耗 GPU；各轮都会留下可用代码 |
| Personalization Profiles | 通过长期选图学习个人审美 | 每个版本有 Global Profile；V7 Profile 可用于 V8.1 |
| Moodboards | 用一组策展图片建立项目级美术方向 | 比单张 SREF 更宽泛；可选择多个；用 --s 调节 |
| Describe Image | 上传图片，得到四条文字提示词建议 | 用于找描述词，不会精确反推原始提示词；重复运行会得到不同建议 |
| Prompt Shortener | 分析长提示词，帮助找出更有效的词并删去冗余 | 适合诊断提示词过长、互相冲突的问题 |

官方依据：[Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference) · [Style Creator](https://docs.midjourney.com/hc/en-us/articles/41308374558221-Style-Creator) · [Describe](https://docs.midjourney.com/hc/en-us/articles/32497889043981-Describe)

---

## 旧版本仍可能遇到的参数

这些参数不是当前 V8.1 主工作流，但在旧教程、旧图片或旧模型中仍可能看到。

| 参数 | 用途 | 适用范围 / 状态 |
| --- | --- | --- |
| --cref URL | Character Reference | V6 / Niji 6；V7 被 --oref 替代 |
| --cw 0–100 | Character Weight | 仅配合 --cref |
| --stop 10–100 | 在生成进度中提前停止，得到更柔和、低细节结果 | V6 及以前；默认 100 |
| --style cute | Niji 5 可爱风格 | 旧版 |
| --style expressive | Niji 5 更成熟的插画表达 | 旧版 |
| --style original | Niji 5 早期默认风格 | 旧版 |
| --style scenic | Niji 5 强调背景和电影化场景 | 旧版 |
| --style 4a/4b/4c | V4 的不同模型风味 | 旧版 |
| --style CODE | 使用以前创建的 Style Tuner Code | 新 Style Tuner 已不能创建，但旧代码仍可用 |
| --test / --testp | 2022 年测试模型 | 旧版 |
| --creative | 增加旧测试模型的构图变化 | 配合 --test/--testp |
| --sameseed | 让 V3 四宫格共享同一大噪声场 | V3 |
| --uplight | 让旧版 U 按钮使用 Light Upscaler | 旧版 |
| --upbeta | 让旧版 U 按钮使用 Beta Upscaler | 已废弃，可能不稳定 |

已经废弃或不应再学习的旧参数：

| 参数 | 官方状态 / 替代方式 |
| --- | --- |
| --width / 旧 --w | 由 --ar 替代；注意当前 --w 已重新用于 --weird |
| --height / --h | 由 --ar 替代 |
| 旧含义的 --fast | 旧时由 Quality 取代；注意当前 --fast 已重新用于 GPU Fast Mode |
| 旧含义的 --hd | 曾代表早期 HD 模型；当前 V8.1 中重新表示原生 2K 分辨率 |
| --vibe | 后来被称为模型版本 1 |
| --upanime | 已废弃 |
| --hq | 已废弃 |
| --newclip | 已废弃 |
| --nostretch | 已废弃 |
| --old | 已废弃 |

---

## 自定义 `--名字` 不是官方内置参数

在 Discord 中可以用 `/prefer option set` 创建自己的快捷参数。例如把：

```text
--chaos 10 --ar 2:3 --stylize 250
```

保存为 `--portrait`，之后写：

```text
a botanical fashion portrait --portrait
```

这里的 `--portrait` 是用户自定义 Option Set，不是 Midjourney 官方内置参数。因此你在别人的提示词里看到陌生的 `--xxx`，它可能只是对方自己的快捷组合，不能直接在你的账户中使用。

---

## 官方资料索引

- [Parameter List](https://docs.midjourney.com/hc/en-us/articles/32859204029709-Parameter-List)
- [Version / Compatibility](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version)
- [Creating on Web](https://docs.midjourney.com/hc/en-us/articles/33390732264589-Creating-on-Web)
- [Image Prompts](https://docs.midjourney.com/hc/en-us/articles/32040250122381-Image-Prompts)
- [Style Reference](https://docs.midjourney.com/hc/en-us/articles/32180011136653-Style-Reference)
- [Omni Reference](https://docs.midjourney.com/hc/en-us/articles/36285124473997-Omni-Reference)
- [Character Reference](https://docs.midjourney.com/hc/en-us/articles/32162917505293-Character-Reference)
- [Personalization](https://docs.midjourney.com/hc/en-us/articles/32433330574221-Personalization)
- [Moodboards](https://docs.midjourney.com/hc/en-us/articles/39193335040013-Moodboards)
- [Modifying Your Creations](https://docs.midjourney.com/hc/en-us/articles/33329329805581-Modifying-Your-Creations)
- [Editor](https://docs.midjourney.com/hc/en-us/articles/32764383466893-Editor)
- [Upscalers](https://docs.midjourney.com/hc/en-us/articles/32804058614669-Upscalers)
- [Legacy Features](https://docs.midjourney.com/hc/en-us/articles/33329788681101-Legacy-Features)

---

本文整理自我此前发布在知乎的文章：[Midjourney 官方生图参数整理](https://zhuanlan.zhihu.com/p/2063707880436634842)。
