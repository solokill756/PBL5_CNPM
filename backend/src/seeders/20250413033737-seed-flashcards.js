"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const flashcardCount = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM flashcard",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (parseInt(flashcardCount[0].count) > 0) {
      console.log("Flashcard table already seeded. Skipping...");
      return;
    }

    // Danh sách các list_id từ bảng list_flashcard
    const listIds = [
      "1a2b3c4d-0000-0000-0000-000000000001", // インフラ基礎用語
      "1a2b3c4d-0000-0000-0000-000000000002", // ネットワーク用語
      "1a2b3c4d-0000-0000-0000-000000000003", // データベース用語
      "1a2b3c4d-0000-0000-0000-000000000004", // セキュリティ用語
      "1a2b3c4d-0000-0000-0000-000000000005", // クラウドコンピューティング
      "1a2b3c4d-0000-0000-0000-000000000006"  // プログラミング基礎
    ];

    // Danh sách từ vựng được chia theo chủ đề
    const vocabByList = [
      // インフラ基礎用語 (server, cấu hình, môi trường,...)
      [
        ["サーバー", "máy chủ", "WebサーバーとDBサーバーを構築"],
        ["構成", "cấu trúc/cấu hình", "システム構成図を作成"],
        ["開発環境", "môi trường phát triển", "開発環境で動作確認する"],
        ["テスト環境", "môi trường kiểm thử", "UATテスト用の環境"],
        ["本番環境", "môi trường sản phẩm", "本番環境に不具合が発生"],
        ["ログ", "log", "ログを出力して原因を調査"],
        ["デバッグ", "gỡ lỗi", "デバッグツールを使う"],
        ["修正", "sửa lỗi", "バグを修正する"],
        // Thêm mới (17 từ)
        ["クラスタ", "cụm", "サーバークラスタを構築する"],
        ["ロードバランサー", "cân bằng tải", "トラフィックを分散する"],
        ["仮想化", "ảo hóa", "VMwareで仮想化環境を構築"],
        ["コンテナ", "container", "Dockerコンテナをデプロイ"],
        ["バックアップ", "sao lưu", "データを定期的にバックアップ"],
        ["リカバリ", "khôi phục", "障害時のリカバリ手順"],
        ["スケーラビリティ", "khả năng mở rộng", "システムのスケーラビリティを考慮"],
        ["モニタリング", "giám sát", "サーバーの稼働状況を監視"],
        ["パフォーマンス", "hiệu suất", "パフォーマンスチューニングを行う"],
        ["ストレージ", "lưu trữ", "大容量ストレージを導入"],
        ["冗長化", "dư thừa", "システムの冗長化を図る"],
        ["プロビジョニング", "cấp phát", "リソースを自動でプロビジョニング"],
        ["メンテナンス", "bảo trì", "定期メンテナンスを実施"],
        ["ファイアウォール", "tường lửa", "ファイアウォール設定を強化"],
        ["プロキシ", "proxy", "リバースプロキシを設定"],
        ["キャッシュ", "bộ nhớ đệm", "キャッシュで高速化を図る"],
        ["スループット", "thông lượng", "システムのスループットを測定"]
      ],
      // ネットワーク用語 (IP, DNS, router,...)
      [
        ["互換性", "tính tương thích", "古いブラウザとの互換性"],
        ["セッション", "phiên làm việc", "ログイン情報をセッションで保持"],
        ["クッキー", "cookie", "ユーザーの設定を保存"],
        ["認証", "xác thực", "JWTを使った認証"],
        ["権限", "quyền hạn", "管理者権限のチェック"],
        ["フレームワーク", "khung phần mềm", "Reactは人気のフレームワークです"],
        ["ライブラリ", "thư viện", "便利なライブラリを使う"],
        ["エラー", "lỗi", "システムエラーが発生した"],
        // Thêm mới (16 từ)
        ["IPアドレス", "địa chỉ IP", "IPアドレスを割り当てる"],
        ["DNS", "hệ thống tên miền", "DNSサーバーを設定"],
        ["ルーター", "bộ định tuyến", "ネットワークトラフィックを管理"],
        ["スイッチ", "bộ chuyển mạch", "LANスイッチを設置"],
        ["帯域幅", "băng thông", "帯域幅を増強する"],
        ["レイテンシ", "độ trễ", "ネットワークのレイテンシを測定"],
        ["プロトコル", "giao thức", "HTTPプロトコルを使用"],
        ["パケット", "gói dữ liệu", "パケットロスを防ぐ"],
        ["ゲートウェイ", "cổng", "デフォルトゲートウェイを設定"],
        ["サブネット", "mạng con", "サブネットマスクを定義"],
        ["VPN", "mạng riêng ảo", "VPNでセキュアな接続"],
        ["ポート", "cổng", "ポート番号を指定する"],
        ["ファイバー", "cáp quang", "高速なファイバー回線"],
        ["トラフィック", "lưu lượng", "トラフィックを監視する"],
        ["ロードテスト", "kiểm tra tải", "ネットワークの負荷をテスト"],
        ["パフォーマンスチューニング", "tối ưu hóa hiệu suất", "ネットワークのパフォーマンスを向上"]
      ],
      // データベース用語 (SQL, index, transaction,...)
      [
        ["データベース", "cơ sở dữ liệu", "MySQLを使う"],
        ["テーブル", "bảng", "ユーザーテーブルを作成"],
        ["カラム", "cột", "カラム名は英語にする"],
        ["外部キー", "khóa ngoại", "リレーションを張る"],
        ["主キー", "khóa chính", "一意の識別子"],
        ["正規化", "chuẩn hóa", "第3正規形まで行う"],
        ["インデックス", "chỉ mục", "検索速度を向上させる"],
        ["SQL", "ngôn ngữ SQL", "SELECT文を使ってデータ取得"],
        // Thêm mới (17 từ)
        ["ビュー", "view", "データベースビューを作成"],
        ["トリガー", "kích hoạt", "更新時にトリガーを実行"],
        ["ストアドプロシージャ", "thủ tục lưu trữ", "複雑な処理を簡略化"],
        ["バックアップ", "sao lưu", "データベースをバックアップ"],
        ["リカバリ", "khôi phục", "データベースをリカバリ"],
        ["レプリケーション", "nhân bản", "データベースのレプリケーションを設定"],
        ["シャーディング", "phân mảnh", "データを分散する"],
        ["パーティショニング", "phân vùng", "テーブルをパーティションに分割"],
        ["クエリ最適化", "tối ưu hóa truy vấn", "実行計画を確認する"],
        ["トランザクション分離", "cách ly giao dịch", "トランザクションの分離レベルを設定"],
        ["データ型", "kiểu dữ liệu", "適切なデータ型を選択"],
        ["制約", "ràng buộc", "一意制約を追加"],
        ["スキーマ", "lược đồ", "データベーススキーマを設計"],
        ["データウェアハウス", "kho dữ liệu", "分析用のデータウェアハウス"],
        ["ETL", "trích xuất-chuyển đổi-tải", "ETLプロセスを実装"],
        ["キャッシュ", "bộ nhớ đệm", "クエリ結果をキャッシュ"],
        ["パフォーマンス", "hiệu suất", "データベースのパフォーマンスを向上"]
      ],
      // セキュリティ用語 (firewall, encryption, VPN,...)
      [
        ["バグ", "lỗi phần mềm", "不具合を修正する必要がある"],
        ["要因", "nguyên nhân", "不具合の要因を分析"],
        ["影響範囲", "phạm vi ảnh hưởng", "修正による影響範囲を調べる"],
        ["再現", "tái hiện", "バグの再現手順を確認"],
        ["例外", "ngoại lệ", "例外処理を実装する"],
        ["検証", "kiểm chứng", "結果が期待通りか検証する"],
        ["単体テスト", "kiểm thử đơn vị", "JUnitを使って単体テストを行う"],
        ["結合テスト", "kiểm thử tích hợp", "複数のモジュールを結合して確認"],
        // Thêm mới (16 từ)
        ["暗号化", "mã hóa", "データを暗号化して保護"],
        ["復号化", "giải mã", "暗号化されたデータを復号"],
        ["認証局", "cơ quan chứng thực", "SSL証明書を発行"],
        ["ハッシュ", "băm", "パスワードをハッシュ化"],
        ["トークン", "mã thông báo", "認証トークンを発行"],
        ["脆弱性", "lỗ hổng", "システムの脆弱性をスキャン"],
        ["パッチ", "bản vá", "セキュリティパッチを適用"],
        ["侵入検知", "phát hiện xâm nhập", "IDSを導入する"],
        ["マルウェア", "phần mềm độc hại", "マルウェアを駆除"],
        ["フィッシング", "lừa đảo", "フィッシング攻撃を防ぐ"],
        ["DDoS攻撃", "tấn công DDoS", "DDoS攻撃を防御"],
        ["アクセス制御", "kiểm soát truy cập", "アクセス制御リストを設定"],
        ["監査ログ", "nhật ký kiểm tra", "セキュリティ監査ログを確認"],
        ["多要素認証", "xác thực đa yếu tố", "MFAを有効化"],
        ["セッション管理", "quản lý phiên", "セッションタイムアウトを設定"],
        ["ペネトレーションテスト", "kiểm tra thâm nhập", "システムの耐性をテスト"]
      ],
      // クラウドコンピューティング (AWS, Azure, container,...)
      [
        ["クエリ", "truy vấn", "クエリ最適化が必要"],
        ["トランザクション", "giao dịch", "ロールバック機能を使う"],
        ["仕様", "đặc tả kỹ thuật", "システムの仕様を確認してください"],
        ["設計書", "tài liệu thiết kế", "基本設計と詳細設計が含まれます"],
        ["要件定義", "định nghĩa yêu cầu", "要件定義フェーズで顧客と確認する"],
        ["実装", "cài đặt", "実装が完了したらレビューする"],
        ["リリース", "phát hành", "本番環境にリリースする"],
        ["保守", "bảo trì", "リリース後の保守対応"],
        // Thêm mới (17 từ)
        ["クラウド", "đám mây", "クラウドサービスを利用"],
        ["AWS", "Amazon Web Services", "AWSでサーバーを構築"],
        ["Azure", "Microsoft Azure", "Azureでアプリをデプロイ"],
        ["GCP", "Google Cloud Platform", "GCPで機械学習を実行"],
        ["サーバーレス", "không máy chủ", "サーバーレスアーキテクチャを採用"],
        ["コンテナオーケストレーション", "điều phối container", "Kubernetesで管理"],
        ["DevOps", "phát triển-vận hành", "DevOps文化を導入"],
        ["CI/CD", "tích hợp/triển khai liên tục", "CI/CDパイプラインを構築"],
        ["インフラストラクチャ", "cơ sở hạ tầng", "クラウドインフラを設計"],
        ["コスト最適化", "tối ưu hóa chi phí", "クラウドのコストを削減"],
        ["高可用性", "tính sẵn sàng cao", "システムの高可用性を確保"],
        ["ディザスタリカバリ", "khôi phục thảm họa", "DR計画を策定"],
        ["スケーリング", "mở rộng", "オートスケーリングを設定"],
        ["モニタリング", "giám sát", "クラウドリソースを監視"],
        ["ログ分析", "phân tích log", "ログを分析して問題を特定"],
        ["マイクロサービス", "vi dịch vụ", "マイクロサービスアーキテクチャを採用"],
        ["APIゲートウェイ", "cổng API", "APIゲートウェイでリクエストを管理"]
      ],
      // プログラミング基礎 (variable, loop, function,...)
      [
        ["変数", "biến", "変数名は分かりやすくする"],
        ["関数", "hàm", "関数を再利用可能にする"],
        ["戻り値", "giá trị trả về", "関数の戻り値をチェック"],
        ["引数", "đối số", "関数に引数を渡す"],
        ["クラス", "lớp", "オブジェクト指向の基本"],
        ["継承", "kế thừa", "クラスの継承を利用する"],
        ["ポリモーフィズム", "đa hình", "多態性とも呼ばれる"],
        ["機能", "chức năng/tính năng", "ログイン機能を実装する"],
        // Thêm mới (17 từ)
        ["ループ", "vòng lặp", "データをループで処理"],
        ["条件分岐", "rẽ nhánh", "if文で条件をチェック"],
        ["配列", "mảng", "データを配列で管理"],
        ["リスト", "danh sách", "Pythonのリストを使う"],
        ["辞書", "từ điển", "キーと値でデータを管理"],
        ["モジュール", "mô-đun", "コードをモジュール化"],
        ["パッケージ", "gói", "複数のモジュールをまとめる"],
        ["例外処理", "xử lý ngoại lệ", "try-catchを実装"],
        ["デバッグ", "gỡ lỗi", "ブレークポイントを設定"],
        ["コメント", "bình luận", "コードにコメントを追加"],
        ["リファクタリング", "tái cấu trúc", "コードをリファクタリング"],
        ["テスト", "kiểm thử", "ユニットテストを実行"],
        ["アルゴリズム", "thuật toán", "効率的なアルゴリズムを選択"],
        ["データ構造", "cấu trúc dữ liệu", "適切なデータ構造を選ぶ"],
        ["パターン", "mẫu", "デザインパターンを実装"],
        ["バージョン管理", "quản lý phiên bản", "Gitでコードを管理"],
        ["デプロイ", "triển khai", "アプリケーションをデプロイ"]
      ]
    ];

    // Tạo flashcard cho từng danh sách
    const flashcards = vocabByList.flatMap((vocabList, listIndex) =>
      vocabList.map(([front, back, note]) => ({
        flashcard_id: uuidv4(),
        list_id: listIds[listIndex],
        front_text: front,
        back_text: back,
        custom_note: note
      }))
    );

    await queryInterface.bulkInsert("flashcard", flashcards, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("flashcard", null, {});
  }
};