UE 中会发现它不同的光源组件，其参数上用的单位是不一样的。它们有用 lumen，有用 candela，也有用nit和 lux。

我想搞清楚来看看具体是怎么样的，以及为什么它们要这样子来区分？

---

[物理光照单位](https://dev.epicgames.com/documentation/unreal-engine/using-physical-lighting-units-in-unreal-engine)

![Light Type Units](https://d1iv7db44yhgxn.cloudfront.net/documentation/images/81390a23-26d8-4d9c-a3de-25d6bd223d05/01-physical-light-units-options.png)

对于这些类型的光源，其强度显示如下：

- **定向光源** 使用 **定向法线照度**，表示为 **勒克斯**，等于每平方米一个流明。
- **天空光照** 和 **作为静态光源的自发光材质** 使用表示为 **每平方米烛光**（cd/m2）的照度。
- **点光源**、**聚光源** 和 **矩形光源** 可以在以下光照单位之间选择：
  - **烛光**（cd）是对一个球面度（sr）的立体角范围内均匀发出的发光强度的测量。例如，光源设置为1000 cd会在一米处测量到1000勒克斯。
  - **流明**（lm）是对照射到一个球面体角度内的光通量的测量。在光度测定中，光通量（或发光能力）测量的是光照感知能力。无论分布情况如何（宽或窄），发出的总能量是相同的。
  - **无单位** 是特定于引擎的光照强度值，保持与虚幻引擎4.19之前的引擎版本的兼容性。

---

对应到 UE，主要看下面这些参数：

| UE 对象／参数                     | 对应单位                                        | 为什么用这个量                                               |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| **Directional Light → Intensity** | **lux**                                         | 模拟远处太阳的平行光，直接描述垂直于光线的表面接收到的照度   |
| **Point Light → Intensity**       | **lm、cd 或 Unitless**，由 Intensity Units 决定 | 描述局部光源的总光通量，或方向上的发光强度                   |
| **Spot Light → Intensity**        | **lm、cd 或 Unitless**                          | 聚光灯需要考虑光束角度与发光强度的关系                       |
| **Rect Light → Intensity**        | **lm、cd 或 Unitless**                          | 虽然有发光面积，标准灯光组件的强度仍使用这些选项             |
| **Sky Light**                     | 最终环境亮度涉及 **cd/m²**                      | 天空／HDR 环境图提供各个方向的亮度，Intensity Scale 对它进行缩放 |
| **材质 Emissive Color**           | 物理亮度解释涉及 **cd/m²，即 nit**              | 描述发光表面的亮度；自定义的 Emissive Strength 参数是否直接等于 nit，取决于材质计算 |

物理单位工作流需要相应的平方反比衰减设置；关闭该衰减的局部灯也会用 Unitless。Sky Light 的缩放值也不能脱离输入 HDR 图，直接当成固定的天空亮度。[UE 物理光照单位](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-physical-lighting-units-in-unreal-engine)、[Sky Light 参数](https://dev.epicgames.com/documentation/unreal-engine/sky-lights-in-unreal-engine)

**至于“为什么 xx BP 要用这个单位”，关键是：单位取决于它控制的物理量和组件设置。**

- **点光 BP**：用 lm 表示灯泡总输出，方便对应灯泡标称流明。
- **聚光灯 BP**：如果希望缩小光束时，光能集中、中心更亮，就保持 lm 不变；如果希望调整光束角时保持方向发光强度，就使用 cd。
- **Directional Light BP**：内部控制 Directional Light 来表现天光,没有光源位置的意义就没有方向,方向角一说,用照度即可，因此其 Intensity 使用 lux。

---

![](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260905235036049.png)

**总结的来说** 到底用哪个单位实际上都是可以根据他的含义去转化的, 我们只要理解清楚了这些单位的转化关系,就能判断灯光之间的值是否合理 
另外UE文档中也给到了用不同单位下实际的转化关系   [物理光照单位](https://dev.epicgames.com/documentation/unreal-engine/using-physical-lighting-units-in-unreal-engine)

<img src="https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260905231430393.png" alt="image-20260905231430393" style="zoom: 67%;" />

**写得很迷惑(=_=),实际上的意思是“灯光参数填同一个数字，但选择不同单位时，产生的照度差多少”。**我手动推演了下数值都是怎么得到的

![image-20260905235552349](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260905235552349.png)

这里矩形灯的立体的写法还有错误,立体角写 2π，最后却乘 3.14, 实际上矩形光的立体角是π ,**覆盖半球，不代表朝半球里的所有方向都一样强。**
所以虽然几何范围是 **2π sr**，将这种随角度变化的强度累加起来，得到的系数是 **π**。

对于理想漫射面光源，方向发光强度为：

\[ I(\theta)=I_0\cos\theta \]

其中 \(I_0\) 是正前方的发光强度。因此，总光通量为：

\[ \Phi=\int_{\text{半球}}I(\theta)\,d\Omega =I_0\int_0^{2\pi}\int_0^{\pi/2} \cos\theta\,\sin\theta\,d\theta\,d\varphi =I_0\pi \]

---

实际在 UE 填参数时，可以整理成这张表，**每一行的三个设置彼此等效**：

| 灯光类型           | Candela | Lumen    | Unitless |
| ------------------ | ------- | -------- | -------- |
| 点光源             | 1       | 约 12.57 | 625      |
| 聚光灯，半角 44°   | 1       | 约 1.76  | 625      |
| 矩形灯，按文档换算 | 1       | 约 3.14  | 625      |

注意这是**同一种灯内部换单位**的对照表；不代表点光源、聚光灯和矩形灯设成 1 cd 后，会形成相同的光照分布。