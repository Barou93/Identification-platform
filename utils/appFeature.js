class APIFeatures {
  constructor(model, queryOptions) {
    this.model = model; // Le modèle Sequelize
    this.queryOptions = queryOptions; // Les options de requête
  }

  filter() {
    const where = { ...this.queryOptions.where };

    // Exclure les champs non pertinents pour la filtration
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete where[el]);

    // Transformation des opérateurs MongoDB en opérateurs Sequelize
    Object.keys(where).forEach((key) => {
      if (typeof where[key] === 'object' && where[key] !== null) {
        Object.keys(where[key]).forEach((op) => {
          const newKey = `$${op}`;
          where[key][newKey] = where[key][op];
          delete where[key][op];
        });
      }
    });

    this.queryOptions.where = where;
    return this;
  }

  sort() {
    if (this.queryOptions.order) {
      // Tri personnalisé
      const sortBy = this.queryOptions.order.map((order) => {
        const key = Object.keys(order)[0];
        const direction = order[key].toUpperCase();
        return `${key} ${direction}`;
      });
      this.queryOptions.order = sortBy;
    } else {
      // Tri par défaut
      this.queryOptions.order = [['createdAt', 'DESC']];
    }

    return this;
  }

  limitFields() {
    if (this.queryOptions.attributes) {
      // Sélectionner des champs spécifiques
      const fields = this.queryOptions.attributes.map(
        (attr) => attr.split('.')[1]
      );
      this.queryOptions.attributes = fields;
    } else {
      // Sélection par défaut, exclure le champ de version Sequelize
      this.queryOptions.attributes = { exclude: ['createdAt', 'updatedAt'] };
    }

    return this;
  }

  paginate() {
    const page = this.queryOptions.page * 1 || 1;
    const limit = this.queryOptions.limit * 1 || 100;
    const offset = (page - 1) * limit;

    this.queryOptions.offset = offset;
    this.queryOptions.limit = limit;

    return this;
  }

  async exec() {
    // Exécuter la requête Sequelize
    const result = await this.model.findAll(this.queryOptions);
    return result;
  }
}

module.exports = APIFeatures;
