document.addEventListener('DOMContentLoaded', function() {
  // Tab数据配置，先声明
  const tabOptions = {
    heat: {
      series: [{
        type: 'heatmap',
        coordinateSystem: 'geo',
        data: [
          {name: '北京', value: 120},
          {name: '上海', value: 110},
          {name: '成都', value: 98},
          {name: '天水', value: 150},
          {name: '柳州', value: 120},
          {name: '淄博', value: 110},
          {name: '南昌', value: 105},
          {name: '巴彦淖尔', value: 140}
        ],
        blurSize: 34,
        minOpacity: 0.15,
        itemStyle: {color: '#00bcd4'}
      }]
    },
    trend: {
      series: [{
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: [
          {name: '柳州', value: [109.4,24.3, 80]},
          {name: '淄博', value: [118.0,36.8, 70]},
          {name: '天水', value: [105.7,34.6, 110]},
          {name: '成都', value: [104.1,30.6, 98]}
        ],
        symbolSize: function(val){ return val[2]/2; },
        showEffectOn: 'render',
        rippleEffect: {brushType: 'stroke'},
        itemStyle: {color: '#ff9800'}
      }]
    },
    consume: {
      series: [{
        type: 'scatter',
        coordinateSystem: 'geo',
        data: [
          {name: '北京', value: [116.4,39.9, 120]},
          {name: '成都', value: [104.1,30.6, 110]},
          {name: '柳州', value: [109.4,24.3, 70]},
          {name: '南昌', value: [115.9,28.7, 90]}
        ],
        symbolSize: function(val){ return val[2]/3; },
        itemStyle: {color: '#4caf50'}
      }]
    },
    emotion: {
      series: [{
        type: 'scatter',
        coordinateSystem: 'geo',
        data: [
          {name: '南昌', value: [115.9,28.7, 80]},
          {name: '淄博', value: [118.0,36.8, 75]},
          {name: '柳州', value: [109.4,24.3, 60]},
          {name: '天水', value: [105.7,34.6, 120]}
        ],
        symbolSize: function(val){ return val[2]/2.5; },
        itemStyle: {color: '#e91e63'}
      }]
    },
    fashion: {
      series: [{
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: [
          {name: '成都', value: [104.1,30.6, 95]},
          {name: '上海', value: [121.5,31.2, 90]},
          {name: '北京', value: [116.4,39.9, 85]},
          {name: '天水', value: [105.7,34.6, 105]}
        ],
        symbolSize: function(val){ return val[2]/2; },
        showEffectOn: 'render',
        rippleEffect: {brushType: 'stroke'},
        itemStyle: {color: '#3f51b5'}
      }]
    }
  };

  // 初始化地图
  var chart = echarts.init(document.getElementById('mainMap'));
  var baseOption = {
    tooltip: {
      show: true,
      trigger: 'item',
      formatter: function(params){
        if(params.data && params.data.name){
          return params.data.name + '<br>热度：' + (params.value[2] || params.value) + '<br>点击查看详细趋势';
        }
        return params.name || '';
      }
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.18,
      itemStyle: {
        normal: {
          areaColor: '#e0f7fa',
          borderColor: '#b2ebf2'
        },
        emphasis: {
          areaColor: '#80deea'
        }
      },
      label: {show: false}
    },
    series: []
  };
  // 激活默认Tab
  let currentTab = 'heat';
  chart.setOption(Object.assign({}, baseOption, tabOptions[currentTab]));

  // Tab切换
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelector('.tab.active').classList.remove('active');
      this.classList.add('active');
      currentTab = this.getAttribute('data-tab');
      const newOption = Object.assign({}, baseOption, tabOptions[currentTab]);
      chart.setOption(newOption, true);
    });
  });

  // 时间轴
  const slider = document.getElementById('timelineSlider');
  const label = document.getElementById('timelineLabel');
  slider.addEventListener('input', function() {
    label.textContent = '假期第' + (parseInt(this.value) + 1) + '天';
    // 可接入你的不同天数据
  });

  // 地图点击弹窗
  chart.on('click', function(params) {
    // 移除旧弹窗
    const oldPopup = document.querySelector('.card-popup');
    if (oldPopup) oldPopup.remove();
    // 仅响应城市
    if (!params.name) return;
    // 构造弹窗
    const popup = document.createElement('div');
    popup.className = 'card-popup';
    popup.innerHTML = `<strong>${params.name}</strong><br>
      热度趋势：<span style='color:#00bcd4'>高</span><br>
      旅行方式：Citywalk<br>
      消费结构：美食、住宿、交通<br>
      舆论热词：#反向旅游 #小众城市`;
    // 定位
    const mapRect = chart.getDom().getBoundingClientRect();
    let left = params.event.event.offsetX;
    let top = params.event.event.offsetY;
    if (left > mapRect.width - 240) left = mapRect.width - 240;
    if (top > mapRect.height - 120) top = mapRect.height - 120;
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.position = 'absolute';
    document.getElementById('mainMap').appendChild(popup);
    // 外部点击关闭
    setTimeout(() => {
      document.addEventListener('click', function handler(e) {
        if (!popup.contains(e.target)) {
          popup.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 10);
  });

  // 彩蛋
  const easterEggBtn = document.getElementById('easterEgg');
  if (easterEggBtn) {
    easterEggBtn.addEventListener('click', function(e) {
      e.preventDefault();
      alert('你的五一潮流标签：#Citywalk达人 #OOTD先锋 #反向旅游官');
    });
  }

  // 浏览器窗口自适应
  window.addEventListener('resize', function() {
    if (chart) chart.resize();
  });
});
