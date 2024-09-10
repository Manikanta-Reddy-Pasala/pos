import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

const getCategories = async (selector) => {
  const db = await Db.get();
  const { businessId } = await Bd.getBusinessData();
  selector.businessId = { $eq: businessId };

  try {
    const data = await db.businesscategories.find({ selector }).exec();
    return data.map((item) => item.toJSON());
  } catch (err) {
    console.log('Internal Server Error', err);
    return [];
  }
};

export const getLevel2Categorieslist = async () => {
  const categoriesList = await getCategories({});
  const level2CategoriesList = categoriesList.map(
    (item) => item.level2Category
  );

  try {
    return Array.from(new Set(level2CategoriesList.map(JSON.stringify))).map(
      JSON.parse
    );
  } catch (e) {
    console.error(' Error: ', e.message);
    return [];
  }
};

export const getLevel3Categorieslist = async (level2Category) => {
  const categoriesList = await getCategories({
    'level2Category.name': { $eq: level2Category }
  });

  if (categoriesList.length > 0) {
    let category = categoriesList[0].level3Categories;
    return category.map((element) => ({ ...element, isChecked: false }));
  }

  return [];
};

export const getLevel2CategoryByName = async (name) => {
  const categoriesList = await getCategories({
    'level2Category.name': { $eq: name }
  });
  return categoriesList.length > 0 ? categoriesList[0] : null;
};
