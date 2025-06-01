// 颜色生成器
import { reactive } from "vue";

export function useColorGenerator() {
  const COMMON_COLORS = reactive({
    // 暖色系
    warm: [
      "#dc143c", //中国红
      "#ff7f50", //珊瑚橙
      "#ffd700", //琥珀黄
      "#ff6347", //'番茄红
      "#ffb6c1", //桃红
    ],

    // 冷色系
    cool: [
      "#337486", //普鲁士蓝
      "#98ff98", //薄荷绿
      "#6495ed", //矢车菊蓝
      "#00868b", //孔雀绿
      "#e6e6fa", //薰衣草紫
    ],

    // 中性色
    neutral: [
      "#f8f8ff", //珍珠白
      "#808080", //中灰色
      "#D2B48C", //浅驼色
      "#f5f5dc", //浅米色
      "#D3C0B2", // 浅卡其灰
    ],
  });

  const methods = {
    /**
     * 获取完全随机颜色
     * @returns {Object} {name, hex}
     */
    getRandomColor() {
      const allColors = [
        ...COMMON_COLORS.warm,
        ...COMMON_COLORS.cool,
        ...COMMON_COLORS.neutral,
      ];
      return allColors[Math.floor(Math.random() * allColors.length)];
    },
    /**
     * 按色系获取随机颜色
     * @param {'warm'|'cool'|'neutral'} toneType
     * @returns {Object} hex
     */
    getRandomByTone(toneType) {
      const colors = COMMON_COLORS[toneType] || [];
      return (
        colors[Math.floor(Math.random() * colors.length)] ||
        this.getRandomColor()
      );
    },

    /**
     * 生成渐变色组（包含2-3个协调色）
     * @returns {Array} 包含协调颜色的数组
     */
    getGradientGroup() {
      const baseColor = this.getRandomColor();
      return [
        baseColor,
        this._findComplementary(baseColor),
        this._findAnalogous(baseColor),
      ].filter(Boolean);
    },

    // 私有方法：寻找补色
    _findComplementary(base) {
      // 色相环补色算法（略）
      return COMMON_COLORS.cool.find((c) => c.hex !== base.hex);
    },

    // 私有方法：寻找类似色
    _findAnalogous(base) {
      // 类似色选择算法（略）
      return COMMON_COLORS.warm.find((c) => c.hex !== base.hex);
    },
  };
  return { ...methods, COMMON_COLORS };
}
