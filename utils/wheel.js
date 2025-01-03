/**
 * 转盘相关工具函数
 */

// 计算奖品角度
export const calculatePrizeAngles = (prizeCount) => {
  const anglePerPrize = 360 / prizeCount
  return Array.from({ length: prizeCount }, (_, index) => ({
    start: index * anglePerPrize,
    end: (index + 1) * anglePerPrize
  }))
}

// 生成随机结果
export const generateResult = (prizes) => {
  return Math.floor(Math.random() * prizes.length)
} 