var express = require('express');
var router = express.Router();
var https = require('https');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', function(req, res) {

  var url = req.param('url') || '';
  var emburl = url.replace('https://','');
  emburl = url.replace('watch?v=','embed/');
  var result;
  result = '<iframe src="//' + emburl + '?autoplay=1&amp;autohide=1&amp;rel=0" height="309" width="550" allowfullscreen="" frameborder="0"></iframe>';
  var name = req.param('name') || '';
  var artist = name.split('-')[0];
  var releaseDate = req.param('releaseDate') || '';
  var country = '';
  var genre = '';


  var rawHTML = '';
  if(url!=='') {
    https.get(url + "&hl=en", function (res2) {
      //console.log( res);
      res2.on('data', function (chunk) {
        //console.log(chunk.toString());
        rawHTML = rawHTML + chunk.toString();
      });

      res2.on('end', function () {
        $ = cheerio.load(rawHTML);

        name = $('#eow-title').html().trim() || '';
        var artist = name.split('-')[0];

        var releaseDate = $('.watch-time-text').html().substr(12);

        console.log('calling... ' + 'https://www.google.com/search?q=' + artist + '&tbm=isch');


        res.render('index', {
          title: name,
          result: result,
          artist: artist,
          releaseDate: releaseDate,
          country: country,
          genre: genre
        });

      }).on('error', function (e) {
        console.log("Got error: " + e.message);
      });
    });
  }else{
    res.render('index', {
      title: name,
      result: result,
      artist: artist,
      releaseDate: releaseDate,
      country: country,
      genre: genre
    });
  }



  //res.render('index', { title: name, result:result, artist:artist, releaseDate:releaseDate, country:country, genre:genre});
});

//var decodeEntities = (function() {
//  // this prevents any overhead from creating the object each time
//  var element = document.createElement('div');
//
//  function decodeHTMLEntities (str) {
//    if(str && typeof str === 'string') {
//      // strip script/html tags
//      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
//      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
//      element.innerHTML = str;
//      str = element.textContent;
//      element.textContent = '';
//    }
//
//    return str;
//  }
//
//  return decodeHTMLEntities;
//})();

module.exports = router;
