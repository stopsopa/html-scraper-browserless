start: kill
	# /bin/bash kill.sh && node server.js --port 8811 --tmp tmp/ -- force port from cli
	/bin/bash kill.sh && node server.js

install:
	# https://github.com/GoogleChrome/puppeteer/issues/244#issuecomment-364222174
	export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && yarn install

# kill all containers that haven't been stopped
kill:
	/bin/bash kill.sh

# test
t:
	/bin/bash test/test.sh
