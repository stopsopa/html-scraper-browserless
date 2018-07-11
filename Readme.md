
# Installation:

    git clone this repository and go to main directory
    make install
    cp config.js.dist config.js
    
    # manually change password in config.js for basic auth
    
    make start
    

# Using:
    
Just visit:

        http://localhost:8811/generate

    
# Current execution environment:

    - node v8.9.4
    - yarn
    - Docker version 18.03.1-ce, build 9ee9f40  
    
# Ping:
    
    http://xx.xx.xx.xx:8811/pdf-generator-check 
    http://slowwly.robertomurray.co.uk/delay/32000/url/https://github.com/stopsopa/docker-puppeteer-pdf-generator
    
# Useful things (irrelevant now):  
        
    docker run -it --rm puppeteer-alpine-generate-pdf /usr/bin/chromium-browser --version        
        $ Chromium 64.0.3282.168
        
    or if you follow node:8-slim : https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker
        docker run -it --rm --cap-add=SYS_ADMIN --rm puppeteer-chrome-linux /usr/bin/google-chrome-unstable --version
            Google Chrome 68.0.3438.3 dev
        
    on mac:
        /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version
            $ Google Chrome 66.0.3359.181
        /Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary --version
            $ Google Chrome 69.0.3445.0 canary
   

