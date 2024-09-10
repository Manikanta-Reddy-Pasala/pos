export const mapFields = (data, fields) => {
  if (!data) {
    return null;
  }

  let result;

  // Check if data is an array
  if (Array.isArray(data)) {
    result = data.map((item) => mapItemFields(item, fields));
  } else {
    // If data is a single object, just map its fields
    result = mapItemFields(data, fields);
  }

  // Stringify and parse the result before returning
  return result;
};

const mapItemFields = (item, fields) => {
  item = item.toJSON();
  if (fields && fields.length > 0) {
    let result = {};
    fields.forEach((field) => {
      result[field] = item[field];
    });
    return result;
  } else {
    return item;
  }
};

export const executeQuery = async (query, fields) => {
  const data = await query.exec();
  return mapFields(data, fields);
};
