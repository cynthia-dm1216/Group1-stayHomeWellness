module.exports = function (sequelize, DataTypes) {
  var workOuts = sequelize.define("workOuts", {
    category: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    reps: {
      type: DataTypes.INTEGER,
    },
    sets: {
      type: DataTypes.INTEGER,
    },
  });
  return workOuts;
};
