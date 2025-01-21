const express = require('express');
const { mongo } = require('../../../utils/mongo');
const { salesService } = require('../../../services');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions', (req, res, next) => {
  try {
    mongo(async db => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
    next(err);
  }
});nom install

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions/:region', (req, res, next) => {
  try {
    mongo(async db => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
    next(err);
  }
});

// **New route added below**
/**
 * @description
 *
 * GET /sales-data
 *
 * Fetches sales data by product.
 *
 * Example:
 * fetch('/sales-data')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/sales-data', async (req, res, next) => {
  try {
    const salesData = await salesService.getSalesDataByProduct();
    res.json(salesData);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// Function to fetch sales data by product
async function getSalesDataByProduct() {
  // Fetch sales data grouped by product
  return new Promise((resolve, reject) => {
    mongo(async db => {
      const salesData = await db.collection('sales').aggregate([
        { $group: { _id: '$product', totalSales: { $sum: '$amount' } } },
        {
          $project: {
            _id: 0,
            product: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { product: 1 }
        }
      ]).toArray();
      resolve(salesData);
    }, reject);
  });
}

module.exports = router;
