var express = require('express');
var router = express.Router();
const { vCodeToSocketId } = require('../sharedData');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sender_join', (req, res) => {
  const { vCode } = req.body;
  if (vCodeToSocketId[vCode]) {
    console.log('Duplicate vCode:', vCode);
    return res.status(400).json({ error: 'vCode already exists' });
  }
  console.log('Received vCode for sender_join:', vCode);
  res.status(200).send({ message: 'vCode received for sender_join' });
});

router.post('/receiver_join', (req, res) => {
  const { vCode } = req.body;
  if (vCodeToSocketId[vCode]) {
    console.log('vCode exists, receiver can join:', vCode);
    return res.status(200).json({ message: 'vCode exists, receiver can join' });
  } else {
    console.log('vCode does not exist, receiver cannot join:', vCode);
    return res.status(400).json({ error: 'vCode does not exist' });
  }
});

module.exports = router;
