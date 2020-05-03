# REACTNATIVE-Kisled-Music
Summary: A react-native youtube music download, converter and player app

### Introduction
This app is original developed because one of the music player that I used to use to pull mp3 file from Google Drive is no longer working, moreover many friends and relative of mine want to have an app that allows them to download mp3 from youtube without paying HKD$80 per month for youtube premium. Thats why I wrote this app. When I was about to publish to apple for appstore distribution, apple rejected this app due to the app has ability to retrieve 3rd party content without 3rd party authorization. Thus I decide to open source this app, and allow anyone that interested with this app to build their own copy or modify this app for private use.

#### Terms of Services
http://ekhome.life/Apps/kisled-music_privacy_policy/TermsOfService.html
if you decide to play with this app, please read the terms of service carefully. If you accept, you can start play around with it

### Capabilities
- download youtube videos and convert them to mp3
- save in your devices
- download via http
- background playing
- shuffle
- replay
- looping
- library management

### Screenshots
- Background playing
<img src='/ScreenShots/background.jpeg' width="300">

- player screen
<p align="center">
<img src='/ScreenShots/library1.jpeg' width="300">
<img src='/ScreenShots/player2.jpeg' width="300">
  </p>
  
- library screen
<p align="center">
<img src='/ScreenShots/player1.jpeg' width="300">
<img src='/ScreenShots/library2.jpeg' width="300">
  <img src='/ScreenShots/library3.jpeg' width="300">
  <img src='/ScreenShots/library4.jpeg' width="300">
  <img src='/ScreenShots/library5.jpeg' width="300">
</p>

- download screen
<p align="center">
<img src='/ScreenShots/download1.jpeg' width="300">
<img src='/ScreenShots/download2.jpeg' width="300">
  <img src='/ScreenShots/download3.jpeg' width="300">
</p>

### libraries used

https://github.com/DrEdwardPCB/REACTNATIVE-Kisled-Music/blob/master/package.json

### installation

#### prerequsite
- Xcode installed
- Node js installed
- React native installed
- mac with OSX version >= 10.15
- Apple Configurator 2
#### installation step
1. clone this repo
2. change the working directory to the project file
```
cd /path/to/the/repo
```
3. install npm dependencies
```
npm install
```
4. install pods
```
cd ios ;
pod install ;
cd .. ;
```
5. running on simulator via react native way 1
```
npx react-native run-ios
```
6. running on simulator via Xcode

- go to ios folder, click open the .xcworkspace
- choose the simulator that you want to run at on the top left of xcode
- click the run button

Troubleshoot:

click to the project root go to signing and capability, change the developer profile to yours apple developer profile and manage the app bundle id

7. building a standaline app

- in the device part, choose Generic IOS device
- go to projects tab and click archive
- after build success go to window tab and press Organizer
- click distribute app and choose Ad hoc
- after compiling bitcode, a folder containing .ipa will be created
- open apple configurator 2 and plug in your device
- click add button and drag the .ipa file in, this will install the appon your device

Troubleshoot:
remember to register a apple developer account and create app identifiers also create provisioning profile for ad hoc. Most importantly add your devices to the account

