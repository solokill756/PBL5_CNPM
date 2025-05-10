import { Sequelize, DataTypes, Model } from "sequelize";

interface ForumReportAttributes {
  report_id: string;
  reported_by: string;
  post_id?: string;
  comment_id?: string;
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  created_at: Date;
}

interface ForumReportCreationAttributes
  extends Partial<
    Pick<
      ForumReportAttributes,
      "report_id" | "post_id" | "comment_id" | "created_at"
    >
  > {}

class ForumReport
  extends Model<ForumReportAttributes, ForumReportCreationAttributes>
  implements ForumReportAttributes
{
  declare report_id: string;
  declare reported_by: string;
  declare post_id?: string;
  declare comment_id?: string;
  declare reason: string;
  declare status: "pending" | "reviewed" | "resolved";
  declare created_at: Date;
}

export default (sequelize: Sequelize) => {
  ForumReport.init(
    {
      report_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      reported_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      comment_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "reviewed", "resolved"),
        allowNull: false,
        defaultValue: "pending",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "forum_report",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["report_id"]
        }
      ]
    }
  );

  return ForumReport;
};
