class ApiFeatures {
  constructor(query, reqQuery) {
    this.query = query;
    this.reqQuery = reqQuery;
  }
  filter() {
    const queryObj = { ...this.reqQuery };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.reqQuery.sort) {
      let sortBy = JSON.parse(
        JSON.stringify(this.reqQuery.sort).replace(/,/g, " ")
      );
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); //sorting by default
    }
    return this;
  }
  select() {
    if (this.reqQuery.fields) {
      let fields = this.reqQuery.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // "-" Minus sign means exclude this field
    }
    return this;
  }
  paginate() {
    const page = this.reqQuery.page * 1 || 1;
    const limit = this.reqQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
