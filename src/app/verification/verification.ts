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
  
  // 初期化データを格納するオブジェクト
  initializedData: { [key: string]: any } = {};

  // データ取得関数（テストでモック化可能にするため、プロパティとして定義）
  private dataFetcher: () => Promise<any> = this.defaultDataFetcher;

  constructor() {
    // コンポーネント初期化時にsetTimeoutを使用
    setTimeout(() => {
      this.message.set('3秒後に更新されました');
    }, 3000);

    // 初期化データの取得処理（100ms後に実行）
    this.initializeData();
  }

  // デフォルトのデータ取得関数
  private async defaultDataFetcher(): Promise<any> {
    // 実際の実装では、API呼び出しなどを行う
    return { id: 1, name: 'デフォルトデータ' };
  }

  // データ取得関数を設定（テストでモックデータを渡すため）
  setDataFetcher(fetcher: () => Promise<any>) {
    this.dataFetcher = fetcher;
  }

  // 初期化データを取得してオブジェクトに格納（テストで呼び出せるようにpublicに）
  async initializeData(): Promise<void> {
    setTimeout(async () => {
      try {
        const data = await this.dataFetcher();
        // 取得したデータをオブジェクトに格納
        this.initializedData = { ...data };
      } catch (error) {
        console.error('データ取得エラー:', error);
        this.initializedData = {};
      }
    }, 100);
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
