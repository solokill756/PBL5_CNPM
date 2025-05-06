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
        ["修正", "sửa lỗi", "バグを修正する"]
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
        ["エラー", "lỗi", "システムエラーが発生した"]
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
        ["SQL", "ngôn ngữ SQL", "SELECT文を使ってデータ取得"]
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
        ["結合テスト", "kiểm thử tích hợp", "複数のモジュールを結合して確認"]
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
        ["保守", "bảo trì", "リリース後の保守対応"]
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
        ["機能", "chức năng/tính năng", "ログイン機能を実装する"]
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