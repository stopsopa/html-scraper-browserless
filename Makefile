start: kill stop
	/bin/bash start.sh

stop:
	/bin/bash kill-process.sh html-scraper-browserless-executed-by-make

status:
	/bin/bash server-is-working.sh html-scraper-browserless-executed-by-make

install:
	# https://github.com/GoogleChrome/puppeteer/issues/244#issuecomment-364222174
	export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && yarn install

# kill all containers that haven't been stopped
kill:
	/bin/bash kill.sh

# test
t:
	/bin/bash test/test.sh
