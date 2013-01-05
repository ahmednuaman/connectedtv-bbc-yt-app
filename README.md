# A connected TV BBC/YouTube mashup
## So what is this?
This is a simple proof-of-concept app that tests to see what the capabilities of smart TVs when it comes to using the [YouTube embedded player](https://developers.google.com/youtube/player_parameters). It's built using:

- [Backbone](http://backbonejs.org/)
- [Lo-dash](http://lodash.com/)
- [Handlebars](http://handlebarsjs.com/)
- [jQuery](http://jquery.com/)
- [Normalize](http://necolas.github.com/normalize.css/)

## What does it do?
_All_ it does is load a feed off YouTube's GData service, creates a tile list of videos and then allows you to watch one of those videos. In this case it's using the [BBC's uploaded videos feed](http://www.youtube.com/user/BBC/videos?view=0).
## How can I use it on my smart TV?
**Note: I've only tested this on a LG 47LM670T**, but it _ought_ to work on any smart TV that has a basic web browser engine built in. This is how you can build and deploy it to a smart TV near you:

1. Clone the repo: `git clone https://github.com/ahmednuaman/connectedtv-bbc-yt-app.git` (or [download the Zip](https://github.com/ahmednuaman/connectedtv-bbc-yt-app/archive/master.zip))
2. Figure out what make and model your TV is and visit the appropriate manufactor's site to download their app SDK (if applicable).
3. Fire up the SDK, in LG's case it's called (fittingly) 'LG IDE', create a new project and stick the cloned repo's files within the defined 'web' folder; in LG's case it's called `WebContent`.
4. Export the project, usually this is found at `File > Export` and follow the steps. Most manufactors use DRM and require you to create an archieve, upload it to their test area and download a DRM packaged version of your app.
5. Once you've got your app ready (usually on a USB stick), don't forget to sign in to your TV and then you're ready to play with the app!

### Or
If you can access your TV's web browser then you can either run the app on your local network or visit the hosted version of the app (on Github): [http://ahmednuaman.github.com/connectedtv-bbc-yt-app/](http://ahmednuaman.github.com/connectedtv-bbc-yt-app/)

## Why did you do this?
Well, why not? More and more of us have smart connected devices but we're not making the most of them. Let's see how far we can go with them and how we can handle graceful degregation in terms of styles, processing power and Javascript engines.

## Is there a vanilla version?
Well, actually, yes, there is. The master  branch is a simple proof-of-concept that uses all the latest new-fangled frameworks and stuff. However, not all smart TV browser engines are the same and so I have created a [bare](https://github.com/ahmednuaman/connectedtv-bbc-yt-app/branches) branch that's a pure vanilla version of the app without any dependancies. 

The idea is to see which one performs better, one that has lots of libraries and makes development _easier_ or one that's written from the ground up where I have control over everything.