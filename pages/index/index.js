Page({
    data: {
      isRotating: false,
      wheelTitle: '',
      currentPrize: '',
      prizes: [],
      rotateAngle: 0,
      duration: 4000,
      lastAngle: 0,
      canvasSize: 360,
      canvasReady: false
    },
  
    onLoad() {
      console.log('[Index] onLoad');
      const app = getApp();
      
      // 定义颜色数组
      const colors = [
        '#FF9B9B',  // 粉红
        '#94D3CC',  // 青绿
        '#9ACDFF',  // 天蓝
        '#FFB98E',  // 橙色
        '#B6A4FF',  // 紫色
        '#FFE69A',  // 黄色
        '#98E698',  // 绿色
        '#FFA4D4'   // 粉色
      ];
      
      // 确保有奖品数据
      if (!app.globalData.prizes || app.globalData.prizes.length === 0) {
        app.globalData.prizes = [
          { name: '奖品1', weight: 10 },
          { name: '奖品2', weight: 20 },
          { name: '奖品3', weight: 30 },
          { name: '奖品4', weight: 40 },
          { name: '奖品5', weight: 50 },
          { name: '奖品6', weight: 60 },
          { name: '奖品7', weight: 70 },
          { name: '奖品8', weight: 80 }
        ];
      }
      
      // 计算总权重
      const totalWeight = app.globalData.prizes.reduce((sum, p) => sum + (Number(p.weight) || 0), 0);
      
      // 计算角度，从-90度（12点位置）开始
      let startAngle = -90;
      
      const prizes = app.globalData.prizes.map((prize, index) => {
        // 确保 weight 是数字类型
        const weight = Number(prize.weight) || 0;
        // 根据权重计算角度
        const angle = (weight / totalWeight) * 360;
        
        console.log(`Prize ${prize.name}: weight=${weight}, angle=${angle}`); // 调试日志
        
        const prizeData = {
          ...prize,
          weight: weight, // 确保存储的是数字类型
          startAngle: startAngle,
          endAngle: startAngle + angle,
          color: colors[index % colors.length]
        };
        startAngle += angle;
        return prizeData;
      });
      
      console.log('Total weight:', totalWeight); // 调试日志
      console.log('Processed prizes:', prizes); // 调试日志
      
      this.setData({
        prizes: prizes,
        wheelTitle: app.globalData.wheelTitle || '幸运大转盘'
      });
      
      // 初始化画布
      this.initCanvas();
    },
  
    initCanvas() {
      const query = wx.createSelectorQuery();
      query.select('#wheelCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]) return;
          
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          
          // 获取屏幕信息
          const info = wx.getWindowInfo();
          const dpr = info.pixelRatio;
          
          // 设置画布尺寸
          this.canvasWidth = this.data.canvasSize;
          this.canvasHeight = this.data.canvasSize;
          
          // 设置实际渲染尺寸
          canvas.width = this.canvasWidth * dpr;
          canvas.height = this.canvasHeight * dpr;
          ctx.scale(dpr, dpr);
          
          this.canvas = canvas;
          this.ctx = ctx;
          this.drawWheel();
        });
    },
  
    // 保存 canvas 数据
    saveCanvasData() {
      // 移除大量数据的保存，只保存必要信息
      if (this.canvas && this.ctx) {
        this.setData({
          canvasReady: true
        });
      }
    },
  
    // 恢复 canvas 数据
    restoreCanvasData() {
      if (this.ctx && this.data.canvasData) {
        try {
          this.ctx.putImageData(this.data.canvasData, 0, 0);
        } catch (e) {
          console.error('Restore canvas data failed:', e);
          this.drawWheel(); // 如果恢复失败，重新绘制
        }
      }
    },
  
    drawWheel() {
      if (!this.ctx || !this.data.prizes.length) {
        console.error('Context or prizes not ready');
        return;
      }
      
      const ctx = this.ctx;
      const centerX = this.canvasWidth / 2;
      const centerY = this.canvasHeight / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // 清空画布
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // 绘制每个扇形
      this.data.prizes.forEach((prize, index) => {
        const startRad = (prize.startAngle + this.data.rotateAngle) * Math.PI / 180;
        const endRad = (prize.endAngle + this.data.rotateAngle) * Math.PI / 180;
        
        // 绘制扇形
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startRad, endRad);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();
        
        // 白色分割线
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制文字
        const textRad = (startRad + endRad) / 2;
        const textDistance = radius * 0.65;
        
        ctx.save();
        ctx.translate(
          centerX + Math.cos(textRad) * textDistance,
          centerY + Math.sin(textRad) * textDistance
        );
        ctx.rotate(textRad + Math.PI / 2);
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(prize.name, 0, 0);
        ctx.restore();
      });
      
      // 绘制外圈
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 绘制中心点
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 2;
      ctx.stroke();
    },
  
    onShow() {
      console.log('[Index] onShow');
      // 获取最新的奖品数据
      const app = getApp();
      
      // 计算总权重
      const totalWeight = app.globalData.prizes.reduce((sum, p) => sum + (Number(p.weight) || 0), 0);
      
      // 计算角度，从-90度（12点位置）开始
      let startAngle = -90;
      
      // 使用不同的变量名避免冲突
      const processedPrizes = app.globalData.prizes.map((prize, index) => {
        // 确保 weight 是数字类型
        const weight = Number(prize.weight) || 0;
        // 根据权重计算角度
        const angle = (weight / totalWeight) * 360;
        
        const prizeData = {
          ...prize,
          weight: weight,
          startAngle: startAngle,
          endAngle: startAngle + angle,
          color: prize.color || this.data.prizes[index]?.color
        };
        startAngle += angle;
        return prizeData;
      });
      
      // 更新数据并重绘转盘
      if (processedPrizes.length > 0) {
        this.setData({ 
          prizes: processedPrizes 
        }, () => {
          // 确保数据更新后再重绘
          if (this.ctx) {
            this.drawWheel();
          } else {
            this.initCanvas();
          }
        });
      }
    },
  
    startLucky() {
      if (this.data.isRotating) return;
      
      const prizes = this.data.prizes;
      if (!prizes || prizes.length === 0) return;
      
      // 清空当前奖品显示
      this.setData({
        currentPrize: ''
      });
      
      const random = Math.random();
      let probabilitySum = 0;
      let selectedPrize = null;
      
      // 计算总权重
      const totalWeight = prizes.reduce((sum, p) => sum + (Number(p.weight) || 0), 0);
      
      // 根据权重选择奖品
      for (const prize of prizes) {
        const probability = Number(prize.weight) / totalWeight;
        probabilitySum += probability;
        if (random <= probabilitySum) {
          selectedPrize = prize;
          break;
        }
      }
      
      if (!selectedPrize) {
        selectedPrize = prizes[0];
      }

      const targetAngle = this.calculateTargetAngle(selectedPrize);
      
      this.setData({
        isRotating: true
      });
      
      const startTime = Date.now();
      const duration = this.data.duration;
      const startAngle = this.data.lastAngle;
      
      const animate = () => {
        const now = Date.now();
        const timePassed = now - startTime;
        
        if (timePassed >= duration) {
          this.setData({
            rotateAngle: targetAngle,
            lastAngle: targetAngle,
            isRotating: false,
            currentPrize: selectedPrize.name
          });
          
          this.drawWheel();
          return;
        }
        
        const progress = timePassed / duration;
        const easeProgress = this.easeInOutCubic(progress);
        const currentAngle = startAngle + ((targetAngle - startAngle) * easeProgress);
        
        this.setData({ rotateAngle: currentAngle });
        this.drawWheel();
        
        this.animationTimer = setTimeout(animate, 16);
      };
      
      animate();
    },
  
    calculateTargetAngle(prize) {
      if (!prize || typeof prize.startAngle !== 'number' || typeof prize.endAngle !== 'number') {
        console.error('Invalid prize data:', prize);
        return 360 * 8;
      }
      
      // 计算奖品区域的中心角度
      const prizeAngle = (prize.startAngle + prize.endAngle) / 2;
      
      // 计算需要旋转的角度
      // 确保每次都是顺时针旋转，并且至少转8圈
      const currentAngle = this.data.lastAngle % 360;  // 获取当前角度（去除完整圈数）
      const targetAngle = -(prizeAngle + 90);  // 目标角度（负号使其与指针对齐）
      const diffAngle = targetAngle - (currentAngle % 360);  // 计算需要转动的角度差
      
      // 确保是顺时针旋转（正值）
      const normalizedDiff = diffAngle <= 0 ? diffAngle + 360 : diffAngle;
      
      // 计算总旋转角度：当前角度 + 8圈 + 归位角度
      return this.data.lastAngle + (360 * 8) + normalizedDiff;
    },
  
    easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
  
    goToEdit() {
      // 保存当前状态
      // 使用微信小程序自带的导航
      wx.navigateTo({
        url: '/pages/edit/edit',
        animationType: 'slide-in-right', // 从右侧滑入
        animationDuration: 300 // 动画持续时间
      });
    },
  
    onHide() {
      console.log('[Index] onHide');
      // 页面隐藏时保存 canvas 数据
      this.saveCanvasData();
      console.log('页面隐藏');
    },
  
    onUnload() {
      console.log('[Index] onUnload');
      // 页面卸载时清理资源
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
      }
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx = null;
      }
      if (this.canvas) {
        this.canvas = null;
      }
    },
  
    showEdit() {
      this.setData({
        showEditPopup: true
      });
    },
  
    hideEdit() {
      this.setData({
        showEditPopup: false
      });
    },
  
    stopPropagation() {
      // 阻止事件冒泡
    },
  
    // 当编辑完成时调用
    onEditComplete() {
      this.hideEdit();
      this.refreshWheel(); // 刷新大转盘
    },
  
    refreshWheel() {
      const app = getApp();
      // ... 重新计算和绘制大转盘的代码 ...
    }
  })