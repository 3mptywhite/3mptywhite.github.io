
[【[UFSH2025]《三角洲行动》中的全局光照方案 | 蔚东辰 腾讯天美J3工作室 引擎开发工程师】](https://www.bilibili.com/video/BV1C62PBeEha/?share_source=copy_web&vd_source=3837c40b8920817a05a5f7922820f119) 

![image-20260829195815611](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829195815611.png)

# 项目目前情况 

- 端手游同步发布。

- 尽要兼容尽可能广泛的平台。

- 大地图全量的 GI 覆盖。

![image-20260829185029965](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829185029965.png)

要求可见的区域都要有GI覆盖。

![image-20260829185217109](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829185217109.png)

每种方案各有特点 

| Name                   | 原理                                                         | 效果上 和 运行性能                                           | 美术成本                                                     |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Lightmap               | 把静态表面的漫反射光照（irradiance）预先计算出来，存进模型 UV2 对应的二维纹理。 | 静态场景效果最好；阴影、接触细节和间接光精度高；运行成本低。 | 高 需要制作2U 需要反复烘培 Mesh 和 场景不解耦。大地图工期上 不可能全用lightmap |
| volume gi              | 就是一些volume存储光照数据 然后通过一些手段读取到对应位置的信息，插值计算出来 irradiance | 能给动态角色和物体提供环境光；不依赖表面 UV；大型场景更方便。 | 中低 手游上处理 漏光的IV ，但比lightmap 美术工作量少很多     |
| 动态gi （lumen/RTXGI） | todo                                                         | 灯光、物体、时间和场景改变后，间接光能实时更新；适合昼夜变化和可破坏场景。 | 基本就是实时所见即所得                                       |

三角洲 有PC 手游 （PVP）和 PC 的黑鹰坠落(PVE) 所以三个都用了

<img src="https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829190646550.png" alt="image-20260829190646550" style="zoom:33%;" />

<img src="https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829190706175.png" alt="image-20260829190706175" style="zoom:50%;" />

# Volume GI

做 Volume GI 的性价比陷阱

 ![image-20260829201500030](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829201500030.png)

Volume GI 目的是要去减少 lightmap 的 资产工作量 的前提下 ，保证综合效果下降不多 ，如果综合效果下降了很多，然后又因为用了很多错误的、hack的方式，导致实际上用的 Volume GI 工作量也很大，那是得不偿失的

## PC Volume GI

### 防漏光

Volume 大小需要定到比墙厚度小 ，这点在PC端可行，且前期有必要就和美术约定好

![image-20260829201903151](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829201903151.png)

### 存储

**ambient Cube** 

![image-20260829202100302](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829202100302.png)

### **树状稀疏存储** 

![image-20260829203532111](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829203532111.png)

越接近mesh表面的东西才值得用更加精度高的的 Cube 存储。参考了 OPenVDB的结构优化了存储 

【实现细节直接看视频把 这里没有看得很细，之后有必要在回头看看 ~】

### **稀疏化存储的访问**

他这个是没有一个 根节点的 

![image-20260829203649182](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829203649182.png)

先BFS得到一个访问序列。再通过一些算法可以做到快速查询 (算法细节没有细看，可以看视频)

![image-20260829203813386](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829203813386.png)

### **近处 ambient cube 数据拟合和压缩**

![image-20260829202743698](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829202743698.png)

我理解是说上面八叉树的最靠近mesh部分的 amibient Cube 又改用这种probe的方式来得到因为这样更加省？

![image-20260829203449333](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829203449333.png)

后面拟合细节这么看得不太懂。 总之老哥最后总结了下 这个Volume GI这样优化一下 拟合的数据的时间还是比lightmap 烘培短很多滴

**总结思路 ：**

1. 确定用volume GI 的原因就是 lightmap 美术做不完 
2. 防漏光的要求下 确认volume大小 （这里是0.25m 墙要比这个大 ，话说他没说PC的铁皮房怎么办 估计还是用了 mobile的 IV方案 ）
3. 接着做才会有以下的各种优化 

### 全视距

最远处用了更加大的volume 同时用了这个神经网络拟合的做法优化的GI表现

![image-20260829205023266](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829205023266.png)

![image-20260829205331540](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829205331540.png)

![image-20260829205345765](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829205345765.png)

## mobile Volume GI

![image-20260829205515368](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829205515368.png)

手游的volume GI 明显加载距离也短了 就64m ，而且mobile 的瓶颈在GPU（八叉树查找没法用）， 要把一些计算迁移到CPU ，用新的算法 

![image-20260829205907034](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829205907034.png)

【算法没细看了 到时可以再看看视频】

### 手游防漏光

前面PC用比墙小的volume 尺寸就能处理大部分了 ，但是手游尺寸做不到这么小 ，用了自定义的Interior Volume 在volume 穿墙时用更多信息来知道在墙的哪边 （Interior Volume 类似 一个简化的mesh 需要美术工作量的 ）
![image-20260829210249050](https://picgo09072024-1328204036.cos.ap-shanghai.myqcloud.com/image/image-20260829210249050.png)

# 阅读清单

https://research.activision.com/publications/archives/volumetric-global-illumination-at-treyarch 
