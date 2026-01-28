import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-verification',
  standalone: false,
  templateUrl: './verification.html',
  styleUrl: './verification.css',
})
export class Verification {
  currentDate = new Date().toLocaleDateString('ja-JP');
  message = signal<string>('初期メッセージ');
  count = signal<number>(0);
  isLoading = signal<boolean>(false);

  constructor() {
    // コンポーネント初期化時にsetTimeoutを使用
    setTimeout(() => {
      this.message.set('3秒後に更新されました');
    }, 3000);
  }

  // ボタンクリック時にsetTimeoutを使用
  handleClick() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.count.set(this.count() + 1);
      this.isLoading.set(false);
      this.message.set(`クリック回数: ${this.count()}`);
    }, 1000);
  }

  // 遅延実行メソッド
  delayedUpdate(text: string, delay: number) {
    setTimeout(() => {
      this.message.set(text);
    }, delay);
  }
}
