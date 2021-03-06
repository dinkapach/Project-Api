import express from 'express';
import Customer from '../.././models/user-model';
import Credit from '../.././models/credit-model';
import Receipt from '../.././models/receipt-model';
import CustomerRepository from '../.././database/repositories/customer.repository';
import cloudinary from 'cloudinary';

const router = express.Router();

router.get('/', (req, res, next) => {
  const customerId = req.query.customerId;
  console.log('users js : + ' + customerId);
  // console.log(req.query);
  CustomerRepository.findCustomerById(customerId)
    .then(customer => {
      if (customer) {
        res.status(200).json(customer);
      }
      else {
        console.log("user not found");
        res.status(404).json({ customer: customer });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).end();
    });
});

router.post('/changePassword', (req, res, next) => {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const customerId = req.body.customerId;
  console.log("currentPassword: " + currentPassword + "newPassword: " + newPassword + "customerId" + customerId);

  CustomerRepository.changePassword(customerId, currentPassword, newPassword)
    .then(customer => {
      if (customer) {
        console.log("success" + customer);
        res.status(200).json(customer);
      }
      else {
        console.log("user not found" + customer);
        res.status(400).json(false);
      }
    })
    .catch(err => {
      console.log("password not match" + err);
      res.status(400).json(false).end();
    });
});

router.post('/updateCustomerInfo', (req, res, next) => {
  const customerUpdate = req.body.customerUpdate;
  const customerId = req.body.customerId;
  console.log("from updateCustomerInfo: ", customerId, customerUpdate);

  CustomerRepository.updateCustomer(customerId, customerUpdate)
    .then(customerUpdated => {
      console.log("return from updateCustomer:\n" + customerUpdated);
      res.status(200).json(customerUpdated);
    })
    .catch(err => {
      console.log('Customer was not updated', err);
      res.status(500).json(false);
    });
});

router.post('/signup', (req, res, next) => {
  console.log("newCustomer");
  const newCustomer = req.body.customer;
  console.log(newCustomer);
  CustomerRepository.addCustomer(newCustomer)
    .then(customer => {
      console.log(customer);
      if (customer) {
        console.log("return customer\n" + customer);
        res.status(200).json(customer);
      }
      else {
        console.log("return fail customer\n" + customer);
        res.status(400).json(customer);
      }
    })
    .catch(err => {
      console.log("error create customer" + err);
      res.status(500).json(err);
    });
});

router.post('/editCredit', (req, res, next) => {
  const creditUpdate = req.body.creditUpdate;
  const customerId = req.body.customerId;
  console.log(customerId, creditUpdate);

  CustomerRepository.editCustomerCredit(customerId, creditUpdate)
    .then(creditUpdated => {
      console.log("return from updateCustomer:\n", creditUpdated);
      res.status(200).json(creditUpdated);
    })
    .catch(err => {
      console.log('Credit was not updated', err);
      res.status(500).json(false);
    });
});

router.post('/addCredit', (req, res, next) => {
  const userId = req.body.userId;
  const creditObj = req.body.credit;
  var credit = new Credit();
  credit.id = creditObj.id;
  credit.clubId = creditObj.clubId;
  credit.dateOfPurchase = creditObj.dateOfPurchase;
  credit.dateOfExpired = creditObj.dateOfExpired;
  credit.items = creditObj.items;
  credit.totalCredit = creditObj.totalCredit;
  credit.img = creditObj.img;

  CustomerRepository.addCustomerCredit(userId, credit)
    .then(userUpdated => {
      console.log('credit was added');
      res.status(200).json(true);
    })
    .catch(err => {
      console.log('credit was not updated', err);
      res.status(500).json(false);
    });
});

router.post('/deleteCredit', (req, res, next) => {
  const userId = req.body.userId;
  const creditObj = req.body.credit;
  console.log("from server-deleteCredit - user id is: ", userId);

  CustomerRepository.removeCreditOrReceipt(userId, creditObj.id, "credits")
    .then(userUpdated => {
      console.log('credit was deleted');
      res.status(200).json({ isAuth: true, user: userUpdated });
    })
    .catch(err => {
      console.log('credit was not deleted', err);
      res.status(500).json(false);
    });
});

router.post('/saveImg', (req, res, next) => {
  const picture = req.body.picture;

  cloudinary.v2.uploader.upload(picture, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ isUpdated: false });
    }
    else {
      console.log(result);
      res.status(200).json({ isUpdated: true, result: result })
    }

  })
});

router.get('/getUserObjectId/:userId', (req, res, next) => {
  const userId = req.params.userId;
  console.log('userId is : ' + userId);

  CustomerRepository.findCustomerById(userId)
    .then(customer => {
      if (customer) {
        res.status(200).json({ isAuth: true, userObjId: customer._id })
      }
      else {
        res.status(500).json({ isAuth: false });
      }
    })
    .catch(err => {
      console.log(" err in getUserObjectId", err);
      res.status(500).json({ isAuth: false });
    })
});

export default router;
