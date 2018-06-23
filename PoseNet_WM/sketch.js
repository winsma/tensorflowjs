// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */

// Grab elements, create settings, etc.
// var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const CONFIDENCE = 0.5;
const IMAGE_NAME =  'vo200401_95.jpg';

let model;
let img;
let poses;

posenet.load().then(function(net) {
  model = net;

  img = new Image();
  img.onload = onImageLoad;
  img.src = IMAGE_NAME;
})


// can change to SinglePose (look at medium documentation for estimateSinglePose)
function onImageLoad() {
  model.estimateSinglePose(img, 0.5, false, 16)
     .then(function(detected) {
       if (!Array.isArray(detected)) {
         detected = [detected];
       }
       poses = detected;
       console.log(detected);
       drawImageIntoCanvas();
       drawSkeleton();
     });
}



// // can change to SinglePose (look at medium documentation for estimateSinglePose)
// function onImageLoad() {
//   model.estimateMultiplePoses(img, 0.001, false, 16, 4, 0.75, 6)
//      .then(function(detected) {
//        if (!Array.isArray(detected)) {
//          detected = [detected];
//        }
//        poses = detected;
//        console.log(detected);
//        drawImageIntoCanvas();
//        drawSkeleton();
//      });
// }



// The detected positions will be inside an array

// Create a webcam capture
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//   navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//     video.src = window.URL.createObjectURL(stream);
//     video.play();
//   });
// }

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet 
// is not detecting a position
// function drawCameraIntoCanvas() {
//   // Draw the video element into the canvas
//   ctx.drawImage(video, 0, 0, 640, 480);
//   // We can call both functions to draw all keypoints and the skeletons
//   drawKeypoints();
//   drawSkeleton();
//   window.requestAnimationFrame(drawCameraIntoCanvas);
// }
// Loop over the drawCameraIntoCanvas function
// drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
// const poseNet = ml5.poseNet(video, 'single', gotPoses);
function drawImageIntoCanvas() {
  // Draw the video element into the canvas
  ctx.drawImage(img, 0, 0, 600, 400);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  // drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].keypoints.length; j++) {
      let keypoint = poses[i].keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > CONFIDENCE) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 0, 127, 1.0)'
        ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    let skeleton = posenet.getAdjacentKeyPoints(poses[i].keypoints, CONFIDENCE);
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      ctx.beginPath();
      ctx.moveTo(partA.position.x, partA.position.y);
      ctx.lineTo(partB.position.x, partB.position.y);
      ctx.strokeStyle = 'rgb(0, 255, 0)'
      ctx.stroke();
    }
  }
}