module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    publishedYear: {
      type: DataTypes.INTEGER
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Subjects',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  Book.associate = (models) => {
    Book.belongsTo(models.Subject, {
      foreignKey: 'subjectId',
      as: 'subject'
    });
  };

  return Book;
};