start: stop
	# specify exact command to run from 'this' directory perspective
	/bin/bash make/start.sh /bin/bash run.sh

stop:
	# FLAG - name of variable with flag
	# .env - (optional) file with config to load to provide FLAG
	/bin/bash make/stop.sh FLAG .env

status:
	# FLAG - name of variable with flag
	# .env - (optional) file with config to load to provide FLAG
	/bin/bash make/status.sh FLAG .env

install:
	# https://github.com/GoogleChrome/puppeteer/issues/244#issuecomment-364222174
	export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true && yarn install

# kill all containers that haven't been stopped
kill:
	/bin/bash kill.sh

# test
t:
	/bin/bash test/test.sh
