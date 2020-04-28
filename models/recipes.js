module.exports = function(sequelize, DataTypes) {
  var Recipes = sequelize.define("Recipes", {
    //this will be a link to the edamam recipe api databse
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      // this is a validate function that ensures the length is at least 1 letter
      validate: {
        len: [1]
      }
    }
  });

  Recipes.associate = function(models) {
    // We're saying that a recipe should belong to an user
    // A recipe can't be created without a user due to the foreign key constraint
    Recipes.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Recipes;
};
