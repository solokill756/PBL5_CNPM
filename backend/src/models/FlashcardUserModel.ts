import { DataTypes, Model, Sequelize } from "sequelize";

interface FlashCardUserAttributes {
    flashcard_id: string;
    user_id: string;
    review_count: number;
    last_review: Date;
    created_at: Date;
    like_status: boolean;
    remember_status: boolean;
}

class FlashCardUser extends Model<FlashCardUserAttributes> implements FlashCardUserAttributes {
    declare flashcard_id: string;
    declare user_id: string;
    declare review_count: number;
    declare last_review: Date;
    declare created_at: Date;
    declare like_status: boolean;
    declare remember_status: boolean;
}


export default (sequelize: Sequelize) => {
    FlashCardUser.init(
        {
            flashcard_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },

            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            review_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            last_review: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(),
            },
            like_status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            remember_status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            tableName: "flashcard_user",
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["flashcard_id", "user_id"]
                }
            ]
        }
    );

    return FlashCardUser;
}
