const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, 'Please provide a rating (1-5).']
        },
        comment: {
            type: String,
            required: [true, 'Please provide a comment.']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    },
    
    { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.statics.calculateAverageRating = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                numOfReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            averageRating: stats.length > 0 ? stats[0].averageRating.toFixed(1) : 0,
            numOfReviews: stats.length > 0 ? stats[0].numOfReviews : 0
        });
    } catch (error) {
        console.error(error);
    }
};

reviewSchema.post('save', function () {
    this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', function () {
    this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);