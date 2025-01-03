// 在 Page 外部定义颜色数据
const colorPalette = [
  // 第一行
  { hex: '#FF9B9B', name: '浪漫粉' },
  { hex: '#7EC2FF', name: '天空蓝' },
  { hex: '#FFB366', name: '蜜橘色' },
  { hex: '#99E699', name: '清新绿' },
  { hex: '#E699FF', name: '甜心紫' },
  // 第二行
  { hex: '#FFD480', name: '奶油黄' },
  { hex: '#80B3FF', name: '海洋蓝' },
  { hex: '#FF99CC', name: '少女粉' },
  { hex: '#99CCFF', name: '晴空蓝' },
  { hex: '#FF8080', name: '草莓红' },
  // 第三行
  { hex: '#80FF80', name: '薄荷绿' },
  { hex: '#FFB84D', name: '杏橙色' },
  { hex: '#B366FF', name: '梦幻紫' },
  { hex: '#FF99B3', name: '桃花粉' },
  { hex: '#66FFB3', name: '翡翠绿' },
  // 第四行
  { hex: '#FF8099', name: '玫瑰红' },
  { hex: '#99FF99', name: '嫩芽绿' },
  { hex: '#FFB399', name: '珊瑚橙' },
  { hex: '#9999FF', name: '淡雅紫' },
  { hex: '#FFE699', name: '柠檬黄' },
  // 第五行
  { hex: '#99FFE6', name: '湖水绿' },
  { hex: '#FF99FF', name: '粉紫色' },
  { hex: '#99FFCC', name: '薄荷白' },
  { hex: '#FFB3E6', name: '樱花粉' },
  { hex: '#B3FFB3', name: '青草绿' },
  // 第六行
  { hex: '#FFB3B3', name: '暖粉色' },
  { hex: '#B3E6FF', name: '浅海蓝' },
  { hex: '#FFD9B3', name: '杏仁色' },
  { hex: '#D9FFB3', name: '柠檬绿' },
  { hex: '#E6B3FF', name: '丁香紫' },
  // 第七行
  { hex: '#FFCCB3', name: '蜜桃色' },
  { hex: '#B3FFFF', name: '清水蓝' },
  { hex: '#FFE6B3', name: '香槟色' },
  { hex: '#CCF2CC', name: '豆绿色' },
  { hex: '#E6CCF2', name: '藤萝紫' },
  // 第八行
  { hex: '#F2CCB3', name: '奶茶色' },
  { hex: '#B3D9FF', name: '天际蓝' },
  { hex: '#F2E6B3', name: '米黄色' },
  { hex: '#B3F2CC', name: '青瓷绿' },
  { hex: '#CCB3F2', name: '幻梦紫' },
  // 第九行
  { hex: '#F2B3CC', name: '芭比粉' },
  { hex: '#CCE6FF', name: '云朵蓝' },
  { hex: '#F2CCB3', name: '驼色' },
  { hex: '#CCF2B3', name: '春芽绿' },
  { hex: '#E6CCF2', name: '紫藤色' },
  // 第十行
  { hex: '#FFB3D9', name: '糖果粉' },
  { hex: '#B3E6FF', name: '碧空蓝' },
  { hex: '#FFD9B3', name: '奶咖色' },
  { hex: '#D9FFB3', name: '嫩叶绿' },
  { hex: '#E6B3FF', name: '梦幻紫' }
];

Page({
  data: {
    wheelTitle: '',
    prizes: [],
    showColorPicker: false,
    currentColorIndex: -1,
    colorPalette: colorPalette,
  },

  onLoad() {
    // 从缓存或全局数据获取当前转盘数据
    const app = getApp()
    this.setData({
      wheelTitle: app.globalData.wheelTitle || '幸运大转盘',
      prizes: JSON.parse(JSON.stringify(app.globalData.prizes || []))
    })
  },

  onTitleInput(e) {
    this.setData({
      wheelTitle: e.detail.value
    })
  },

  onNameInput(e) {
    const { index } = e.currentTarget.dataset
    const { prizes } = this.data
    prizes[index].name = e.detail.value
    this.setData({ prizes })
  },

  onColorInput(e) {
    const { index } = e.currentTarget.dataset
    const { prizes } = this.data
    prizes[index].color = e.detail.value
    this.setData({ prizes })
  },

  onWeightInput(e) {
    const index = e.currentTarget.dataset.index;
    const value = parseInt(e.detail.value) || 0;
    const { prizes } = this.data;
    
    prizes[index].weight = value;
    
    // 计算总权重和每个选项的概率
    const totalWeight = prizes.reduce((sum, prize) => sum + (prize.weight || 0), 0);
    prizes.forEach(prize => {
      prize.probability = totalWeight > 0 ? 
        ((prize.weight || 0) / totalWeight * 100).toFixed(1) + '%' : '0%';
    });
    
    this.setData({ prizes });
  },

  addPrize() {
    const { prizes } = this.data
    prizes.push({
      name: '新奖品',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      weight: 1
    })
    this.setData({ prizes })
  },

  deletePrize(e) {
    const { index } = e.currentTarget.dataset
    const { prizes } = this.data
    prizes.splice(index, 1)
    this.setData({ prizes })
  },

  saveChanges() {
    const { wheelTitle, prizes } = this.data;
    
    // 计算总权重
    const totalWeight = prizes.reduce((sum, prize) => sum + (prize.weight || 0), 0);
    
    // 计算每个奖品的角度范围
    let startAngle = 0;
    const updatedPrizes = prizes.map(prize => {
      const weight = prize.weight || 0;
      const ratio = weight / totalWeight;
      const angle = 360 * ratio;
      
      const prizeData = {
        ...prize,
        startAngle,
        endAngle: startAngle + angle,
        probability: ratio  // 保存实际概率用于抽奖
      };
      
      startAngle += angle;
      return prizeData;
    });

    getApp().globalData.wheelTitle = wheelTitle;
    getApp().globalData.prizes = updatedPrizes;

    wx.navigateBack();
  },

  onColorTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      showColorPicker: true,
      currentColorIndex: index
    });
  },

  onColorSelect(e) {
    const colorIndex = e.currentTarget.dataset.colorIndex;
    const { currentColorIndex, prizes } = this.data;
    
    if (currentColorIndex >= 0) {
      prizes[currentColorIndex].color = colorPalette[colorIndex].hex;
      this.setData({
        prizes,
        showColorPicker: false
      });
    }
  },

  closeColorPicker() {
    this.setData({
      showColorPicker: false
    });
  }
}) 