const db = require('../database/db');

module.exports = {
  all() {
    return db.select().from('category');
  },

  allMainCategories() {
    return db.select()
      .from('category')
      .whereNull('parent_id');
  },

  allSubCategories() {
    return db.select()
      .from('category')
      .whereNotNull('parent_id');
  },

  add(category) {
    return db('category').insert(category);
  },

  findByParentID(parent_id) {
    return db('category')
      .where('parent_id', parent_id);
  },

  async findByID(id) {
    const rows = await db.select('c1.id', 'c1.title', { parent_id: 'c2.id' }, { parent_title: 'c2.title' })
      .from({ c1: 'category' })
      .leftJoin({ c2: 'category' }, 'c1.parent_id', '=', 'c2.id')
      .where('c1.id', id);

    if (rows.length === 0) {
      return null;
    }

    rows[0].parent_id = rows[0].parent_id === null ? 0 : rows[0].parent_id;
    rows[0].parent_title = rows[0].parent_title === null ? 'Không' : rows[0].parent_title;
    return rows[0];
  },

  patch(category) {
    const id = category.id;
    delete category.id;
    delete category.parent_title;
    delete category.parent_id;

    return db('category')
      .where('id', id)
      .update(category);
  },

  del(id) {
    return db('category')
      .where('id', id)
      .del();
  },

};