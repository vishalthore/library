module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true
  });

  return Subject;
};