import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Verification } from './verification';

describe('Verification', () => {
  let component: Verification;
  let fixture: ComponentFixture<Verification>;

  describe('setTimeoutのテスト', () => {
    beforeEach(() => {
      // fakeTimersを先に有効化（コンポーネント作成前に）
      jest.useFakeTimers();
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [Verification],
        imports: [CommonModule],
      }).compileComponents();

      fixture = TestBed.createComponent(Verification);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      // 各テスト後にタイマーをクリア
      jest.clearAllTimers();
      // テスト後にrealTimersに戻す
      jest.useRealTimers();
    });

    it('コンストラクタ内のsetTimeoutが3秒後にメッセージを更新する', () => {
      // 初期状態を確認（コンストラクタ内のsetTimeoutはまだ実行されていない）
      expect(component.message()).toBe('初期メッセージ');

      // 3秒進める（コンストラクタ内のsetTimeoutを実行）
      jest.advanceTimersByTime(3000);

      // メッセージが更新されていることを確認
      expect(component.message()).toBe('3秒後に更新されました');
    });

    it('handleClickメソッドが1秒後にカウントとメッセージを更新する', () => {
      // 初期状態を確認
      expect(component.count()).toBe(0);
      expect(component.isLoading()).toBe(false);

      // クリック処理を実行
      component.handleClick();

      // 即座にisLoadingがtrueになることを確認
      expect(component.isLoading()).toBe(true);
      expect(component.count()).toBe(0); // まだカウントは更新されていない

      // 1秒進める
      jest.advanceTimersByTime(1000);

      // カウントとメッセージが更新され、isLoadingがfalseになることを確認
      expect(component.count()).toBe(1);
      expect(component.isLoading()).toBe(false);
      expect(component.message()).toBe('クリック回数: 1');
    });

    it('delayedUpdateメソッドが指定した時間後にメッセージを更新する', () => {
      const testMessage = '遅延更新されたメッセージ';
      const delay = 2000;

      // メソッドを呼び出し
      component.delayedUpdate(testMessage, delay);

      // まだ更新されていないことを確認
      expect(component.message()).not.toBe(testMessage);

      // 2秒進める
      jest.advanceTimersByTime(2000);

      // メッセージが更新されていることを確認
      expect(component.message()).toBe(testMessage);
    });

    it('複数のsetTimeoutが順番に実行される', () => {
      component.delayedUpdate('1秒後', 1000);
      component.delayedUpdate('2秒後', 2000);
      component.delayedUpdate('3秒後', 3000);

      // 500ms進める - まだ何も更新されない
      jest.advanceTimersByTime(500);
      expect(component.message()).toBe('初期メッセージ');

      // さらに500ms進める（合計1秒）
      jest.advanceTimersByTime(500);
      expect(component.message()).toBe('1秒後');

      // さらに1秒進める（合計2秒）
      jest.advanceTimersByTime(1000);
      expect(component.message()).toBe('2秒後');

      // さらに1秒進める（合計3秒）
      jest.advanceTimersByTime(1000);
      expect(component.message()).toBe('3秒後');
    });

    it('runAllTimersで全てのタイマーを即座に実行できる', () => {
      component.delayedUpdate('即座に実行', 5000);

      // runAllTimersで全てのタイマーを実行
      jest.runAllTimers();

      // 即座に更新されていることを確認
      expect(component.message()).toBe('即座に実行');
    });
  });

  // 注意: jest.config.jsでfakeTimers: { enableGlobally: true }が設定されているため、
  // realTimersを使う場合は、コンポーネント作成前にjest.useRealTimers()を呼ぶ必要があります。
  // ただし、コンストラクタ内でsetTimeoutを使用している場合、realTimersの使用は推奨されません。
  // 
  // realTimersを使いたい場合は、以下のようにテストを書くことができます：
  //
  // describe('realTimersを使ったテスト（オプション）', () => {
  //   beforeEach(async () => {
  //     jest.useRealTimers(); // 先にrealTimersを有効化
  //     await TestBed.configureTestingModule({
  //       imports: [Verification],
  //     }).compileComponents();
  //     fixture = TestBed.createComponent(Verification);
  //     component = fixture.componentInstance;
  //     fixture.detectChanges();
  //   });
  //
  //   afterEach(() => {
  //     jest.useFakeTimers(); // テスト後にfakeTimersに戻す
  //   });
  //
  //   it('realTimersを使用した場合のテスト例', async () => {
  //     const promise = new Promise<void>((resolve) => {
  //       setTimeout(() => {
  //         component.message.set('realTimersで更新');
  //         resolve();
  //       }, 100);
  //     });
  //     await promise;
  //     expect(component.message()).toBe('realTimersで更新');
  //   });
  // });
});
