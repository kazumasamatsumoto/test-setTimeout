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

    describe('秒数がわからない場合の対処法', () => {
      it('方法1: runAllTimers()で全てのタイマーを即座に実行（推奨）', () => {
        // 秒数がわからない場合、runAllTimers()を使うと全てのタイマーを即座に実行できる
        component.delayedUpdate('秒数不明でも実行', 999999); // 非常に長い時間でも

        // runAllTimers()で全てのタイマーを即座に実行
        jest.runAllTimers();

        // 即座に更新されていることを確認
        expect(component.message()).toBe('秒数不明でも実行');
      });

      it('方法2: runOnlyPendingTimers()で待機中のタイマーのみ実行', () => {
        // runOnlyPendingTimers()は、現在待機中のタイマーのみを実行
        // 再帰的なタイマー（setTimeout内でsetTimeoutを呼ぶ）がある場合に便利
        component.delayedUpdate('待機中のタイマー', 10000);

        // 待機中のタイマーのみ実行
        jest.runOnlyPendingTimers();

        expect(component.message()).toBe('待機中のタイマー');
      });

      it('方法3: 十分に大きな時間を進める', () => {
        // 秒数がわからないが、最大でも1時間以内とわかっている場合など
        component.delayedUpdate('大きな時間を進める', 3600000); // 1時間

        // 十分に大きな時間を進める
        jest.advanceTimersByTime(3600000);

        expect(component.message()).toBe('大きな時間を進める');
      });

      it('方法4: タイマーが設定されているか確認してから実行', () => {
        // タイマーが設定されているか確認する方法
        const initialTimerCount = jest.getTimerCount();
        
        component.delayedUpdate('タイマー確認後実行', 5000);
        
        // タイマーが1つ増えていることを確認
        expect(jest.getTimerCount()).toBe(initialTimerCount + 1);
        
        // 全てのタイマーを実行
        jest.runAllTimers();
        
        expect(component.message()).toBe('タイマー確認後実行');
      });

      it('方法5: 段階的に時間を進めて確認', () => {
        // 秒数がわからない場合、段階的に時間を進めて確認する
        component.delayedUpdate('段階的に確認', 5000);

        // 1秒ずつ進めて確認
        jest.advanceTimersByTime(1000);
        expect(component.message()).not.toBe('段階的に確認'); // まだ実行されていない

        jest.advanceTimersByTime(1000);
        expect(component.message()).not.toBe('段階的に確認'); // まだ実行されていない

        jest.advanceTimersByTime(3000); // 合計5秒
        expect(component.message()).toBe('段階的に確認'); // 実行された
      });

      it('方法6: 複数のタイマーがある場合、全てを一度に実行', () => {
        // 複数のタイマーがあり、それぞれの秒数がわからない場合
        component.delayedUpdate('タイマー1', 1000);
        component.delayedUpdate('タイマー2', 5000);
        component.delayedUpdate('タイマー3', 10000);

        // runAllTimers()で全てのタイマーを一度に実行
        jest.runAllTimers();

        // 最後に設定されたタイマーが実行されていることを確認
        expect(component.message()).toBe('タイマー3');
      });
    });
  });

  describe('初期化データ取得のテスト', () => {
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
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('モックデータを設定して、100ms後にオブジェクトに格納される', async () => {
      // モックデータを用意
      const mockData = {
        id: 123,
        name: 'テストデータ',
        value: 'テスト値',
        items: ['item1', 'item2', 'item3'],
      };

      // モックデータを返す関数を設定
      component.setDataFetcher(async () => mockData);

      // 初期状態を確認（まだデータが格納されていない）
      expect(component.initializedData).toEqual({});

      // コンポーネントを再初期化（initializeDataを呼び出すため）
      // または、直接initializeDataを呼び出す方法もあるが、
      // ここではsetDataFetcherを設定した後に再度初期化する
      // 実際には、setDataFetcherを設定してからコンポーネントを作成する方が良い
      // しかし、コンストラクタでinitializeDataが呼ばれるため、
      // 先にsetDataFetcherを設定する必要がある

      // 100ms進める（setTimeoutを実行）
      jest.advanceTimersByTime(100);

      // Promiseが解決されるまで待つ
      await Promise.resolve();

      // データがオブジェクトに格納されていることを確認
      expect(component.initializedData).toEqual(mockData);
      expect(component.initializedData['id']).toBe(123);
      expect(component.initializedData['name']).toBe('テストデータ');
      expect(component.initializedData['value']).toBe('テスト値');
      expect(component.initializedData['items']).toEqual(['item1', 'item2', 'item3']);
    });

  });

  describe('初期化データ取得のテスト（改善版）', () => {
    let mockDataFetcher: jest.Mock;

    beforeEach(() => {
      jest.useFakeTimers();
    });

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [Verification],
        imports: [CommonModule],
      }).compileComponents();

      fixture = TestBed.createComponent(Verification);
      component = fixture.componentInstance;
    });

    afterEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    it('モックデータを設定して、100ms後にオブジェクトに正しく格納される', async () => {
      // モックデータを用意
      const mockData = {
        id: 999,
        name: 'モックデータ',
        data: { key: 'value', nested: { prop: 'test' } },
      };

      // モックデータ取得関数を作成
      mockDataFetcher = jest.fn().mockResolvedValue(mockData);

      // モックデータ取得関数を設定
      component.setDataFetcher(mockDataFetcher);

      // 初期状態を確認（コンストラクタで既にinitializeDataが呼ばれているが、
      // デフォルトのデータ取得関数が使われているため、まだモックデータは格納されていない）
      expect(component.initializedData).not.toEqual(mockData);

      // initializeDataを再度呼び出し（setDataFetcherを設定した後）
      component.initializeData();

      // 100ms進める（setTimeoutを実行）
      jest.advanceTimersByTime(100);

      // Promiseが解決されるまで待つ
      await Promise.resolve();

      // モック関数が呼ばれていることを確認
      // 注意: コンストラクタで既に1回呼ばれているため、2回呼ばれる
      expect(mockDataFetcher).toHaveBeenCalled();

      // データがオブジェクトに格納されていることを確認
      expect(component.initializedData).toEqual(mockData);
      expect(component.initializedData['id']).toBe(999);
      expect(component.initializedData['name']).toBe('モックデータ');
      expect(component.initializedData['data']).toEqual({ key: 'value', nested: { prop: 'test' } });
    });

    it('異なるモックデータを設定して、正しく格納される', async () => {
      // 別のモックデータを用意
      const mockData = {
        userId: 12345,
        userName: 'テストユーザー',
        email: 'test@example.com',
        roles: ['admin', 'user'],
      };

      // モックデータ取得関数を作成
      mockDataFetcher = jest.fn().mockResolvedValue(mockData);

      // モックデータ取得関数を設定
      component.setDataFetcher(mockDataFetcher);

      // initializeDataを呼び出し
      component.initializeData();

      // 100ms進める
      jest.advanceTimersByTime(100);

      // Promiseが解決されるまで待つ
      await Promise.resolve();

      // データが正しく格納されていることを確認
      expect(component.initializedData).toEqual(mockData);
      expect(component.initializedData['userId']).toBe(12345);
      expect(component.initializedData['userName']).toBe('テストユーザー');
      expect(component.initializedData['roles']).toEqual(['admin', 'user']);
    });

    it('エラーが発生した場合、空のオブジェクトが格納される', async () => {
      // エラーを発生させるモック関数を作成
      mockDataFetcher = jest.fn().mockRejectedValue(new Error('データ取得エラー'));

      // モックデータ取得関数を設定
      component.setDataFetcher(mockDataFetcher);

      // initializeDataを呼び出し
      component.initializeData();

      // 100ms進める
      jest.advanceTimersByTime(100);

      // Promiseが解決されるまで待つ
      await Promise.resolve();

      // エラーが発生した場合、空のオブジェクトが格納される
      expect(component.initializedData).toEqual({});
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
