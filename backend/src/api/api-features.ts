import { FilterQuery, Query } from 'mongoose';

export default class APIFeatures<T, D, G> {
    public query: Query<T, D, G>;
    private queryString: { [key: string]: any };

    constructor(query: Query<T, D, G>, queryString: { [key: string]: any }) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * @param obj
     * @replace objects like { key1: { key2: someval } } with { key1.key2: someval }
     */
    private convert(obj: { [key: string]: any }) {
        Object.keys(obj).forEach(key => {
            const nested = Object.keys(obj[key])[0];
            if (isNaN(+nested) && !/\b(gte|gt|lte|lt|ne)\b/g.test(nested)) {
                const newKey = key + '.' + nested;
                const val = obj[key][nested];
                delete obj[key];
                obj[newKey] = val;
            }
        });
    }

    private exclude(obj: { [key: string]: any }, ...excludedFields: string[]) {
        excludedFields.forEach(el => {
            delete obj[el];
        });
    }

    public filter() {
        // Filtering
        const queryObj = { ...this.queryString };
        this.convert(queryObj);
        this.exclude(queryObj, 'page', 'sort', 'limit', 'fields', 'field');

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, match => `$${match}`); // match exact words \b

        this.query = this.query.find(JSON.parse(queryStr)) as unknown as Query<T, D, G>;

        return this;
    }

    public sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join('');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('_id');
        }

        return this;
    }

    public distinct() {
        const queryObj = { ...this.queryString };

        if (queryObj.field) {
            const { field } = queryObj;
            delete queryObj.field;
            this.query.distinct(field, queryObj as FilterQuery<D>);
        }

        return this;
    }

    public limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    public paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    public count() {
        const queryObj = { ...this.queryString };
        this.convert(queryObj);
        this.exclude(queryObj, 'page', 'sort', 'limit');

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt|ne)\b/g, match => `$${match}`);

        this.query = this.query.count(JSON.parse(queryStr)) as unknown as Query<T, D, G>;

        return this;
    }
}
