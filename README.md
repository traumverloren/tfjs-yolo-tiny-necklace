# Tiny-yolo with nodejs 🖼

Run tiny-yolo in nodejs!

## To run (on MacOS):
  
  Install deps for [node-canvas](https://github.com/Automattic/node-canvas#imagesrc) using homebrew:
  
  ```
  $ brew install pkg-config cairo pango libpng jpeg giflib librsvg
  ```

  Install packages and run project:

  ```
  $ yarn
  $ node demo/index.js
  ```

   Should `console.log()` image recognition results for photo!

## Installing on Raspberry Pi 3 B+: 🤷‍

#### NOTE: NOT CURRENTLY WORKING, WAITING ON NEW RELEASE OF TFJS-NODE PACKAGE 🤞

1. Install node.js & npm:

    I installed v8 since I was getting some errors when installing project deps for canvas with v10+ 😢

    ```
    $ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    $ sudo apt-get install -y nodejs
    ```

2. Install yarn:

    ```
    $ curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    $ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    $ sudo apt-get update && sudo apt-get install yarn
    ```

3. Install things for canvas:

    ```
    $ sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
    ```

4. Install project dependencies:

    ```
    $ yarn
    ```