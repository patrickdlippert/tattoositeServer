# tattoositeServer
This is the back-end Express/MongoDB application for the fictitious Bad Panda Tattoo Shop. To use this system, be sure to install the corresponding repository call tattoositeClient - the React front-end web server that works in tandem.

To install, use npm:
  - npm install
  - npm start
  
 You will need to have MongoDB running and use the provided files in initial-data.
  mongoimport --db=tattoosite --collection=artists --file initial-data/artists.json --jsonArray 
  mongoimport --db=tattoosite --collection=billboards --file initial-data/billboards.json --jsonArray 
  mongoimport --db=tattoosite --collection=galleries --file initial-data/galleries.json --jsonArray 
  mongoimport --db=tattoosite --collection=galleryimages --file initial-data/galleryimages.json --jsonArray 
  mongoimport --db=tattoosite --collection=matches --file initial-data/matches.json --jsonArray 
  mongoimport --db=tattoosite --collection=news --file initial-data/news.json --jsonArray 
  mongoimport --db=tattoosite --collection=promotions --file initial-data/promotions.json --jsonArray 
  mongoimport --db=tattoosite --collection=reviews --file initial-data/reviews.json --jsonArray 
  mongoimport --db=tattoosite --collection=shoppingitems --file initial-data/shoppingitems.json --jsonArray 
  mongoimport --db=tattoosite --collection=users --file initial-data/users.json --jsonArray 
  
  Also create a config.js file that contains:
    module.exports = {
      'secretKey': 'xxxxx-xxxxx-xxxxx-xxxxx',
      'mongoUrl': 'mongodb://localhost:27017/tattoosite',
      'facebook': {
          clientId: 'xxxxxxxxxxxxxxx',
          clientSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      }
  }
  with your own signed keys instead of x.
