# LearnFlow - Video Streaming Website

[Visit](https://learnflow.link)

## Description

LearnFlow is a video streaming website where users can select a video from the home screen and stream it to the video player. Users can like, comment, and share the video and can also see how many likes and views the video has received. Users can reply to comments, and the user interface differentiates between replied and new comments.

## Features

- Users can sign in and register using Google.
- Users can select their role during registration as either a creator or student.
- Users can like and comment on the videos.
- Users can reply to existing comments with infinite nesting allowed.
- Each Video is marked as Viewed once a User watches 20% (just a threshold) of the video.
- Allowed creators to upload videos which are strored in an AWS S3 Bucket.
- Videos are streamed in chunks and fetched from the S3 Bucket.
- Application is deployed using AWS EC2 Instance.
- Clean and responsive user interface.
- Used MVC architecture in the backend design.

## Technology Stack

- MongoDB
- Express.js
- EJS Template Engine (For Frontend)
- Node.js

## Setup

1. Clone the repository from GitHub.
2. Run `npm install` to install all the dependencies.
3. Run `npm run dev` to start the server.

## Authors

- [Aditya Agrawal](https://github.com/AA2512)

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
