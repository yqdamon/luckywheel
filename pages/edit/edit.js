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
    prizes: []
  },

  onLoad() {
    console.log('[Edit] onLoad');
    const app = getApp();
    
    // 设置导航栏标题与主页面一致
    wx.setNavigationBarTitle({
      title: app.globalData.wheelTitle || '幸运大转盘'
    });
    
    this.setData({
      prizes: app.globalData.prizes || []
    });
  },

  onShow() {
    console.log('[Edit] onShow');
    console.log('[Edit] Current pages:', getCurrentPages());
  },

  onHide() {
    console.log('[Edit] onHide');
  },

  onUnload() {
    console.log('[Edit] onUnload');
  },

  onReady() {
    console.log('[Edit] onReady');
    // 检查页面元素
    const query = wx.createSelectorQuery();
    query.select('.container').boundingClientRect(rect => {
      console.log('[Edit] Container rect:', rect);
    }).exec();
  },

  onNameChange(e) {
    const { index } = e.currentTarget.dataset;
    const { value } = e.detail;
    const prizes = this.data.prizes;
    prizes[index].name = value;
    this.setData({ prizes });
  },

  onWeightChange(e) {
    const { index } = e.currentTarget.dataset;
    const { value } = e.detail;
    const prizes = this.data.prizes;
    prizes[index].weight = value;
    this.setData({ prizes });
  },

  addPrize() {
    const prizes = this.data.prizes;
    prizes.push({
      name: '',
      weight: 1
    });
    this.setData({ prizes });
  },

  deletePrize(e) {
    const { index } = e.currentTarget.dataset;
    const prizes = this.data.prizes;
    prizes.splice(index, 1);
    this.setData({ prizes });
  },

  savePrizes() {
    const app = getApp();
    app.globalData.prizes = this.data.prizes;
    wx.navigateBack();
  }
}); 