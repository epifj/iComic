// 模拟漫画数据（每本由若干图片构成章节页面）
const comics = [
  {
    id: 1,
    title: "胆大党",
    author: "龙幸伸",
    tags: ["动作", "奇幻"],
    isFree: true,
    cover: "images/胆大党.png",
    pages: ["images/胆大党.png","images/胆大党1.png"]
  },
  {
    id: 2,
    title: "葬送的芙莉莲",
    author: "山田钟人 / 阿部司",
    tags: ["奇幻", "冒险"],
    isFree: false,
    cover: "images/葬送的芙莉莲.png",
    pages: ["images/葬送的芙莉莲.png","images/葬送的芙莉莲1.png"]
  },
  {
    id: 3,
    title: "名侦探柯南",
    author: "青山刚昌",
    tags: ["推理", "悬疑"],
    isFree: true,
    cover: "images/名侦探柯南.png",
    pages: ["images/名侦探柯南.png","images/名侦探柯南1.png"]
  },
  {
    id: 4,
    title: "间谍过家家",
    author: "远藤达哉",
    tags: ["搞笑", "家庭", "间谍"],
    isFree: false,
    cover: "images/间谍过家家.png",
    pages: ["images/间谍过家家.png","images/间谍过家家1.png"]
  }
];

const collections = [
  { id: 1, title: "动作精选", comics: [1, 4] },
  { id: 2, title: "奇幻必看", comics: [2] }
];
