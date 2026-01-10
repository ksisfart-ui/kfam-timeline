// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '暦家タイムライン', // サイトごとにフルネームを記載
    short_name: 'K-TIMELINE',      // アイコンの下に表示される短い名前
    description: '「暦家」の一日の行動を、タイムライン形式で見返せる非公式ファンサイト',
    start_url: '/',           // ホーム画面から起動した時のパス
    display: 'standalone',    // ★重要：ブラウザのUIを隠してアプリ風にする
    background_color: '#1a1a1a', // 起動画面の背景色（ダークモードに合わせる）
    theme_color: '#1a1a1a',      // 通知バーやステータスバーの色
    icons: [
      {
        src: '/icon.png',       // app/icon.png を参照
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}