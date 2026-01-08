export const CATEGORY_PALETTES: Record<string, { bg: string; border: string; text: string }[]> = {
  "警察": [
    { bg: "#373737", border: "#E1D1B3", text: "#FFFFFF" }, // 墨 × 亜麻 × 白
    { bg: "#373737", border: "#B9D08B", text: "#FFFFFF" }, // 墨 × 若葉 × 白
    { bg: "#373737", border: "#A59ACA", text: "#FFFFFF" }, // 墨 × 藤紫 × 白
    { bg: "#373737", border: "#64BCC7", text: "#FFFFFF" }, // 墨 × 新橋 × 白
    { bg: "#373737", border: "#9E3D3E", text: "#FFFFFF" }, // 墨 × 蘇芳 × 白
  ],
  "医療": [
    { bg: "#FFFFFE", border: "#9E3D3E", text: "#640125" }, // 梅 (白 × 蘇芳) × 葡萄色
    { bg: "#FFFFFE", border: "#91B493", text: "#051419" }, // 柳 (白 × 淡青) × 五倍子鉄漿
    { bg: "#FFFFFE", border: "#8E4898", text: "#051419" }, // 白躑躅 (白 × 紫) × 五倍子鉄漿
  ],
  "メカニック": [
    { bg: "#F8A484", border: "#EE7836", text: "#72221A" }, // 曙 × 人参 × 赤銅
    { bg: "#F49D43", border: "#F3E9BE", text: "#FFFFFF" }, // 萱草 × 蒸栗 × 白
    { bg: "#E0803A", border: "#F7B977", text: "#FFFFFF" }, // 金木犀 × 杏 × 白
    { bg: "#F6AD48", border: "#72221A", text: "#FFFFFF" }, // 柑子 × 赤銅 × 白
    { bg: "#F4A57A", border: "#B3364F", text: "#FFFFFF" }, // 朱華 × 紅樺 × 白
    { bg: "#E79A3E", border: "#706145", text: "#FFFFFF" }, // 鶏冠石 × 媚茶 × 白
    { bg: "#DD7A55", border: "#E1D1B3", text: "#FFFFFF" }, // 肉桂 × 亜麻 × 白
  ],
  "飲食店": [
    { bg: "#282E89", border: "#91B493", text: "#FFFFFF" }, // 秘色 (瑠璃色 × 淡青) × 白
    { bg: "#2980AF", border: "#0074A0", text: "#FFFFFF" }, // 花田 (縹 × 縹) × 白
    { bg: "#2980AF", border: "#8E354A", text: "#FFFFFF" }, // 葡萄染 (蘇芳 × 縹) × 白
    { bg: "#082752", border: "#D7CF3A", text: "#FFFFFF" }, // 濃藍 × 鶸 × 白
    { bg: "#004676", border: "#00A2AF", text: "#FFFFFF" }, // 呉須 × 浅葱 × 白
    { bg: "#00669F", border: "#BBD3E6", text: "#FFFFFF" }, // 孔雀青 × 砧青磁 × 白
    { bg: "#0C5A85", border: "#EB9793", text: "#FFFFFF" }, // 裏 × 乾鮭 × 白
    { bg: "#1E50A2", border: "#F6AD48", text: "#FFFFFF" }, // 瑠璃紺 × 柑子 × 白
    { bg: "#4E67B0", border: "#D8BEBD", text: "#FFFFFF" }, // 群青 × 浪花鼠 × 白
    { bg: "#4653A2", border: "#D6E9CA", text: "#FFFFFF" }, // 杜若 × 白緑 × 白
    { bg: "#213D5D", border: "#D6E9CA", text: "#FFFFFF" }, // 暝 × 白緑 × 白
    { bg: "#3D597D", border: "#839CCA", text: "#FFFFFF" }, // 藍 × 青藤 × 白
    { bg: "#17184B", border: "#BF783D", text: "#FFFFFF" }, // 鉄紺 × 胡桃 × 白
  ],
  "自宅": [
    { bg: "#BF794E", border: "#E1B982", text: "#FFFFFF" }, // 駱駝 × 伽羅 × 白
    { bg: "#E1B982", border: "#BF794E", text: "#051419" }, // 伽羅 × 駱駝 × 五倍子鉄漿
    { bg: "#A0564D", border: "#C29B8F", text: "#FFFFFE" }, // 小豆 × 嵯峨鼠 × 白
  ],
  "住民の家": [
    { bg: "#D2DBC4", border: "#5A7561", text: "#051419" }, // 裏柳 × 千歳緑 × 五倍子鉄漿
    { bg: "#D6E9CA", border: "#542658", text: "#051419" }, // 白緑 × 桑の実 × 五倍子鉄漿
    { bg: "#EFECAD", border: "#007F89", text: "#051419" }, // 女郎花 × 碧 × 五倍子鉄漿
  ],
  "車両・運輸": [
    { bg: "#A0D8EF", border: "#1E50A2", text: "#051419" }, // 空 × 瑠璃紺 × 五倍子鉄漿
    { bg: "#BBD3E6", border: "#895B8A", text: "#051419" }, // 砧青磁 × 古代紫 × 五倍子鉄漿
    { bg: "#A2D7DD", border: "#D0104C", text: "#051419" }, // 瓶覗 × 韓紅花 × 五倍子鉄漿
    { bg: "#7C94C0", border: "#F2C3CA", text: "#FFFFFE" }, // 御空 × 撫子 × 白
    { bg: "#B9C9D2", border: "#FEECD2", text: "#051419" }, // 空色鼠 × 象牙 × 五倍子鉄漿
  ],
  "販売": [
    { bg: "#B07DA3", border: "#763166", text: "#FFFFFF" }, // 梅鼠 × 葡萄 × 白
    { bg: "#4B1A47", border: "#E59F5C", text: "#FFFFFF" }, // 茄子紺 × 小麦 × 白
    { bg: "#460D43", border: "#BDD7CA", text: "#FFFFFF" }, // 紫紺 × 浅緑 × 白
    { bg: "#968ABD", border: "#BDD7CA", text: "#FFFFFF" }, // 紫苑 × 浅緑 × 白
    { bg: "#895B8A", border: "#BBBCDE", text: "#FFFFFF" }, // 古代紫 × 藤 × 白
  ],
  "金融": [
    { bg: "#000026", border: "#F9CA00", text: "#F6F7F8" }, // 檳榔子染 × 金 × 月白
  ],
  "その他": [
    { bg: "#BDBEBE", border: "#426669", text: "#232323" }, // 薄墨 × 御召茶 × 鉄黒
    { bg: "#B9B9B9", border: "#646364", text: "#232323" }, // 銀鼠 × 御召茶 × 鉄黒
    { bg: "#B9BBBD", border: "#4653A2", text: "#232323" }, // 錫 × 杜若 × 鉄黒
    { bg: "#D8D6D7", border: "#C70532", text: "#232323" }, // 霞 × 柘榴 × 鉄黒
    { bg: "#D8D6D7", border: "#EC6800", text: "#232323" }, // 霞 × 黄赤 × 鉄黒
    { bg: "#D8D6D7", border: "#965036", text: "#232323" }, // 霞 × 檜皮 × 鉄黒
    { bg: "#D8D6D7", border: "#F9E7B7", text: "#232323" }, // 霞 × 砥粉 × 鉄黒
    { bg: "#D8D6D7", border: "#007364", text: "#232323" }, // 霞 × 鴨の羽 × 鉄黒
    { bg: "#D8D6D7", border: "#5383C2", text: "#232323" }, // 霞 × 薄群青 × 鉄黒
    { bg: "#D8D6D7", border: "#A596C7", text: "#232323" }, // 霞 × 楝 × 鉄黒
  ]
};