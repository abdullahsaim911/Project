module.exports = (req, res, next) => {
    // Check for coupon in Query string (?coupon=SAVE10) or Form Body
    // Also check session if it was already applied
    const coupon = req.query.coupon || req.body.coupon || req.session.appliedCoupon;
    console.log('MIDDLEWARE: Coupon detected:', coupon);

    let discountRate = 0;

    if (coupon === 'SAVE10') {
        console.log('MIDDLEWARE: Valid coupon SAVE10 found. Applying 10%.');
        discountRate = 0.10; // 10% discount
        req.session.appliedCoupon = 'SAVE10'; // Store in session to remember it
    } else {
        console.log('MIDDLEWARE: No valid coupon found.');
    }

    // Attach values to res.locals so Controller & EJS can see them
    res.locals.discountRate = discountRate;
    res.locals.couponCode = coupon || '';

    next();
};